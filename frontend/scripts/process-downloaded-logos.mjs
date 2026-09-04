import fs from 'node:fs'
import path from 'node:path'
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

const inputPath = 'c:/laragon/www/maketter/downloaded_test'
if (!fs.existsSync(inputPath)) {
  console.error('File downloaded_test not found!')
  process.exit(1)
}

const fileBuffer = fs.readFileSync(inputPath)

// Copy directly to public/assets
fs.writeFileSync('c:/laragon/www/maketter/public/assets/tnth-canva/04-organizations-transparent-v2.png', fileBuffer)
fs.writeFileSync('c:/laragon/www/maketter/public/assets/tnth-canva/04-organizations-70-years.png', fileBuffer)
fs.writeFileSync('c:/laragon/www/maketter/public/assets/organizers/don-vi-to-chuc-banner.png', fileBuffer)
console.log('Saved banner copies successfully!')

const src = decodeRawRGBA(fileBuffer)
console.log(`Source dimensions: ${src.width}x${src.height}`)

// Scan columns to find content clusters (non-empty columns)
const colAlpha = new Float32Array(src.width)
for (let x = 0; x < src.width; x++) {
  let sum = 0
  for (let y = 0; y < src.height; y++) {
    const a = src.data[(y * src.width + x) * 4 + 3]
    if (a > 10) sum += a
  }
  colAlpha[x] = sum
}

// Find ranges where colAlpha > 0
const clusters = []
let inCluster = false
let startX = 0
for (let x = 0; x < src.width; x++) {
  if (colAlpha[x] > 0) {
    if (!inCluster) {
      inCluster = true
      startX = x
    }
  } else {
    if (inCluster) {
      inCluster = false
      if (x - startX > 15) {
        clusters.push({ x0: startX, x1: x - 1 })
      }
    }
  }
}
if (inCluster && src.width - startX > 15) {
  clusters.push({ x0: startX, x1: src.width - 1 })
}

console.log('Found clusters:', clusters)

const logoNames = [
  '01-doan',
  '02-neu-70',
  '03-hsv',
  '04-bdn',
  '05-tnth',
]

const outDir = 'c:/laragon/www/maketter/public/assets/organizers'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

clusters.forEach((r, idx) => {
  if (idx >= logoNames.length) return
  let minX = src.width, maxX = 0, minY = src.height, maxY = 0
  for (let y = 0; y < src.height; y++) {
    for (let x = r.x0; x <= r.x1; x++) {
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
  // Add a small 4px padding
  const pad = 8
  const outW = w + pad * 2
  const outH = h + pad * 2
  const buf = Buffer.alloc(outW * outH * 4)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = ((minY + y) * src.width + (minX + x)) * 4
      const dstIdx = ((pad + y) * outW + (pad + x)) * 4
      buf[dstIdx] = src.data[srcIdx]
      buf[dstIdx + 1] = src.data[srcIdx + 1]
      buf[dstIdx + 2] = src.data[srcIdx + 2]
      buf[dstIdx + 3] = src.data[srcIdx + 3]
    }
  }

  const png = encodePNG(outW, outH, buf)
  const filename = `${logoNames[idx]}.png`
  fs.writeFileSync(path.join(outDir, filename), png)
  console.log(`Saved logo ${filename} (${outW}x${outH})`)
})

console.log('All done successfully!')
