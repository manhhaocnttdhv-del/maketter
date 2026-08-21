<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CompetitionHero from '../components/CompetitionHero.vue'
import CompetitionSections from '../components/CompetitionSections.vue'
import { loadSiteContent, type SiteContent } from '../data/site-content'
import { globalSiteStyle } from '../utils/site-styles'

const content = ref<SiteContent | null>(null)
const loadError = ref('')
let customStyleElement: HTMLStyleElement | null = null

onMounted(async () => {
  try {
    content.value = await loadSiteContent()
    document.title = content.value.meta.title
    if (content.value.settings.customCss.trim()) {
      customStyleElement = document.createElement('style')
      customStyleElement.dataset.tnthCustomCss = 'true'
      customStyleElement.textContent = content.value.settings.customCss
      document.head.appendChild(customStyleElement)
    }
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Không thể tải nội dung trang.'
  }
})

onBeforeUnmount(() => customStyleElement?.remove())
</script>

<template>
  <main v-if="content" class="event-index" :style="globalSiteStyle(content)">
    <CompetitionHero :site="content" />
    <CompetitionSections :site="content" />
  </main>
  <main v-else class="page-loading"><span v-if="!loadError" class="loading-orbit"></span><p>{{ loadError || 'Đang tải trải nghiệm sự kiện...' }}</p></main>
</template>
