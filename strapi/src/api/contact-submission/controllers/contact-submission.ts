import { factories } from '@strapi/strapi';

/**
 * Mesaje din formularul de contact (blocul `blocks.contact-form`).
 * Pattern identic cu membership-request: validare consimțământ, honeypot,
 * whitelist de câmpuri, status forțat server-side.
 */
export default factories.createCoreController(
	'api::contact-submission.contact-submission',
	() => ({
		async create(ctx) {
			const body = ctx.request.body as { data?: Record<string, unknown> };
			const data = body?.data;

			if (!data) {
				return ctx.badRequest('Missing data');
			}

			// Honeypot anti-spam.
			if (typeof data.website === 'string' && data.website.trim() !== '') {
				return { data: { ok: true } };
			}

			if (data.consent_gdpr !== true) {
				return ctx.badRequest('Consimțământul pentru prelucrarea datelor este obligatoriu.');
			}

			const name = typeof data.name === 'string' ? data.name.trim().slice(0, 150) : '';
			const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
			const subject = typeof data.subject === 'string' ? data.subject.trim().slice(0, 200) : '';
			const message = typeof data.message === 'string' ? data.message.trim().slice(0, 3000) : '';

			if (!name || !email || !message) {
				return ctx.badRequest('Numele, emailul și mesajul sunt obligatorii.');
			}

			// Whitelist strict — status forțat la „new".
			ctx.request.body = {
				data: {
					name,
					email,
					...(subject ? { subject } : {}),
					message,
					consent_gdpr: true,
					status: 'new',
				},
			};

			await super.create(ctx);
			// Nu întoarce entitatea creată (PII). (audit 2026-07-02 L1)
			return { data: { ok: true } };
		},
	})
);
