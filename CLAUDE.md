# CLAUDE.md — Ghid de development pentru site-ul SENS

Instrucțiuni pentru Claude când lucrează în acest repo. Citește-l înainte de orice task.
Pentru planul de implementare (epice, ordine, decizii) vezi `docs/roadmap-implementare.md`.

---

## Ce e proiectul

Site-ul partidului SENS. Monorepo cu două aplicații:

```
site/
├── frontend/        # SvelteKit 2 + Svelte 5 (runes) + TS, adapter-node
├── strapi/          # Strapi v5 (headless CMS), Postgres
├── docs/            # roadmap + arhitectură + audituri + GDPR (referință de proiect)
│   └── reference/   # specificații, user journeys, wireframes (documente sursă, statice)
├── MANUAL_CONTENT/  # manual pentru editorii CMS (NU pentru development)
├── SECURITY.md      # politica de securitate + reguli pentru contributori
└── package.json     # orchestrare dev/build cu concurrently
```

**🔒 Securitate & date personale:** site-ul prelucrează date sensibile (opinie politică, GDPR
Art. 9). Înainte de a atinge formulare / API / permisiuni / relații, citește
`docs/audit-2026-07-02.md` (ultimul audit), `docs/pii-inventory.md` (harta PII) și `SECURITY.md`.

**Producție:** frontend Dockerizat (adapter-node) în spatele Cloudflare; Strapi pe
Railway/Postgres la `cms.cusens.eu`; site la `cusens.eu`.

---

## Comenzi

Din rădăcina `site/`:
- `npm run dev` — pornește Strapi + frontend împreună (concurrently).
- `npm run dev:frontend` / `npm run dev:strapi` — separat.
- `npm run build` — build ambele.

Frontend (`cd frontend/`):
- `npm run dev` — Vite dev (5173).
- `npm run check` — `svelte-check` (type-check). **Rulează asta înainte de a considera un task gata.**
- `npm run build` — build producție.

Strapi (`cd strapi/`):
- `npm run develop` — dev cu admin la 1337.
- `npm run build` — build admin.

**Mediu local:** Node prin `n` (`$HOME/.n/bin`), Postgres 16 prin Homebrew, DB `sens_strapi`.

---

## Convenții frontend (SvelteKit + Svelte 5)

- **Svelte 5 runes**: `$props()`, `$derived()`, `$state()`, `$effect()`. NU sintaxă veche (`export let`).
- **Aliasuri**: `$lib`, `$components` (= `src/lib/components`), `$stores`.
- **Fetch Strapi**: prin `src/lib/strapi.ts` (`fetchStrapi`, `mutateStrapi`, `getStrapiMediaUrl`,
  `getPreviewStatus`). Nu face `fetch` direct către Strapi în componente.
- **HTML din CMS**: sanitizează ÎNTOTDEAUNA cu `src/lib/sanitize.ts` (dompurify) înainte de `{@html}`.
- **Forms**: `sveltekit-superforms` + `zod`. Decizie de proiect: **server actions** (`+page.server.ts`),
  nu client POST (vezi roadmap Epic 7). ⚠️ Proiectul are **Zod 4** → folosește adapterul
  **`zod4()`** (nu `zod()`) din `sveltekit-superforms/adapters`. Exemplu complet:
  `routes/petitii/[slug]/+page.server.ts` + `lib/schemas/petition.ts`. Pattern anti-spam pentru
  formulare publice: honeypot (`website` gol) + `rate-limit` middleware + dedup pe server.
- **SEO**: componenta `SeoHead.svelte` pe fiecare pagină.

### SSR (Epic 3 — fetch de conținut e pe server)
Toate `load`-urile de conținut public sunt în `+page.server.ts` (rulează doar pe server;
pe navigare client-side se lovește serverul SvelteKit, nu Strapi direct). **Rute noi de
conținut: scrie-le direct `+page.server.ts`** cu `PageServerLoad`. Excepții care rămân
client-side: `/cont/*`, `/auth/*` (JWT user, date personale).

`strapi.ts` comută server/client: pe server folosește `STRAPI_URL_INTERNAL` (Docker),
în browser `VITE_STRAPI_URL` (public). Media URL rămâne mereu public.

### ⚠️ Gotcha 0 — NICIODATĂ secrete în variabile `VITE_*`
`VITE_*` se inlinează în bundle-ul de CLIENT la build — oricine le citește din sursa JS.
(Audit 2026-06-10: `VITE_PREVIEW_SECRET` era expus așa.) Secretele se citesc DOAR prin
`$env/dynamic/private` în module server-only (`src/lib/server/`). Preview-ul (draft) e în
`src/lib/server/preview.ts`; Strapi are middleware-ul `draft-guard` care refuză
`?status=draft` fără `?secret=` — fără el, drafturile ar fi publice.

