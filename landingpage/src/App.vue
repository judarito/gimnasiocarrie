<script setup>
import { computed, ref, onErrorCaptured } from 'vue'
import { pendingRequests } from './lib/api.js'

const isLoading = computed(() => pendingRequests.value > 0)
const globalError = ref(null)

onErrorCaptured((err) => {
  globalError.value = err.message + '\n' + err.stack
  return false // prevent propagation
})
</script>

<template>
  <div v-if="globalError" style="position: fixed; inset: 0; z-index: 10000; background: white; padding: 20px; color: red; overflow: auto;">
    <h1>Error Crítico</h1>
    <pre>{{ globalError }}</pre>
    <button @click="globalError = null">Cerrar</button>
  </div>
  <div class="global-loading-bar" :class="{ 'global-loading-bar--active': isLoading }"></div>
  <router-view />
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
