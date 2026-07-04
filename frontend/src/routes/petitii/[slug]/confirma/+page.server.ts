import type { PageServerLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';

export const load: PageServerLoad = async ({ url, params, fetch }) => {
	const token = url.searchParams.get('token') ?? '';

	if (!token) {
		return { status: 'missing' as const, slug: params.slug };
	}

	try {
		const res = await fetchStrapi<{ ok: boolean; already?: boolean }>(
			'/petition-signatures/verify',
			{ token },
			undefined,
			fetch
		);
		const d = res.data as { ok?: boolean; already?: boolean };
		if (d?.ok) {
			return { status: d.already ? ('already' as const) : ('ok' as const), slug: params.slug };
		}
		return { status: 'invalid' as const, slug: params.slug };
	} catch {
		return { status: 'invalid' as const, slug: params.slug };
	}
};
