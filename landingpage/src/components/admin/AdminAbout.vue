<script setup>
import { ref } from 'vue'
import AdminHistoryModal from './AdminHistoryModal.vue'
import { useAdmin } from '../../lib/useAdmin.js'
import AdminImageField from '../AdminImageField.vue'

const { state, savingSection, handleSectionSave } = useAdmin()
const showHistory = ref(false)

function onHistoryRestored(newData) {
  state.form['about'] = newData
  showHistory.value = false
}
</script>

<template>
  <div class="admin__section">
    <h2>Sección nosotros</h2>
    <div class="admin__form-grid">
      <label><span>Kicker</span><input v-model="state.form.about.kicker" type="text" /></label>
      <label><span>Título</span><input v-model="state.form.about.title" type="text" /></label>
      <label class="admin__field--full"><span>Texto 1</span><textarea v-model="state.form.about.body1" rows="4"></textarea></label>
      <label class="admin__field--full"><span>Texto 2</span><textarea v-model="state.form.about.body2" rows="4"></textarea></label>
      <label><span>Botón</span><input v-model="state.form.about.buttonText" type="text" /></label>
      <div class="admin__field--full">
        <AdminImageField
          v-model="state.form.about.imageUrl"
          label="Imagen de nosotros"
          hint="Recomendado: 640 × 720 px (proporción 8:9, vertical)"
          :minWidth="640"
          :minHeight="720"
        />
      </div>
    </div>
    <div class="admin__actions" style="margin-top: 1rem;">
      <button type="button" class="button button--primary" :disabled="savingSection === 'about'" @click="handleSectionSave('about')">
      {{ savingSection === 'about' ? 'Guardando...' : 'Guardar nosotros' }}
    </button>
      <button type="button" class="button button--secondary" @click="showHistory = true">
        Ver historial
      </button>
    </div>
  </div>
  <AdminHistoryModal
      v-if="showHistory"
      sectionKey="about"
      @close="showHistory = false"
      @restored="onHistoryRestored"
    />
</template>
