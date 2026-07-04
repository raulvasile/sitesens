/**
 * Draft guard — blochează accesul anonim la conținut NEPUBLICAT prin REST.
 *
 * Strapi v5 acceptă `?status=draft` pe orice GET /api/* cu permisiune `find`,
 * ceea ce ar expune public conținut draft (articole/comunicate nepublicate).
 * Confirmat prin test: un request anonim cu status=draft întoarce draftul.
 *
 * Regula: cererile cu `status=draft` (sau `publicationState=preview`, sintaxa
 * v4) sunt permise DOAR dacă vin cu `?secret=<PREVIEW_SECRET>` — același secret
 * folosit de frontend pentru modul preview. Secretul e eliminat din query
 * înainte de a ajunge la controller (Strapi ar respinge un param necunoscut).
 */
export default (_config: unknown, { strapi }: { strapi: any }) => {
	return async (ctx: any, next: () => Promise<void>) => {
		if (!ctx.path.startsWith('/api/')) return next();

		const q = ctx.query ?? {};
		const wantsDraft = q.status === 'draft' || q.publicationState === 'preview';

		if (wantsDraft) {
			const expected = process.env.PREVIEW_SECRET;
			const provided = typeof q.secret === 'string' ? q.secret : undefined;

			if (!expected || !provided || provided !== expected) {
				strapi.log.warn(`[draft-guard] Cerere draft respinsă: ${ctx.method} ${ctx.path}`);
				ctx.status = 403;
				ctx.body = {
					error: {
						status: 403,
						name: 'ForbiddenError',
						message: 'Conținutul nepublicat nu este accesibil public.',
					},
				};
				return;
			}
		}

		// Scoate `secret` din query indiferent de status — controllerele Strapi
		// validează parametrii și ar da 400 pe unul necunoscut.
		if ('secret' in q) {
			const { secret: _secret, ...rest } = q;
			ctx.query = rest;
		}

		return next();
	};
};
