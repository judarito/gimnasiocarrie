<script setup>
import { computed, onMounted, ref } from 'vue'
import { cloneDefaultPosts, cloneDefaultSiteData, mergeSiteData } from '../content/defaultSiteData.js'
import { getPublicSite } from '../lib/api.js'
import AboutSection from './AboutSection.vue'
import ContactSection from './ContactSection.vue'
import FeaturesSection from './FeaturesSection.vue'
import FooterSection from './FooterSection.vue'
import HeroSection from './HeroSection.vue'
import NewsEventsSection from './NewsEventsSection.vue'
import ProgramsSection from './ProgramsSection.vue'

const settings = ref(cloneDefaultSiteData())
const posts = ref(cloneDefaultPosts())
const loading = ref(true)
const error = ref('')

const news = computed(() => posts.value.filter((post) => post.type === 'news'))
const events = computed(() => posts.value.filter((post) => post.type === 'event'))

onMounted(loadSite)

async function loadSite() {
  loading.value = true
  error.value = ''

  try {
    const payload = await getPublicSite()
    settings.value = mergeSiteData(payload.settings || {})
    posts.value = [
      ...(payload.posts?.events || []),
      ...(payload.posts?.news || []),
    ]
  } catch (loadError) {
    error.value = loadError.message
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

    <div v-if="loading" class="public-loading">
      <span></span>
    </div>
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

.public-loading {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(16, 42, 86, 0.9);
}

.public-loading span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
