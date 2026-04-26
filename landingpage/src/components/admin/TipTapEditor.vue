<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value.getHTML())
  },
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value
  if (isSame) {
    return
  }
  editor.value.commands.setContent(value, false)
})

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<template>
  <div class="tiptap-editor" v-if="editor">
    <div class="tiptap-editor__toolbar">
      <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        B
      </button>
      <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        I
      </button>
      <button type="button" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        S
      </button>
      <span class="divider"></span>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        H2
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        H3
      </button>
      <span class="divider"></span>
      <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        Lista
      </button>
      <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        Números
      </button>
      <span class="divider"></span>
      <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()">
        Deshacer
      </button>
      <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()">
        Rehacer
      </button>
    </div>
    <EditorContent :editor="editor" class="tiptap-editor__content" />
  </div>
</template>

<style>
.tiptap-editor {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-white);
  overflow: hidden;
}

.tiptap-editor__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: var(--color-blue-soft);
  border-bottom: 1px solid var(--color-border);
}

.tiptap-editor__toolbar button {
  padding: 4px 8px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
}

.tiptap-editor__toolbar button:hover {
  background: rgba(38, 118, 227, 0.1);
}

.tiptap-editor__toolbar button.is-active {
  background: var(--color-blue);
  color: var(--color-white);
}

.tiptap-editor__toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tiptap-editor__toolbar .divider {
  width: 1px;
  background: var(--color-border);
  margin: 0 4px;
}

.tiptap-editor__content .ProseMirror {
  padding: 16px;
  min-height: 200px;
  outline: none;
}

.tiptap-editor__content .ProseMirror > * + * {
  margin-top: 0.75em;
}

.tiptap-editor__content .ProseMirror ul,
.tiptap-editor__content .ProseMirror ol {
  padding-left: 1.5rem;
}
</style>
