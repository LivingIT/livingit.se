// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import cloudflare from '@astrojs/cloudflare';
import type { Plugin } from 'vite';

const debugEsmShim: Plugin = {
  name: 'debug-esm-shim',
  enforce: 'pre',
  resolveId(id) {
    if (id === 'debug') return '\0virtual:debug-shim';
  },
  load(id) {
    if (id !== '\0virtual:debug-shim') return;
    return `
const createDebug = (ns) => {
  const fn = () => {};
  fn.namespace = ns;
  fn.enabled = false;
  fn.extend = (s) => createDebug(ns + ':' + s);
  fn.destroy = () => {};
  fn.log = () => {};
  fn.color = 0;
  fn.diff = 0;
  return fn;
};
createDebug.enable = () => {};
createDebug.disable = () => '';
createDebug.enabled = () => false;
createDebug.names = [];
createDebug.skips = [];
createDebug.formatters = {};
export default createDebug;
`;
  },
};

export default defineConfig({
  output: 'static',
  adapter: cloudflare({ platformProxy: { enabled: false } }),
  integrations: [icon()],
  vite: {
    plugins: [debugEsmShim],
  },
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
