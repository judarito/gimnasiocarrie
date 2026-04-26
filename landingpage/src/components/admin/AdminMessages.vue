<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useAdmin } from '../../lib/useAdmin.js'
import { getAdminContacts } from '../../lib/api.js'

const { state, authError } = useAdmin()

const contactsLoading = ref(false)

async function loadContacts(page = state.contactsPagination.page) {
  contactsLoading.value = true
  try {
    const payload = await getAdminContacts({ page, pageSize: state.contactsPagination.pageSize })
    state.contacts = payload.items || []
    state.contactsPagination = {
      page: payload.page,
      pageSize: payload.pageSize,
      total: payload.total,
      totalPages: payload.totalPages,
    }
  } catch (error) {
    authError.value = error.message
  } finally {
    contactsLoading.value = false
  }
}

onMounted(() => {
  if (state.user) {
    loadContacts(1)
  }
})

watch(() => state.user, (user) => {
  if (user) loadContacts(1)
})

function formatDateTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const hasPreviousPage = computed(() => state.contactsPagination.page > 1)
const hasNextPage = computed(() => state.contactsPagination.page < state.contactsPagination.totalPages)

async function changePage(direction) {
  const nextPage = state.contactsPagination.page + direction
  if (nextPage < 1 || nextPage > state.contactsPagination.totalPages) return
  await loadContacts(nextPage)
}
</script>

<template>
  <div class="admin__section">
    <h2>Mensajes de contacto</h2>
    <p v-if="contactsLoading" class="admin__muted">Cargando mensajes...</p>
    <p v-else-if="!state.contacts.length" class="admin__muted">No hay mensajes.</p>
    <div v-else class="admin__stack">
      <div v-for="contact in state.contacts" :key="contact.id" class="admin__array-card admin__message-card">
        <div class="admin__message-header">
          <strong>{{ contact.name }}</strong>
          <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
          <span class="admin__muted">{{ formatDateTime(contact.created_at) }}</span>
        </div>
        <p class="admin__message-body">{{ contact.message }}</p>
      </div>
    </div>
    
    <div class="admin__pagination" v-if="state.contactsPagination.totalPages > 1">
      <button
        type="button"
        class="button button--secondary"
        :disabled="!hasPreviousPage || contactsLoading"
        @click="changePage(-1)"
      >
        Anterior
      </button>
      <span>Página {{ state.contactsPagination.page }} de {{ state.contactsPagination.totalPages }}</span>
      <button
        type="button"
        class="button button--secondary"
        :disabled="!hasNextPage || contactsLoading"
        @click="changePage(1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>
