/**
 * STRAPI_URL — uses VITE_STRAPI_URL (inlined at build time) for the CLIENT
 * (needed by getStrapiMediaUrl to render images). On the SERVER, prefer the
 * private runtime vars so the API base can differ from the media host.
 *
 * NOTE: `strapi.ts` is imported by client components (getStrapiMediaUrl,
 * mutateStrapi), so we CANNOT use `$env/dynamic/private` here (would break the
 * client build). We read `process.env.*` guarded by `typeof window`, exactly
 * like the existing STRAPI_URL_INTERNAL pattern — the branch is dead code on
 * the client, so no secret is inlined.
 */
const PUBLIC_STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

function getStrapiBaseUrl(): string {
	if (typeof window === 'undefined') {
		// Server-side: internal Docker URL → private STRAPI_URL → public fallback.
		// @ts-ignore — process.env is available at runtime in Node
		return process.env.STRAPI_URL_INTERNAL || process.env.STRAPI_URL || PUBLIC_STRAPI_URL;
	}
	return PUBLIC_STRAPI_URL;
}

const STRAPI_URL = getStrapiBaseUrl();

/**
 * Read-only API token, SERVER-ONLY. When set, `fetchStrapi` attaches it to
 * server-side reads so Strapi's public `find`/`findOne` permissions can be
 * closed (the seed removes them when this token is present). Never exposed to
 * the client — the branch below is unreachable in the browser bundle.
 */
function getServerApiToken(): string | undefined {
	if (typeof window !== 'undefined') return undefined;
	// @ts-ignore — process.env is available at runtime in Node
	return process.env.STRAPI_API_TOKEN || undefined;
}

export interface StrapiResponse<T> {
	data: T;
	meta: {
		pagination?: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

export interface StrapiError {
	status: number;
	message: string;
}

/**
 * Fetch helper pentru Strapi REST API.
 * @param endpoint - calea API fără /api prefix (ex: '/articles')
 * @param params   - query params opționali
 * @param token    - JWT token pentru endpoint-uri autentificate
 */
export async function fetchStrapi<T = unknown>(
	endpoint: string,
	params?: Record<string, string>,
	token?: string,
	fetchFn: typeof fetch = fetch
): Promise<StrapiResponse<T>> {
	const url = new URL(`/api${endpoint}`, STRAPI_URL);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.set(key, value);
		});
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	// Prefer an explicit token (user JWT); otherwise fall back to the server-only
	// read-only API token so public read permissions can be closed in Strapi.
	const authToken = token ?? getServerApiToken();
	if (authToken) {
		headers['Authorization'] = `Bearer ${authToken}`;
	}

	const res = await fetchFn(url.toString(), { headers });

	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: { message: res.statusText } }));
		throw {
			status: res.status,
			message: error?.error?.message || `Strapi error: ${res.status}`
		} satisfies StrapiError;
	}

	return res.json();
}

/**
 * POST/PUT/DELETE helper pentru Strapi.
 */
export async function mutateStrapi<T = unknown>(
	endpoint: string,
	method: 'POST' | 'PUT' | 'DELETE',
	body?: unknown,
	token?: string
): Promise<T> {
	const url = new URL(`/api${endpoint}`, STRAPI_URL);

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const res = await fetch(url.toString(), {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: { message: res.statusText } }));
		throw {
			status: res.status,
			message: error?.error?.message || `Strapi error: ${res.status}`
		} satisfies StrapiError;
	}

	return res.json();
}

// NOTĂ: getPreviewStatus + PREVIEW_SECRET au fost mutate în
// `$lib/server/preview.ts` (server-only). Stăteau aici cu VITE_PREVIEW_SECRET,
// care se inlinează în bundle-ul de CLIENT → secretul era citibil din sursa JS.

/**
 * Construiește URL complet pentru media din Strapi.
 */
export function getStrapiMediaUrl(url: string | null | undefined): string {
	if (!url) return '';
	if (url.startsWith('http')) return url;
	// Always use public URL for media (rendered in browser)
	return `${PUBLIC_STRAPI_URL}${url}`;
}
