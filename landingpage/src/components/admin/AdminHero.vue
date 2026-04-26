<script setup>
import { ref } from 'vue'
import AdminHistoryModal from './AdminHistoryModal.vue'
import { useAdmin } from '../../lib/useAdmin.js'
import AdminImageField from '../AdminImageField.vue'

const { state, savingSection, handleSectionSave } = useAdmin()
const showHistory = ref(false)

function onHistoryRestored(newData) {
  state.form['hero'] = newData
  showHistory.value = false
}
</script>

<template>
  <div class="admin__section">
    <h2>Hero</h2>
    <div v-if="!state.form.hero" class="admin__muted" style="color:red">Error: state.form.hero is undefined!</div>
    <div v-else class="admin__form-grid">
      <label><span>Kicker</span><input v-model="state.form.hero.kicker" type="text" /></label>
      <label><span>Línea 1</span><input v-model="state.form.hero.titleLine1" type="text" /></label>
      <label><span>Texto azul</span><input v-model="state.form.hero.titleBlue" type="text" /></label>
      <label><span>Texto verde</span><input v-model="state.form.hero.titleGreen" type="text" /></label>
      <label><span>Texto rojo</span><input v-model="state.form.hero.titleRed" type="text" /></label>
      <label><span>Botón principal</span><input v-model="state.form.hero.primaryButtonText" type="text" /></label>
      <label><span>Botón secundario</span><input v-model="state.form.hero.secondaryButtonText" type="text" /></label>
      <label class="admin__field--full"><span>Descripción</span><textarea v-model="state.form.hero.description" rows="4"></textarea></label>
      <div class="admin__field--full">
        <AdminImageField
          v-model="state.form.hero.imageUrl"
          label="Imagen del hero"
          hint="Recomendado: 1280 × 800 px (proporción 16:10)"
          :minWidth="1280"
          :minHeight="800"
        />
      </div>
    </div>
    <div class="admin__actions" style="margin-top: 1rem;">
      <button type="button" class="button button--primary" :disabled="savingSection === 'hero'" @click="handleSectionSave('hero')">
      {{ savingSection === 'hero' ? 'Guardando...' : 'Guardar hero' }}
    </button>
      <button type="button" class="button button--secondary" @click="showHistory = true">
        Ver historial
      </button>
    </div>
  </div>
  <AdminHistoryModal
      v-if="showHistory"
      sectionKey="hero"
      @close="showHistory = false"
      @restored="onHistoryRestored"
    />
</template>
