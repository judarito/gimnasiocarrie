import { compileTemplate } from '@vue/compiler-sfc';
import fs from 'fs';

const source = fs.readFileSync('./src/components/admin/AdminHero.vue', 'utf8');
const result = compileTemplate({
  source,
  filename: 'AdminHero.vue',
  id: 'test'
});

if (result.errors.length) {
  console.log('Errors:', result.errors);
} else {
  console.log('Compiled OK');
}
