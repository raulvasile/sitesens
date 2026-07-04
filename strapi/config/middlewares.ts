import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  // Blochează accesul anonim la conținut draft (?status=draft) fără PREVIEW_SECRET.
  'global::draft-guard',
  {
    name: 'global::rate-limit',
    config: {
      windowMs: 15 * 60 * 1000,
      max: 10,
      paths: [
        '/api/membership-requests',
        '/api/newsletter-subscribers',
        '/api/contact-submissions',
        '/api/petition-signatures',
      ],
      // GET-uri sensibile (anti brute-force pe token de verificare).
      getPaths: ['/api/petition-signatures/verify'],
    },
  },
  {
    name: 'strapi::cors',
    config: {
      // CORS_ORIGIN e o listă separată prin virgulă (ex. "https://cusens.eu").
      // FAIL-CLOSED în producție: dacă lipsește, NU cădem pe "*" (ar permite
      // oricărei origini să citească API-ul din browser) — folosim originea de
      // prod cunoscută. Doar în dev permitem "*". Vezi docs/audit-2026-07-02.md M3.
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
        : process.env.NODE_ENV === 'production'
          ? ['https://cusens.eu']
          : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
    },
  },
  // `strapi::poweredBy` scos intenționat — nu mai anunțăm „X-Powered-By: Strapi"
  // (info disclosure). Vezi docs/audit-2026-07-02.md L4.
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
