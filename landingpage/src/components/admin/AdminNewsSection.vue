<script setup>
import { useAdmin } from '../../lib/useAdmin.js'

const { state, savingSection, handleSectionSave } = useAdmin()
</script>

<template>
  <div class="admin__section">
    <h2>Encabezado de noticias y eventos</h2>
    <div class="admin__form-grid">
      <label><span>Kicker</span><input v-model="state.form.newsSection.kicker" type="text" /></label>
      <label><span>Título</span><input v-model="state.form.newsSection.title" type="text" /></label>
      <label class="admin__field--full"><span>Descripción</span><textarea v-model="state.form.newsSection.description" rows="4"></textarea></label>
    </div>
    <button type="button" class="button button--primary" :disabled="savingSection === 'newsSection'" @click="handleSectionSave('newsSection')">
      {{ savingSection === 'newsSection' ? 'Guardando...' : 'Guardar encabezado' }}
    </button>
  </div>
</template>
