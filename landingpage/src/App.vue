<script setup>
import { computed } from 'vue'
import { pendingRequests } from './lib/api.js'
import AdminApp from './components/AdminApp.vue'
import PublicLanding from './components/PublicLanding.vue'

const isAdminRoute = window.location.pathname.startsWith('/admin')
const isLoading = computed(() => pendingRequests.value > 0)
</script>

<template>
  <div class="global-loading-bar" :class="{ 'global-loading-bar--active': isLoading }"></div>
  <AdminApp v-if="isAdminRoute" />
  <PublicLanding v-else />
</template>

<style>
.global-loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, #2676e3, #68b738);
  transition: opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

.global-loading-bar--active {
  opacity: 1;
  width: 100%;
  transition: width 8s cubic-bezier(0.1, 0.05, 0, 1), opacity 0.3s ease;
}
</style>
