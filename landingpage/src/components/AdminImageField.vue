<script setup>
import { ref } from 'vue'
import { uploadAdminImage } from '../lib/api.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Imagen',
  },
})

const emit = defineEmits(['update:modelValue'])
const uploading = ref(false)
const error = ref('')

async function handleFileChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''

  if (!file) return

  uploading.value = true
  error.value = ''

  try {
    const payload = await uploadAdminImage(file)
    emit('update:modelValue', payload.url)
  } catch (uploadError) {
    error.value = uploadError.message
  } finally {
    uploading.value = false
  }
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

    <div class="admin-image-field__actions">
      <label class="button button--secondary admin-image-field__upload">
        {{ uploading ? 'Subiendo...' : 'Subir imagen' }}
        <input
          type="file"
          accept="image/*"
          :disabled="uploading"
          @change="handleFileChange"
        />
      </label>

      <button
        v-if="modelValue"
        type="button"
        class="admin-image-field__clear"
        @click="emit('update:modelValue', '')"
      >
        Quitar
      </button>
    </div>

    <p v-if="error" class="admin-image-field__error">{{ error }}</p>

    <div v-if="modelValue" class="admin-image-field__preview">
      <img :src="modelValue" :alt="label" />
    </div>
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

.admin-image-field__preview img {
  width: 100%;
  height: auto;
  display: block;
}
</style>
