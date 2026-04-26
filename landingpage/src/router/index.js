import { createRouter, createWebHistory } from 'vue-router'
import PublicLanding from '../components/PublicLanding.vue'
import AdminApp from '../components/AdminApp.vue'

// Import admin sub-components
import AdminSiteSettings from '../components/admin/AdminSiteSettings.vue'
import AdminHero from '../components/admin/AdminHero.vue'
import AdminFeatures from '../components/admin/AdminFeatures.vue'
import AdminAbout from '../components/admin/AdminAbout.vue'
import AdminPrograms from '../components/admin/AdminPrograms.vue'
import AdminContact from '../components/admin/AdminContact.vue'
import AdminFooter from '../components/admin/AdminFooter.vue'
import AdminNewsSection from '../components/admin/AdminNewsSection.vue'
import AdminPostsManager from '../components/admin/AdminPostsManager.vue'
import AdminMessages from '../components/admin/AdminMessages.vue'
import AdminGallery from '../components/admin/AdminGallery.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PublicLanding,
    },
    {
      path: '/admin',
      component: AdminApp,
      children: [
        { path: '', redirect: '/admin/site' },
        { path: 'login', redirect: '/admin/site' },
        { path: 'site', name: 'admin-site', component: AdminSiteSettings },
        { path: 'hero', name: 'admin-hero', component: AdminHero },
        { path: 'features', name: 'admin-features', component: AdminFeatures },
        { path: 'about', name: 'admin-about', component: AdminAbout },
        { path: 'programs', name: 'admin-programs', component: AdminPrograms },
        { path: 'contact', name: 'admin-contact', component: AdminContact },
        { path: 'footer', name: 'admin-footer', component: AdminFooter },
        { path: 'news-section', name: 'admin-news-section', component: AdminNewsSection },
        { path: 'posts', name: 'admin-posts', component: AdminPostsManager },
        { path: 'messages', name: 'admin-messages', component: AdminMessages },
        { path: 'gallery', name: 'admin-gallery', component: AdminGallery },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
