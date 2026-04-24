<script setup>
defineProps({
  programs: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section id="galeria" class="section programs">
    <div class="container">
      <h2 class="section-title programs__title">{{ programs.title }}</h2>

      <div class="programs__grid">
        <article
          v-for="program in programs.items"
          :key="`${program.title}-${program.imageUrl}`"
          class="programs__card card-surface"
        >
          <img :src="program.imageUrl" :alt="program.title" class="programs__image" />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.programs {
  padding-top: 12px;
}

.programs__title {
  text-align: center;
  font-size: clamp(2rem, 3.3vw, 2.7rem);
}

.programs__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.95rem;
  margin-top: 1.4rem;
}

.programs__card {
  overflow: hidden;
  border-radius: 20px;
}

.programs__image {
  width: 100%;
  height: auto;
}

@media (max-width: 1120px) {
  .programs__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .programs__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .programs__grid {
    grid-template-columns: 1fr;
  }
}
</style>
