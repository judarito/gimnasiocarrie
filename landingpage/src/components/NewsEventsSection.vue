<script setup>
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

      <div class="news-events__grid">
        <div class="news-events__column">
          <div class="news-events__column-header">
            <h3>Eventos</h3>
          </div>

          <article
            v-for="post in props.events"
            :key="post.id"
            class="news-events__card card-surface"
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

@media (max-width: 820px) {
  .news-events__grid {
    grid-template-columns: 1fr;
  }
}
</style>
