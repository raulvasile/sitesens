/**
 * Rute pentru semnături petiție.
 * - POST /petition-signatures        → create (custom controller: validare + dedup + email)
 * - GET  /petition-signatures/count  → numărul de semnături verificate pt o petiție
 * - GET  /petition-signatures/verify → confirmă o semnătură prin token (double opt-in)
 *
 * NU expunem find/findOne (datele personale nu se listează public).
 */
export default {
  routes: [
    {
      method: 'POST',
      path: '/petition-signatures',
      handler: 'petition-signature.create',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/petition-signatures/count',
      handler: 'petition-signature.count',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/petition-signatures/verify',
      handler: 'petition-signature.verify',
      config: { auth: false },
    },
  ],
};
