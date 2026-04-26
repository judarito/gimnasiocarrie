<script setup>
import { ref, onMounted } from 'vue'
import { getAdminSiteHistory, restoreAdminSiteHistory } from '../../lib/api.js'
import { toast } from 'vue3-toastify'

const props = defineProps({
  sectionKey: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close', 'restored'])

const history = ref([])
const loading = ref(true)
const restoring = ref(false)

async function loadHistory() {
  loading.value = true
  try {
    const data = await getAdminSiteHistory(props.sectionKey)
    history.value = data.history || []
  } catch (error) {
    toast.error('Error al cargar el historial: ' + error.message)
  } finally {
    loading.value = false
  }
}

async function restoreVersion(id) {
  if (!confirm('¿Seguro que quieres restaurar esta versión? Perderás los cambios actuales que no hayas guardado.')) return
  
  restoring.value = true
  try {
    const data = await restoreAdminSiteHistory(id)
    toast.success('Versión restaurada con éxito')
    emit('restored', data.restoredValue)
  } catch (error) {
    toast.error('Error al restaurar: ' + error.message)
  } finally {
    restoring.value = false
  }
}

function formatDate(isoStr) {
  return new Date(isoStr).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(loadHistory)
</script>

<template>
  <Teleport to="body">
    <div class="history-modal" @click.self="emit('close')">
      <div class="history-modal__content card-surface">
        <div class="history-modal__header">
          <h3>Historial de Cambios</h3>
          <button class="history-modal__close" @click="emit('close')">✕</button>
        </div>
        
        <p class="admin__muted" style="margin-bottom: 1rem;">
          Mostrando las últimas 20 veces que se guardó esta sección.
        </p>

        <div v-if="loading" class="history-modal__list">
          <div v-for="i in 3" :key="i" class="skeleton history-modal__item"></div>
        </div>
        
        <div v-else-if="history.length === 0" class="admin__muted">
          Aún no hay un historial guardado para esta sección.
        </div>
        
        <div v-else class="history-modal__list">
          <div v-for="(item, index) in history" :key="item.id" class="history-modal__item">
            <div class="history-modal__info">
              <strong>Versión {{ history.length - index }}</strong>
              <span>Guardada el: {{ formatDate(item.createdAt) }}</span>
            </div>
            <button 
              class="button button--secondary history-btn" 
              :disabled="restoring"
              @click="restoreVersion(item.id)"
            >
              Restaurar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.history-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 20, 45, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.history-modal__content {
  width: 100%;
  max-width: 540px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.history-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.history-modal__header h3 {
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 1.6rem;
  color: var(--color-blue-dark);
}

.history-modal__close {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-muted);
}

.history-modal__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.history-modal__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 12px;
  background: #f8fbff;
  border: 1px solid rgba(38, 118, 227, 0.12);
}

.skeleton.history-modal__item {
  height: 64px;
}

.history-modal__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.history-modal__info strong {
  color: var(--color-blue-dark);
}

.history-modal__info span {
  color: var(--color-muted);
  font-size: 0.85rem;
}

.history-btn {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  min-height: auto;
}
</style>
