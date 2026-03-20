import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // ── Code splitting — splits app into smaller chunks ──
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — loaded first, cached forever
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // Animations — only loads on pages that need it
          'motion': [
            'framer-motion',
          ],
          // Supabase — separate chunk, loads once
          'supabase': [
            '@supabase/supabase-js',
          ],
          // Icons — large library, separate chunk
          'ui': [
            'lucide-react',
          ],
          // Charts — only loads on analytics page
          'charts': [
            'recharts',
          ],
        }
      }
    },

    // Suppress warnings for slightly large chunks
    chunkSizeWarningLimit: 600,

    // Generate sourcemaps for production debugging
    sourcemap: false,

    // Minify output
    minify: 'esbuild',

    // Target modern browsers — smaller output
    target: 'es2020',
  },

  // ── Optimize dependencies on dev server ──────────────
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@supabase/supabase-js',
      'lucide-react',
    ],
  },

  // ── Dev server settings ───────────────────────────────
  server: {
    port: 5173,
    host: true,
  },

  // ── Preview server settings ───────────────────────────
  preview: {
    port: 4173,
    host: true,
  },
})