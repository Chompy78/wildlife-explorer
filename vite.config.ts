import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this as a project site at /wildlife-explorer/, not the domain root - base must
// match so built asset URLs resolve correctly. This also changes the dev server's URL: `npm run dev`
// serves at http://localhost:<port>/wildlife-explorer/, not the root - Vite prints the exact URL to use.
export default defineConfig({
  base: '/wildlife-explorer/',
  plugins: [react()],
});
