<script setup>
import AdminApp from './components/AdminApp.vue'
import PublicLanding from './components/PublicLanding.vue'

const isAdminRoute = window.location.pathname.startsWith('/admin')
</script>

<template>
  <AdminApp v-if="isAdminRoute" />
  <PublicLanding v-else />
</template>
