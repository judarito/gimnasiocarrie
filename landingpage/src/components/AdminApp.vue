<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { cloneDefaultSiteData, mergeSiteData } from '../content/defaultSiteData.js'
import AdminImageField from './AdminImageField.vue'
import {
  createAdminPost,
  deleteAdminPost,
  getAdminContacts,
  getAdminPost,
  getAdminPosts,
  getAdminSite,
  getSession,
  login,
  logout,
  saveSection,
  updateAdminPost,
} from '../lib/api.js'

const tabs = [
  { id: 'site', label: 'Sitio' },
  { id: 'hero', label: 'Hero' },
  { id: 'features', label: 'Metodología' },
  { id: 'about', label: 'Nosotros' },
  { id: 'programs', label: 'Galería' },
  { id: 'contact', label: 'Padres y contacto' },
  { id: 'footer', label: 'Footer' },
  { id: 'newsSection', label: 'Noticias' },
  { id: 'posts', label: 'Eventos y noticias' },
  { id: 'messages', label: 'Mensajes' },
]

const form = ref(cloneDefaultSiteData())
const posts = ref([])
const activeTab = ref('site')
const loading = ref(true)
const authLoading = ref(true)
const user = ref(null)
const authError = ref('')
const successMessage = ref('')
const savingSection = ref('')
const savingPost = ref(false)
const deletingPost = ref(false)
const postListLoading = ref(false)
const postDetailLoading = ref(false)
const postView = ref('list')
const postTypeFilter = ref('')
const postPagination = ref({
  page: 1,
  pageSize: 8,
  total: 0,
  totalPages: 1,
})

const credentials = ref({
  email: '',
  password: '',
})

const contacts = ref([])
const contactsLoading = ref(false)
const contactsPagination = ref({ page: 1, pageSize: 20, total: 0, totalPages: 1 })

const postEditor = ref(createEmptyPost())

const hasPreviousPostPage = computed(() => postPagination.value.page > 1)
const hasNextPostPage = computed(() => postPagination.value.page < postPagination.value.totalPages)
const selectedPostTitle = computed(() => postEditor.value.id ? postEditor.value.title : 'Nueva publicación')

onMounted(init)

async function init() {
  authLoading.value = true

  try {
    const session = await getSession()
    user.value = session.user

    if (user.value) {
      await loadAdminData()
    }
  } catch {
    user.value = null
  } finally {
    authLoading.value = false
    loading.value = false
  }
}

async function handleLogin() {
  authError.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    const payload = await login(credentials.value)
    user.value = payload.user
    credentials.value = { email: '', password: '' }
    await loadAdminData()
  } catch (error) {
    authError.value = error.message
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  await logout()
  user.value = null
  postEditor.value = createEmptyPost()
  authError.value = ''
  successMessage.value = ''
}

async function loadAdminData() {
  const payload = await getAdminSite()
  form.value = mergeSiteData(payload.settings || {})
  await loadPosts()
}

async function handleSectionSave(key) {
  savingSection.value = key
  successMessage.value = ''

  try {
    await saveSection(key, clone(form.value[key]))
    successMessage.value = 'Cambios guardados correctamente.'
  } catch (error) {
    authError.value = error.message
  } finally {
    savingSection.value = ''
  }
}

function addFeature() {
  form.value.features.push({
    icon: 'users',
    title: 'Nuevo ítem',
    description: '',
    color: 'blue',
  })
}

function addProgram() {
  form.value.programs.items.push({
    title: 'Nuevo elemento',
    imageUrl: '',
  })
}

function addFooterLink() {
  form.value.footer.links.push({
    label: 'Nuevo enlace',
    href: '#',
  })
}

function selectPost(post) {
  activeTab.value = 'posts'
  postView.value = 'detail'
  loadPostDetail(post.id)
}

function newPost(type = 'event') {
  postEditor.value = createEmptyPost(type)
  postView.value = 'detail'
  activeTab.value = 'posts'
}

async function loadPosts(page = postPagination.value.page) {
  postListLoading.value = true
  authError.value = ''

  try {
    const payload = await getAdminPosts({
      page,
      pageSize: postPagination.value.pageSize,
      type: postTypeFilter.value,
    })

    posts.value = payload.items || []
    postPagination.value = {
      page: payload.page,
      pageSize: payload.pageSize,
      total: payload.total,
      totalPages: payload.totalPages,
    }

  } catch (error) {
    authError.value = error.message
  } finally {
    postListLoading.value = false
  }
}

