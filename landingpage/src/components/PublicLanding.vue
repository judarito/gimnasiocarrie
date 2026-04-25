<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { cloneDefaultPosts, cloneDefaultSiteData, mergeSiteData } from '../content/defaultSiteData.js'
import { getPublicSite } from '../lib/api.js'
import AboutSection from './AboutSection.vue'
import ContactSection from './ContactSection.vue'
import FeaturesSection from './FeaturesSection.vue'
import FooterSection from './FooterSection.vue'
import HeroSection from './HeroSection.vue'
import NewsEventsSection from './NewsEventsSection.vue'
import ProgramsSection from './ProgramsSection.vue'

const CACHE_KEY = 'gc_site_v1'
const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL_MS ?? 24 * 60 * 60 * 1000) // 24h por defecto

function saveCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ payload, savedAt: Date.now() }))
  } catch {}
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { payload, savedAt } = JSON.parse(raw)
    if (Date.now() - savedAt > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return payload
  } catch {
    return null
  }
}

function applyPayload(payload) {
  settings.value = mergeSiteData(payload.settings || {})
  posts.value = [
    ...(payload.posts?.events || []),
    ...(payload.posts?.news || []),
  ]
}

const settings = ref(cloneDefaultSiteData())
const posts = ref(cloneDefaultPosts())
const loading = ref(true)
const error = ref('')
const showScrollTop = ref(false)

function onScroll() {
  showScrollTop.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onUnmounted(() => window.removeEventListener('scroll', onScroll))

const news = computed(() => posts.value.filter((post) => post.type === 'news'))
const events = computed(() => posts.value.filter((post) => post.type === 'event'))

onMounted(() => {
  loadSite()
  window.addEventListener('scroll', onScroll, { passive: true })
})

async function loadSite() {
  loading.value = true
  error.value = ''

  try {
    const payload = await getPublicSite()
    saveCache(payload)
    applyPayload(payload)
  } catch (loadError) {
    const cached = loadCache()
    if (cached) {
      applyPayload(cached)
    } else {
      error.value = loadError.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="app-shell">
    <div v-if="error" class="public-alert">
      <div class="container">
        <p>
          Mostrando contenido local porque el backend no respondió:
          {{ error }}
        </p>
      </div>
    </div>

    <HeroSection :site="settings.site" :hero="settings.hero" />
    <main>
      <FeaturesSection :items="settings.features" />
      <AboutSection :about="settings.about" />
      <ProgramsSection :programs="settings.programs" />
      <NewsEventsSection :section="settings.newsSection" :news="news" :events="events" />
      <ContactSection :site="settings.site" :contact="settings.contact" />
    </main>
    <FooterSection :site="settings.site" :footer="settings.footer" />


    <button
      v-if="showScrollTop"
      class="scroll-top"
      aria-label="Volver arriba"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.public-alert {
  padding: 0.75rem 0;
  background: rgba(255, 80, 71, 0.1);
  color: #b83f38;
  font-weight: 700;
}


.scroll-top {
  position: fixed;
  right: 18px;
  bottom: 76px;
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(16, 42, 86, 0.9);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: background 0.2s ease, transform 0.2s ease;
}

.scroll-top:hover {
  background: rgba(38, 118, 227, 0.95);
  transform: translateY(-2px);
}
</style>
