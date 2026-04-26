<script setup>
import { ref } from 'vue'
import { useAdmin } from '../../lib/useAdmin.js'

const { loading, authError, handleLogin } = useAdmin()

const credentials = ref({
  email: '',
  password: '',
})

async function submit() {
  await handleLogin(credentials.value)
  if (!authError.value) {
    credentials.value = { email: '', password: '' }
  }
}
</script>

<template>
  <div class="admin__panel admin__panel--center card-surface">
    <div class="admin__login-copy">
      <h2>Inicia sesión</h2>
      <p>Accede al panel para administrar textos, galería, noticias y eventos.</p>
    </div>

    <form class="admin__login-form" @submit.prevent="submit">
      <label>
        Correo
        <input v-model="credentials.email" type="email" required placeholder="admin@colegio.com" />
      </label>

      <label>
        Contraseña
        <input v-model="credentials.password" type="password" required placeholder="••••••••" />
      </label>

      <button type="submit" class="button button--primary" :disabled="loading">
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>

      <p v-if="authError" class="admin__message admin__message--error">{{ authError }}</p>
    </form>
  </div>
</template>
