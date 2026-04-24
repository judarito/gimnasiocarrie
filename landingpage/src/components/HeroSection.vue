<script setup>
import AppIcon from './AppIcon.vue'

const props = defineProps({
  site: {
    type: Object,
    required: true,
  },
  hero: {
    type: Object,
    required: true,
  },
})

const navItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Metodología', href: '#metodologia' },
  { label: 'Padres', href: '#padres' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Noticias', href: '#noticias' },
  { label: 'Contacto', href: '#contacto' },
]
</script>

<template>
  <section id="inicio" class="hero">
    <div class="hero__backdrop puzzle-piece hero__piece hero__piece--left"></div>
    <div class="hero__backdrop puzzle-piece hero__piece hero__piece--bottom"></div>

    <header class="hero__header container">
      <a href="#inicio" class="brand" aria-label="Inicio">
        <img src="/assets/carrie-logo-header.png" :alt="props.site.schoolName" class="brand__logo" />
      </a>

      <nav class="hero__nav" aria-label="Principal">
        <a
          v-for="item in navItems"
          :key="item.label"
          :href="item.href"
          class="hero__nav-link"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="hero__actions">
        <a href="#contacto" class="button button--primary hero__cta">
          {{ props.hero.primaryButtonText || props.site.enrollLabel }}
        </a>
        <a
          :href="props.site.whatsappUrl"
          class="hero__whatsapp"
          aria-label="Escríbenos por WhatsApp"
        >
          <AppIcon name="whatsapp" />
        </a>
      </div>
    </header>

    <div class="hero__body container">
      <div class="hero__content">
        <span class="section-kicker">{{ props.hero.kicker }}</span>
        <h1 class="hero__title">
          <span class="hero__title-line">{{ props.hero.titleLine1 }}</span>
          <span class="hero__title-line">
            <span class="hero__title-accent hero__title-accent--blue">{{ props.hero.titleBlue }}</span>,
            <span class="hero__title-accent hero__title-accent--green">{{ props.hero.titleGreen }}</span> y
          </span>
          <span class="hero__title-line hero__title-accent hero__title-accent--red">
            {{ props.hero.titleRed }}
          </span>
        </h1>

        <p class="hero__description">
          {{ props.hero.description }}
        </p>

        <div class="button-row hero__button-row">
          <a href="#contacto" class="button button--primary">
            {{ props.hero.primaryButtonText || props.site.enrollLabel }}
            <AppIcon name="arrow-right" />
          </a>
          <a href="#nosotros" class="button button--secondary">
            {{ props.hero.secondaryButtonText }}
            <AppIcon name="arrow-right" />
          </a>
        </div>
      </div>

      <div class="hero__visual">
        <img
          :src="props.hero.imageUrl"
          alt="Niños compartiendo una actividad con piezas de rompecabezas"
          class="hero__image"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: clip;
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 74%, rgba(248, 251, 255, 0.98) 100%);
  padding: 20px 0 28px;
}

.hero__backdrop {
  z-index: 0;
}

.hero__piece--left {
  top: 255px;
  left: -24px;
  background: var(--color-yellow);
}

.hero__piece--bottom {
  left: -8px;
  bottom: 16px;
  background: var(--color-blue);
  transform: rotate(-12deg);
}

.hero__header,
.hero__body {
  position: relative;
  z-index: 1;
}

.hero__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 1.5rem;
  padding-bottom: 0.35rem;
}

.brand {
  display: inline-flex;
  align-items: flex-start;
}

.brand__logo {
  width: 176px;
  height: auto;
}

.hero__nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.95rem, 2vw, 2.15rem);
  padding-top: 10px;
}

.hero__nav-link {
  position: relative;
  color: var(--color-blue-dark);
  font-weight: 700;
}

.hero__nav-link:first-child {
  color: var(--color-blue);
}

.hero__nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}

.hero__nav-link:hover::after {
  transform: scaleX(1);
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding-top: 2px;
}

.hero__cta {
  min-height: 50px;
  padding-inline: 1.35rem;
}

.hero__whatsapp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #37b44a;
  color: white;
  box-shadow: 0 16px 30px rgba(55, 180, 74, 0.28);
}

.hero__whatsapp :deep(svg) {
  width: 24px;
  height: 24px;
}

.hero__body {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  align-items: center;
  gap: clamp(1.6rem, 4vw, 3.2rem);
  padding: 12px 0 0;
}

.hero__content {
  max-width: 610px;
}

.hero__title {
  margin-top: 1.1rem;
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: clamp(3.4rem, 7vw, 5.45rem);
  line-height: 0.92;
  letter-spacing: -0.055em;
  color: var(--color-blue-dark);
}

.hero__title-line {
  display: block;
  white-space: nowrap;
}

.hero__title-accent--blue {
  color: var(--color-blue);
}

.hero__title-accent--green {
  color: var(--color-green);
}

.hero__title-accent--red {
  color: var(--color-red);
}

.hero__description {
  max-width: 520px;
  margin-top: 1rem;
  font-size: 1.16rem;
  color: var(--color-muted);
}

.hero__button-row {
  margin-top: 1.45rem;
}

.hero__visual {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.hero__image {
  width: min(100%, 610px);
  height: auto;
  margin-right: -30px;
}

@media (max-width: 1120px) {
  .hero__header {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 1rem;
  }

  .hero__nav,
  .hero__actions {
    justify-content: center;
    padding-top: 0;
  }

  .hero__body {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .hero__description {
    margin-inline: auto;
  }

  .hero__button-row {
    justify-content: center;
  }

  .hero__image {
    margin-right: 0;
  }
}

@media (max-width: 720px) {
  .brand__logo {
    width: 162px;
  }

  .hero {
    padding-top: 18px;
  }

  .hero__title {
    font-size: clamp(2.95rem, 14vw, 4.5rem);
  }

  .hero__title-line {
    white-space: normal;
  }

  .hero__description {
    font-size: 1.04rem;
  }

  .hero__piece--left {
    top: 220px;
    left: -32px;
  }
}
</style>
