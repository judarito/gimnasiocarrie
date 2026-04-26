<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { getAdminMedia, deleteAdminMedia } from '../../lib/api.js'
import CloudinaryImage from '../CloudinaryImage.vue'

const items = ref([])
const loading = ref(true)

async function loadMedia() {
  loading.value = true
  try {
    const data = await getAdminMedia()
    items.value = data.items || []
  } catch (error) {
    toast.error('Error al cargar la galería: ' + error.message)
  } finally {
    loading.value = false
  }
}

async function deleteMedia(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer y romperá los lugares donde esté siendo usada.')) return

  try {
    await deleteAdminMedia(id)
    toast.success('Imagen eliminada de la galería')
    await loadMedia()
  } catch (error) {
    toast.error('Error al eliminar: ' + error.message)
  }
}

function copyUrl(url) {
  navigator.clipboard.writeText(url)
  toast.info('URL copiada al portapapeles')
}

onMounted(loadMedia)
</script>

<template>
  <div class="admin__section">
    <div class="admin__section-head">
      <h2>Galería de Medios</h2>
      <button class="button button--secondary" @click="loadMedia">Actualizar</button>
    </div>

    <div v-if="loading" class="gallery-grid">
      <div v-for="i in 8" :key="i" class="skeleton gallery-item"></div>
    </div>
    
    <div v-else-if="items.length === 0" class="admin__muted">
      No hay imágenes en la galería. Sube imágenes desde las demás secciones.
    </div>

    <div v-else class="gallery-grid">
      <article v-for="item in items" :key="item.id" class="gallery-item card-surface">
        <div class="gallery-item__img-wrap">
          <CloudinaryImage :src="item.url" :alt="item.publicId" className="gallery-item__img" width="400" />
        </div>
        <div class="gallery-item__actions">
          <button class="button button--secondary gallery-btn" @click="copyUrl(item.url)">
            Copiar URL
          </button>
          <button class="button admin__button-danger gallery-btn" @click="deleteMedia(item.id)">
            Eliminar
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(38, 118, 227, 0.12);
}

.gallery-item__img-wrap {
  aspect-ratio: 1;
  background: #f1f5f9;
  overflow: hidden;
}

.gallery-item__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
}

.gallery-btn {
  padding: 0.4rem;
  font-size: 0.85rem;
  min-height: auto;
}
</style>
