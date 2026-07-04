/**
 * Job-uri de retenție date (GDPR minimizare + reducere blast-radius la breșă).
 *
 * DEZACTIVAT by default — se activează cu `RETENTION_ENABLED=true`. Ferestrele sunt
 * configurabile prin env. Rulează zilnic la 03:15. Șterge doar date „moarte":
 *  - semnături petiție NEVERIFICATE mai vechi de RETENTION_UNVERIFIED_DAYS (double
 *    opt-in neconfirmat → fără bază legală de păstrare);
 *  - abonați newsletter PENDING (neconfirmați) mai vechi de RETENTION_UNVERIFIED_DAYS;
 *  - cereri de aderare RESPINSE mai vechi de RETENTION_REJECTED_DAYS.
 *
 * NU atinge date verificate/aprobate/confirmate. Vezi docs/audit-2026-07-02.md.
 */
const DAY_MS = 24 * 60 * 60 * 1000;

function cutoffISO(days: number): string {
  // now() nu e disponibil aici la momentul definirii — se calculează la rulare.
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

export default {
  retentionCleanup: {
    task: async ({ strapi }: { strapi: any }) => {
      if (process.env.RETENTION_ENABLED !== 'true') return;

      const unverifiedDays = Number(process.env.RETENTION_UNVERIFIED_DAYS ?? 30);
      const rejectedDays = Number(process.env.RETENTION_REJECTED_DAYS ?? 180);

      try {
        const unverifiedCutoff = cutoffISO(unverifiedDays);
        const sigDeleted = await strapi.db.query('api::petition-signature.petition-signature').deleteMany({
          where: { verified: false, createdAt: { $lt: unverifiedCutoff } },
        });

        const nlDeleted = await strapi.db.query('api::newsletter-subscriber.newsletter-subscriber').deleteMany({
          where: { status: 'pending', createdAt: { $lt: unverifiedCutoff } },
        });

        const mrDeleted = await strapi.db.query('api::membership-request.membership-request').deleteMany({
          where: { status: 'rejected', updatedAt: { $lt: cutoffISO(rejectedDays) } },
        });

        strapi.log.info(
          `🧹 [retention] Șters: ${sigDeleted?.count ?? 0} semnături neverificate, ` +
            `${nlDeleted?.count ?? 0} abonați pending, ${mrDeleted?.count ?? 0} cereri respinse.`
        );
      } catch (err) {
        strapi.log.error(`[retention] Eroare la cleanup: ${err}`);
      }
    },
    options: {
      // Zilnic la 03:15.
      rule: '15 3 * * *',
    },
  },
};
