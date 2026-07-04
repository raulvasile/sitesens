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
	/** Path-uri GET de limitat (ex. verificare token — anti brute-force). */
	getPaths?: string[];
}

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** O singură adresă IP validă (v4/v6), fără liste. */
function isValidIp(v: string): boolean {
	const s = v.trim();
	if (!s || s.length > 45 || s.includes(',')) return false;
	// IPv4 sau IPv6 (validare permisivă — respinge liste/gunoi, nu e RFC-complet).
	return /^[0-9.]+$/.test(s) || /^[0-9a-fA-F:]+$/.test(s);
}

/**
 * IP-ul REAL al clientului. `ctx.request.ip` (derivat din `X-Forwarded-For`) e
 * spoofabil de client când `proxy:true` → un atacator rotește XFF pentru un
 * bucket nou per request și ocolește limita. În spatele Cloudflare, `CF-Connecting-IP`
 * e setat de CF și NU poate fi falsificat de client. Preferă-l; altfel cade pe
 * `True-Client-IP`, apoi pe IP-ul socketului (nu pe XFF).
 * Vezi docs/audit-2026-07-02.md H1.
 */
function getClientIp(ctx: any): string {
	const cf = ctx.get?.('cf-connecting-ip') || ctx.request?.headers?.['cf-connecting-ip'];
	if (typeof cf === 'string' && isValidIp(cf)) return cf.trim();

	const tci = ctx.get?.('true-client-ip') || ctx.request?.headers?.['true-client-ip'];
	if (typeof tci === 'string' && isValidIp(tci)) return tci.trim();

	// Socket direct (koa `request.socket.remoteAddress`) — NU XFF (spoofabil).
	const socketIp = ctx.req?.socket?.remoteAddress;
	if (typeof socketIp === 'string' && isValidIp(socketIp)) return socketIp;

	return 'unknown';
}

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
		paths: ['/api/membership-requests', '/api/newsletter-subscribers', '/api/contact-submissions', '/api/petition-signatures'],
		...(typeof _config === 'object' && _config !== null ? _config : {}),
	};

	return async (ctx: any, next: () => Promise<void>) => {
		const path: string = ctx.path || '';

		// POST pe path-urile de formular + GET pe path-urile sensibile (getPaths).
		const isTargeted =
			(ctx.method === 'POST' && config.paths.some((p) => path.startsWith(p))) ||
			(ctx.method === 'GET' && (config.getPaths ?? []).some((p) => path.startsWith(p)));
		if (!isTargeted) {
			return next();
		}

		const ip: string = getClientIp(ctx);
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
