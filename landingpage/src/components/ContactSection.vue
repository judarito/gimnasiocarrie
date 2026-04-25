<script setup>
import { computed, ref } from 'vue'
import { submitContact } from '../lib/api.js'
import AppIcon from './AppIcon.vue'
import LeafletMap from './LeafletMap.vue'

const props = defineProps({
  site: {
    type: Object,
    required: true,
  },
  contact: {
    type: Object,
    required: true,
  },
})

const formData = ref({
  name: '',
  email: '',
  message: '',
})

const status = ref('idle')
const statusMessage = ref('')

const contactDetails = computed(() => [
  ...props.site.addressLines.map((label) => ({
    icon: 'map-pin',
    label,
  })),
  {
    icon: 'phone',
    label: props.site.phone,
  },
  {
    icon: 'mail',
    label: props.site.email,
  },
  {
    icon: 'clock',
    label: props.site.schedule,
  },
])

const submitLabel = computed(() => {
  if (status.value === 'loading') return 'Enviando...'
  return 'Enviar mensaje'
})

const socialLinks = computed(() => [
  { icon: 'facebook', href: props.site.socialLinks.facebook, label: 'Facebook' },
  { icon: 'instagram', href: props.site.socialLinks.instagram, label: 'Instagram' },
  { icon: 'youtube', href: props.site.socialLinks.youtube, label: 'YouTube' },
])

async function handleSubmit() {
  status.value = 'loading'
  statusMessage.value = ''

  try {
    await submitContact(formData.value)
    status.value = 'success'
    statusMessage.value = '¡Mensaje enviado con éxito! Te contactaremos pronto.'
    formData.value = { name: '', email: '', message: '' }
  } catch (error) {
    status.value = 'error'
    statusMessage.value = error.message
  }
}
</script>

<template>
  <section id="padres" class="section contact">
    <div class="container">
      <div class="contact__top">
        <article class="contact__family card-surface">
          <div class="contact__family-copy">
            <span class="section-kicker section-kicker--green">{{ props.contact.parentsKicker }}</span>
            <h2 class="contact__title">{{ props.contact.parentsTitle }}</h2>
            <ul class="contact__support-list">
              <li v-for="item in props.contact.parentPoints" :key="item">
                <span class="contact__support-icon">
                  <AppIcon name="check-circle" />
                </span>
                {{ item }}
              </li>
            </ul>
            <a href="#formulario" class="button contact__visit-button">
              {{ props.contact.visitButtonText }}
              <AppIcon name="arrow-right" />
            </a>
          </div>

          <div class="contact__family-visual">
            <img
              :src="props.contact.familyImageUrl"
              alt="Familia revisando información en un computador"
              class="contact__family-image"
            />
          </div>
        </article>

        <article id="contacto" class="contact__details card-surface">
          <span class="section-kicker section-kicker--blue">{{ props.contact.locationKicker }}</span>
          <h2 class="contact__details-title">{{ props.contact.locationTitle }}</h2>

          <ul class="contact__details-list">
            <li v-for="item in contactDetails" :key="item.label">
              <span class="contact__detail-icon">
                <AppIcon :name="item.icon" />
              </span>
              <span>{{ item.label }}</span>
            </li>
          </ul>

          <div class="contact__socials">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
            >
              <AppIcon :name="social.icon" />
            </a>
          </div>
        </article>

        <article class="contact__map card-surface" aria-label="Mapa de ubicación">
          <LeafletMap
            :lat="props.contact.mapLat || 3.4516"
            :lng="props.contact.mapLng || -76.532"
            :label="props.site.schoolName"
          />
        </article>
      </div>

      <div id="formulario" class="contact__form-wrap card-surface">
        <div class="contact__form-copy">
          <span class="section-kicker section-kicker--blue">{{ props.contact.formKicker }}</span>
          <h2 class="contact__title">{{ props.contact.formTitle }}</h2>
          <p class="section-copy">
            {{ props.contact.formDescription }}
          </p>
        </div>

        <form class="contact__form" @submit.prevent="handleSubmit">
          <label>
            Nombre
            <input
              v-model="formData.name"
              type="text"
              name="name"
              placeholder="Tu nombre"
              required
            />
          </label>

          <label>
            Correo electrónico
            <input
              v-model="formData.email"
              type="email"
              name="email"
              placeholder="tu@correo.com"
              required
            />
          </label>

          <label class="contact__textarea">
            Mensaje
            <textarea
              v-model="formData.message"
              name="message"
              rows="5"
              placeholder="Cuéntanos qué estás buscando para tu familia..."
              required
            ></textarea>
          </label>

          <button
            type="submit"
            class="button button--primary contact__submit"
            :disabled="status === 'loading'"
          >
            {{ submitLabel }}
          </button>

          <p v-if="status === 'success'" class="contact__status contact__status--success">
            {{ statusMessage }}
          </p>
          <p v-else-if="status === 'error'" class="contact__status contact__status--error">
            {{ statusMessage }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-kicker--green {
  background: rgba(104, 183, 56, 0.16);
  color: #4d9322;
}

.section-kicker--blue {
  background: rgba(38, 118, 227, 0.12);
  color: var(--color-blue);
}

.contact {
  padding-bottom: 62px;
}

.contact__top {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr);
  grid-template-rows: auto auto;
  gap: 1.25rem;
  align-items: stretch;
}

