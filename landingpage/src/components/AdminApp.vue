<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdmin } from '../lib/useAdmin.js'
import AdminLoginForm from './admin/AdminLoginForm.vue'

const router = useRouter()
const route = useRoute()
const { state, authLoading, initAdmin, handleLogout } = useAdmin()

const tabs = [
  { id: 'site', label: 'Sitio', path: '/admin/site' },
  { id: 'hero', label: 'Hero', path: '/admin/hero' },
  { id: 'features', label: 'Metodología', path: '/admin/features' },
  { id: 'about', label: 'Nosotros', path: '/admin/about' },
  { id: 'programs', label: 'Galería', path: '/admin/programs' },
  { id: 'contact', label: 'Padres y contacto', path: '/admin/contact' },
  { id: 'footer', label: 'Footer', path: '/admin/footer' },
  { id: 'news-section', label: 'Noticias', path: '/admin/news-section' },
  { id: 'posts', label: 'Eventos y noticias', path: '/admin/posts' },
  { id: 'messages', label: 'Mensajes', path: '/admin/messages' },
  { id: 'gallery', label: 'Archivos (Galería)', path: '/admin/gallery' },
]

onMounted(initAdmin)

function isActive(path) {
  return route.path === path
}

function navigateTo(path) {
  router.push(path)
}
</script>

<template>
  <div class="admin">
    <div class="container">
      <div class="admin__topbar">
        <div>
          <span class="section-kicker section-kicker--blue">Administrador</span>
          <h1 class="admin__title">Gestor de contenido</h1>
        </div>
        <div class="admin__actions">
          <router-link to="/" class="button button--secondary">Ver sitio</router-link>
          <button v-if="state.user" type="button" class="button button--primary" @click="handleLogout">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div v-if="authLoading" class="admin__layout">
        <aside class="admin__sidebar card-surface skeleton-sidebar">
          <div class="skeleton" style="height: 20px; width: 60%; margin-bottom: 1rem; border-radius: 4px;"></div>
          <div v-for="i in 8" :key="i" class="skeleton skeleton-tab"></div>
        </aside>
        <section class="admin__content card-surface">
          <div class="admin__section">
            <div class="skeleton skeleton-title"></div>
            <div class="admin__form-grid">
              <div v-for="i in 6" :key="i" class="skeleton skeleton-field"></div>
            </div>
            <div class="skeleton skeleton-field" style="max-width: 150px; margin-top: 1rem;"></div>
          </div>
        </section>
      </div>

      <AdminLoginForm v-else-if="!state.user" />

      <div v-else class="admin__layout">
        <aside class="admin__sidebar card-surface">
          <p class="admin__user">{{ state.user.email }}</p>
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="admin__tab"
            :class="{ 'admin__tab--active': isActive(tab.path) }"
            @click="navigateTo(tab.path)"
          >
            {{ tab.label }}
          </button>
        </aside>

        <section class="admin__content card-surface">
          <router-view />
        </section>
      </div>
    </div>
  </div>
</template>

<style>
.section-kicker--blue {
  background: rgba(38, 118, 227, 0.12);
  color: var(--color-blue);
}

.admin {
  padding: 28px 0 60px;
}

.admin__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.admin__title {
  margin-top: 0.8rem;
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  line-height: 0.95;
  color: var(--color-blue-dark);
}

.admin__actions,
.admin__quick-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.admin__layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 1.2rem;
}

.admin__panel,
.admin__sidebar,
.admin__content {
  padding: 1.4rem;
  border-radius: 28px;
}

/* Skeletons */
.skeleton {
  background: #e1e7ef;
  animation: skeleton-pulse 1.8s infinite ease-in-out;
}

@keyframes skeleton-pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

.skeleton-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.skeleton-tab {
  height: 48px;
  border-radius: 18px;
}

