<script setup>
const props = defineProps({
  site: {
    type: Object,
    required: true,
  },
  footer: {
    type: Object,
    required: true,
  },
})

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__wave"></div>
    <div class="container footer__content">
      <a href="#inicio" class="footer__brand">
        <img src="/assets/carrie-logo-header.png" :alt="props.site.schoolName" />
        <div>
          <strong>{{ props.site.schoolName }}</strong>
          <p>{{ props.site.tagline }}</p>
        </div>
      </a>

      <p class="footer__copy">
        © {{ year }} {{ props.site.schoolName }}. {{ props.footer.copyrightText }}
      </p>

      <nav class="footer__links" aria-label="Footer">
        <a v-for="link in props.footer.links" :key="link.label" :href="link.href">
          {{ link.label }}
        </a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: clip;
  padding: 84px 0 26px;
  background: linear-gradient(90deg, #2470d8 0%, #3184e5 46%, #6ab738 46%, #6ab738 77%, #ff5047 77%, #ff5047 100%);
  color: white;
}

.footer__wave {
  position: absolute;
  inset: 0 0 auto 0;
  height: 72px;
  background:
    radial-gradient(circle at 10% 0, white 0 70px, transparent 71px),
    radial-gradient(circle at 36% 0, white 0 95px, transparent 96px),
    radial-gradient(circle at 64% 0, white 0 75px, transparent 76px),
    radial-gradient(circle at 88% 0, white 0 105px, transparent 106px);
  transform: translateY(-52px);
}

.footer__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.footer__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
}

.footer__brand img {
  width: 74px;
  height: 74px;
  object-fit: contain;
}

.footer__brand strong {
  display: block;
  font-family: 'Baloo 2', 'Trebuchet MS', cursive;
  font-size: 1.5rem;
  line-height: 1;
}

.footer__copy {
  font-weight: 700;
  text-align: center;
}

.footer__links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer__links a {
  font-weight: 700;
}

@media (max-width: 720px) {
  .footer__content {
    justify-content: center;
    text-align: center;
  }

  .footer__brand {
    flex-direction: column;
  }

  .footer__links {
    justify-content: center;
  }
}
</style>
