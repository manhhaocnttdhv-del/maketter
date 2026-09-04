<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { SiteContent } from '../data/site-content'
import { sectionClass, sectionStyle } from '../utils/site-styles'

const props = defineProps<{
  site: SiteContent
  preview?: boolean
}>()

const now = ref(Date.now())
let intervalId: ReturnType<typeof setInterval> | undefined
const activeNavigationTarget = ref('top')

const updateActiveNavigation = () => {
  if (props.preview) return
  const headerOffset = (headerSettings.value.enabled ? headerSettings.value.height : 0) + 32
  const targets = ['top', ...props.site.navigation.map((item) => item.target)]
  let current = 'top'

  targets.forEach((target) => {
    const section = document.getElementById(target)
    if (section && section.getBoundingClientRect().top <= headerOffset) current = target
  })

  activeNavigationTarget.value = current
}

if (!props.preview) {
  intervalId = window.setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

const countdown = computed(() => {
  const deadline = new Date(props.site.hero.deadline).getTime()
  const remaining = Math.max(0, deadline - now.value)
  const day = Math.floor(remaining / 86_400_000)
  const hour = Math.floor((remaining % 86_400_000) / 3_600_000)
  const minute = Math.floor((remaining % 3_600_000) / 60_000)
  const second = Math.floor((remaining % 60_000) / 1000)

  return [day, hour, minute, second].map((value) => String(value).padStart(2, '0'))
})

const countdownLabels = ['NGÀY', 'GIỜ', 'PHÚT', 'GIÂY']

const heroSettings = computed(() => props.site.settings.sections.hero)
const headerSettings = computed(() => props.site.settings.header)

const heroStyle = computed(() => {
  const style = sectionStyle(props.site, 'hero', props.site.assets.heroBackground)
  style.marginTop = headerSettings.value.enabled && headerSettings.value.sticky
    ? `${headerSettings.value.height + heroSettings.value.marginTop}px`
    : `${heroSettings.value.marginTop}px`
  return style
})

const heroBackgroundStyle = computed(() => ({
  backgroundImage: `url("${heroSettings.value.backgroundImage || props.site.assets.heroBackground}")`,
  backgroundPosition: heroSettings.value.backgroundPosition,
  backgroundSize: heroSettings.value.backgroundSize,
  backgroundRepeat: heroSettings.value.backgroundRepeat,
}))

const heroShadeStyle = computed(() => ({
  backgroundColor: heroSettings.value.overlayColor,
  opacity: heroSettings.value.overlayOpacity,
}))

const headerStyle = computed(() => ({
  height: `${headerSettings.value.height}px`,
  minHeight: `${headerSettings.value.height}px`,
  color: headerSettings.value.textColor,
  background: headerSettings.value.backgroundColor,
  backdropFilter: `blur(${headerSettings.value.backdropBlur}px)`,
}))

const headerContainerStyle = computed(() => ({
  '--header-container-width': `${headerSettings.value.containerWidth}px`,
  '--header-padding-x': `${headerSettings.value.paddingX}px`,
  '--header-logo-width': `${headerSettings.value.logoWidth}px`,
  '--header-nav-gap': `${headerSettings.value.navGap}px`,
  '--header-font-size': `${headerSettings.value.fontSize}px`,
}))

onMounted(() => {
  updateActiveNavigation()
  if (!props.preview) window.addEventListener('scroll', updateActiveNavigation, { passive: true })
})

onBeforeUnmount(() => {
  if (intervalId) window.clearInterval(intervalId)
  window.removeEventListener('scroll', updateActiveNavigation)
})
</script>

<template>
  <div class="event-page" :class="{ 'event-page--editor-preview': preview }">
    <div class="event-frame">
      <header v-if="headerSettings.enabled" data-editor-section="header" class="event-nav navbar navbar-expand-md" :class="{ 'event-nav--inline': !headerSettings.sticky }" :style="headerStyle">
        <div class="event-nav__inner container" :style="headerContainerStyle">
          <a href="#top" class="event-mark" :aria-label="site.meta.title">
            <img :src="site.assets.headerLogo" alt="Logo Tầm Nhìn Thương Hiệu" />
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#eventNavigation" aria-controls="eventNavigation" aria-label="Mở điều hướng">
            <span></span><span></span><span></span>
          </button>
          <div id="eventNavigation" class="collapse navbar-collapse">
            <ul class="navbar-nav ms-auto align-items-lg-center">
              <li v-for="item in site.navigation" :key="item.target" class="nav-item"><a class="nav-link" :class="{ active: activeNavigationTarget === item.target }" :href="`#${item.target}`" :aria-current="activeNavigationTarget === item.target ? 'page' : undefined">{{ item.label }}</a></li>
            </ul>
          </div>
        </div>
      </header>

      <section v-if="heroSettings.enabled" id="top" data-editor-section="hero" class="competition-hero" :class="sectionClass(site, 'hero')" :style="heroStyle">
        <div class="hero-background" :style="heroBackgroundStyle" aria-hidden="true"></div>
        <div class="hero-shade" :style="heroShadeStyle" aria-hidden="true"></div>
        <div class="hero-scanline" aria-hidden="true"></div>

        <div class="hero-content container">
          <div class="hero-copy">
            <img v-if="site.assets.heroTitleArtwork" class="hero-title-artwork" :src="site.assets.heroTitleArtwork" alt="Tầm Nhìn Thương Hiệu 2026" />
            <h1 v-else>
              <span>{{ site.hero.titleLineOne }}</span>
              <span>{{ site.hero.titleLineTwo }}</span>
              <span class="event-edition">{{ site.hero.edition }}</span>
            </h1>
            <p v-if="site.hero.tagline" class="event-tagline">{{ site.hero.tagline }}</p>

            <div class="countdown" aria-label="Thời gian đến sự kiện">
              <div v-for="(value, index) in countdown" :key="countdownLabels[index]" class="countdown-item">
                <strong>{{ value }}</strong>
                <span>{{ countdownLabels[index] }}</span>
              </div>
            </div>

            <a id="content" class="register-button" :href="site.hero.ctaHref">{{ site.hero.ctaLabel }}</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
