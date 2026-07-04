import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fetchStrapi, mutateStrapi } from '$lib/strapi';
import { getPreviewStatus } from '$lib/server/preview';
import { enrichDynamicZone } from '$lib/enrichDynamicZone';
import { chapterContentPopulate } from '$lib/chapterPopulate';
import { petitionSignatureSchema } from '$lib/schemas/petition';

export interface PetitionData {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	summary?: string;
	content: Array<{ __component: string; [key: string]: unknown }>;
	cover_image?: { url: string; alternativeText?: string } | null;
	signature_target?: number | null;
	petition_status?: 'open' | 'closed';
	deadline?: string | null;
	consent_text?: string | null;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

async function fetchVerifiedCount(slug: string, fetchFn: typeof fetch): Promise<number> {
	try {
		const res = await fetchStrapi<{ count: number }>(
			'/petition-signatures/count',
			{ petition: slug },
			undefined,
			fetchFn
		);
		// Endpoint-ul custom întoarce { data: { count } }; fetchStrapi întoarce { data }.
		return (res.data as { count?: number })?.count ?? 0;
	} catch {
		return 0;
	}
}

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	let res;
	try {
		res = await fetchStrapi<PetitionData[]>('/petitions', {
			'filters[slug][$eq]': params.slug,
			...chapterContentPopulate(),
			'populate[cover_image]': 'true',
			'populate[seo][populate]': '*',
			...previewParams,
		}, undefined, fetch);
	} catch (err) {
		const status = (err as { status?: number })?.status;
		console.error(`[/petitii/${params.slug}] Strapi fetch failed (${status ?? '?'})`);
		throw error(status && status >= 500 ? 503 : 500, 'Petiția nu poate fi încărcată momentan.');
	}

	const petition = res.data?.[0];
	if (!petition) throw error(404, 'Petiția nu a fost găsită');

	if (petition.content) {
		petition.content = await enrichDynamicZone(petition.content, fetch);
	}

	const [signatureCount, form] = await Promise.all([
		fetchVerifiedCount(params.slug, fetch),
		superValidate(zod4(petitionSignatureSchema)),
	]);

	return { petition, signatureCount, form };
};

export const actions: Actions = {
	sign: async ({ request, params, fetch }) => {
		const form = await superValidate(request, zod4(petitionSignatureSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Honeypot completat → pretindem succes (nu înregistrăm).
		if (form.data.website) {
			return message(form, { type: 'success', text: 'verifica-email' });
		}

		// Rezolvă documentId-ul petiției (controllerul Strapi acceptă documentId).
		let petitionDocId: string | null = null;
		try {
			const pet = await fetchStrapi<Array<{ documentId: string; petition_status?: string }>>(
				'/petitions',
				{ 'filters[slug][$eq]': params.slug, 'fields[0]': 'documentId', 'fields[1]': 'petition_status' },
				undefined,
				fetch
			);
			const row = pet.data?.[0];
			if (!row) return message(form, { type: 'error', text: 'Petiția nu a fost găsită.' }, { status: 404 });
			if (row.petition_status === 'closed') {
				return message(form, { type: 'error', text: 'Petiția este închisă pentru semnături.' }, { status: 400 });
			}
			petitionDocId = row.documentId;
		} catch {
			return message(form, { type: 'error', text: 'Serviciul nu este disponibil momentan.' }, { status: 503 });
		}

		try {
			await mutateStrapi('/petition-signatures', 'POST', {
				data: {
					first_name: form.data.first_name,
					last_name: form.data.last_name,
					email: form.data.email,
					county: form.data.county,
					city: form.data.city,
					comment: form.data.comment,
					consent_gdpr: form.data.consent_gdpr,
					petition: petitionDocId,
					website: form.data.website,
				},
			});
		} catch (err) {
			const msg = (err as { message?: string })?.message ?? 'Eroare la trimitere.';
			return message(form, { type: 'error', text: msg }, { status: 400 });
		}

		return message(form, { type: 'success', text: 'verifica-email' });
	},
};
