<script setup>
import { ref } from 'vue'
import { uploadAdminImage, getAdminMedia } from '../lib/api.js'
import CloudinaryImage from './CloudinaryImage.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Imagen' },
  hint: { type: String, default: '' },
  minWidth: { type: Number, default: 0 },
  minHeight: { type: Number, default: 0 },
})

const emit = defineEmits(['update:modelValue'])
const uploading = ref(false)
const error = ref('')
const warning = ref('')

function getImageDimensions(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

async function handleFileChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  uploading.value = true
  error.value = ''
  warning.value = ''

  // Validar dimensiones antes de subir
  if (props.minWidth || props.minHeight) {
    const dims = await getImageDimensions(file)
    if (dims) {
      const tooNarrow = props.minWidth && dims.width < props.minWidth
      const tooShort = props.minHeight && dims.height < props.minHeight
      if (tooNarrow || tooShort) {
        warning.value = `La imagen mide ${dims.width} × ${dims.height} px. ${props.hint || `Se recomiendan al menos ${props.minWidth} × ${props.minHeight} px`}.`
      }
    }
  }

  try {
    const payload = await uploadAdminImage(file)
    emit('update:modelValue', payload.url)
  } catch (uploadError) {
    error.value = uploadError.message
  } finally {
    uploading.value = false
  }
}

const galleryOpen = ref(false)
const galleryItems = ref([])
const galleryLoading = ref(false)

async function openGallery() {
  galleryOpen.value = true
  galleryLoading.value = true
  try {
    const data = await getAdminMedia()
    galleryItems.value = data.items || []
  } catch (err) {
    error.value = 'Error al cargar galería'
  } finally {
    galleryLoading.value = false
  }
}

function selectFromGallery(url) {
  emit('update:modelValue', url)
  galleryOpen.value = false
}
</script>

<template>
  <div class="admin-image-field">
    <label class="admin-image-field__label">
      <span>{{ label }}</span>
      <input
        :value="modelValue"
        type="text"
        placeholder="https://..."
        @input="emit('update:modelValue', $event.target.value)"
      />
    </label>

    <p v-if="hint" class="admin-image-field__hint">{{ hint }}</p>

    <div class="admin-image-field__actions">
      <label class="button button--secondary admin-image-field__upload">
        {{ uploading ? 'Subiendo...' : 'Subir' }}
        <input type="file" accept="image/*" :disabled="uploading" @change="handleFileChange" />
      </label>
      <button type="button" class="button button--secondary" @click="openGallery">
        Galería
      </button>
      <button
        v-if="modelValue"
        type="button"
        class="admin-image-field__clear"
        @click="emit('update:modelValue', '')"
      >
        Quitar
      </button>
    </div>

    <p v-if="warning" class="admin-image-field__warning">⚠ {{ warning }}</p>
    <p v-if="error" class="admin-image-field__error">{{ error }}</p>

    <div v-if="modelValue" class="admin-image-field__preview">
      <CloudinaryImage :src="modelValue" :alt="label" width="400" />
    </div>

    <Teleport to="body">
      <div v-if="galleryOpen" class="gallery-modal" @click.self="galleryOpen = false">
        <div class="gallery-modal__content card-surface">
          <div class="gallery-modal__header">
            <h3>Seleccionar de la galería</h3>
            <button class="gallery-modal__close" @click="galleryOpen = false">✕</button>
          </div>
          
          <div v-if="galleryLoading" class="gallery-modal__grid">
            <div v-for="i in 4" :key="i" class="skeleton gallery-modal__item"></div>
          </div>
          <div v-else-if="galleryItems.length === 0" class="admin__muted">
            No hay imágenes en la galería.
          </div>
          <div v-else class="gallery-modal__grid">
            <div
              v-for="item in galleryItems"
              :key="item.id"
              class="gallery-modal__item"
              @click="selectFromGallery(item.url)"
            >
              <CloudinaryImage :src="item.url" :alt="item.publicId" className="gallery-modal__img" width="300" />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.admin-image-field {
  display: grid;
  gap: 0.7rem;
}

.admin-image-field__label {
  display: grid;
  gap: 0.45rem;
  font-weight: 700;
  color: var(--color-blue-dark);
}

.admin-image-field__hint {
  font-size: 0.82rem;
  color: var(--color-muted);
  font-weight: 600;
  margin-top: -0.35rem;
}

.admin-image-field__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.admin-image-field__upload {
  position: relative;
  overflow: hidden;
}

.admin-image-field__upload input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.admin-image-field__clear {
  border: 0;
  background: transparent;
  color: #cb443e;
  font-weight: 800;
  cursor: pointer;
}

.admin-image-field__warning {
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  background: rgba(255, 160, 0, 0.1);
  color: #a06000;
  font-weight: 700;
  font-size: 0.85rem;
}

.admin-image-field__error {
  color: #c3423b;
  font-weight: 700;
}

.admin-image-field__preview {
  max-width: 260px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(38, 118, 227, 0.12);
  background: white;
}

.admin-image-field__preview :deep(img) {
  width: 100%;
  height: auto;
  display: block;
}

/* Modal de Galería */
.gallery-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 20, 45, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.gallery-modal__content {
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.gallery-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.gallery-modal__header h3 {
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 1.6rem;
  color: var(--color-blue-dark);
}

.gallery-modal__close {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-muted);
}

.gallery-modal__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.gallery-modal__item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
  background: #f1f5f9;
}

.gallery-modal__item:hover {
  border-color: var(--color-blue);
}

.gallery-modal__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
