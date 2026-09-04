import fs from 'node:fs'
import zlib from 'node:zlib'

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}

function decodeRawRGBA(buffer) {
  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)
  
  let offset = 8
  const idatChunks = []
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    if (type === 'IDAT') {
      idatChunks.push(buffer.subarray(offset + 8, offset + 8 + length))
    }
    offset += 12 + length
  }
  
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks))
  const raw = Buffer.alloc(width * height * 4)
  const bytesPerPixel = 4
  const stride = width * 4
  
  let srcPos = 0
  let dstPos = 0
  
  for (let y = 0; y < height; y++) {
    const filter = decompressed[srcPos++]
    const prevRowStart = dstPos - stride
    
    for (let x = 0; x < stride; x++) {
      const cur = decompressed[srcPos++]
      const left = x >= bytesPerPixel ? raw[dstPos - bytesPerPixel] : 0
      const up = y > 0 ? raw[prevRowStart + x] : 0
      const upLeft = y > 0 && x >= bytesPerPixel ? raw[prevRowStart + x - bytesPerPixel] : 0
      
      let val = 0
      if (filter === 0) val = cur
      else if (filter === 1) val = (cur + left) & 0xff
      else if (filter === 2) val = (cur + up) & 0xff
      else if (filter === 3) val = (cur + Math.floor((left + up) / 2)) & 0xff
      else if (filter === 4) val = (cur + paeth(left, up, upLeft)) & 0xff
      
      raw[dstPos++] = val
    }
  }
  
  return { width, height, data: raw }
}

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function encodePNG(width, height, rgbaBuffer) {
  const header = Buffer.alloc(8 + 25)
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(header, 0)
  header.writeUInt32BE(13, 8)
  header.write('IHDR', 12, 4, 'ascii')
  header.writeUInt32BE(width, 16)
  header.writeUInt32BE(height, 20)
  header[24] = 8
  header[25] = 6
  header[26] = 0
  header[27] = 0
  header[28] = 0
  header.writeUInt32BE(crc32(header.subarray(12, 29)), 29)
  
  const filtered = Buffer.alloc(height * (width * 4 + 1))
  let fPos = 0
  let rPos = 0
  for (let y = 0; y < height; y++) {
    filtered[fPos++] = 0
    rgbaBuffer.copy(filtered, fPos, rPos, rPos + width * 4)
    fPos += width * 4
    rPos += width * 4
  }
  
  const idatData = zlib.deflateSync(filtered, { level: 9 })
  const idatChunk = Buffer.alloc(12 + idatData.length)
  idatChunk.writeUInt32BE(idatData.length, 0)
  idatChunk.write('IDAT', 4, 4, 'ascii')
  idatData.copy(idatChunk, 8)
  idatChunk.writeUInt32BE(crc32(idatChunk.subarray(4, 8 + idatData.length)), 8 + idatData.length)
  
  const iendChunk = Buffer.alloc(12)
  iendChunk.writeUInt32BE(0, 0)
  iendChunk.write('IEND', 4, 4, 'ascii')
  iendChunk.writeUInt32BE(crc32(iendChunk.subarray(4, 8)), 8)
  
  return Buffer.concat([header, idatChunk, iendChunk])
}

const src = decodeRawRGBA(fs.readFileSync('c:/laragon/www/maketter/public/assets/tnth-canva/04-organizations-transparent-v2.png'))

// Specific ranges for the 5 logos:
// Logo 1: NEU ~ [70, 480]
// Logo 2: Đoàn ~ [550, 920]
// Logo 3: HSV ~ [980, 1360]
// Logo 4: BĐN ~ [1420, 1730]
// Logo 5: TNTH ~ [1780, 2150]
const ranges = [
  { x0: 70, x1: 480 },
  { x0: 550, x1: 920 },
  { x0: 980, x1: 1360 },
  { x0: 1420, x1: 1730 },
  { x0: 1780, x1: 2150 },
]

const logos = ranges.map((r, idx) => {
  let minX = src.width, maxX = 0, minY = src.height, maxY = 0
  for (let y = 0; y < src.height; y++) {
    for (let x = r.x0; x < r.x1; x++) {
      const a = src.data[(y * src.width + x) * 4 + 3]
      if (a > 15) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const w = maxX - minX + 1
  const h = maxY - minY + 1
  const buf = Buffer.alloc(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = ((minY + y) * src.width + (minX + x)) * 4
      const dstIdx = (y * w + x) * 4
      buf[dstIdx] = src.data[srcIdx]
      buf[dstIdx + 1] = src.data[srcIdx + 1]
      buf[dstIdx + 2] = src.data[srcIdx + 2]
      buf[dstIdx + 3] = src.data[srcIdx + 3]
    }
  }
  console.log(`Logo ${idx + 1}: ${w}x${h} (at [${minX},${maxX}]x[${minY},${maxY}])`)
  return { id: idx, w, h, buf }
})

function scaleLogo(logo, scale) {
  const newW = Math.round(logo.w * scale)
  const newH = Math.round(logo.h * scale)
  const newBuf = Buffer.alloc(newW * newH * 4)
  
  for (let dy = 0; dy < newH; dy++) {
    for (let dx = 0; dx < newW; dx++) {
      const gx = (dx / newW) * (logo.w - 1)
      const gy = (dy / newH) * (logo.h - 1)
      const gxi = Math.floor(gx)
      const gyi = Math.floor(gy)
      const c00 = (gyi * logo.w + gxi) * 4
      
      const dstIdx = (dy * newW + dx) * 4
      newBuf[dstIdx] = logo.buf[c00]
      newBuf[dstIdx + 1] = logo.buf[c00 + 1]
      newBuf[dstIdx + 2] = logo.buf[c00 + 2]
      newBuf[dstIdx + 3] = logo.buf[c00 + 3]
    }
  }
  return { w: newW, h: newH, buf: newBuf }
}

// First 3 logos scale 1.0, last 2 logos scale 0.83
const scaledLogos = logos.map((l, i) => i < 3 ? l : scaleLogo(l, 0.83))

const targetGap = 70
const totalWidth = scaledLogos.reduce((acc, l) => acc + l.w, 0) + (scaledLogos.length - 1) * targetGap
const maxHeight = Math.max(...scaledLogos.map(l => l.h)) + 20

const outCanvas = Buffer.alloc(totalWidth * maxHeight * 4)

let curX = 0
for (const l of scaledLogos) {
  const startY = Math.round((maxHeight - l.h) / 2)
  for (let y = 0; y < l.h; y++) {
    for (let x = 0; x < l.w; x++) {
      const srcIdx = (y * l.w + x) * 4
      const dstIdx = ((startY + y) * totalWidth + (curX + x)) * 4
      outCanvas[dstIdx] = l.buf[srcIdx]
      outCanvas[dstIdx + 1] = l.buf[srcIdx + 1]
      outCanvas[dstIdx + 2] = l.buf[srcIdx + 2]
      outCanvas[dstIdx + 3] = l.buf[srcIdx + 3]
    }
  }
  curX += l.w + targetGap
}

const outPng = encodePNG(totalWidth, maxHeight, outCanvas)
fs.writeFileSync('c:/laragon/www/maketter/public/assets/tnth-canva/04-organizations-transparent-v3.png', outPng)
console.log('Saved 04-organizations-transparent-v3.png cleanly!')
