import type { CSSProperties } from 'vue'
import type { SectionKey, SiteContent } from '../data/site-content'

const colorWithOpacity = (color: string, opacity: number) => {
  const normalized = color.trim()
  const hex = normalized.replace('#', '')
  if (/^[\da-f]{3}$/i.test(hex)) {
    const [r, g, b] = hex.split('').map((part) => Number.parseInt(part + part, 16))
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  if (/^[\da-f]{6}$/i.test(hex)) {
    const value = Number.parseInt(hex, 16)
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${opacity})`
  }
  return normalized || `rgba(7, 20, 56, ${opacity})`
}

export const globalSiteStyle = (site: SiteContent): CSSProperties => {
  const global = site.settings.global
  const bgImage = site.assets.globalBackground ? `url("${site.assets.globalBackground}")` : undefined
  return {
    '--site-container-width': `${global.containerWidth}px`,
    '--site-font-family': global.fontFamily,
    '--site-heading-font-family': global.headingFontFamily,
    '--site-base-font-size': `${global.baseFontSize}px`,
    '--site-primary-color': global.primaryColor,
    '--site-secondary-color': global.secondaryColor,
    '--site-accent-color': global.accentColor,
    '--site-text-color': global.textColor,
    '--site-heading-color': global.headingColor,
    '--site-button-radius': `${global.buttonRadius}px`,
    '--site-page-background': global.pageBackground,
    '--site-global-bg-image': bgImage,
    backgroundColor: global.pageBackground,
    backgroundImage: bgImage,
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    color: global.textColor,
    fontFamily: global.fontFamily,
    fontSize: `${global.baseFontSize}px`,
    scrollBehavior: global.scrollBehavior,
  } as CSSProperties
}

export const sectionStyle = (
  site: SiteContent,
  key: SectionKey,
  fallbackImage = '',
): CSSProperties => {
  const settings = site.settings.sections[key]
  const image = key === 'hero'
    ? (settings.backgroundImage || fallbackImage || site.assets.heroBackground)
    : (settings.backgroundImage || site.assets.globalBackground)
  const style: CSSProperties = {
    '--section-container-width': `${settings.containerWidth}px`,
    '--section-columns': String(settings.columns || 0),
    '--section-content-font-size': `${settings.contentFontSize}px`,
    paddingTop: `${settings.paddingTop}px`,
    paddingBottom: `${settings.paddingBottom}px`,
    marginTop: `${settings.marginTop}px`,
    marginBottom: `${settings.marginBottom}px`,
    minHeight: settings.minHeight > 0 ? `${settings.minHeight}px` : undefined,
    color: settings.textColor || undefined,
    textAlign: settings.contentAlign,
    borderRadius: settings.borderRadius > 0 ? `${settings.borderRadius}px` : undefined,
    backgroundColor: settings.backgroundColor || undefined,
    backgroundPosition: settings.backgroundPosition,
    backgroundSize: settings.backgroundSize,
    backgroundRepeat: settings.backgroundRepeat,
    backgroundAttachment: image ? 'fixed' : undefined,
  } as CSSProperties

  if (image) {
    const overlay = colorWithOpacity(settings.overlayColor, settings.overlayOpacity)
    style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url("${image}")`
  }

  if (key !== 'hero') {
    const order = site.settings.sectionOrder.indexOf(key)
    style.order = order >= 0 ? order : site.settings.sectionOrder.length
  }

  return style
}

export const sectionClass = (site: SiteContent, key: SectionKey) => {
  const settings = site.settings.sections[key]
  return [
    'configurable-section',
    `section-layout-${settings.layout}`,
    settings.columns > 0 ? 'section-has-custom-columns' : '',
    settings.customClass,
  ]
}
