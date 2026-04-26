<script setup>
import { ref } from 'vue'
import AdminHistoryModal from './AdminHistoryModal.vue'
import { useAdmin } from '../../lib/useAdmin.js'

const { state, savingSection, handleSectionSave } = useAdmin()

function parseLines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
const showHistory = ref(false)

function onHistoryRestored(newData) {
  state.form['site'] = newData
  showHistory.value = false
}
</script>

<template>
  <div class="admin__section">
    <h2>Información del sitio</h2>
    <div class="admin__form-grid">
      <label>
        Nombre del colegio
        <input v-model="state.form.site.schoolName" type="text" />
      </label>
      <label>
        Lema
        <input v-model="state.form.site.tagline" type="text" />
      </label>
      <label>
        WhatsApp
        <input v-model="state.form.site.whatsappUrl" type="url" />
      </label>
      <label>
        Texto del CTA
        <input v-model="state.form.site.enrollLabel" type="text" />
      </label>
      <label>
        Teléfono
        <input v-model="state.form.site.phone" type="text" />
      </label>
      <label>
        Correo
        <input v-model="state.form.site.email" type="email" />
      </label>
      <label>
        Horario
        <input v-model="state.form.site.schedule" type="text" />
      </label>
      <label class="admin__field--full">
        Dirección
        <textarea
          :value="state.form.site.addressLines.join('\n')"
          rows="4"
          @input="state.form.site.addressLines = parseLines($event.target.value)"
        ></textarea>
      </label>
      <label>
        Facebook
        <input v-model="state.form.site.socialLinks.facebook" type="url" />
      </label>
      <label>
        Instagram
        <input v-model="state.form.site.socialLinks.instagram" type="url" />
      </label>
      <label>
        YouTube
        <input v-model="state.form.site.socialLinks.youtube" type="url" />
      </label>
    </div>
    <button
      type="button"
      class="button button--primary"
      :disabled="savingSection === 'site'"
      @click="handleSectionSave('site')"
    >
      {{ savingSection === 'site' ? 'Guardando...' : 'Guardar sitio' }}
    </button>
  </div>
  <AdminHistoryModal
      v-if="showHistory"
      sectionKey="site"
      @close="showHistory = false"
      @restored="onHistoryRestored"
    />
</template>
