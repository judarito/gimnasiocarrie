const fs = require('fs');
const path = require('path');

const dir = './src/components/admin';
const files = [
  { file: 'AdminSiteSettings.vue', key: 'site' },
  { file: 'AdminHero.vue', key: 'hero' },
  { file: 'AdminFeatures.vue', key: 'features' },
  { file: 'AdminAbout.vue', key: 'about' },
  { file: 'AdminPrograms.vue', key: 'programs' },
  { file: 'AdminContact.vue', key: 'contact' },
  { file: 'AdminFooter.vue', key: 'footer' },
  { file: 'AdminNewsSection.vue', key: 'newsSection' }
];

files.forEach(({ file, key }) => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert imports
  if (!content.includes('import AdminHistoryModal')) {
    content = content.replace(
      '<script setup>',
      `<script setup>\nimport { ref } from 'vue'\nimport AdminHistoryModal from './AdminHistoryModal.vue'`
    );
  }

  // Insert ref and restore handler
  if (!content.includes('const showHistory = ref(false)')) {
    content = content.replace(
      '</script>',
      `const showHistory = ref(false)\n\nfunction onHistoryRestored(newData) {\n  state.form['${key}'] = newData\n  showHistory.value = false\n}\n</script>`
    );
  }

  // Insert button
  if (!content.includes('showHistory = true')) {
    const btnRegex = /(<button type="button" class="button button--primary".*?<\/button>)/s;
    content = content.replace(btnRegex, `<div class="admin__actions" style="margin-top: 1rem;">\n      $1\n      <button type="button" class="button button--secondary" @click="showHistory = true">\n        Ver historial\n      </button>\n    </div>`);
  }

  // Insert modal
  if (!content.includes('<AdminHistoryModal')) {
    content = content.replace(
      '</template>',
      `  <AdminHistoryModal\n      v-if="showHistory"\n      sectionKey="${key}"\n      @close="showHistory = false"\n      @restored="onHistoryRestored"\n    />\n</template>`
    );
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
