// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [icon()],
  redirects: {
    '/bli-konsult': {
      destination: '/kontakt',
      status: 301,
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true, // don't touch this!
  },
});
