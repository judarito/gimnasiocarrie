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
const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL_MS ?? 7 * 24 * 60 * 60 * 1000) // 7d por defecto
const REFETCH_COOLDOWN = 5 * 60 * 1000 // no refrescar si el último fetch fue hace menos de 5 min

let lastFetchAt = 0

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
const error = ref('')
const showScrollTop = ref(false)
// 'idle' | 'cache' | 'fresh' | 'stale'
const syncStatus = ref('idle')
let freshTimer = null

function onScroll() {
  showScrollTop.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onVisibilityChange() {
  if (document.visibilityState === 'visible' && Date.now() - lastFetchAt > REFETCH_COOLDOWN) {
    loadSite()
  }
}

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  clearTimeout(freshTimer)
})

const news = computed(() => posts.value.filter((post) => post.type === 'news'))
const events = computed(() => posts.value.filter((post) => post.type === 'event'))

onMounted(() => {
  loadSite()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
})

async function loadSite() {
  error.value = ''
  clearTimeout(freshTimer)

  const cached = loadCache()
  if (cached) {
    applyPayload(cached)
    syncStatus.value = 'cache'  // mostrando caché, API en camino
  }

  try {
    const payload = await getPublicSite()
    lastFetchAt = Date.now()
    saveCache(payload)
    applyPayload(payload)
    syncStatus.value = 'fresh'  // info recién traída del servidor
    freshTimer = setTimeout(() => { syncStatus.value = 'idle' }, 3000)
  } catch (loadError) {
    if (cached) {
      syncStatus.value = 'stale'  // API falló, mostrando caché
    } else {
      error.value = loadError.message
      syncStatus.value = 'idle'
    }
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

    <Transition name="sync-fade">
      <div
        v-if="syncStatus !== 'idle'"
        class="sync-indicator"
        :class="`sync-indicator--${syncStatus}`"
      >
        <span class="sync-indicator__dot"></span>
        <span v-if="syncStatus === 'cache'">Caché local · actualizando…</span>
        <span v-else-if="syncStatus === 'fresh'">Actualizado</span>
        <span v-else-if="syncStatus === 'stale'">Sin conexión · caché local</span>
      </div>
    </Transition>
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

.sync-indicator {
  position: fixed;
  bottom: 20px;
  left: 18px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-blue-dark);
  z-index: 100;
  pointer-events: none;
}

.sync-indicator__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* cache: azul pulsante */
.sync-indicator--cache { color: var(--color-blue-dark); }
.sync-indicator--cache .sync-indicator__dot {
  background: var(--color-blue);
  animation: sync-pulse 1.4s ease-in-out infinite;
}

/* fresh: verde, estático */
.sync-indicator--fresh { color: #2d7a1f; }
.sync-indicator--fresh .sync-indicator__dot { background: #4caf50; }

/* stale: ámbar, estático */
.sync-indicator--stale { color: #7a4a00; }
.sync-indicator--stale .sync-indicator__dot { background: #f59e0b; }

@keyframes sync-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.sync-fade-enter-active,
.sync-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.sync-fade-enter-from,
.sync-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
