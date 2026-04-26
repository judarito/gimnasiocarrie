<script setup>
import { ref, computed } from 'vue'
import CloudinaryImage from './CloudinaryImage.vue'

const props = defineProps({
  section: { type: Object, required: true },
  news: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
})

const selectedItem = ref(null)

// Más recientes primero: por eventDate desc, sin fecha al final
function byRecent(a, b) {
  if (!a.eventDate && !b.eventDate) return 0
  if (!a.eventDate) return 1
  if (!b.eventDate) return -1
  return new Date(b.eventDate) - new Date(a.eventDate)
}

const sortedEvents = computed(() => [...props.events].sort(byRecent))
const sortedNews = computed(() => [...props.news].sort(byRecent))

// Carruseles independientes
const eventIdx = ref(0)
const newsIdx = ref(0)
const VISIBLE = 1

function canPrev(idx) { return idx > 0 }
function canNext(idx, list) { return idx + VISIBLE < list.length }

function selectItem(post) { selectedItem.value = post }
function clearSelection() { selectedItem.value = null }

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}
</script>

<template>
  <section id="noticias" class="section news-events">
    <div class="container">
      <div class="news-events__header">
        <span class="section-kicker section-kicker--blue">{{ props.section.kicker }}</span>
        <h2 class="section-title">{{ props.section.title }}</h2>
        <p class="section-copy">{{ props.section.description }}</p>
      </div>

      <!-- Vista detalle -->
      <div v-if="selectedItem" class="news-events__detail card-surface">
        <button class="news-events__back" @click="clearSelection">← Volver</button>
        <CloudinaryImage
          v-if="selectedItem.imageUrl"
          :src="selectedItem.imageUrl"
          :alt="selectedItem.title"
          className="news-events__detail-image"
          width="1000"
        />
        <div class="news-events__detail-body">
          <span
            class="news-events__badge"
            :class="selectedItem.type === 'event' ? 'news-events__badge--event' : 'news-events__badge--news'"
          >
            {{ formatDate(selectedItem.eventDate) || (selectedItem.type === 'event' ? 'Próximamente' : 'Comunidad') }}
          </span>
          <h3>{{ selectedItem.title }}</h3>
          <small v-if="selectedItem.location">{{ selectedItem.location }}</small>
          <p class="news-events__detail-excerpt">{{ selectedItem.excerpt }}</p>
          <div v-if="selectedItem.content" class="news-events__detail-content">{{ selectedItem.content }}</div>
        </div>
      </div>

      <!-- Vista carruseles -->
      <div v-else class="news-events__columns">

        <!-- Eventos -->
        <div class="news-events__column">
          <div class="news-events__column-header">
            <h3>Eventos</h3>
            <div class="news-events__arrows">
              <button class="ne-arrow" :disabled="!canPrev(eventIdx)" @click="eventIdx--" aria-label="Anterior">‹</button>
              <button class="ne-arrow" :disabled="!canNext(eventIdx, sortedEvents)" @click="eventIdx++" aria-label="Siguiente">›</button>
            </div>
          </div>

          <div class="news-events__track-wrap">
            <div class="news-events__track" :style="{ transform: `translateX(calc(-${eventIdx} * (100% + 0.75rem)))` }">
              <article
                v-for="post in sortedEvents"
                :key="post.id"
                class="news-events__card card-surface"
                @click="selectItem(post)"
              >
                <CloudinaryImage v-if="post.imageUrl" :src="post.imageUrl" :alt="post.title" className="news-events__image" width="600" />
                <div class="news-events__body">
                  <span class="news-events__badge news-events__badge--event">
                    {{ formatDate(post.eventDate) || 'Próximamente' }}
                  </span>
                  <h4>{{ post.title }}</h4>
                  <p>{{ post.excerpt }}</p>
                  <small v-if="post.location">{{ post.location }}</small>
                </div>
              </article>
            </div>
          </div>

          <p v-if="!sortedEvents.length" class="news-events__empty">
            No hay eventos publicados por el momento.
          </p>
        </div>

        <!-- Noticias -->
        <div class="news-events__column">
          <div class="news-events__column-header">
            <h3>Noticias</h3>
            <div class="news-events__arrows">
              <button class="ne-arrow" :disabled="!canPrev(newsIdx)" @click="newsIdx--" aria-label="Anterior">‹</button>
              <button class="ne-arrow" :disabled="!canNext(newsIdx, sortedNews)" @click="newsIdx++" aria-label="Siguiente">›</button>
            </div>
          </div>

          <div class="news-events__track-wrap">
            <div class="news-events__track" :style="{ transform: `translateX(calc(-${newsIdx} * (100% + 0.75rem)))` }">
              <article
                v-for="post in sortedNews"
                :key="post.id"
                class="news-events__card card-surface"
                @click="selectItem(post)"
              >
                <CloudinaryImage v-if="post.imageUrl" :src="post.imageUrl" :alt="post.title" className="news-events__image" width="600" />
                <div class="news-events__body">
                  <span class="news-events__badge news-events__badge--news">
                    {{ formatDate(post.eventDate) || 'Comunidad' }}
                  </span>
                  <h4>{{ post.title }}</h4>
                  <p>{{ post.excerpt }}</p>
                  <small v-if="post.location">{{ post.location }}</small>
                </div>
              </article>
            </div>
          </div>

          <p v-if="!sortedNews.length" class="news-events__empty">
            No hay noticias publicadas por el momento.
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.section-kicker--blue {
  background: rgba(38, 118, 227, 0.12);
  color: var(--color-blue);
}

