import { z } from 'zod';

/**
 * Schema de validare pentru formularul de semnătură petiție.
 * Folosită cu sveltekit-superforms pe server (+page.server.ts action).
 * `website` e honeypot anti-spam — trebuie să rămână gol.
 */
export const petitionSignatureSchema = z.object({
	first_name: z.string().trim().min(1, 'Prenumele este obligatoriu.').max(100),
	last_name: z.string().trim().min(1, 'Numele este obligatoriu.').max(100),
	email: z.string().trim().toLowerCase().email('Adresa de email este invalidă.').max(254),
	county: z.string().trim().max(50).optional().default(''),
	city: z.string().trim().max(100).optional().default(''),
	comment: z.string().trim().max(500).optional().default(''),
	consent_gdpr: z.boolean().refine((v) => v === true, {
		message: 'Trebuie să accepți prelucrarea datelor pentru a semna.'
	}),
	// Honeypot: câmp ascuns; boții îl completează, oamenii nu.
	website: z.string().max(0).optional().default('')
});

export type PetitionSignatureSchema = typeof petitionSignatureSchema;
