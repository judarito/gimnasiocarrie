<script setup>
import { ref } from 'vue'
import AdminHistoryModal from './AdminHistoryModal.vue'
import { useAdmin } from '../../lib/useAdmin.js'

const { state, savingSection, handleSectionSave } = useAdmin()

function addFeature() {
  state.form.features.push({
    icon: 'users',
    title: 'Nuevo ítem',
    description: '',
    color: 'blue',
  })
}
const showHistory = ref(false)

function onHistoryRestored(newData) {
  state.form['features'] = newData
  showHistory.value = false
}
</script>

<template>
  <div class="admin__section">
    <div class="admin__section-head">
      <h2>Metodología</h2>
      <button type="button" class="button button--secondary" @click="addFeature">Agregar ítem</button>
    </div>
    <div class="admin__stack">
      <div v-for="(feature, index) in state.form.features" :key="index" class="admin__array-card">
        <div class="admin__form-grid">
          <label><span>Ícono</span><input v-model="feature.icon" type="text" /></label>
          <label><span>Color</span><input v-model="feature.color" type="text" /></label>
          <label><span>Título</span><input v-model="feature.title" type="text" /></label>
          <label class="admin__field--full"><span>Descripción</span><textarea v-model="feature.description" rows="3"></textarea></label>
        </div>
        <button type="button" class="admin__danger-link" @click="state.form.features.splice(index, 1)">Eliminar</button>
      </div>
    </div>
    <div class="admin__actions" style="margin-top: 1rem;">
      <button type="button" class="button button--primary" :disabled="savingSection === 'features'" @click="handleSectionSave('features')">
      {{ savingSection === 'features' ? 'Guardando...' : 'Guardar metodología' }}
    </button>
      <button type="button" class="button button--secondary" @click="showHistory = true">
        Ver historial
      </button>
    </div>
  </div>
  <AdminHistoryModal
      v-if="showHistory"
      sectionKey="features"
      @close="showHistory = false"
      @restored="onHistoryRestored"
    />
</template>
