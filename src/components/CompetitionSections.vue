<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, Award, ChevronRight, Trophy } from '@lucide/vue'
import type { IntroSlide, SectionKey, SiteContent } from '../data/site-content'
import { sectionClass, sectionStyle } from '../utils/site-styles'

const props = defineProps<{ site: SiteContent }>()
const root = ref<HTMLElement | null>(null)
const galleryTrack = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
let galleryDragStartX = 0
let galleryScrollStart = 0
const animatedStats = ref<string[]>(props.site.about.statistics.map(() => '0'))

const animateStatistic = (index: number, rawValue: string) => {
  const target = Number(rawValue.replace(/[^\d]/g, ''))
  if (!target) return (animatedStats.value[index] = rawValue)
  const suffix = rawValue.replace(/[\d.,]/g, '')
  const startedAt = performance.now()
  const tick = (time: number) => {
    const progress = Math.min((time - startedAt) / 1400, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedStats.value[index] = `${Math.round(target * eased).toLocaleString('vi-VN')}${suffix}`
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const slideStyle = (slide: IntroSlide) => ({
  backgroundImage: `linear-gradient(155deg, rgba(24, 91, 166, .08), rgba(8, 23, 76, .16)), url("${slide.image}")`,
  backgroundPosition: `center, ${slide.position ?? 'center'}`,
  backgroundSize: 'auto, cover',
})

const aboutImageStyle = computed(() => ({
  backgroundImage: `url("${props.site.assets.aboutImage}")`,
}))

const styleFor = (key: SectionKey, fallbackImage = '') => sectionStyle(props.site, key, fallbackImage)
const classFor = (key: SectionKey) => sectionClass(props.site, key)
const isEnabled = (key: SectionKey) => props.site.settings.sections[key].enabled
const isReverse = (key: SectionKey) => props.site.settings.sections[key].layout === 'reverse'
const hasColumns = (key: SectionKey) => props.site.settings.sections[key].columns > 0
const cardGridStyle = (key: SectionKey) => hasColumns(key)
  ? { gridTemplateColumns: `repeat(${props.site.settings.sections[key].columns}, minmax(0, 1fr))` }
  : undefined

const timelineDescriptionHtml = (description: string) => description
  .split('\n')
  .map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return '<span class="timeline-copy-spacer"></span>'
    if (/^(HOÀN THIỆN ĐỀ ÁN|PHẦN ĐỘI THI ĐƯỢC YÊU THÍCH NHẤT|ĐÊM CHUNG KẾT)$/.test(trimmed)) {
      return `<strong class="timeline-copy-heading">${trimmed}</strong>`
    }
    if (/^Phần \d+:/.test(trimmed)) {
      const [label, ...copy] = trimmed.split(':')
      return `<span class="timeline-copy-line"><b>${label}:</b>${copy.join(':')}</span>`
    }
    return `<span class="timeline-copy-line">${trimmed}</span>`
  })
  .join('')

const startGalleryDrag = (event: PointerEvent) => {
  if (!galleryTrack.value) return
  galleryDragStartX = event.clientX
  galleryScrollStart = galleryTrack.value.scrollLeft
  galleryTrack.value.classList.add('is-dragging')
  galleryTrack.value.setPointerCapture(event.pointerId)
}

const moveGalleryDrag = (event: PointerEvent) => {
  if (!galleryTrack.value?.classList.contains('is-dragging')) return
  galleryTrack.value.scrollLeft = galleryScrollStart - (event.clientX - galleryDragStartX) * 1.2
}

const stopGalleryDrag = (event: PointerEvent) => {
  if (!galleryTrack.value) return
  galleryTrack.value.classList.remove('is-dragging')
  if (galleryTrack.value.hasPointerCapture(event.pointerId)) galleryTrack.value.releasePointerCapture(event.pointerId)
}

onMounted(() => {
  if (!root.value) return
  const revealElements = root.value.querySelectorAll<HTMLElement>('.reveal')
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'))
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          const statIndex = entry.target.getAttribute('data-stat-index')
          if (statIndex !== null) animateStatistic(Number(statIndex), props.site.about.statistics[Number(statIndex)].value)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
  )
  revealElements.forEach((element) => observer?.observe(element))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="root" class="competition-sections">
    <section
      v-if="isEnabled('intro')"
      id="organizers"
      data-editor-section="intro"
      class="content-section intro-section"
      :class="classFor('intro')"
      :style="styleFor('intro')"
    >
      <div class="container px-4 px-lg-5">
        <div class="intro-heading text-center reveal">
          <h2>{{ site.intro.title || 'BAN TỔ CHỨC' }}</h2>
          <p>{{ site.intro.subtitle || 'BAN ĐỐI NGOẠI - HỘI SINH VIÊN - NEU' }}</p>
        </div>
        <div class="row align-items-center g-4 g-lg-5 intro-section__row" :class="{ 'flex-lg-row-reverse': isReverse('intro') }">
          <div class="col-lg-7 reveal slide-left">
            <div class="about-copy-card">
              <p v-for="(paragraph, index) in site.intro.paragraphsHtml" :key="index" v-html="paragraph"></p>
            </div>
          </div>
          <div class="col-lg-5 reveal slide-right">
            <div id="organizerCarousel" class="carousel slide carousel-fade section-carousel" data-bs-ride="carousel" data-bs-interval="4200">
              <div class="carousel-indicators">
                <button v-for="(_, index) in site.assets.organizerSlides" :key="index" type="button" data-bs-target="#organizerCarousel" :data-bs-slide-to="index" :class="{ active: index === 0 }" :aria-label="`Slide ${index + 1}`"></button>
              </div>
              <div class="carousel-inner">
                <div v-for="(slide, index) in site.assets.organizerSlides" :key="`${slide.image}-${index}`" class="carousel-item" :class="{ active: index === 0 }">
                  <div class="section-image section-image--organizer" :style="slideStyle(slide)"><div class="image-grid"></div><span v-if="slide.label">{{ slide.label }}</span></div>
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#organizerCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span><span class="visually-hidden">Trước</span></button>
              <button class="carousel-control-next" type="button" data-bs-target="#organizerCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span><span class="visually-hidden">Sau</span></button>
            </div>
          </div>
        </div>
        <div class="text-center intro-section__cta reveal"><a class="outline-light-button" :href="site.intro.ctaHref" target="_blank" rel="noopener noreferrer">{{ site.intro.ctaLabel }} <ArrowRight :size="17" /></a></div>
      </div>
    </section>

    <section v-if="isEnabled('about')" id="about" data-editor-section="about" class="content-section section-deep-blue section-divider-top" :class="classFor('about')" :style="styleFor('about')">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5">
        <div class="text-center section-heading reveal">
          <p v-if="site.about.kicker" class="section-kicker justify-content-center">{{ site.about.kicker }}</p>
          <h2>{{ site.about.title }}</h2>
          <p>{{ site.about.description }}</p>
        </div>
        <div class="row mt-2 mt-lg-4 g-4 align-items-center" :class="{ 'flex-md-row-reverse': isReverse('about') }">
          <div class="col-md-6 reveal slide-left"><div class="section-image section-image--vision" :style="aboutImageStyle"><span>{{ site.about.imageLabel }}</span></div></div>
          <div class="col-md-6 reveal slide-right"><p v-for="(paragraph, index) in site.about.paragraphsHtml" :key="index" v-html="paragraph"></p></div>
        </div>
        <div v-if="site.assets.aboutGallery?.length" class="about-years reveal">
          <div class="about-years__heading">
            <div><span class="about-years__eyebrow">HÀNH TRÌNH THƯƠNG HIỆU</span><h3>DẤU ẤN QUA CÁC NĂM</h3></div>
            <span class="about-years__hint">Kéo ngang <ArrowRight :size="15" /></span>
          </div>
          <div ref="galleryTrack" class="about-years__track" @pointerdown="startGalleryDrag" @pointermove="moveGalleryDrag" @pointerup="stopGalleryDrag" @pointercancel="stopGalleryDrag">
            <figure v-for="(image, index) in site.assets.aboutGallery" :key="image" class="about-years__item">
              <img :src="image" :alt="`Tầm Nhìn Thương Hiệu qua các năm - ảnh ${index + 1}`" loading="lazy" draggable="false" />
              <figcaption><small>TẦM NHÌN THƯƠNG HIỆU</small><strong>{{ ['2025', '2024', '2023'][index % 3] }}</strong></figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>

    <section v-if="isEnabled('metrics')" data-editor-section="metrics" class="metrics-section" :class="classFor('metrics')" :style="styleFor('metrics')">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="metrics-section__stars"></div>
      <div class="container px-4 px-lg-5 position-relative">
        <div class="metrics-grid" :style="cardGridStyle('metrics')">
          <article v-for="(stat, index) in site.about.statistics" :key="`${stat.label}-${index}`" class="metric-item reveal" :data-stat-index="index" :style="{ transitionDelay: `${index * 85}ms` }">
            <img class="metric-item__icon" :src="site.assets.statisticIcon" alt="" />
            <strong>{{ animatedStats[index] }}</strong>
            <span>{{ stat.label }}</span>
          </article>
        </div>
      </div>
    </section>

    <section v-if="isEnabled('voices')" data-editor-section="voices" class="content-section voices-section section-deep-blue" :class="classFor('voices')" :style="styleFor('voices')">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5">
        <div class="text-center voices-heading reveal"><h2>{{ site.voices.title }}</h2></div>
        <div id="voicesCarousel" class="carousel slide voices-carousel reveal" data-bs-ride="carousel" data-bs-interval="5600">
          <div class="carousel-inner">
            <div v-for="(voice, index) in site.voices.slides" :key="`${voice.name}-${index}`" class="carousel-item" :class="{ active: index === 0 }">
              <article class="voice-card">
                <div class="voice-card__portrait"><img v-if="voice.image" :src="voice.image" :alt="voice.name" /></div>
                <div class="voice-card__copy"><h3>{{ voice.name }}</h3><p>{{ voice.role }}</p><blockquote>“{{ voice.quote }}”</blockquote></div>
              </article>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#voicesCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span><span class="visually-hidden">Trước</span></button>
          <button class="carousel-control-next" type="button" data-bs-target="#voicesCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span><span class="visually-hidden">Sau</span></button>
          <div class="carousel-indicators"><button v-for="(_, index) in site.voices.slides" :key="index" type="button" data-bs-target="#voicesCarousel" :data-bs-slide-to="index" :class="{ active: index === 0 }" :aria-label="`Slide ${index + 1}`"></button></div>
        </div>
      </div>
    </section>

    <section v-if="isEnabled('theme')" data-editor-section="theme" class="content-section section-cosmic" :class="classFor('theme')" :style="styleFor('theme')">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="cosmic-orb cosmic-orb--one"></div><div class="cosmic-orb cosmic-orb--two"></div>
      <div class="container px-4 px-lg-5 position-relative">
        <div class="text-center section-heading theme-heading reveal"><p v-if="site.theme.kicker" class="section-kicker justify-content-center"><Trophy :size="16" /> {{ site.theme.kicker }}</p><h2>{{ site.theme.title }}</h2><strong v-if="site.theme.subtitle">{{ site.theme.subtitle }}</strong></div>
        <div class="row align-items-center g-4 g-lg-5 mt-2" :class="{ 'flex-lg-row-reverse': isReverse('theme') }">
          <div class="col-lg-5 reveal slide-left"><div class="theme-card theme-card--poster"><img :src="site.assets.themePoster" alt="Chủ đề Tầm Nhìn Thương Hiệu 2026" /></div></div>
          <div class="col-lg-7 reveal slide-right"><p v-for="(paragraph, index) in site.theme.paragraphsHtml" :key="index" v-html="paragraph"></p></div>
        </div>
      </div>
    </section>

    <section v-if="isEnabled('rules')" id="rules" data-editor-section="rules" class="content-section section-deep-blue" :class="classFor('rules')" :style="styleFor('rules')">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5">
        <div class="text-center section-heading reveal"><h2>{{ site.rules.title }}</h2></div>
        <div class="row g-3 g-lg-4 mt-2" :class="{ 'configured-card-grid': hasColumns('rules') }" :style="cardGridStyle('rules')">
          <div v-for="(rule, index) in site.rules.cards" :key="`${rule.title}-${index}`" :class="hasColumns('rules') ? '' : 'col-md-4'" class="reveal" :style="{ transitionDelay: `${index * 90}ms` }"><article class="rule-card h-100"><span class="rule-card__number">{{ String(index + 1).padStart(2, '0') }}</span><h3>{{ rule.title }}</h3><ul><li v-for="(item, itemIndex) in rule.items" :key="itemIndex">{{ item }}</li></ul></article></div>
        </div>
      </div>
    </section>

    <section v-if="isEnabled('timeline')" data-editor-section="timeline" class="timeline-section" :class="classFor('timeline')" :style="styleFor('timeline', site.assets.timelineBackground)">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5 position-relative">
        <div class="text-center section-heading reveal"><h2>{{ site.timeline.title }}</h2></div>
        <div class="row align-items-center g-4 mt-1" :class="{ 'flex-md-row-reverse': isReverse('timeline') }">
          <div class="col-md-5 reveal slide-left"><div class="timeline-nav nav nav-pills flex-column" role="tablist"><button v-for="(round, index) in site.timeline.rounds" :key="`${round.title}-${index}`" class="nav-link" :class="{ active: index === 0 }" type="button" data-bs-toggle="pill" :data-bs-target="`#round-${index}`"><span>{{ String(index + 1).padStart(2, '0') }}</span><strong>{{ round.title }}</strong></button></div></div>
          <div class="col-md-7 reveal slide-right"><div class="tab-content timeline-content"><article v-for="(round, index) in site.timeline.rounds" :id="`round-${index}`" :key="`${round.title}-${index}`" class="tab-pane fade" :class="{ 'show active': index === 0 }"><p class="timeline-stage">{{ round.title }}</p><span class="timeline-date">{{ round.date }}</span><div class="timeline-copy" v-html="timelineDescriptionHtml(round.description)"></div></article></div></div>
        </div>
      </div>
    </section>

    <section v-if="isEnabled('prizes')" id="prizes" data-editor-section="prizes" class="content-section section-deep-blue" :class="classFor('prizes')" :style="styleFor('prizes')">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5">
        <div class="text-center section-heading reveal"><h2>{{ site.prizes.title }}</h2></div>
        <div class="total-prize reveal"><span>{{ site.prizes.totalLabel }}</span><strong>{{ site.prizes.totalValue }}</strong></div>
        <div class="row g-3 g-lg-4 mt-3" :class="{ 'configured-card-grid': hasColumns('prizes') }" :style="cardGridStyle('prizes')"><div v-for="(prize, index) in site.prizes.cards" :key="`${prize.title}-${index}`" :class="hasColumns('prizes') ? '' : 'col-md-6'" class="reveal" :style="{ transitionDelay: `${index * 75}ms` }"><article class="prize-card h-100"><Award :size="22" /><h3>{{ prize.title }}</h3><strong>{{ prize.value }}</strong><ul><li v-for="(benefit, benefitIndex) in prize.benefits" :key="benefitIndex">{{ benefit }}</li></ul></article></div></div>
      </div>
    </section>

    <section v-if="isEnabled('benefits')" data-editor-section="benefits" class="content-section section-light-blue" :class="classFor('benefits')" :style="styleFor('benefits')">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5">
        <div class="text-center section-heading section-heading--dark reveal"><h2>{{ site.benefits.title }}</h2></div>
        <div class="row g-4 mt-1" :class="{ 'configured-card-grid': hasColumns('benefits') }" :style="cardGridStyle('benefits')"><div v-for="(group, index) in site.benefits.groups" :key="`${group.title}-${index}`" :class="hasColumns('benefits') ? '' : 'col-lg-6'" class="reveal"><article class="glass-rule h-100"><h3>{{ group.title }}</h3><ul><li v-for="(item, itemIndex) in group.items" :key="itemIndex">{{ item }}</li></ul></article></div></div>
      </div>
    </section>

    <section v-if="isEnabled('activities')" id="register" data-editor-section="activities" class="content-section section-cosmic section-activities" :class="classFor('activities')" :style="styleFor('activities', site.assets.activitiesBackground)">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5 position-relative">
        <div class="text-center section-heading reveal"><h2>{{ site.activities.title }}</h2></div>
        <div class="row g-3 mt-1" :class="{ 'configured-card-grid': hasColumns('activities') }" :style="cardGridStyle('activities')"><div v-for="(activity, index) in site.activities.cards" :key="`${activity.title}-${index}`" class="reveal" :class="hasColumns('activities') ? '' : [index % 2 === 0 ? 'slide-left' : 'slide-right']"><article class="activity-card h-100"><h3>{{ activity.title }} <em>{{ activity.date }}</em></h3><p>{{ activity.description }}</p><a :class="{ 'activity-cta--bubble': index < 2 }" :href="activity.ctaHref">{{ activity.ctaLabel }} <ChevronRight :size="16" /></a></article></div></div>
      </div>
    </section>

    <section v-if="isEnabled('faq')" data-editor-section="faq" class="content-section faq-section section-cosmic" :class="classFor('faq')" :style="styleFor('faq', site.assets.activitiesBackground)">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5">
        <div class="faq-wrap reveal"><div class="text-center section-heading"><h2>FAQ</h2></div><div id="faqAccordion" class="accordion accordion-flush"><div v-for="(item, index) in site.faq" :key="`${item.question}-${index}`" class="accordion-item"><h3 class="accordion-header"><button class="accordion-button" :class="{ collapsed: index !== 0 }" type="button" data-bs-toggle="collapse" :data-bs-target="`#faq-${index}`">{{ index + 1 }}. {{ item.question }}</button></h3><div :id="`faq-${index}`" class="accordion-collapse collapse" :class="{ show: index === 0 }" data-bs-parent="#faqAccordion"><div class="accordion-body">{{ item.answer }}</div></div></div></div></div>
      </div>
    </section>

    <section v-if="isEnabled('partners')" id="partners" data-editor-section="partners" class="content-section section-deep-blue partners-section" :class="classFor('partners')" :style="styleFor('partners')">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5 text-center">
        <div class="section-heading reveal"><h2>{{ site.partners.title }}</h2></div>
        <div class="partner-markers reveal"><span v-for="(marker, index) in site.partners.markers" :key="index">{{ marker }}</span></div>
        <div class="row row-cols-2 row-cols-md-4 g-3 partner-levels reveal" :class="{ 'configured-card-grid': hasColumns('partners') }" :style="cardGridStyle('partners')"><div v-for="(level, index) in site.partners.levels" :key="`${level.value}-${index}`" :class="hasColumns('partners') ? '' : 'col'"><span>{{ level.label }}</span><strong>{{ level.value }}</strong></div></div>
      </div>
    </section>

    <footer v-if="isEnabled('footer')" id="footer" data-editor-section="footer" class="event-footer" :class="classFor('footer')" :style="styleFor('footer', site.assets.footerBackground)">
      <div class="section-transition" aria-hidden="true"></div>
      <div class="container px-4 px-lg-5">
        <div class="footer-contact-card" :class="{ 'footer-contact-card--reverse': isReverse('footer') }">
          <div class="footer-contact-card__details"><img class="footer-contact-card__logo" :src="site.assets.footerLogo" alt="Tầm Nhìn Thương Hiệu" /><div><strong>{{ site.footer.contactTitle || site.footer.title }}</strong><p v-for="(line, index) in site.footer.contactLines" :key="index">{{ line }}</p></div></div>
          <div class="footer-contact-card__socials"><a v-for="(social, index) in site.footer.socials" :key="`${social.label}-${index}`" :href="social.href" target="_blank" rel="noopener noreferrer"><img :src="social.icon" :alt="social.label" /><span>{{ social.label }}</span></a></div>
        </div>
      </div>
    </footer>
  </div>
</template>