async function loadPostDetail(id, options = {}) {
  postDetailLoading.value = true
  authError.value = ''

  try {
    const payload = await getAdminPost(id)
    postEditor.value = clone(payload.post)
    postView.value = options.keepListVisible ? 'list' : 'detail'
  } catch (error) {
    authError.value = error.message
  } finally {
    postDetailLoading.value = false
  }
}

async function changePostTypeFilter(type) {
  postTypeFilter.value = type
  postEditor.value = createEmptyPost(type || 'event')
  postView.value = 'list'
  await loadPosts(1)
}

async function changePostPage(direction) {
  const nextPage = postPagination.value.page + direction
  if (nextPage < 1 || nextPage > postPagination.value.totalPages) return

  postEditor.value = createEmptyPost(postTypeFilter.value || 'event')
  postView.value = 'list'
  await loadPosts(nextPage)
}

async function savePost() {
  savingPost.value = true
  authError.value = ''
  successMessage.value = ''

  try {
    const payload = { ...postEditor.value }
    if (!payload.slug) {
      payload.slug = slugify(payload.title)
    }

    const response = payload.id
      ? await updateAdminPost(payload.id, payload)
      : await createAdminPost(payload)

    const saved = response.post
    const index = posts.value.findIndex((post) => post.id === saved.id)

    if (index >= 0) {
      posts.value.splice(index, 1, saved)
    } else {
      posts.value.unshift(saved)
    }

    postEditor.value = clone(saved)
    await loadPosts(postPagination.value.page)
    successMessage.value = 'Publicación guardada correctamente.'
  } catch (error) {
    authError.value = error.message
  } finally {
    savingPost.value = false
  }
}

async function removePost() {
  if (!postEditor.value.id) return

  deletingPost.value = true
  authError.value = ''
  successMessage.value = ''

  try {
    await deleteAdminPost(postEditor.value.id)
    postEditor.value = createEmptyPost()
    postView.value = 'list'
    await loadPosts(postPagination.value.page)
    successMessage.value = 'Publicación eliminada.'
  } catch (error) {
    authError.value = error.message
  } finally {
    deletingPost.value = false
  }
}

async function loadContacts(page = contactsPagination.value.page) {
  contactsLoading.value = true
  try {
    const payload = await getAdminContacts({ page, pageSize: contactsPagination.value.pageSize })
    contacts.value = payload.items || []
    contactsPagination.value = {
      page: payload.page,
      pageSize: payload.pageSize,
      total: payload.total,
      totalPages: payload.totalPages,
    }
  } catch (error) {
    authError.value = error.message
  } finally {
    contactsLoading.value = false
  }
}

watch(activeTab, (tab) => {
  if (tab === 'messages' && user.value) loadContacts(1)
})

function formatDateTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function createEmptyPost(type = 'event') {
  return {
    id: null,
    type,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    location: '',
    eventDate: '',
    published: true,
    sortOrder: 0,
  }
}

