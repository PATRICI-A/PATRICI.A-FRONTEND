import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const mkProxy = (target: string) => ({ target, changeOrigin: true, secure: true });
const mkProxyRewrite = (prefix: string, target: string) => ({
  target,
  changeOrigin: true,
  secure: true,
  rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
});

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': mkProxy(
        'https://patricia-api-gateway-qa.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
      '/svc/profile': mkProxyRewrite(
        '/svc/profile',
        'https://patricia-profile-service-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
      '/svc/events': mkProxyRewrite(
        '/svc/events',
        'https://patricia-campus-events-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
      '/svc/notifications': mkProxyRewrite(
        '/svc/notifications',
        'https://patricia-notificati-service-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
      '/svc/wellness': mkProxyRewrite(
        '/svc/wellness',
        'https://patricia-suport-service-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
      '/svc/analytics': mkProxyRewrite(
        '/svc/analytics',
        'https://patricia-stati-analytics-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
      '/svc/chat': mkProxyRewrite(
        '/svc/chat',
        'https://patricia-chat-service-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
      '/svc/matching': mkProxyRewrite(
        '/svc/matching',
        'https://patricia-social-matching-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
      '/svc/gateway': mkProxyRewrite(
        '/svc/gateway',
        'https://patricia-api-gateway-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
});
