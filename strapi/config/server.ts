import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // PUBLIC_URL is the externally-reachable URL (e.g. https://cms.cusens.eu).
  // Required when running behind a TLS-terminating reverse proxy so admin-
  // generated absolute URLs (uploads, preview redirects) match the public
  // origin instead of falling back to http://localhost:1337.
  url: env('PUBLIC_URL', ''),
  proxy: env.bool('IS_PROXIED', false),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Cron pentru job-urile de retenție date (config/cron.ts). Task-urile în sine
  // sunt gate-uite pe RETENTION_ENABLED, deci activarea cron-ului e sigură.
  cron: {
    enabled: env.bool('CRON_ENABLED', true),
  },
});

export default config;
