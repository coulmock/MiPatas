import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // On GitHub Pages or GitHub Actions deployment, use /MiPatas/ repository base path.
  // In local development or AI Studio Cloud Run, use root '/'.
  const isGitHubPages =
    process.env.GITHUB_PAGES === 'true' ||
    Boolean(process.env.GITHUB_ACTIONS) ||
    env.VITE_GITHUB_PAGES === 'true';

  const base =
    process.env.VITE_BASE_PATH ||
    env.VITE_BASE_PATH ||
    (isGitHubPages ? '/MiPatas/' : '/');

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
