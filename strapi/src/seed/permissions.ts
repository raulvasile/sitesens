import type { Core } from '@strapi/strapi';

/**
 * Configurare permisiuni pentru rolul Public + lockdown PII.
 *
 * - Acordă `find`/`findOne` public pe tipurile de CONȚINUT (articole, pagini, etc.).
 * - Acordă doar `create` (+ acțiuni custom) pe formularele publice.
 * - Când există `STRAPI_API_TOKEN`, revocă citirile publice (SSR-ul citește autentificat).
 * - PII lockdown: revocă ÎNTOTDEAUNA find/findOne/update/delete public pe tipurile cu
 *   date personale, indiferent de token/activări manuale. Vezi docs/audit-2026-07-02.md.
 */
export async function setupPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const hasApiToken = !!process.env.STRAPI_API_TOKEN;
  const READ_ACTIONS = new Set(['find', 'findOne']);

  const publicEndpoints = [
    // Collection types (conținut)
    { controller: 'api::article.article', actions: ['find', 'findOne'] },
    { controller: 'api::category.category', actions: ['find', 'findOne'] },
    { controller: 'api::tag.tag', actions: ['find', 'findOne'] },
    { controller: 'api::event.event', actions: ['find', 'findOne'] },
    { controller: 'api::team-member.team-member', actions: ['find', 'findOne'] },
    { controller: 'api::page.page', actions: ['find', 'findOne'] },
    { controller: 'api::section.section', actions: ['find', 'findOne'] },
    { controller: 'api::county.county', actions: ['find', 'findOne'] },
    { controller: 'api::interest-area.interest-area', actions: ['find', 'findOne'] },
    { controller: 'api::chapter.chapter', actions: ['find', 'findOne'] },
    { controller: 'api::chapter-page.chapter-page', actions: ['find', 'findOne'] },
    { controller: 'api::campaign.campaign', actions: ['find', 'findOne'] },
    { controller: 'api::petition.petition', actions: ['find', 'findOne'] },
    // Petiție — semnături: create + count + verify (custom). NU find/findOne (date personale).
    { controller: 'api::petition-signature.petition-signature', actions: ['create', 'count', 'verify'] },
    // Single types (conținut fix)
    { controller: 'api::homepage.homepage', actions: ['find'] },
    { controller: 'api::contact-page.contact-page', actions: ['find'] },
    { controller: 'api::donate-page.donate-page', actions: ['find'] },
    { controller: 'api::navigation.navigation', actions: ['find'] },
    { controller: 'api::footer.footer', actions: ['find'] },
    { controller: 'api::inscription-page.inscription-page', actions: ['find'] },
    { controller: 'api::newsletter-page.newsletter-page', actions: ['find'] },
    { controller: 'api::community-page.community-page', actions: ['find'] },
    { controller: 'api::privacy-policy-page.privacy-policy-page', actions: ['find'] },
    { controller: 'api::events-page.events-page', actions: ['find'] },
    { controller: 'api::site-theme.site-theme', actions: ['find'] },
    // Formulare publice — doar create.
    { controller: 'api::newsletter-subscriber.newsletter-subscriber', actions: ['create'] },
    { controller: 'api::membership-request.membership-request', actions: ['create'] },
    { controller: 'api::contact-submission.contact-submission', actions: ['create'] },
  ];

  let granted = 0;
  let revoked = 0;
  for (const endpoint of publicEndpoints) {
    for (const action of endpoint.actions) {
      const actionId = `${endpoint.controller}.${action}`;
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { role: publicRole.id, action: actionId } });

      const shouldBePublic = !(hasApiToken && READ_ACTIONS.has(action));

      if (shouldBePublic && !existing) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({ data: { role: publicRole.id, action: actionId } });
        granted++;
      } else if (!shouldBePublic && existing) {
        await strapi
          .query('plugin::users-permissions.permission')
          .delete({ where: { id: existing.id } });
        revoked++;
      }
    }
  }

  if (hasApiToken) {
    strapi.log.info(
      `🔒 Public API permissions: read închis (STRAPI_API_TOKEN prezent). +${granted} scrieri publice, -${revoked} citiri revocate.`
    );
  } else {
    strapi.log.warn(
      '⚠️  STRAPI_API_TOKEN LIPSEȘTE din env-ul Strapi → citirile publice `find`/`findOne` rămân DESCHISE. ' +
        'Setează-l (același token read-only injectat în frontend) ca să se închidă. ' +
        'PII e protejat oricum prin flag-uri `private` pe scheme + lockdown-ul de mai jos.'
    );
    strapi.log.info(`✅ Public API permissions configured (+${granted}). Read PUBLIC (fără STRAPI_API_TOKEN).`);
  }

  // ── Defense-in-depth: lockdown PII ────────────────────────────────────────
  const PII_CONTROLLERS = [
    'api::petition-signature.petition-signature',
    'api::membership-request.membership-request',
    'api::newsletter-subscriber.newsletter-subscriber',
    'api::contact-submission.contact-submission',
  ];
  const FORBIDDEN_PUBLIC_ACTIONS = ['find', 'findOne', 'update', 'delete'];
  let piiRevoked = 0;
  for (const controller of PII_CONTROLLERS) {
    for (const action of FORBIDDEN_PUBLIC_ACTIONS) {
      const actionId = `${controller}.${action}`;
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { role: publicRole.id, action: actionId } });
      if (existing) {
        await strapi.query('plugin::users-permissions.permission').delete({ where: { id: existing.id } });
        piiRevoked++;
        strapi.log.warn(`🔒 [PII lockdown] Revocat permisiunea publică ${actionId}.`);
      }
    }
  }
  if (piiRevoked === 0) {
    strapi.log.info('🔒 [PII lockdown] OK — niciun tip cu PII nu are read/write public.');
  }
}

/**
 * Hardening auth: dezactivează înregistrarea publică de utilizatori cât timp
 * conturile de membru NU sunt lansate (rutele /cont, /auth sunt stub-uri).
 * `/api/auth/local/register` e activ by default în users-permissions → fără asta
 * oricine poate crea conturi (spam / enumerare). Idempotent.
 */
export async function hardenAuth(strapi: Core.Strapi) {
  try {
    const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const advanced = (await pluginStore.get({ key: 'advanced' })) as Record<string, unknown> | null;
    if (advanced && advanced.allow_register === true) {
      advanced.allow_register = false;
      await pluginStore.set({ key: 'advanced', value: advanced });
      strapi.log.info('🔒 [auth] Înregistrarea publică de utilizatori a fost DEZACTIVATĂ.');
    }
  } catch (err) {
    strapi.log.warn(`[auth] Nu am putut dezactiva înregistrarea publică: ${err}`);
  }
}