.news-events__header {
  text-align: center;
}

.news-events__header .section-copy {
  margin-inline: auto;
}

/* Layout */
.news-events__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  margin-top: 1.8rem;
}

.news-events__column {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.news-events__column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.news-events__column-header h3 {
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 2rem;
  color: var(--color-blue-dark);
}

.news-events__arrows {
  display: flex;
  gap: 0.4rem;
}

/* Carrusel */
.news-events__track-wrap {
  overflow: hidden;
}

.news-events__track {
  display: grid;
  grid-template-columns: repeat(v-bind('sortedEvents.length'), 100%);
  gap: 0.75rem;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.news-events__column:last-child .news-events__track {
  grid-template-columns: repeat(v-bind('sortedNews.length'), 100%);
}

.news-events__card {
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.news-events__card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.news-events__image {
  width: 100%;
  height: 210px;
  object-fit: cover;
  object-position: top;
}

.news-events__body {
  padding: 1rem;
}

.news-events__badge {
  display: inline-flex;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
}

.news-events__badge--event {
  background: rgba(104, 183, 56, 0.16);
  color: #4d9322;
}

.news-events__badge--news {
  background: rgba(38, 118, 227, 0.12);
  color: var(--color-blue);
}

.news-events__body h4 {
  margin-top: 0.6rem;
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 1.3rem;
  line-height: 1.1;
  color: var(--color-blue-dark);
}

.news-events__body p {
  margin-top: 0.6rem;
  color: var(--color-muted);
}

.news-events__body small {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--color-blue-dark);
  font-weight: 700;
  font-size: 0.85rem;
}

.news-events__empty {
  color: var(--color-muted);
}

/* Flechas */
.ne-arrow {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 1.3rem;
  color: var(--color-blue-dark);
  cursor: pointer;
  line-height: 1;
  transition: background 0.2s, opacity 0.2s;
}

.ne-arrow:disabled {
  opacity: 0.25;
  cursor: default;
}

.ne-arrow:not(:disabled):hover {
  background: rgba(38, 118, 227, 0.1);
}

/* Detalle */
.news-events__detail {
  margin-top: 1.8rem;
  border-radius: 24px;
  overflow: hidden;
}

.news-events__back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 1.2rem 1.2rem 0;
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 999px;
  background: rgba(38, 118, 227, 0.1);
  color: var(--color-blue);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.news-events__back:hover {
  background: rgba(38, 118, 227, 0.2);
}

.news-events__detail-image {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  margin-top: 1.2rem;
}

.news-events__detail-body {
  padding: 1.5rem 1.8rem 2rem;
}

.news-events__detail-body h3 {
  margin-top: 0.8rem;
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  line-height: 1.1;
  color: var(--color-blue-dark);
}

.news-events__detail-body small {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--color-blue-dark);
  font-weight: 700;
}

.news-events__detail-excerpt {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: var(--color-muted);
}

.news-events__detail-content {
  margin-top: 1.2rem;
  color: var(--color-blue-dark);
  white-space: pre-line;
  line-height: 1.7;
}

@media (max-width: 820px) {
  .news-events__columns {
    grid-template-columns: 1fr;
  }
}
</style>
