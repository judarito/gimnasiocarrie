<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  label: { type: String, default: '' },
  zoom: { type: Number, default: 16 },
})

let map = null
let marker = null

function buildIcon(label) {
  return L.divIcon({
    className: '',
    html: `
      <div class="lmap-pin">
        ${label ? `<div class="lmap-pin__label">${label}</div>` : ''}
        <div class="lmap-pin__bubble"></div>
        <div class="lmap-pin__tail"></div>
      </div>
    `,
    iconSize: [160, 72],
    iconAnchor: [80, 72],
  })
}

onMounted(() => {
  map = L.map('leaflet-map', {
    center: [props.lat, props.lng],
    zoom: props.zoom,
    zoomControl: true,
    scrollWheelZoom: false,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  marker = L.marker([props.lat, props.lng], { icon: buildIcon(props.label) }).addTo(map)
})

watch(() => [props.lat, props.lng, props.label], ([lat, lng]) => {
  if (!map) return
  map.setView([lat, lng], props.zoom)
  marker.setLatLng([lat, lng])
  marker.setIcon(buildIcon(props.label))
})

onUnmounted(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div id="leaflet-map" class="lmap"></div>
</template>

<style>
.lmap {
  width: 100%;
  height: 100%;
  min-height: 220px;
  border-radius: 24px;
  z-index: 0;
}

/* Pin personalizado */
.lmap-pin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.lmap-pin__label {
  background: white;
  border-radius: 10px;
  padding: 4px 10px;
  font-family: 'Baloo 2', sans-serif;
  font-size: 0.78rem;
  font-weight: 800;
  color: #102a56;
  white-space: nowrap;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.14);
}

.lmap-pin__bubble {
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #2676e3;
  box-shadow: 0 4px 14px rgba(38, 118, 227, 0.45);
  position: relative;
}

.lmap-pin__bubble::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
}

.lmap-pin__tail {
  width: 3px;
  height: 8px;
  background: #2676e3;
  border-radius: 0 0 2px 2px;
  margin-top: -4px;
}
</style>
