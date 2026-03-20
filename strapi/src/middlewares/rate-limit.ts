/**
 * Simple in-memory rate limiter middleware.
 * Limits POST requests to public form endpoints (membership-requests, newsletter-subscribers, contact).
 *
 * Config:
 *   - windowMs: time window in milliseconds (default: 15 minutes)
 *   - max: max requests per IP per window (default: 5)
 *   - paths: array of path prefixes to rate limit
 */

interface RateLimitConfig {
	windowMs: number;
	max: number;
	paths: string[];
}

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of store) {
		if (now > entry.resetAt) {
			store.delete(key);
		}
	}
}, 5 * 60 * 1000);

export default (_config: unknown, { strapi }: { strapi: any }) => {
	const config: RateLimitConfig = {
		windowMs: 15 * 60 * 1000,
		max: 10,
		paths: ['/api/membership-requests', '/api/newsletter-subscribers', '/api/contact-submissions'],
		...(typeof _config === 'object' && _config !== null ? _config : {}),
	};

	return async (ctx: any, next: () => Promise<void>) => {
		// Only rate limit POST requests to configured paths
		if (ctx.method !== 'POST') {
			return next();
		}

		const path: string = ctx.path || '';
		const isTargeted = config.paths.some((p) => path.startsWith(p));
		if (!isTargeted) {
			return next();
		}

		const ip: string = ctx.request.ip || ctx.ip || 'unknown';
		const key = `${ip}:${path}`;
		const now = Date.now();

		let entry = store.get(key);
		if (!entry || now > entry.resetAt) {
			entry = { count: 0, resetAt: now + config.windowMs };
			store.set(key, entry);
		}

		entry.count++;

		// Set rate limit headers
		ctx.set('X-RateLimit-Limit', String(config.max));
		ctx.set('X-RateLimit-Remaining', String(Math.max(0, config.max - entry.count)));
		ctx.set('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

		if (entry.count > config.max) {
			strapi.log.warn(`Rate limit exceeded for ${ip} on ${path}`);
			ctx.status = 429;
			ctx.body = {
				error: {
					status: 429,
					name: 'TooManyRequestsError',
					message: 'Prea multe cereri. Vă rugăm încercați din nou mai târziu.',
				},
			};
			return;
		}

		return next();
	};
};