.skeleton-title {
  height: 38px;
  width: 180px;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.skeleton-field {
  height: 52px;
  border-radius: 16px;
}

.admin__panel--center {
  display: grid;
  gap: 1.4rem;
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}

.admin__login-copy h2 {
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 2.2rem;
  color: var(--color-blue-dark);
}

.admin__login-copy p {
  margin-top: 0.6rem;
  color: var(--color-muted);
}

.admin__login-form {
  display: grid;
  gap: 1rem;
  text-align: left;
}

.admin__login-form label,
.admin__form-grid label {
  display: grid;
  gap: 0.45rem;
  font-weight: 700;
  color: var(--color-blue-dark);
}

.admin__user {
  margin-bottom: 1rem;
  color: var(--color-muted);
  font-weight: 700;
}

.admin__tab {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 0;
  border-radius: 18px;
  background: transparent;
  color: var(--color-blue-dark);
  font-weight: 800;
  text-align: left;
  cursor: pointer;
}

.admin__tab--active {
  background: rgba(38, 118, 227, 0.12);
  color: var(--color-blue);
}

.admin__section {
  display: grid;
  gap: 1.2rem;
}

.admin__section h2 {
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 2.1rem;
  color: var(--color-blue-dark);
}

.admin__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin__form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.admin__field--full {
  grid-column: 1 / -1;
}

.admin__stack {
  display: grid;
  gap: 1rem;
}

.admin__array-card {
  padding: 1rem;
  border: 1px solid rgba(38, 118, 227, 0.12);
  border-radius: 20px;
  background: rgba(248, 251, 255, 0.72);
}

.admin__danger-link {
  margin-top: 0.8rem;
  border: 0;
  background: transparent;
  color: #cb443e;
  font-weight: 800;
  cursor: pointer;
}

.admin__posts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.admin__post-group {
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
}

.admin__post-filters,
.admin__pagination,
.admin__detail-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.admin__post-filters {
  margin-top: 0.25rem;
}

.admin__filter {
  padding: 0.65rem 0.9rem;
  border: 1px solid rgba(38, 118, 227, 0.14);
  border-radius: 999px;
  background: white;
  color: var(--color-blue-dark);
  font-weight: 800;
  cursor: pointer;
}

.admin__filter--active {
  border-color: rgba(38, 118, 227, 0.42);
  background: rgba(38, 118, 227, 0.12);
  color: var(--color-blue);
}

.admin__post-item {
  display: grid;
  gap: 0.25rem;
  width: 100%;
  padding: 0.85rem 0.95rem;
  border: 1px solid rgba(38, 118, 227, 0.12);
  border-radius: 18px;
  background: white;
  text-align: left;
  cursor: pointer;
}

.admin__post-item--active {
  border-color: rgba(38, 118, 227, 0.45);
  box-shadow: 0 0 0 3px rgba(38, 118, 227, 0.08);
}

.admin__post-item strong {
  color: var(--color-blue-dark);
}

.admin__post-item span {
  color: var(--color-muted);
}

.admin__post-editor {
  padding-left: 0.5rem;
}

.admin__detail-head {
  margin-bottom: 1rem;
}

.admin__detail-head h3 {
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 1.8rem;
  line-height: 1;
  color: var(--color-blue-dark);
}

.admin__back-button {
  display: inline-flex;
  border: 0;
  background: transparent;
  color: var(--color-blue);
  font-weight: 900;
  cursor: pointer;
}

.admin__pagination {
  justify-content: space-between;
  margin-top: 1rem;
}

.admin__pagination span,
.admin__muted {
  color: var(--color-muted);
  font-weight: 700;
}

.admin input,
.admin textarea,
.admin select {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(36, 49, 79, 0.12);
  border-radius: 16px;
  background: rgba(248, 251, 255, 0.95);
  color: var(--color-text);
}

.admin input:focus,
.admin textarea:focus,
.admin select:focus {
  outline: none;
  border-color: rgba(38, 118, 227, 0.45);
  box-shadow: 0 0 0 4px rgba(38, 118, 227, 0.12);
}

.admin__checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
}

.admin__checkbox input {
  width: auto;
}

.admin__message {
  padding: 0.9rem 1rem;
  border-radius: 16px;
  font-weight: 800;
}

.admin__message--success {
  background: rgba(104, 183, 56, 0.14);
  color: #4d9322;
}

.admin__message--error {
  background: rgba(255, 80, 71, 0.12);
  color: #c3423b;
}

.admin__message-card {
  display: grid;
  gap: 0.6rem;
}

.admin__message-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin__message-meta strong {
  color: var(--color-blue-dark);
}

.admin__message-email {
  color: var(--color-blue);
  font-weight: 700;
}

.admin__message-body {
  color: var(--color-text);
  white-space: pre-line;
  line-height: 1.6;
}

.admin__button-danger {
  background: #ff5047;
  color: white;
  box-shadow: 0 18px 32px rgba(255, 80, 71, 0.25);
}

@media (max-width: 1080px) {
  .admin__layout {
    grid-template-columns: 1fr;
  }

  .admin__sidebar {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
  }

  .admin__user {
    display: none;
  }

  .admin__tab {
    width: auto;
    flex: 0 0 auto;
    white-space: nowrap;
  }
}

.admin__posts-list--hidden,
.admin__post-editor--hidden {
  display: none;
}

.admin__post-editor {
  padding-left: 0;
}

@media (max-width: 860px) {
  .admin__posts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .admin {
    padding-top: 18px;
  }

  .admin__topbar,
  .admin__actions,
  .admin__quick-actions {
    align-items: stretch;
  }

  .admin__actions,
  .admin__quick-actions,
  .admin__pagination {
    width: 100%;
  }

  .admin__actions .button,
  .admin__quick-actions .button,
  .admin__pagination .button {
    flex: 1 1 150px;
  }

  .admin__form-grid {
    grid-template-columns: 1fr;
  }

  .admin__panel,
  .admin__sidebar,
  .admin__content {
    padding: 1rem;
    border-radius: 20px;
  }
}
</style>
