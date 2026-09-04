import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync } from 'node:fs'
import { basename, extname, join, relative, sep } from 'node:path'

const virtualSourceImagesId = 'virtual:source-images'
const resolvedSourceImagesId = `\0${virtualSourceImagesId}`
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'])

const sourceImageLibrary = () => {
  const root = process.cwd()
  const publicRoot = join(root, 'public')
  const sourceRoot = join(root, 'src', 'assets')

  const scan = (directory: string, source: 'public' | 'src') => {
    const images: Array<{ path: string; url: string; name: string; source: 'public' | 'src' }> = []
    const visit = (current: string) => {
      for (const entry of readdirSync(current, { withFileTypes: true })) {
        const absolute = join(current, entry.name)
        if (entry.isDirectory()) {
          visit(absolute)
        } else if (imageExtensions.has(extname(entry.name).toLowerCase())) {
          const base = source === 'public' ? publicRoot : sourceRoot
          const relativePath = relative(base, absolute).split(sep).join('/')
          images.push({
            path: `${source === 'public' ? 'public' : 'src/assets'}/${relativePath}`,
            url: source === 'public' ? `/${relativePath}` : `/src/assets/${relativePath}`,
            name: basename(entry.name, extname(entry.name)).replace(/[-_]+/g, ' '),
            source,
          })
        }
      }
    }
    visit(directory)
    return images
  }

  const publicImages = scan(publicRoot, 'public')
  const sourceImages = scan(sourceRoot, 'src')
  const imports = sourceImages.map((image, index) => `import sourceImage${index} from ${JSON.stringify(image.url)}`)
  const entries = [
    ...publicImages.map((image) => JSON.stringify(image)),
    ...sourceImages.map((image, index) => JSON.stringify({ ...image, url: `__SOURCE_IMAGE_${index}__` })
      .replace(`"__SOURCE_IMAGE_${index}__"`, `sourceImage${index}`)),
  ]

  return `${imports.join('\n')}\nexport const sourceImages = [${entries.join(',\n')}].sort((a, b) => a.path.localeCompare(b.path))\nexport default sourceImages`
}

const sourceImageLibraryPlugin = (): Plugin => ({
  name: 'source-image-library',
  resolveId(id: string) {
    return id === virtualSourceImagesId ? resolvedSourceImagesId : undefined
  },
  load(id: string) {
    return id === resolvedSourceImagesId ? sourceImageLibrary() : undefined
  },
  configureServer(server) {
    const refreshOnImageChange = (file: string) => {
      if (!imageExtensions.has(extname(file).toLowerCase())) return
      const imageModule = server.moduleGraph.getModuleById(resolvedSourceImagesId)
      if (imageModule) server.moduleGraph.invalidateModule(imageModule)
      server.ws.send({ type: 'full-reload' })
    }
    server.watcher.on('add', refreshOnImageChange)
    server.watcher.on('change', refreshOnImageChange)
    server.watcher.on('unlink', refreshOnImageChange)
  },
})

export default defineConfig({
  plugins: [sourceImageLibraryPlugin(), vue()],
})
