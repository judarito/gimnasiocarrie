<script setup>
import { ref } from 'vue'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  news: {
    type: Array,
    default: () => [],
  },
  events: {
    type: Array,
    default: () => [],
  },
})

const selectedItem = ref(null)

function selectItem(post) {
  selectedItem.value = post
}

function clearSelection() {
  selectedItem.value = null
}

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
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

      <!-- Vista de detalle -->
      <div v-if="selectedItem" class="news-events__detail card-surface">
        <button class="news-events__back" @click="clearSelection">
          ← Volver
        </button>
        <img
          v-if="selectedItem.imageUrl"
          :src="selectedItem.imageUrl"
          :alt="selectedItem.title"
          class="news-events__detail-image"
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

      <!-- Vista de lista -->
      <div v-else class="news-events__grid">
        <div class="news-events__column">
          <div class="news-events__column-header">
            <h3>Eventos</h3>
          </div>

          <article
            v-for="post in props.events"
            :key="post.id"
            class="news-events__card card-surface"
            @click="selectItem(post)"
          >
            <img v-if="post.imageUrl" :src="post.imageUrl" :alt="post.title" class="news-events__image" />
            <div class="news-events__body">
              <span class="news-events__badge news-events__badge--event">
                {{ formatDate(post.eventDate) || 'Próximamente' }}
              </span>
              <h4>{{ post.title }}</h4>
              <p>{{ post.excerpt }}</p>
              <small v-if="post.location">{{ post.location }}</small>
            </div>
          </article>

          <p v-if="!props.events.length" class="news-events__empty">
            No hay eventos publicados por el momento.
          </p>
        </div>

        <div class="news-events__column">
          <div class="news-events__column-header">
            <h3>Noticias</h3>
          </div>

          <article
            v-for="post in props.news"
            :key="post.id"
            class="news-events__card card-surface"
            @click="selectItem(post)"
          >
            <img v-if="post.imageUrl" :src="post.imageUrl" :alt="post.title" class="news-events__image" />
            <div class="news-events__body">
              <span class="news-events__badge news-events__badge--news">
                {{ formatDate(post.eventDate) || 'Comunidad' }}
              </span>
              <h4>{{ post.title }}</h4>
              <p>{{ post.excerpt }}</p>
              <small v-if="post.location">{{ post.location }}</small>
            </div>
          </article>

          <p v-if="!props.news.length" class="news-events__empty">
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

/* Lista */
.news-events__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin-top: 1.8rem;
}

.news-events__column {
  display: grid;
  gap: 1rem;
}

.news-events__column-header h3 {
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 2rem;
  color: var(--color-blue-dark);
}

.news-events__card {
  overflow: hidden;
  border-radius: 24px;
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
}

.news-events__body {
  padding: 1.2rem;
}

.news-events__badge {
  display: inline-flex;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
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
  margin-top: 0.8rem;
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 1.8rem;
  line-height: 1;
  color: var(--color-blue-dark);
}

.news-events__body p {
  margin-top: 0.6rem;
  color: var(--color-muted);
}

.news-events__body small {
  display: inline-block;
  margin-top: 0.7rem;
  color: var(--color-blue-dark);
  font-weight: 700;
}

.news-events__empty {
  color: var(--color-muted);
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
  .news-events__grid {
    grid-template-columns: 1fr;
  }
}
</style>
