import { factories } from '@strapi/strapi';

const VALID_INTERESTS = [
	'Mediu', 'Educație', 'Sănătate', 'Sustenabilitate',
	'Tineret', 'Digitalizare', 'Agricultură', 'Transport', 'Energie',
];

export default factories.createCoreController(
	'api::membership-request.membership-request',
	({ strapi }) => ({
		async create(ctx) {
			const body = ctx.request.body as { data?: Record<string, unknown> };
			const data = body?.data;

			if (!data) {
				return ctx.badRequest('Missing data');
			}

			// Validate interests — must be array of allowed strings (or null/undefined)
			if (data.interests != null) {
				if (
					!Array.isArray(data.interests) ||
					data.interests.length > 20 ||
					!data.interests.every((i: unknown) => typeof i === 'string' && VALID_INTERESTS.includes(i))
				) {
					return ctx.badRequest('Invalid interests');
				}
			}

			// Enforce consent booleans must be true
			if (data.consent_gdpr !== true) {
				return ctx.badRequest('Consent GDPR is required');
			}
			if (data.consent_statute !== true) {
				return ctx.badRequest('Consent statute is required');
			}
			if (data.consent_data_processing !== true) {
				return ctx.badRequest('Consent data processing is required');
			}

			// Force status to pending — prevent public users from setting their own status
			data.status = 'pending';

			// Strip private/admin fields
			delete data.notes;

			return super.create(ctx);
		},
	})
);
