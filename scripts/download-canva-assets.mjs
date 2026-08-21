import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'

const sourceFile = new URL('../canva-view.html', import.meta.url)
const outputDirectory = new URL('../public/assets/tnth-canva/', import.meta.url)
const manifestFile = new URL('../public/assets/tnth-canva/manifest.json', import.meta.url)

const html = await readFile(sourceFile, 'utf8')

function extractJsonObject(source, startIndex) {
  let depth = 0
  let inString = false
  let escaped = false

  for (let index = startIndex; index < source.length; index += 1) {
    const character = source[index]

    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
      continue
    }

    if (character === '"') inString = true
    else if (character === '{') depth += 1
    else if (character === '}') {
      depth -= 1
      if (depth === 0) return source.slice(startIndex, index + 1)
    }
  }

  return null
}

function findAssets(source) {
  const assets = new Map()
  const marker = /\{"type":"(?:RASTER|VECTOR)"/g
  let match

  while ((match = marker.exec(source)) !== null) {
    const rawObject = extractJsonObject(source, match.index)
    if (!rawObject) continue

    try {
      const asset = JSON.parse(rawObject)
      if (asset.id && Array.isArray(asset.files) && asset.files.length > 0) {
        assets.set(asset.id, asset)
      }
    } catch {
      // A malformed bootstrap fragment is skipped; other assets remain downloadable.
    }
  }

  return [...assets.values()]
}

function chooseBestFile(asset) {
  if (asset.type === 'VECTOR') {
    const vectors = asset.files.filter((file) => file.mimeType === 'image/svg+xml')
    if (vectors.length > 0) {
      return vectors.sort((left, right) => qualityScore(right) - qualityScore(left))[0]
    }
  }

  return [...asset.files].sort((left, right) => {
    const areaDifference = (right.width ?? 0) * (right.height ?? 0)
      - (left.width ?? 0) * (left.height ?? 0)
    return areaDifference || qualityScore(right) - qualityScore(left)
  })[0]
}

function qualityScore(file) {
  const scores = {
    ORIGINAL: 100,
    SOURCE: 95,
    SCREEN_3X: 80,
    SCREEN_2X: 70,
    SCREEN: 60,
    THUMBNAIL: 20,
  }
  return scores[file.quality] ?? 0
}

function extensionFor(file) {
  const extensions = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
  }
  return extensions[file.mimeType] ?? extname(new URL(file.url).pathname) ?? '.bin'
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 52)
}

await mkdir(outputDirectory, { recursive: true })

const assets = findAssets(html)
const manifest = []

for (const [index, asset] of assets.entries()) {
  const file = chooseBestFile(asset)
  const extension = extensionFor(file)
  const label = slugify(asset.title || asset.id) || 'asset'
  const fileName = `${String(index + 1).padStart(2, '0')}-${label}-${asset.id}${extension}`
  const targetUrl = new URL(fileName, outputDirectory)
  const response = await fetch(file.url)

  if (!response.ok) {
    throw new Error(`Không tải được ${asset.id}: HTTP ${response.status}`)
  }

  await writeFile(targetUrl, Buffer.from(await response.arrayBuffer()))
  manifest.push({
    id: asset.id,
    title: asset.title || '',
    type: asset.type,
    width: file.width ?? null,
    height: file.height ?? null,
    quality: file.quality ?? null,
    mimeType: file.mimeType ?? null,
    localPath: `/assets/tnth-canva/${basename(targetUrl.pathname)}`,
    sourceUrl: file.url,
  })
}

await writeFile(manifestFile, `${JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, assets: manifest }, null, 2)}\n`)

console.log(`Downloaded ${manifest.length} Canva assets to ${join('public', 'assets', 'tnth-canva')}`)
for (const asset of manifest) {
  console.log(`${asset.id}\t${asset.type}\t${asset.width}x${asset.height}\t${asset.title || '(untitled)'}\t${asset.localPath}`)
}
