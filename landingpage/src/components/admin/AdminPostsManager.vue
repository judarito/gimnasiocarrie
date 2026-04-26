<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAdmin } from '../../lib/useAdmin.js'
import { getAdminPosts, getAdminPost, createAdminPost, updateAdminPost, deleteAdminPost } from '../../lib/api.js'
import AdminImageField from '../AdminImageField.vue'
import TipTapEditor from './TipTapEditor.vue'
import { toast } from 'vue3-toastify'

const { state, authError } = useAdmin()

const postListLoading = ref(false)
const postDetailLoading = ref(false)
const savingPost = ref(false)
const deletingPost = ref(false)
const postView = ref('list')
const postTypeFilter = ref('')

const postEditor = ref(createEmptyPost())

const hasPreviousPostPage = computed(() => state.postPagination.page > 1)
const hasNextPostPage = computed(() => state.postPagination.page < state.postPagination.totalPages)
const selectedPostTitle = computed(() => postEditor.value.id ? postEditor.value.title : 'Nueva publicación')

onMounted(() => {
  if (state.user) loadPosts(1)
})

watch(() => state.user, (user) => {
  if (user) loadPosts(1)
})

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

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function selectPost(post) {
  postView.value = 'detail'
  loadPostDetail(post.id)
}

function newPost(type = 'event') {
  postEditor.value = createEmptyPost(type)
  postView.value = 'detail'
}

async function loadPosts(page = state.postPagination.page) {
  postListLoading.value = true
  authError.value = ''
  try {
    const payload = await getAdminPosts({
      page,
      pageSize: state.postPagination.pageSize,
      type: postTypeFilter.value,
    })
    state.posts = payload.items || []
    state.postPagination = {
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

async function loadPostDetail(id) {
  postDetailLoading.value = true
  authError.value = ''
  try {
    const payload = await getAdminPost(id)
    postEditor.value = clone(payload.post)
    postView.value = 'detail'
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
  const nextPage = state.postPagination.page + direction
  if (nextPage < 1 || nextPage > state.postPagination.totalPages) return
  postEditor.value = createEmptyPost(postTypeFilter.value || 'event')
  postView.value = 'list'
  await loadPosts(nextPage)
}

async function savePost() {
  savingPost.value = true
  authError.value = ''
  try {
    const payload = { ...postEditor.value }
    if (!payload.slug) {
      payload.slug = slugify(payload.title)
    }
    const response = payload.id
      ? await updateAdminPost(payload.id, payload)
      : await createAdminPost(payload)

    const saved = response.post
    const index = state.posts.findIndex((post) => post.id === saved.id)
    if (index >= 0) {
      state.posts.splice(index, 1, saved)
    } else {
      state.posts.unshift(saved)
    }
    postEditor.value = clone(saved)
    await loadPosts(state.postPagination.page)
    toast.success('Publicación guardada correctamente.')
  } catch (error) {
    authError.value = error.message
    toast.error(error.message)
  } finally {
    savingPost.value = false
  }
}

async function removePost() {
  if (!postEditor.value.id) return
  deletingPost.value = true
  authError.value = ''
  try {
    await deleteAdminPost(postEditor.value.id)
    postEditor.value = createEmptyPost()
    postView.value = 'list'
    await loadPosts(state.postPagination.page)
    toast.success('Publicación eliminada.')
  } catch (error) {
    authError.value = error.message
    toast.error(error.message)
  } finally {
    deletingPost.value = false
  }
}
</script>

<template>
  <div class="admin__section admin__posts">
    <div class="admin__posts-list" :class="{ 'admin__posts-list--hidden': postView === 'detail' }">
      <div class="admin__section-head">
        <h2>Eventos y noticias</h2>
        <div class="admin__quick-actions">
          <button type="button" class="button button--secondary" @click="newPost('event')">Nuevo evento</button>
          <button type="button" class="button button--secondary" @click="newPost('news')">Nueva noticia</button>
        </div>
      </div>

      <div class="admin__post-filters">
        <button type="button" class="admin__filter" :class="{ 'admin__filter--active': postTypeFilter === '' }" @click="changePostTypeFilter('')">Todos</button>
        <button type="button" class="admin__filter" :class="{ 'admin__filter--active': postTypeFilter === 'event' }" @click="changePostTypeFilter('event')">Eventos</button>
        <button type="button" class="admin__filter" :class="{ 'admin__filter--active': postTypeFilter === 'news' }" @click="changePostTypeFilter('news')">Noticias</button>
      </div>

      <div class="admin__post-group">
        <p v-if="postListLoading" class="admin__muted">Cargando publicaciones...</p>
        <p v-else-if="!state.posts.length" class="admin__muted">No hay publicaciones para mostrar.</p>
        <button
          v-for="post in state.posts"
          :key="post.id"
          type="button"
          class="admin__post-item"
          :class="{ 'admin__post-item--active': postEditor.id === post.id }"
          @click="selectPost(post)"
        >
          <strong>{{ post.title }}</strong>
          <span>
            {{ post.type === 'event' ? 'Evento' : 'Noticia' }} · {{ post.eventDate || 'Sin fecha' }} · {{ post.published ? 'Publicado' : 'Borrador' }}
          </span>
        </button>
      </div>

      <div class="admin__pagination" v-if="state.postPagination.totalPages > 1">
        <button type="button" class="button button--secondary" :disabled="!hasPreviousPostPage || postListLoading" @click="changePostPage(-1)">Anterior</button>
        <span>Página {{ state.postPagination.page }} de {{ state.postPagination.totalPages }}</span>
        <button type="button" class="button button--secondary" :disabled="!hasNextPostPage || postListLoading" @click="changePostPage(1)">Siguiente</button>
      </div>
    </div>

    <div class="admin__post-editor" :class="{ 'admin__post-editor--hidden': postView === 'list' }">
      <div class="admin__detail-head">
        <button type="button" class="admin__back-button" @click="postView = 'list'">Volver al listado</button>
        <h3>{{ selectedPostTitle }}</h3>
      </div>

      <p v-if="postDetailLoading" class="admin__muted">Cargando detalle...</p>

      <div class="admin__form-grid" v-if="!postDetailLoading">
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
        
        <!-- TipTap Editor instead of textarea for Content -->
        <div class="admin__field--full">
          <span>Contenido</span>
          <TipTapEditor v-model="postEditor.content" />
        </div>

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

      <div class="admin__actions admin__actions--spread" v-if="!postDetailLoading">
        <button type="button" class="admin__danger-link" :disabled="savingPost || deletingPost || !postEditor.id" @click="removePost">
          {{ deletingPost ? 'Eliminando...' : 'Eliminar' }}
        </button>
        <div class="admin__actions">
          <button type="button" class="button button--secondary" @click="postView = 'list'">Cancelar</button>
          <button type="button" class="button button--primary" :disabled="savingPost || deletingPost" @click="savePost">
            {{ savingPost ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
