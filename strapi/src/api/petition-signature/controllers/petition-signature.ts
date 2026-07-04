import { factories } from '@strapi/strapi';
import crypto from 'crypto';

const SIG_UID = 'api::petition-signature.petition-signature';
const PET_UID = 'api::petition.petition';

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

function clampStr(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * Escape HTML pentru valori interpolate în emailuri. Fără asta, un atacator
 * poate pune HTML în `first_name` și folosi expeditorul nostru (noreply@)
 * ca releu de phishing către orice adresă introdusă.
 */
function escapeHtml(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default factories.createCoreController(SIG_UID, ({ strapi }) => ({
  /**
   * POST /petition-signatures — înregistrează o semnătură (double opt-in).
   * Validează consimțământ + honeypot + dublură, generează token, trimite email
   * de confirmare. Semnătura e `verified: false` până la click pe link.
   */
  async create(ctx) {
    const body = ctx.request.body as { data?: Record<string, unknown> };
    const data = body?.data;

    if (!data) return ctx.badRequest('Missing data');

    // Honeypot anti-spam: dacă vine completat câmpul „website", e bot → 200 fals.
    if (typeof data.website === 'string' && data.website.trim() !== '') {
      return { data: { ok: true } }; // răspuns „de succes" ca botul să nu reîncerce
    }

    // Consimțământ GDPR obligatoriu
    if (data.consent_gdpr !== true) {
      return ctx.badRequest('Consimțământul GDPR este obligatoriu.');
    }

    // Validări câmpuri
    const first_name = clampStr(data.first_name, 100);
    const last_name = clampStr(data.last_name, 100);
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
    if (!first_name || !last_name) return ctx.badRequest('Numele și prenumele sunt obligatorii.');
    if (!isEmail(email)) return ctx.badRequest('Adresa de email este invalidă.');

    // Petiția — acceptă documentId sau id; trebuie să existe și să fie deschisă.
    const petitionRef = data.petition;
    if (petitionRef == null) return ctx.badRequest('Petiția lipsește.');

    const petition = await strapi.documents(PET_UID).findOne({
      documentId: String(petitionRef),
      fields: ['id', 'title', 'slug', 'petition_status'],
    }).catch(() => null);

    if (!petition) return ctx.badRequest('Petiția nu există.');
    if ((petition as any).petition_status === 'closed') {
      return ctx.badRequest('Petiția este închisă pentru semnături.');
    }

    // Dublură: aceeași adresă pe aceeași petiție.
    const existing = await strapi.db.query(SIG_UID).findOne({
      where: { email, petition: (petition as any).id },
    });
    if (existing) {
      // Nu dezvăluim dacă e verificată sau nu — răspuns idempotent.
      return { data: { ok: true, duplicate: true } };
    }

    const token = crypto.randomBytes(24).toString('hex');

    await strapi.documents(SIG_UID).create({
      data: {
        first_name,
        last_name,
        email,
        county: clampStr(data.county, 50),
        city: clampStr(data.city, 100),
        comment: clampStr(data.comment, 500),
        consent_gdpr: true,
        verified: false,
        verification_token: token,
        petition: (petition as any).documentId ?? petitionRef,
      } as any,
    });

    // Email de confirmare (degradare grațioasă dacă providerul nu e configurat).
    const siteUrl = process.env.PUBLIC_SITE_URL ?? process.env.CLIENT_URL ?? 'https://cusens.eu';
    const verifyUrl = `${siteUrl}/petitii/${(petition as any).slug}/confirma?token=${token}`;
    const safeName = escapeHtml(first_name);
    const safeTitle = escapeHtml((petition as any).title ?? '');
    try {
      await strapi.plugin('email').service('email').send({
        to: email,
        subject: `Confirmă-ți semnătura — ${(petition as any).title}`,
        text: `Salut, ${first_name}!\n\nMulțumim că ai semnat petiția „${(petition as any).title}".\nPentru a confirma semnătura, accesează linkul:\n\n${verifyUrl}\n\nDacă nu ai semnat tu, ignoră acest mesaj.\n\nSENS`,
        html: `<p>Salut, ${safeName}!</p><p>Mulțumim că ai semnat petiția „<strong>${safeTitle}</strong>".</p><p>Pentru a confirma semnătura, apasă butonul:</p><p><a href="${verifyUrl}">Confirmă semnătura</a></p><p>Dacă nu ai semnat tu, ignoră acest mesaj.</p><p>— SENS</p>`,
      });
    } catch (err) {
      strapi.log.warn(`[petition] Email confirmare eșuat (provider neconfigurat?): ${err}`);
    }

    return { data: { ok: true } };
  },

  /**
   * GET /petition-signatures/count?petition=<slug> — numărul de semnături VERIFICATE.
   * Expus public pentru bara de progres. Fără date personale.
   */
  async count(ctx) {
    const slug = ctx.query.petition;
    if (typeof slug !== 'string' || !/^[a-z0-9-]{1,120}$/.test(slug)) {
      return ctx.badRequest('Parametrul petition lipsește sau e invalid.');
    }

    const count = await strapi.db.query(SIG_UID).count({
      where: { verified: true, petition: { slug } },
    });

    return { data: { count } };
  },

  /**
   * GET /petition-signatures/verify?token=<token> — confirmă semnătura (double opt-in).
   */
  async verify(ctx) {
    const token = ctx.query.token;
    if (typeof token !== 'string' || !token) return ctx.badRequest('Token lipsă.');

    const sig = await strapi.db.query(SIG_UID).findOne({ where: { verification_token: token } });
    if (!sig) return ctx.badRequest('Token invalid sau expirat.');

    if (sig.verified) return { data: { ok: true, already: true } };

    await strapi.db.query(SIG_UID).update({
      where: { id: sig.id },
      data: { verified: true, verification_token: null },
    });

    return { data: { ok: true } };
  },
}));