**Hardening (FĂCUT):** `fetchStrapi` atașează `STRAPI_API_TOKEN` (read-only, server-only prin
`process.env` guard-uit — NU `$env/dynamic/private`, fiindcă `strapi.ts` e importat și de client).
Seed-ul `setupPublicPermissions` revocă `find`/`findOne` public când tokenul e prezent
(idempotent). Cutover în prod: vezi procedura din `docs/roadmap-implementare.md` Epic 3.
⚠️ CSP `connect-src` către Strapi rămâne — formularele client-POST (newsletter/contact/înscriere)
încă lovesc Strapi din browser (doar `create`, public + honeypot/rate-limit).

---

## Convenții Strapi (v5)

- **Content-types**: `src/api/<name>/content-types/<name>/schema.json` + `controllers/` + `routes/` + `services/`.
- **Componente**: `src/components/<category>/<name>.json` (ex. `blocks/`, `shared/`, `form/`).
- **Seed**: `src/index.ts` (bootstrap) — populează date demo la prima rulare.
- **i18n**: displayName-urile sunt în română.

### ⚠️ Gotcha 1 — Populate pe Dynamic Zone (Strapi v5)
`populate=*` pe un dynamic zone returnează blocurile dar **NU** deep-populează componentele
nested. Fiecare tip de bloc are nevoie de populate propriu. Vezi `frontend/src/routes/[slug]/+page.ts`:
- Blocuri „shallow" → `populate[content][on][blocks.X][populate]=*`.
- Blocuri cu nested media/relații (card-grid, file-list, calendar-custom) → doar cheile nested,
  ex. `populate[content][on][blocks.card-grid][populate][cards][populate][image]=true`.
- **NU combina** `*` generic ȘI chei nested pe același bloc → Strapi vede două valori pentru
  `populate` și respinge query-ul cu „Invalid populate parameter". `card-grid` și `file-list`
  sunt DEEP-only — NU le pune în lista shallow. (Capcană reală: a dat 500 pe `/filiale/[chapter]`
  → 503 în frontend. `npm run check` NU prinde asta — e eroare de runtime Strapi.)
- **Verifică query-urile de populate direct pe Strapi** (`curl .../api/<type>?<query>` → 200,
  nu 500) când adaugi/modifici un dynamic-zone load. Type-check-ul nu validează query-string-ul.

### ⚠️ Gotcha 2 — `uid` e unic GLOBAL
Tipul `uid` impune unicitate pe tot content-type-ul. Când vrei unicitate **per-parent**
(ex. slug de pagină unic doar în cadrul unei filiale), folosește `string` + un lifecycle
`beforeCreate`/`beforeUpdate` care validează manual. Vezi `docs/roadmap-implementare.md` §3.
Exemplu real: `src/api/chapter-page/content-types/chapter-page/lifecycles.ts`.

### ⚠️ Gotcha 2c — seed cu `draftAndPublish` se publică prin `status`, nu `publishedAt`
La `strapi.documents(uid).create()` pe un content-type cu `draftAndPublish: true`, a pune
`publishedAt` în `data` NU publică entry-ul (rămâne draft, invizibil la `/api/<type>` care
întoarce doar published). Folosește `create({ data, status: 'published' })`. Exemple corecte
în `index.ts`: `topUpPetitions`, `topUpCampaigns`, `topUpChapters`.

### ⚠️ Gotcha 2b — `uid` NU se auto-completează la seed programatic
Câmpul `uid` se generează din `targetField` **doar în admin UI**. La `strapi.documents(...).create()`
din `src/index.ts`, dacă nu treci explicit `slug`, rămâne `null` → rupe tăcut orice filtrare
pe slug. (Descoperit: 42 județe cu `slug=null` care omorau filtrul `?judet=`.) Soluție:
generează slug-ul manual la seed (`slugifyRo()` în `index.ts`) + o migration de backfill
pentru datele deja create.

### ⚠️ Gotcha 3 — Formulare publice = controller custom
Endpoint-urile publice de POST (cereri, semnături) au controller custom care:
1. validează consimțămintele (boolean-uri `required` trebuie să fie `true`),
2. forțează câmpuri server-side (ex. `status = 'pending'`),
3. șterge câmpuri private (`notes`),
4. validează enum-uri/array-uri.

Model de aur: `src/api/membership-request/controllers/membership-request.ts`.
Plus: `src/middlewares/rate-limit.ts` (in-memory, pe path-uri de form; adaugă noul path în lista lui).

