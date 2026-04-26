<script setup>
import { ref } from 'vue'
import AdminHistoryModal from './AdminHistoryModal.vue'
import { useAdmin } from '../../lib/useAdmin.js'

const { state, savingSection, handleSectionSave } = useAdmin()

function addFooterLink() {
  state.form.footer.links.push({
    label: 'Nuevo enlace',
    href: '#',
  })
}
const showHistory = ref(false)

function onHistoryRestored(newData) {
  state.form['footer'] = newData
  showHistory.value = false
}
</script>

<template>
  <div class="admin__section">
    <div class="admin__section-head">
      <h2>Footer</h2>
      <button type="button" class="button button--secondary" @click="addFooterLink">Agregar enlace</button>
    </div>
    <div class="admin__form-grid">
      <label class="admin__field--full"><span>Copyright</span><input v-model="state.form.footer.copyrightText" type="text" /></label>
    </div>
    <div class="admin__stack">
      <div v-for="(link, index) in state.form.footer.links" :key="index" class="admin__array-card">
        <div class="admin__form-grid">
          <label><span>Etiqueta</span><input v-model="link.label" type="text" /></label>
          <label><span>Href</span><input v-model="link.href" type="text" /></label>
        </div>
        <button type="button" class="admin__danger-link" @click="state.form.footer.links.splice(index, 1)">Eliminar</button>
      </div>
    </div>
    <div class="admin__actions" style="margin-top: 1rem;">
      <button type="button" class="button button--primary" :disabled="savingSection === 'footer'" @click="handleSectionSave('footer')">
      {{ savingSection === 'footer' ? 'Guardando...' : 'Guardar footer' }}
    </button>
      <button type="button" class="button button--secondary" @click="showHistory = true">
        Ver historial
      </button>
    </div>
  </div>
  <AdminHistoryModal
      v-if="showHistory"
      sectionKey="footer"
      @close="showHistory = false"
      @restored="onHistoryRestored"
    />
</template>
