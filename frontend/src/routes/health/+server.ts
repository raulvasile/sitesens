import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
	let strapiOk = false;

	try {
		const res = await fetch(`${strapiUrl}/api/homepage`, { signal: AbortSignal.timeout(5000) });
		strapiOk = res.ok;
	} catch {
		strapiOk = false;
	}

	const status = strapiOk ? 'healthy' : 'degraded';
	const code = strapiOk ? 200 : 503;

	return new Response(
		JSON.stringify({
			status,
			timestamp: new Date().toISOString(),
			services: {
				frontend: 'ok',
				strapi: strapiOk ? 'ok' : 'unreachable',
			},
		}),
		{
			status: code,
			headers: { 'Content-Type': 'application/json' },
		}
	);
};
