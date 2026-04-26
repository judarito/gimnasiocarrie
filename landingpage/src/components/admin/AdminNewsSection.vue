<script setup>
import { ref } from 'vue'
import AdminHistoryModal from './AdminHistoryModal.vue'
import { useAdmin } from '../../lib/useAdmin.js'

const { state, savingSection, handleSectionSave } = useAdmin()
const showHistory = ref(false)

function onHistoryRestored(newData) {
  state.form['newsSection'] = newData
  showHistory.value = false
}
</script>

<template>
  <div class="admin__section">
    <h2>Encabezado de noticias y eventos</h2>
    <div class="admin__form-grid">
      <label><span>Kicker</span><input v-model="state.form.newsSection.kicker" type="text" /></label>
      <label><span>Título</span><input v-model="state.form.newsSection.title" type="text" /></label>
      <label class="admin__field--full"><span>Descripción</span><textarea v-model="state.form.newsSection.description" rows="4"></textarea></label>
    </div>
    <div class="admin__actions" style="margin-top: 1rem;">
      <button type="button" class="button button--primary" :disabled="savingSection === 'newsSection'" @click="handleSectionSave('newsSection')">
      {{ savingSection === 'newsSection' ? 'Guardando...' : 'Guardar encabezado' }}
    </button>
      <button type="button" class="button button--secondary" @click="showHistory = true">
        Ver historial
      </button>
    </div>
  </div>
  <AdminHistoryModal
      v-if="showHistory"
      sectionKey="newsSection"
      @close="showHistory = false"
      @restored="onHistoryRestored"
    />
</template>
