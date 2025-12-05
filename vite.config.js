import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';  // or whatever plugins you use

export default defineConfig({
  base: '/resume-generator/',
  plugins: [react()],
});
