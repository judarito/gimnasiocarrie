<script setup>
import { ref } from 'vue'
import AdminHistoryModal from './AdminHistoryModal.vue'
import { useAdmin } from '../../lib/useAdmin.js'
import AdminImageField from '../AdminImageField.vue'

const { state, savingSection, handleSectionSave } = useAdmin()

function parseLines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
const showHistory = ref(false)

function onHistoryRestored(newData) {
  state.form['contact'] = newData
  showHistory.value = false
}
</script>

<template>
  <div class="admin__section">
    <h2>Padres y contacto</h2>
    <div class="admin__form-grid">
      <label><span>Kicker padres</span><input v-model="state.form.contact.parentsKicker" type="text" /></label>
      <label><span>Título padres</span><input v-model="state.form.contact.parentsTitle" type="text" /></label>
      <label class="admin__field--full">
        <span>Puntos para padres</span>
        <textarea
          :value="state.form.contact.parentPoints.join('\n')"
          rows="4"
          @input="state.form.contact.parentPoints = parseLines($event.target.value)"
        ></textarea>
      </label>
      <label><span>Texto botón visita</span><input v-model="state.form.contact.visitButtonText" type="text" /></label>
      <div class="admin__field--full">
        <AdminImageField
          v-model="state.form.contact.familyImageUrl"
          label="Imagen de familia"
          hint="Recomendado: 480 × 560 px (proporción 6:7, vertical)"
          :minWidth="480"
          :minHeight="560"
        />
      </div>
      <label><span>Kicker ubicación</span><input v-model="state.form.contact.locationKicker" type="text" /></label>
      <label><span>Título ubicación</span><input v-model="state.form.contact.locationTitle" type="text" /></label>
      <label>
        <span>Latitud</span>
        <input v-model.number="state.form.contact.mapLat" type="number" step="0.0001" placeholder="Ej: 10.3932" />
      </label>
      <label>
        <span>Longitud</span>
        <input v-model.number="state.form.contact.mapLng" type="number" step="0.0001" placeholder="Ej: -75.4832" />
      </label>
      <p class="admin__muted admin__field--full" style="margin-top:-0.5rem; font-size:0.85rem;">
        Busca la dirección en Google Maps, haz clic derecho sobre el punto exacto y copia las coordenadas.
      </p>
      <label><span>Kicker formulario</span><input v-model="state.form.contact.formKicker" type="text" /></label>
      <label><span>Título formulario</span><input v-model="state.form.contact.formTitle" type="text" /></label>
      <label class="admin__field--full"><span>Descripción formulario</span><textarea v-model="state.form.contact.formDescription" rows="4"></textarea></label>
    </div>
    <div class="admin__actions" style="margin-top: 1rem;">
      <button type="button" class="button button--primary" :disabled="savingSection === 'contact'" @click="handleSectionSave('contact')">
      {{ savingSection === 'contact' ? 'Guardando...' : 'Guardar contacto' }}
    </button>
      <button type="button" class="button button--secondary" @click="showHistory = true">
        Ver historial
      </button>
    </div>
  </div>
  <AdminHistoryModal
      v-if="showHistory"
      sectionKey="contact"
      @close="showHistory = false"
      @restored="onHistoryRestored"
    />
</template>
