import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended  from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      eslintConfigPrettier,
      eslintPluginPrettierRecommended
    ],
    languageOptions: {
      ecmaVersion: 'latest'
    }
  }
]);
