const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

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
	token?: string
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

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const res = await fetch(url.toString(), { headers });

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

/**
 * Construiește URL complet pentru media din Strapi.
 */
export function getStrapiMediaUrl(url: string | null | undefined): string {
	if (!url) return '';
	if (url.startsWith('http')) return url;
	return `${STRAPI_URL}${url}`;
}
