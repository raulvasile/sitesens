# Fallback content — conținut de rezervă când Strapi e inaccesibil

Când Strapi e jos (deploy, mentenanță, cădere), site-ul servește conținutul din
`data/*.json` în loc să arate pagini goale sau 503. **Server-only** — nu ajunge în
bundle-ul de client.

## Scope (decizie proiect 2026-07-04)
Shell + pagini fixe:
- **shell** (apare pe fiecare pagină): `navigation`, `footer`, `site-theme`
- **pagini fixe** (single-types): `homepage`, `contact-page`, `donate-page`,
  `inscription-page`, `newsletter-page`, `community-page`, `privacy-policy-page`, `events-page`

Colecțiile (articole, evenimente) **nu** au fallback → degradează grațios (listă goală).

## Cum se completează (manual)
Fiecare `data/<endpoint>.json` trebuie să conțină **exact răspunsul REAL** al
endpoint-ului Strapi, cu același `populate` folosit în `load`. Cel mai sigur mod de a
obține forma corectă:

1. Pornește Strapi cu conținutul real completat.
2. Deschide în browser / curl endpoint-ul cu ACELAȘI query ca în `load`. Exemple:
   - `/api/navigation?populate[main_menu][populate]=children&populate[secondary_menu][populate]=children&populate[logo]=true&populate[mobile_extra_links]=true`
   - `/api/footer?populate[logo]=true&populate[footer_links]=true&populate[social_links]=true`
   - `/api/site-theme?populate[brand]=true&populate[surfaces]=true&populate[accents]=true&populate[typography]=true`
   - `/api/homepage?populate[content][on][blocks.hero][populate]=*...` (vezi `routes/+page.server.ts`)
3. Copiază răspunsul JSON (obiectul `{ "data": {...}, "meta": {...} }`) în fișierul corespunzător.
4. Pentru media (imagini): pune **URL-uri absolute** (ex. `https://cms.cusens.eu/uploads/...`)
   sau mută asset-urile critice în `frontend/static/` și referă-le local — dacă Strapi e jos,
   și `/uploads` de pe Strapi e jos.

## Cum funcționează
- `index.ts` mapează endpoint → JSON. `getFallback(endpoint)` întoarce snapshot-ul
  **doar dacă `data` e non-null** — un skeleton gol (`data: null`) e ignorat, deci
  comportamentul rămâne neschimbat până completezi.
- `$lib/server/content.ts` → `fetchContent()` = `fetchStrapi` + fallback automat.
  Folosit deja în `+layout.server.ts` (shell). Homepage-ul îl folosește în `catch`.

## De completat wiring-ul (când ai conținutul)
Shell (nav/footer/temă) + homepage + contact-page sunt deja conectate. Pentru restul
paginilor fixe, schimbă în `<pagina>/+page.server.ts` apelul `fetchStrapi('/x-page', …)` cu
`fetchContent('/x-page', …)` (din `$lib/server/content`) și completează
`data/x-page.json`. Endpoint-uri rămase de conectat: `donate-page`,
`inscription-page`, `newsletter-page`, `community-page`, `privacy-policy-page`, `events-page`.
