import { reactive, ref, computed } from 'vue'
import { cloneDefaultSiteData, mergeSiteData } from '../content/defaultSiteData.js'
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
} from './api.js'
import { toast } from 'vue3-toastify'

const state = reactive({
  user: null,
  form: cloneDefaultSiteData(),
  posts: [],
  contacts: [],
  postPagination: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  contactsPagination: { page: 1, pageSize: 20, total: 0, totalPages: 1 },
})

const loading = ref(true)
const authLoading = ref(true)
const authError = ref('')
const savingSection = ref('')

async function initAdmin() {
  authLoading.value = true
  try {
    const session = await getSession()
    state.user = session.user
    if (state.user) {
      await loadAdminData()
    }
  } catch {
    state.user = null
  } finally {
    authLoading.value = false
    loading.value = false
  }
}

async function handleLogin(credentials) {
  authError.value = ''
  loading.value = true
  try {
    const payload = await login(credentials)
    state.user = payload.user
    await loadAdminData()
    toast.success('Sesión iniciada')
    return true
  } catch (error) {
    authError.value = error.message
    toast.error(error.message)
    return false
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  await logout()
  state.user = null
  authError.value = ''
}

async function loadAdminData() {
  const payload = await getAdminSite()
  state.form = mergeSiteData(payload.settings || {})
}

async function handleSectionSave(key) {
  savingSection.value = key
  try {
    await saveSection(key, JSON.parse(JSON.stringify(state.form[key])))
    toast.success('Cambios guardados correctamente.')
  } catch (error) {
    toast.error(error.message)
  } finally {
    savingSection.value = ''
  }
}

export function useAdmin() {
  return {
    state,
    loading,
    authLoading,
    authError,
    savingSection,
    initAdmin,
    handleLogin,
    handleLogout,
    loadAdminData,
    handleSectionSave,
  }
}
