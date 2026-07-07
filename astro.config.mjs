// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://avakkai.studio',
  
  integrations: [
    sitemap(), 
    react()
  ],
  
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'esbuild',  // ✅ Use esbuild instead of terser
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
    },
  },
  
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  
  compressHTML: true,
  output: 'static',
});