function parseLines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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
          <a href="/" class="button button--secondary">Ver sitio</a>
          <button v-if="user" type="button" class="button button--primary" @click="handleLogout">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div v-if="authLoading" class="admin__panel admin__panel--center card-surface">
        <p>Cargando sesión...</p>
      </div>

      <div v-else-if="!user" class="admin__panel admin__panel--center card-surface">
        <div class="admin__login-copy">
          <h2>Inicia sesión</h2>
          <p>Accede al panel para administrar textos, galería, noticias y eventos.</p>
        </div>

        <form class="admin__login-form" @submit.prevent="handleLogin">
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

      <div v-else class="admin__layout">
        <aside class="admin__sidebar card-surface">
          <p class="admin__user">{{ user.email }}</p>
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="admin__tab"
            :class="{ 'admin__tab--active': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </aside>

        <section class="admin__content card-surface">
          <p v-if="successMessage" class="admin__message admin__message--success">
            {{ successMessage }}
          </p>
          <p v-if="authError" class="admin__message admin__message--error">
            {{ authError }}
          </p>

          <div v-if="activeTab === 'site'" class="admin__section">
            <h2>Información del sitio</h2>
            <div class="admin__form-grid">
              <label>
                Nombre del colegio
                <input v-model="form.site.schoolName" type="text" />
              </label>
              <label>
                Lema
                <input v-model="form.site.tagline" type="text" />
              </label>
              <label>
                WhatsApp
                <input v-model="form.site.whatsappUrl" type="url" />
              </label>
              <label>
                Texto del CTA
                <input v-model="form.site.enrollLabel" type="text" />
              </label>
              <label>
                Teléfono
                <input v-model="form.site.phone" type="text" />
              </label>
              <label>
                Correo
                <input v-model="form.site.email" type="email" />
              </label>
              <label>
                Horario
                <input v-model="form.site.schedule" type="text" />
              </label>
              <label class="admin__field--full">
                Dirección
                <textarea
                  :value="form.site.addressLines.join('\n')"
                  rows="4"
                  @input="form.site.addressLines = parseLines($event.target.value)"
                ></textarea>
              </label>
              <label>
                Facebook
                <input v-model="form.site.socialLinks.facebook" type="url" />
              </label>
              <label>
                Instagram
                <input v-model="form.site.socialLinks.instagram" type="url" />
              </label>
              <label>
                YouTube
                <input v-model="form.site.socialLinks.youtube" type="url" />
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

          <div v-else-if="activeTab === 'hero'" class="admin__section">
            <h2>Hero</h2>
            <div class="admin__form-grid">
              <label><span>Kicker</span><input v-model="form.hero.kicker" type="text" /></label>
              <label><span>Línea 1</span><input v-model="form.hero.titleLine1" type="text" /></label>
              <label><span>Texto azul</span><input v-model="form.hero.titleBlue" type="text" /></label>
              <label><span>Texto verde</span><input v-model="form.hero.titleGreen" type="text" /></label>
              <label><span>Texto rojo</span><input v-model="form.hero.titleRed" type="text" /></label>
              <label><span>Botón principal</span><input v-model="form.hero.primaryButtonText" type="text" /></label>
              <label><span>Botón secundario</span><input v-model="form.hero.secondaryButtonText" type="text" /></label>
              <label class="admin__field--full"><span>Descripción</span><textarea v-model="form.hero.description" rows="4"></textarea></label>
              <div class="admin__field--full">
                <AdminImageField
                  v-model="form.hero.imageUrl"
                  label="Imagen del hero"
                  hint="Recomendado: 1280 × 800 px (proporción 16:10)"
                  :minWidth="1280"
                  :minHeight="800"
                />
              </div>
            </div>
            <button type="button" class="button button--primary" :disabled="savingSection === 'hero'" @click="handleSectionSave('hero')">
              {{ savingSection === 'hero' ? 'Guardando...' : 'Guardar hero' }}
            </button>
          </div>

          <div v-else-if="activeTab === 'features'" class="admin__section">
            <div class="admin__section-head">
              <h2>Metodología</h2>
              <button type="button" class="button button--secondary" @click="addFeature">Agregar ítem</button>
            </div>
            <div class="admin__stack">
              <div v-for="(feature, index) in form.features" :key="index" class="admin__array-card">
                <div class="admin__form-grid">
                  <label><span>Ícono</span><input v-model="feature.icon" type="text" /></label>
                  <label><span>Color</span><input v-model="feature.color" type="text" /></label>
                  <label><span>Título</span><input v-model="feature.title" type="text" /></label>
                  <label class="admin__field--full"><span>Descripción</span><textarea v-model="feature.description" rows="3"></textarea></label>
                </div>
                <button type="button" class="admin__danger-link" @click="form.features.splice(index, 1)">Eliminar</button>
              </div>
            </div>
            <button type="button" class="button button--primary" :disabled="savingSection === 'features'" @click="handleSectionSave('features')">
              {{ savingSection === 'features' ? 'Guardando...' : 'Guardar metodología' }}
            </button>
          </div>

          <div v-else-if="activeTab === 'about'" class="admin__section">
            <h2>Sección nosotros</h2>
            <div class="admin__form-grid">
              <label><span>Kicker</span><input v-model="form.about.kicker" type="text" /></label>
              <label><span>Título</span><input v-model="form.about.title" type="text" /></label>
              <label class="admin__field--full"><span>Texto 1</span><textarea v-model="form.about.body1" rows="4"></textarea></label>
              <label class="admin__field--full"><span>Texto 2</span><textarea v-model="form.about.body2" rows="4"></textarea></label>
              <label><span>Botón</span><input v-model="form.about.buttonText" type="text" /></label>
              <div class="admin__field--full">
                <AdminImageField
                  v-model="form.about.imageUrl"
                  label="Imagen de nosotros"
                  hint="Recomendado: 640 × 720 px (proporción 8:9, vertical)"
                  :minWidth="640"
                  :minHeight="720"
                />
              </div>
            </div>
            <button type="button" class="button button--primary" :disabled="savingSection === 'about'" @click="handleSectionSave('about')">
              {{ savingSection === 'about' ? 'Guardando...' : 'Guardar nosotros' }}
            </button>
          </div>

          <div v-else-if="activeTab === 'programs'" class="admin__section">
            <div class="admin__section-head">
              <h2>Galería</h2>
              <button type="button" class="button button--secondary" @click="addProgram">Agregar elemento</button>
            </div>
            <div class="admin__form-grid">
              <label class="admin__field--full"><span>Título</span><input v-model="form.programs.title" type="text" /></label>
            </div>
            <div class="admin__stack">
              <div v-for="(item, index) in form.programs.items" :key="index" class="admin__array-card">
                <div class="admin__form-grid">
                  <label><span>Título</span><input v-model="item.title" type="text" /></label>
                  <div class="admin__field--full">
                    <AdminImageField
                      v-model="item.imageUrl"
                      :label="`Imagen de galería ${index + 1}`"
                      hint="Recomendado: 800 × 600 px (proporción 4:3)"
                      :minWidth="800"
                      :minHeight="600"
                    />
                  </div>
                </div>
                <button type="button" class="admin__danger-link" @click="form.programs.items.splice(index, 1)">Eliminar</button>
              </div>
            </div>
            <button type="button" class="button button--primary" :disabled="savingSection === 'programs'" @click="handleSectionSave('programs')">
              {{ savingSection === 'programs' ? 'Guardando...' : 'Guardar galería' }}
            </button>
          </div>

          <div v-else-if="activeTab === 'contact'" class="admin__section">
            <h2>Padres y contacto</h2>
            <div class="admin__form-grid">
              <label><span>Kicker padres</span><input v-model="form.contact.parentsKicker" type="text" /></label>
              <label><span>Título padres</span><input v-model="form.contact.parentsTitle" type="text" /></label>
              <label class="admin__field--full">
                <span>Puntos para padres</span>
                <textarea
                  :value="form.contact.parentPoints.join('\n')"
                  rows="4"
                  @input="form.contact.parentPoints = parseLines($event.target.value)"
                ></textarea>
              </label>
              <label><span>Texto botón visita</span><input v-model="form.contact.visitButtonText" type="text" /></label>
              <div class="admin__field--full">
                <AdminImageField
                  v-model="form.contact.familyImageUrl"
                  label="Imagen de familia"
                  hint="Recomendado: 480 × 560 px (proporción 6:7, vertical)"
                  :minWidth="480"
                  :minHeight="560"
                />
              </div>
              <label><span>Kicker ubicación</span><input v-model="form.contact.locationKicker" type="text" /></label>
              <label><span>Título ubicación</span><input v-model="form.contact.locationTitle" type="text" /></label>
              <label>
                <span>Latitud</span>
                <input v-model.number="form.contact.mapLat" type="number" step="0.0001" placeholder="Ej: 10.3932" />
              </label>
              <label>
                <span>Longitud</span>
                <input v-model.number="form.contact.mapLng" type="number" step="0.0001" placeholder="Ej: -75.4832" />
              </label>
              <p class="admin__muted admin__field--full" style="margin-top:-0.5rem; font-size:0.85rem;">
                Busca la dirección en Google Maps, haz clic derecho sobre el punto exacto y copia las coordenadas.
              </p>
              <label><span>Kicker formulario</span><input v-model="form.contact.formKicker" type="text" /></label>
              <label><span>Título formulario</span><input v-model="form.contact.formTitle" type="text" /></label>
              <label class="admin__field--full"><span>Descripción formulario</span><textarea v-model="form.contact.formDescription" rows="4"></textarea></label>
            </div>
            <button type="button" class="button button--primary" :disabled="savingSection === 'contact'" @click="handleSectionSave('contact')">
              {{ savingSection === 'contact' ? 'Guardando...' : 'Guardar contacto' }}
            </button>
          </div>

          <div v-else-if="activeTab === 'footer'" class="admin__section">
            <div class="admin__section-head">
              <h2>Footer</h2>
              <button type="button" class="button button--secondary" @click="addFooterLink">Agregar enlace</button>
            </div>
            <div class="admin__form-grid">
              <label class="admin__field--full"><span>Copyright</span><input v-model="form.footer.copyrightText" type="text" /></label>
            </div>
            <div class="admin__stack">
              <div v-for="(link, index) in form.footer.links" :key="index" class="admin__array-card">
                <div class="admin__form-grid">
                  <label><span>Etiqueta</span><input v-model="link.label" type="text" /></label>
                  <label><span>Href</span><input v-model="link.href" type="text" /></label>
                </div>
                <button type="button" class="admin__danger-link" @click="form.footer.links.splice(index, 1)">Eliminar</button>
              </div>
            </div>
            <button type="button" class="button button--primary" :disabled="savingSection === 'footer'" @click="handleSectionSave('footer')">
              {{ savingSection === 'footer' ? 'Guardando...' : 'Guardar footer' }}
            </button>
          </div>

          <div v-else-if="activeTab === 'newsSection'" class="admin__section">
            <h2>Encabezado de noticias y eventos</h2>
            <div class="admin__form-grid">
              <label><span>Kicker</span><input v-model="form.newsSection.kicker" type="text" /></label>
              <label><span>Título</span><input v-model="form.newsSection.title" type="text" /></label>
              <label class="admin__field--full"><span>Descripción</span><textarea v-model="form.newsSection.description" rows="4"></textarea></label>
            </div>
            <button type="button" class="button button--primary" :disabled="savingSection === 'newsSection'" @click="handleSectionSave('newsSection')">
              {{ savingSection === 'newsSection' ? 'Guardando...' : 'Guardar encabezado' }}
            </button>
          </div>

          <div v-else-if="activeTab === 'posts'" class="admin__section admin__posts">
            <div class="admin__posts-list" :class="{ 'admin__posts-list--hidden': postView === 'detail' }">
              <div class="admin__section-head">
                <h2>Eventos y noticias</h2>
                <div class="admin__quick-actions">
                  <button type="button" class="button button--secondary" @click="newPost('event')">Nuevo evento</button>
                  <button type="button" class="button button--secondary" @click="newPost('news')">Nueva noticia</button>
                </div>
              </div>

              <div class="admin__post-filters">
                <button
                  type="button"
                  class="admin__filter"
                  :class="{ 'admin__filter--active': postTypeFilter === '' }"
                  @click="changePostTypeFilter('')"
                >
                  Todos
                </button>
                <button
                  type="button"
                  class="admin__filter"
                  :class="{ 'admin__filter--active': postTypeFilter === 'event' }"
                  @click="changePostTypeFilter('event')"
                >
                  Eventos
                </button>
                <button
                  type="button"
                  class="admin__filter"
                  :class="{ 'admin__filter--active': postTypeFilter === 'news' }"
                  @click="changePostTypeFilter('news')"
                >
                  Noticias
                </button>
              </div>

              <div class="admin__post-group">
                <p v-if="postListLoading" class="admin__muted">Cargando publicaciones...</p>
                <p v-else-if="!posts.length" class="admin__muted">No hay publicaciones para mostrar.</p>
                <button
                  v-for="post in posts"
                  :key="post.id"
                  type="button"
                  class="admin__post-item"
                  :class="{ 'admin__post-item--active': postEditor.id === post.id }"
                  @click="selectPost(post)"
                >
                  <strong>{{ post.title }}</strong>
                  <span>
                    {{ post.type === 'event' ? 'Evento' : 'Noticia' }}
                    ·
                    {{ post.eventDate || 'Sin fecha' }}
                    ·
                    {{ post.published ? 'Publicado' : 'Borrador' }}
                  </span>
                </button>
              </div>

              <div class="admin__pagination">
                <button
                  type="button"
                  class="button button--secondary"
                  :disabled="!hasPreviousPostPage || postListLoading"
                  @click="changePostPage(-1)"
                >
                  Anterior
                </button>
                <span>
                  Página {{ postPagination.page }} de {{ postPagination.totalPages }}
                </span>
                <button
                  type="button"
                  class="button button--secondary"
                  :disabled="!hasNextPostPage || postListLoading"
                  @click="changePostPage(1)"
                >
                  Siguiente
                </button>
              </div>
            </div>

            <div class="admin__post-editor" :class="{ 'admin__post-editor--hidden': postView === 'list' }">
              <div class="admin__detail-head">
                <button type="button" class="admin__back-button" @click="postView = 'list'">
                  Volver al listado
                </button>
                <h3>{{ selectedPostTitle }}</h3>
              </div>

              <p v-if="postDetailLoading" class="admin__muted">Cargando detalle...</p>

              <div class="admin__form-grid">
                <label>
                  <span>Tipo</span>
                  <select v-model="postEditor.type">
                    <option value="event">Evento</option>
                    <option value="news">Noticia</option>
                  </select>
                </label>
                <label>
                  <span>Orden</span>
                  <input v-model.number="postEditor.sortOrder" type="number" />
                </label>
                <label class="admin__field--full">
                  <span>Título</span>
                  <input v-model="postEditor.title" type="text" />
                </label>
                <label class="admin__field--full">
                  <span>Slug</span>
                  <input v-model="postEditor.slug" type="text" placeholder="se genera si lo dejas vacío" />
                </label>
                <label class="admin__field--full">
                  <span>Extracto</span>
                  <textarea v-model="postEditor.excerpt" rows="3"></textarea>
                </label>
                <label class="admin__field--full">
                  <span>Contenido</span>
                  <textarea v-model="postEditor.content" rows="5"></textarea>
                </label>
                <label>
                  <span>Fecha</span>
                  <input v-model="postEditor.eventDate" type="date" />
                </label>
                <label>
                  <span>Ubicación</span>
                  <input v-model="postEditor.location" type="text" />
                </label>
                <div class="admin__field--full">
                  <AdminImageField
                    v-model="postEditor.imageUrl"
                    label="Imagen de la publicación"
                    hint="Recomendado: 900 × 500 px (proporción 16:9)"
                    :minWidth="900"
                    :minHeight="500"
                  />
                </div>
                <label class="admin__checkbox">
                  <input v-model="postEditor.published" type="checkbox" />
                  Publicado
                </label>
              </div>

              <div class="admin__quick-actions">
                <button type="button" class="button button--primary" :disabled="savingPost" @click="savePost">
                  {{ savingPost ? 'Guardando...' : 'Guardar publicación' }}
                </button>
                <button
                  v-if="postEditor.id"
                  type="button"
                  class="button admin__button-danger"
                  :disabled="deletingPost"
                  @click="removePost"
                >
                  {{ deletingPost ? 'Eliminando...' : 'Eliminar' }}
                </button>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab === 'messages'" class="admin__section">
            <h2>Mensajes de contacto</h2>
            <p v-if="contactsLoading" class="admin__muted">Cargando mensajes...</p>
            <p v-else-if="!contacts.length" class="admin__muted">No hay mensajes todavía.</p>
            <div v-else class="admin__stack">
              <div v-for="msg in contacts" :key="msg.id" class="admin__array-card admin__message-card">
                <div class="admin__message-meta">
                  <strong>{{ msg.name }}</strong>
                  <a :href="`mailto:${msg.email}`" class="admin__message-email">{{ msg.email }}</a>
                  <span class="admin__muted">{{ formatDateTime(msg.created_at) }}</span>
                </div>
                <p class="admin__message-body">{{ msg.message }}</p>
              </div>
            </div>
            <div v-if="contactsPagination.totalPages > 1" class="admin__pagination">
              <button
                type="button"
                class="button button--secondary"
                :disabled="contactsPagination.page <= 1 || contactsLoading"
                @click="loadContacts(contactsPagination.page - 1)"
              >
                Anterior
              </button>
              <span>Página {{ contactsPagination.page }} de {{ contactsPagination.totalPages }}</span>
              <button
                type="button"
                class="button button--secondary"
                :disabled="contactsPagination.page >= contactsPagination.totalPages || contactsLoading"
                @click="loadContacts(contactsPagination.page + 1)"
              >
                Siguiente
              </button>
            </div>
          </div>

        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
