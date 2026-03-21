import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'global::rate-limit',
    config: {
      windowMs: 15 * 60 * 1000,
      max: 10,
      paths: ['/api/membership-requests', '/api/newsletter-subscribers', '/api/contact-submissions'],
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
