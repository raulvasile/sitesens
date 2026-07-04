import { factories } from '@strapi/strapi';

const MR_UID = 'api::membership-request.membership-request';

const VALID_INTERESTS = [
	'Mediu', 'Educație', 'Sănătate', 'Sustenabilitate',
	'Tineret', 'Digitalizare', 'Agricultură', 'Transport', 'Energie',
];

function clampStr(v: unknown, max: number): string {
	return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export default factories.createCoreController(MR_UID, ({ strapi }) => ({
	async create(ctx) {
		const body = ctx.request.body as { data?: Record<string, unknown> };
		const data = body?.data;

		if (!data) {
			return ctx.badRequest('Missing data');
		}

		// Honeypot anti-spam: dacă vine completat câmpul „website", e bot → succes fals.
		if (typeof data.website === 'string' && data.website.trim() !== '') {
			return { data: { ok: true } };
		}

		// Validate interests — must be array of allowed strings (or null/undefined)
		let interests: string[] | undefined;
		if (data.interests != null) {
			if (
				!Array.isArray(data.interests) ||
				data.interests.length > 20 ||
				!data.interests.every((i: unknown) => typeof i === 'string' && VALID_INTERESTS.includes(i))
			) {
				return ctx.badRequest('Invalid interests');
			}
			interests = data.interests as string[];
		}

		// Enforce consent booleans must be true
		if (data.consent_gdpr !== true) return ctx.badRequest('Consent GDPR is required');
		if (data.consent_statute !== true) return ctx.badRequest('Consent statute is required');
		if (data.consent_data_processing !== true) return ctx.badRequest('Consent data processing is required');

		const first_name = clampStr(data.first_name, 100);
		const last_name = clampStr(data.last_name, 100);
		const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
		const phone = clampStr(data.phone, 20);
		const county = clampStr(data.county, 50);
		const city = clampStr(data.city, 100);
		const address = clampStr(data.address, 500);
		if (!first_name || !last_name || !email || !phone || !data.birth_date || !county || !city || !address) {
			return ctx.badRequest('Câmpuri obligatorii lipsă.');
		}

		// Oracle de apartenență: nu dezvălui dacă emailul e deja înscris. Răspuns
		// idempotent de succes — la fel ca petiția. (audit 2026-07-02 M2)
		const existing = await strapi.db.query(MR_UID).findOne({ where: { email } });
		if (existing) {
			return { data: { ok: true } };
		}

		// Whitelist STRICT — clientul nu poate seta `status`/`notes` sau alte câmpuri.
		ctx.request.body = {
			data: {
				first_name,
				last_name,
				email,
				phone,
				birth_date: data.birth_date,
				county,
				city,
				address,
				...(clampStr(data.motivation, 1000) ? { motivation: clampStr(data.motivation, 1000) } : {}),
				...(interests && interests.length > 0 ? { interests } : {}),
				consent_gdpr: true,
				consent_statute: true,
				consent_data_processing: true,
				consent_newsletter: data.consent_newsletter === true,
				status: 'pending',
			},
		};

		await super.create(ctx);
		// Nu întoarce entitatea creată (PII). (audit 2026-07-02 L1)
		return { data: { ok: true } };
	},
}));
