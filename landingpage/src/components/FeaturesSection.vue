<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section id="metodologia" class="section features">
    <div class="container">
      <div class="features__grid">
        <article
          v-for="feature in items"
          :key="feature.title"
          class="features__card card-surface"
          :class="`features__card--${feature.color}`"
        >
          <span class="features__icon">
            <AppIcon :name="feature.icon" />
          </span>
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.description }}</p>
          <span class="features__underline"></span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding-top: 18px;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

.features__card {
  position: relative;
  padding: 2rem 1.5rem 1.7rem;
  border-radius: 28px;
  text-align: center;
}

.features__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 74px;
  margin-bottom: 1.25rem;
  border-radius: 50%;
  color: white;
}

.features__card--blue .features__icon {
  background: var(--color-blue);
}

.features__card--green .features__icon {
  background: var(--color-green);
}

.features__card--red .features__icon {
  background: var(--color-red);
}

.features__card--yellow .features__icon {
  background: var(--color-yellow);
}

.features__icon :deep(svg) {
  width: 30px;
  height: 30px;
}

.features__card h2 {
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 1.7rem;
  line-height: 1;
  color: var(--color-blue-dark);
}

.features__card p {
  margin-top: 0.9rem;
  color: var(--color-muted);
}

.features__underline {
  display: inline-block;
  width: 38px;
  height: 4px;
  margin-top: 1.3rem;
  border-radius: 999px;
}

.features__card--blue .features__underline {
  background: var(--color-blue);
}

.features__card--green .features__underline {
  background: var(--color-green);
}

.features__card--red .features__underline {
  background: var(--color-red);
}

.features__card--yellow .features__underline {
  background: var(--color-yellow);
}

@media (max-width: 1024px) {
  .features__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .features__grid {
    grid-template-columns: 1fr;
  }
}
</style>