.contact__family,
.contact__details,
.contact__map,
.contact__form-wrap {
  border-radius: 30px;
}

.contact__family {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.88fr);
  gap: 1rem;
  padding: 1.1rem 1.1rem 1.1rem 2rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 201, 56, 0.16), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.88));
}

.contact__title,
.contact__details-title {
  margin-top: 0.95rem;
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 0.98;
  color: var(--color-blue-dark);
}

.contact__support-list,
.contact__details-list {
  display: grid;
  gap: 0.85rem;
  margin-top: 1.25rem;
  list-style: none;
}

.contact__support-list li,
.contact__details-list li {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  color: var(--color-blue-dark);
  font-weight: 700;
}

.contact__support-icon,
.contact__detail-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.contact__support-icon {
  background: rgba(104, 183, 56, 0.14);
  color: var(--color-green);
}

.contact__detail-icon {
  background: rgba(38, 118, 227, 0.12);
  color: var(--color-blue);
}

.contact__support-icon :deep(svg),
.contact__detail-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.contact__visit-button {
  margin-top: 1.5rem;
  width: fit-content;
  background: var(--color-green);
  color: white;
  box-shadow: 0 18px 32px rgba(104, 183, 56, 0.24);
}

.contact__family-visual {
  display: flex;
  align-items: stretch;
}

.contact__family-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
}

.contact__details,
.contact__map {
  padding: 1.6rem;
}

.contact__socials {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.4rem;
}

.contact__socials a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(38, 118, 227, 0.08);
  color: var(--color-blue);
}

.contact__socials a:nth-child(2) {
  background: rgba(255, 80, 71, 0.09);
  color: var(--color-red);
}

.contact__socials a:nth-child(3) {
  background: rgba(255, 201, 56, 0.18);
  color: #ff9a00;
}

.contact__socials :deep(svg) {
  width: 20px;
  height: 20px;
}

.contact__map {
  overflow: hidden;
  grid-column: 1 / -1;
  height: 260px;
}

.contact__map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
}

.contact__form-wrap {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 1.5rem;
  margin-top: 1.3rem;
  padding: 1.8rem;
}

.contact__form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.contact__form label {
  display: grid;
  gap: 0.55rem;
  font-weight: 700;
  color: var(--color-blue-dark);
}

.contact__textarea,
.contact__submit,
.contact__status {
  grid-column: 1 / -1;
}

.contact__form input,
.contact__form textarea {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(36, 49, 79, 0.12);
  border-radius: 18px;
  background: rgba(248, 251, 255, 0.95);
  color: var(--color-text);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.contact__form input:focus,
.contact__form textarea:focus {
  outline: none;
  border-color: rgba(38, 118, 227, 0.45);
  box-shadow: 0 0 0 4px rgba(38, 118, 227, 0.12);
}

.contact__submit:disabled {
  opacity: 0.75;
  cursor: progress;
}

.contact__status {
  font-weight: 700;
}

.contact__status--success {
  color: #2b8a3e;
}

.contact__status--error {
  color: #d64545;
}

@media (max-width: 1120px) {
  .contact__top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 820px) {
  .contact__top,
  .contact__form-wrap,
  .contact__family,
  .contact__form {
    grid-template-columns: 1fr;
  }

  .contact__map {
    min-height: 220px;
  }

  .contact__family {
    padding: 1.5rem;
  }
}
</style>
