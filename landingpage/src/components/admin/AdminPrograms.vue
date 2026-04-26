<script setup>
import { ref } from 'vue'
import AdminHistoryModal from './AdminHistoryModal.vue'
import { useAdmin } from '../../lib/useAdmin.js'
import AdminImageField from '../AdminImageField.vue'

const { state, savingSection, handleSectionSave } = useAdmin()

function addProgram() {
  state.form.programs.items.push({
    title: 'Nuevo elemento',
    imageUrl: '',
  })
}
const showHistory = ref(false)

function onHistoryRestored(newData) {
  state.form['programs'] = newData
  showHistory.value = false
}
</script>

<template>
  <div class="admin__section">
    <div class="admin__section-head">
      <h2>Galería</h2>
      <button type="button" class="button button--secondary" @click="addProgram">Agregar elemento</button>
    </div>
    <div class="admin__form-grid">
      <label class="admin__field--full"><span>Título</span><input v-model="state.form.programs.title" type="text" /></label>
    </div>
    <div class="admin__stack">
      <div v-for="(item, index) in state.form.programs.items" :key="index" class="admin__array-card">
        <div class="admin__form-grid">
          <label><span>Título</span><input v-model="item.title" type="text" /></label>
          <div class="admin__field--full">
            <AdminImageField
              v-model="item.imageUrl"
              :label="`Imagen de galería ${index + 1}`"
              hint="Recomendado: 800 × 600 px (proporción 4:3)"
              :minWidth="800"
              :minHeight="600"
            />
          </div>
        </div>
        <button type="button" class="admin__danger-link" @click="state.form.programs.items.splice(index, 1)">Eliminar</button>
      </div>
    </div>
    <div class="admin__actions" style="margin-top: 1rem;">
      <button type="button" class="button button--primary" :disabled="savingSection === 'programs'" @click="handleSectionSave('programs')">
      {{ savingSection === 'programs' ? 'Guardando...' : 'Guardar galería' }}
    </button>
      <button type="button" class="button button--secondary" @click="showHistory = true">
        Ver historial
      </button>
    </div>
  </div>
  <AdminHistoryModal
      v-if="showHistory"
      sectionKey="programs"
      @close="showHistory = false"
      @restored="onHistoryRestored"
    />
</template>
