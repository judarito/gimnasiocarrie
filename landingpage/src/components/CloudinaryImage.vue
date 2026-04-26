<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String],
    default: null,
  },
  height: {
    type: [Number, String],
    default: null,
  },
  crop: {
    type: String,
    default: 'limit', // limit, fill, scale, etc.
  },
  className: {
    type: String,
    default: '',
  },
})

const optimizedSrc = computed(() => {
  if (!props.src || !props.src.includes('res.cloudinary.com')) {
    return props.src
  }

  // Find the insertion point for transformations: after "/upload/"
  const parts = props.src.split('/upload/')
  if (parts.length !== 2) return props.src

  const transforms = ['f_auto', 'q_auto']
  
  if (props.width) {
    transforms.push(`w_${props.width}`)
  }
  if (props.height) {
    transforms.push(`h_${props.height}`)
  }
  if (props.crop) {
    transforms.push(`c_${props.crop}`)
  }

  const transformationString = transforms.join(',')

  return `${parts[0]}/upload/${transformationString}/${parts[1]}`
})
</script>

<template>
  <img :src="optimizedSrc" :alt="alt" :class="className" loading="lazy" />
</template>
