import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'], // Added ts and tsx support
    languageOptions: {
      parser: typescriptParser, // Use TypeScript parser
    },
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  js.configs.recommended, // JavaScript recommended config
  ...pluginVue.configs['flat/essential'], // Vue essential config
  typescriptPlugin.configs.recommended, // TypeScript recommended rules
];