### ⚠️ Gotcha 4 — PII se scurge prin `populate`, nu doar prin `find`
În Strapi v5, `?populate` pe un endpoint public întoarce înregistrările relaționate filtrate
**doar** după flag-urile `"private": true` din schema-țintă — **NU** după permisiunea `find` a
tipului relaționat. Un tip public cu o relație către un tip cu PII scurge PII-ul chiar dacă
tipul-PII nu are `find` public. (Capcană reală, audit 2026-07-02: `petition.signatures` →
nume+email citibile anonim prin `GET /api/petitions?populate[signatures]=*`.)
**Reguli:** (1) orice câmp personal are `"private": true` în schema (vezi cele 4 tipuri PII —
`docs/pii-inventory.md`); (2) formularele publice au honeypot `website` + răspuns idempotent
(fără oracle de apartenență) — model: oricare din `*/controllers/*.ts`; (3) seed-ul
(`index.ts` `setupPublicPermissions`) face **PII lockdown** — revocă activ find/findOne/update/delete
public pe tipurile PII. La orice relație nouă public→PII: testează live
`curl '.../api/<public>?populate[<rel>][fields][0]=email'` — nu trebuie să întoarcă PII.

### Cache invalidation (deja implementat — vezi roadmap Epic 4)
Fiecare content-type are `content-types/<name>/lifecycles.ts` care apelează `purgeUrls` /
`cacheUrls` din `src/lib/cloudflare-cache.ts` pe afterCreate/Update/Delete. No-op în dev
(fără `CF_ZONE_ID`/`CF_API_TOKEN`). **Când adaugi un content-type nou cu pagină publică,
adaugă-i lifecycle + un URL mapper în `cacheUrls`.**

---

## Cum adaugi un BLOC nou de dynamic zone (checklist)

1. **Strapi**: `src/components/blocks/<name>.json` (componenta).
2. **Strapi**: adaugă `blocks.<name>` în `components` al dynamic zone-urilor relevante
   (`page`, `homepage`, `article`, etc. — `schema.json`).
3. **Frontend**: `src/lib/components/blocks/<Name>.svelte`.
4. **Frontend**: înregistrează în `src/lib/components/DynamicZone.svelte` (`componentMap` +
   import; dacă are fundal propriu, adaugă-l în `HAS_OWN_BG`).
5. **Frontend**: adaugă populate-ul blocului în load-urile care randează dynamic zone
   (`routes/+page.ts` homepage, `routes/[slug]/+page.ts`, etc.) — respectă Gotcha 1.
6. `npm run check` în frontend.

## Cum adaugi un CONTENT-TYPE nou (checklist)

1. **Strapi**: `schema.json` + `controllers` + `routes` + `services` (folosește factories).
2. Dacă e formular public: controller custom (Gotcha 3) + path în `rate-limit.ts`.
3. Dacă are slug unic per-parent: `string` + lifecycle (Gotcha 2).
4. Dacă are pagină publică: `lifecycles.ts` cu purge + URL mapper în `cloudflare-cache.ts`.
5. Permisiuni: public `find`/`findOne` (sau token read-only — vezi Epic 3).
6. **Frontend**: tipuri + `load` server (`+page.server.ts`) + componente.
7. Seed opțional în `strapi/src/index.ts`.
8. `npm run check`.

---

## Variabile de mediu

Frontend (`frontend/.env`): `VITE_STRAPI_URL`, `VITE_SITE_URL`, `VITE_PREVIEW_SECRET`,
`STRAPI_URL_INTERNAL` (runtime server, Docker), `VITE_GTM_ID` (analytics).

Strapi (`strapi/.env`): secretele Strapi (APP_KEYS etc.), `DATABASE_*`, `PREVIEW_SECRET`
(= `VITE_PREVIEW_SECRET`!), `CORS_ORIGIN`, `CF_ZONE_ID`/`CF_API_TOKEN`/`PUBLIC_SITE_URL` (cache purge).

**`PREVIEW_SECRET` din Strapi trebuie să fie identic cu `VITE_PREVIEW_SECRET` din frontend.**

---

## Reguli de lucru

- **Verifică înainte de „gata"**: `npm run check` (frontend) trebuie să treacă fără erori noi.
- **Nu comite/nu face push** decât dacă ți se cere explicit. Repo are git (branch `main`).
- **Romanian-first**: UI text, displayName-uri CMS, mesaje de eroare către user — în română.
- **📚 Sincronizează documentația în ACELAȘI task cu codul.** După orice schimbare
  semnificativă (content-type, rută, bloc, env var, comandă, decizie de arhitectură) sau la
  finalul unui epic, rulează skill-ul **`sync-docs`**: actualizează `CLAUDE.md`,
  `docs/roadmap-implementare.md` și skills-urile afectate. Docs stale = bug. Nu amâna „la final".
