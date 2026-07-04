import { factories } from '@strapi/strapi';

/**
 * Controller custom pentru abonări newsletter.
 *
 * Controllerul default permitea mass-assignment: oricine putea POST-a
 * `status: 'confirmed'` (sărind peste double opt-in) sau `consent_date`
 * antedatat. Aici acceptăm DOAR email + name; restul se forțează server-side.
 */
const NL_UID = 'api::newsletter-subscriber.newsletter-subscriber';

export default factories.createCoreController(NL_UID, ({ strapi }) => ({
	async create(ctx) {
		const body = ctx.request.body as { data?: Record<string, unknown> };
		const data = body?.data;

		if (!data) {
			return ctx.badRequest('Missing data');
		}

		// Honeypot anti-spam: dacă `website` vine completat, e bot → succes fals.
		if (typeof data.website === 'string' && data.website.trim() !== '') {
			return { data: { ok: true } };
		}

		const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
		if (!email) {
			return ctx.badRequest('Adresa de email este obligatorie.');
		}

		const name = typeof data.name === 'string' ? data.name.trim().slice(0, 200) : undefined;

		// Idempotent — nu dezvălui dacă emailul e deja abonat (audit 2026-07-02 M2).
		const existing = await strapi.db.query(NL_UID).findOne({ where: { email } });
		if (existing) {
			return { data: { ok: true } };
		}

		// Whitelist strict — clientul NU poate seta status/consent_date/source/ip.
		ctx.request.body = {
			data: {
				email,
				...(name ? { name } : {}),
				status: 'pending',
				consent_date: new Date().toISOString(),
				source: 'website',
			},
		};

		await super.create(ctx);
		return { data: { ok: true } };
	},
}));
