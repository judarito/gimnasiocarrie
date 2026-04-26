<script setup>
import CloudinaryImage from './CloudinaryImage.vue'

defineProps({
  about: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section id="nosotros" class="section about">
    <div class="container about__grid">
      <div class="about__photo-wrap">
        <span class="about__puzzle puzzle-piece"></span>
        <CloudinaryImage
          :src="about.imageUrl"
          alt="Docente acompañando a un estudiante"
          className="about__photo card-surface"
          width="800"
        />
      </div>

      <div class="about__content">
        <span class="section-kicker section-kicker--green">{{ about.kicker }}</span>

        <div class="about__heading">
          <h2 class="section-title">{{ about.title }}</h2>
          <span class="about__heart" aria-hidden="true">
            <svg
              class="about__heart-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m12 21-1.45-1.32C5.4 15.03 2 11.95 2 8.5A4.5 4.5 0 0 1 6.5 4 5 5 0 0 1 12 7a5 5 0 0 1 5.5-3A4.5 4.5 0 0 1 22 8.5c0 3.45-3.4 6.53-8.55 11.18z" />
            </svg>
          </span>
        </div>

        <p class="section-copy">
          {{ about.body1 }}
        </p>
        <p class="section-copy">
          {{ about.body2 }}
        </p>

        <a href="#contacto" class="button button--primary about__button">
          {{ about.buttonText }}
        </a>

        <span class="dotted-path about__path"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-kicker--green {
  background: rgba(104, 183, 56, 0.16);
  color: #4d9322;
}

.about__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
  gap: clamp(1.5rem, 5vw, 3rem);
  align-items: center;
}

.about__photo-wrap {
  position: relative;
}

.about__photo {
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
}

.about__puzzle {
  left: -22px;
  bottom: 22px;
  background: var(--color-green);
  transform: rotate(18deg);
  z-index: 2;
}

.about__content {
  position: relative;
}

.about__heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.9rem;
  margin-top: 0.85rem;
}

.about__heart {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 52px;
  height: 52px;
  color: var(--color-blue);
}

.about__heart-svg {
  display: block;
  width: 34px;
  height: 34px;
}

.about__content .section-copy + .section-copy {
  margin-top: 0.8rem;
}

.about__button {
  margin-top: 1.45rem;
  width: fit-content;
}

.about__path {
  right: -98px;
  top: 34px;
  width: 200px;
  height: 110px;
  transform: rotate(10deg);
}

@media (max-width: 920px) {
  .about__grid {
    grid-template-columns: 1fr;
  }

  .about__path {
    display: none;
  }
}

@media (max-width: 640px) {
  .about__heading {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .about__heart {
    width: 42px;
    height: 42px;
  }

  .about__heart-svg {
    width: 28px;
    height: 28px;
  }
}
</style>
