# Securitate — SENS

Site-ul SENS prelucrează **date personale sensibile** (opinie politică, GDPR Art. 9).
Securitatea nu e opțională.

## Raportarea unei vulnerabilități
Trimite un email la **contact@cusens.eu** cu subiect „SECURITY". Nu deschide un issue public
și nu divulga public înainte de remediere. Descrie pașii de reproducere.

## Documente
- `docs/audit-2026-07-02.md` — ultimul audit de securitate (findings + fix-uri).
- `docs/audit-2026-06-10.md` — auditul anterior.
- `docs/pii-inventory.md` — harta datelor personale + garanțiile tehnice.
- `docs/compliance-gdpr.md` — cadru GDPR/ePrivacy.

## Reguli pentru contributori (inclusiv AI)
1. **Secrete:** niciodată în cod sau în variabile `VITE_*` (se inlinează în bundle-ul de client).
   Doar prin `$env/dynamic/private` (server-only) în frontend, `env()` în Strapi. `.env` e gitignored.
2. **PII:** orice câmp personal nou primește `"private": true` în schema. Orice relație nouă dinspre
   un tip public către un tip cu PII se testează live împotriva leak-ului prin `populate`
   (vezi `pii-inventory.md`).
3. **Formulare publice:** controller custom cu whitelist de câmpuri + consimțământ forțat + honeypot
   + path adăugat în `rate-limit.ts` + răspuns idempotent (fără oracle).
4. **HTML din CMS:** întotdeauna prin `sanitize.ts` (DOMPurify) înainte de `{@html}`.
5. **Dependențe:** `npm audit` verde (sau documentat) înainte de release; vezi workflow-ul CI.

## Măsuri operaționale (owner/infra — în afara codului)
- Cloudflare WAF (rate rules pe `/api` și `/admin`) + Cloudflare Access în fața admin-ului Strapi.
- 2FA pe conturile admin Strapi; parole tari; rotația secretelor prin runbook.
- Postgres cu encryption at rest; backup-uri criptate + acces-controlat + test de restore.
- SMTP real (Brevo) pentru double opt-in; Sentry + uptime pe `/health`.
- Penetration test extern înainte de go-live.
