<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CloudinaryImage from './CloudinaryImage.vue'

const props = defineProps({
  programs: {
    type: Object,
    required: true,
  },
})

const VISIBLE = 4
const current = ref(0)
const zoomed = ref(null)

const items = computed(() => props.programs.items || [])
const total = computed(() => items.value.length)
const canPrev = computed(() => current.value > 0)
const canNext = computed(() => current.value + VISIBLE < total.value)

function prev() {
  if (canPrev.value) current.value--
}

function next() {
  if (canNext.value) current.value++
}

function openZoom(item) {
  zoomed.value = item
}

function closeZoom() {
  zoomed.value = null
}

function onKey(e) {
  if (!zoomed.value) return
  if (e.key === 'Escape') closeZoom()
  if (e.key === 'ArrowRight') zoomNext()
  if (e.key === 'ArrowLeft') zoomPrev()
}

function zoomNext() {
  const idx = items.value.indexOf(zoomed.value)
  if (idx < total.value - 1) zoomed.value = items.value[idx + 1]
}

function zoomPrev() {
  const idx = items.value.indexOf(zoomed.value)
  if (idx > 0) zoomed.value = items.value[idx - 1]
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section id="galeria" class="section programs">
    <div class="container">
      <h2 class="section-title programs__title">{{ programs.title }}</h2>

      <div class="programs__carousel">
        <button
          class="programs__arrow programs__arrow--prev"
          :disabled="!canPrev"
          aria-label="Anterior"
          @click="prev"
        >‹</button>

        <div class="programs__track-wrap">
          <div
            class="programs__track"
            :style="{ transform: `translateX(calc(-${current} * (100% / ${VISIBLE} + 0.95rem / ${VISIBLE} * (${VISIBLE} - 1))))` }"
          >
            <article
              v-for="item in items"
              :key="`${item.title}-${item.imageUrl}`"
              class="programs__card card-surface"
              @click="openZoom(item)"
            >
              <CloudinaryImage :src="item.imageUrl" :alt="item.title" className="programs__image" width="600" />
              <div v-if="item.title" class="programs__caption">{{ item.title }}</div>
            </article>
          </div>
        </div>

        <button
          class="programs__arrow programs__arrow--next"
          :disabled="!canNext"
          aria-label="Siguiente"
          @click="next"
        >›</button>
      </div>

      <div class="programs__dots">
        <button
          v-for="i in Math.ceil(total / VISIBLE)"
          :key="i"
          class="programs__dot"
          :class="{ 'programs__dot--active': Math.floor(current / VISIBLE) === i - 1 }"
          :aria-label="`Página ${i}`"
          @click="current = (i - 1) * VISIBLE"
        />
      </div>
    </div>

    <!-- Lightbox zoom -->
    <Teleport to="body">
      <div v-if="zoomed" class="programs__lightbox" @click.self="closeZoom">
        <button class="programs__lb-close" aria-label="Cerrar" @click="closeZoom">✕</button>
        <button class="programs__lb-arrow programs__lb-arrow--prev" :disabled="items.indexOf(zoomed) === 0" @click="zoomPrev">‹</button>
        <div class="programs__lb-content">
          <CloudinaryImage :src="zoomed.imageUrl" :alt="zoomed.title" className="programs__lb-image" width="1200" />
          <p v-if="zoomed.title" class="programs__lb-caption">{{ zoomed.title }}</p>
        </div>
        <button class="programs__lb-arrow programs__lb-arrow--next" :disabled="items.indexOf(zoomed) === total - 1" @click="zoomNext">›</button>
      </div>
    </Teleport>
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

/* Carrusel */
.programs__carousel {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.4rem;
}

.programs__track-wrap {
  flex: 1;
  overflow: hidden;
}

.programs__track {
  display: grid;
  grid-template-columns: repeat(v-bind(total), calc((100% - 0.95rem * 3) / v-bind(VISIBLE)));
  gap: 0.95rem;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.programs__card {
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.programs__card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.programs__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}

.programs__caption {
  padding: 0.6rem 0.85rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-blue-dark);
}

/* Flechas */
.programs__arrow {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-size: 1.6rem;
  color: var(--color-blue-dark);
  cursor: pointer;
  line-height: 1;
  transition: background 0.2s, opacity 0.2s;
}

.programs__arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.programs__arrow:not(:disabled):hover {
  background: rgba(38, 118, 227, 0.1);
}

/* Dots */
.programs__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.programs__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(38, 118, 227, 0.2);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.programs__dot--active {
  background: var(--color-blue);
  transform: scale(1.3);
}

/* Lightbox */
.programs__lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(10, 20, 45, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
}

.programs__lb-content {
  max-width: 900px;
  width: 100%;
  text-align: center;
}

.programs__lb-image {
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 16px;
}

.programs__lb-caption {
  margin-top: 0.75rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.programs__lb-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.programs__lb-close:hover {
  background: rgba(255,255,255,0.25);
}

.programs__lb-arrow {
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.programs__lb-arrow:disabled {
  opacity: 0.2;
  cursor: default;
}

.programs__lb-arrow:not(:disabled):hover {
  background: rgba(255,255,255,0.25);
}

@media (max-width: 820px) {
  .programs__track {
    grid-template-columns: repeat(v-bind(total), calc((100% - 0.95rem) / 2));
  }
}

@media (max-width: 560px) {
  .programs__track {
    grid-template-columns: repeat(v-bind(total), 100%);
  }
  .programs__lb-arrow {
    display: none;
  }
}
</style>
