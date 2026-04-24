<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <svg
    v-if="name === 'users'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>

  <svg
    v-else-if="name === 'book-open'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H10a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H4.5A2.5 2.5 0 0 0 2 19.5z" />
    <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H14a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h6.5a2.5 2.5 0 0 1 2.5 2.5z" />
  </svg>

  <svg
    v-else-if="name === 'badge'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m7 11 5-8 5 8" />
    <path d="M7 11v8l5 2 5-2v-8" />
    <path d="M12 8v8" />
  </svg>

  <svg
    v-else-if="name === 'heart'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m12 21-1.45-1.32C5.4 15.03 2 11.95 2 8.5A4.5 4.5 0 0 1 6.5 4 5 5 0 0 1 12 7a5 5 0 0 1 5.5-3A4.5 4.5 0 0 1 22 8.5c0 3.45-3.4 6.53-8.55 11.18z" />
  </svg>

  <svg
    v-else-if="name === 'check-circle'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </svg>

  <svg
    v-else-if="name === 'map-pin'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>

  <svg
    v-else-if="name === 'phone'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 12.8 19.8 19.8 0 0 1 2.08 4.09 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72l.32 2.57a2 2 0 0 1-.57 1.73L7.12 9.71a16 16 0 0 0 7.17 7.17l1.69-1.69a2 2 0 0 1 1.73-.57l2.57.32A2 2 0 0 1 22 16.92z" />
  </svg>

  <svg
    v-else-if="name === 'mail'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="3" />
    <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
  </svg>

  <svg
    v-else-if="name === 'clock'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>

  <svg
    v-else-if="name === 'arrow-right'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </svg>

  <svg
    v-else-if="name === 'whatsapp'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.56 0 .24 5.32.24 11.84c0 2.09.55 4.12 1.58 5.91L0 24l6.42-1.68a11.8 11.8 0 0 0 5.66 1.45h.01c6.52 0 11.84-5.32 11.84-11.84 0-3.16-1.23-6.12-3.41-8.45Z" />
    <path d="M8.6 6.76c-.25-.56-.51-.57-.75-.58h-.64c-.22 0-.58.08-.88.41-.3.33-1.16 1.14-1.16 2.77 0 1.63 1.19 3.21 1.35 3.43.16.22 2.25 3.6 5.55 4.9 2.74 1.07 3.3.86 3.9.8.6-.05 1.94-.8 2.22-1.58.27-.78.27-1.45.19-1.58-.08-.14-.3-.22-.63-.39-.33-.16-1.94-.96-2.24-1.07-.3-.11-.52-.16-.74.16-.22.33-.85 1.07-1.05 1.29-.19.22-.38.25-.71.08-.33-.16-1.38-.5-2.63-1.6-.97-.86-1.63-1.92-1.82-2.25-.19-.33-.02-.51.14-.68.15-.15.33-.39.49-.58.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.58-.08-.16-.7-1.69-.97-2.31Z" />
  </svg>

  <svg
    v-else-if="name === 'facebook'"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13.5 22v-8.08H16l.38-3.15H13.5V8.75c0-.91.24-1.54 1.55-1.54h1.66V4.39c-.29-.04-1.28-.12-2.43-.12-2.4 0-4.05 1.46-4.05 4.15v2.35H8v3.15h2.23V22h3.27Z" />
  </svg>

  <svg
    v-else-if="name === 'instagram'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>

  <svg
    v-else-if="name === 'youtube'"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.1C17.69 4.6 12 4.6 12 4.6s-5.7 0-7.48.49a2.98 2.98 0 0 0-2.1 2.1C1.93 8.97 1.93 12 1.93 12s0 3.03.49 4.81a2.98 2.98 0 0 0 2.1 2.1c1.78.49 7.48.49 7.48.49s5.69 0 7.48-.49a2.98 2.98 0 0 0 2.1-2.1c.49-1.78.49-4.81.49-4.81s0-3.03-.49-4.81ZM10.09 14.98V9.02L15.27 12l-5.18 2.98Z" />
  </svg>
</template>
