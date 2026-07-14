# Roadmap implementare SENS — toate etapele

> Document de referință + plan de execuție pentru toate task-urile rămase pe site.
> Deciziile din document sunt bătute în cuie — orice abatere se discută explicit.
>
> Stack: SvelteKit 2 + Svelte 5 (runes) + `adapter-node` (Docker, în spatele
> Cloudflare) + Strapi v5. Forms: `sveltekit-superforms` + `zod`. Sanitizare:
> `dompurify`. Vezi și `SENS_Specificatii_Tehnice_v1.md` și `SENS_Strapi_Ghid_CMS.md`.

---

## Cuprins & ordine de execuție

Epicele sunt ordonate pe dependențe. Recomandarea de ordine:

| Ordine | # | Epic | Stare | Depinde de |
|---|---|---|---|---|
| ✅ | 0 | Skills Claude + `CLAUDE.md` (faza timpurie) | **FĂCUT** | — |
| ✅ | 3 | API calls pe SSR + hardening token | **FĂCUT** (token read-only, read public închis, verificat live) | 0 |
| ✅ | 1 | Filiale + filtrare pe județ | **FĂCUT** (verificat end-to-end pe Strapi live) | 3 |
| ✅ | 2 | Campanii | **FĂCUT** (verificat live; seed idempotent) | 3, 1 |
| ✅ | 7 | Petiții (formular, **server actions**) | **FĂCUT** (double opt-in verificat end-to-end) | 3 |
| 6 | 5 | Cookie consent | de făcut | — |
| 7 | 8 | Skills Claude (restul) | de făcut | — |
| **ULTIMELE** | 4 | Cache Cloudflare + invalidare Strapi | **~90% deja implementat** (vezi nota) | 3 |
| **ULTIMELE** | 6 | Analytics + monitorizare | **amânat la final** | 5 |

> **🔍 Audit complet (10 iun 2026)** — vezi `docs/audit-2026-06-10.md`. 10 vulnerabilități
> reparate + verificate live (expunere drafturi, mass-assignment newsletter, ContactForm fals
> → content-type `contact-submission` nou, secret preview în bundle, injecție HTML email etc.),
> 3 bug-uri fixate (populate featured-campaigns!), scheme curățate (cross-ref Strapi↔FE: fără
> elemente moarte). Rămase ca recomandări: CSP nonce (la Epic 6), `npm audit fix`, migrare
> `/inscrie-te` pe server actions.

> **🔍 Audit + hardening (2 iul 2026)** — vezi `docs/audit-2026-07-02.md` + `docs/pii-inventory.md`
> + `SECURITY.md`. Reparat leak-ul de PII prin `populate` (semnături petiție citibile anonim →
> flag-uri `private` pe toate tipurile PII + PII lockdown în seed), rate-limit pe `CF-Connecting-IP`,
> CORS fail-closed, whitelist+honeypot+idempotent pe formulare, HSTS/COOP/CORP, înregistrare
> publică dezactivată, job cron de retenție, `npm audit fix` (FE 17→5, Strapi 70→56). CI:
> `.github/` (audit + gitleaks + check) + Dependabot. Rămas: upgrade Strapi 5.50, CSP nonce.

> **🧹 Curățare conținut + restructurare seed (4 iul 2026)** — seed-ul demo (`index.ts`, 2694 linii)
> a fost curățat și mutat în **`strapi/src/seed/`** (permissions / admin-labels / taxonomies / org /
> base). `index.ts` = orchestrator subțire. Strategie conținut **hibrid**: bază+structură în seed
> (idempotent, re-rulabil pe clean deploy), editorial (articole/evenimente) din CMS. Referințele mai
> vechi din acest document la funcții `topUp*`/`migrate*`/`setupPublicPermissions` din
> `strapi/src/index.ts` reflectă structura de-atunci — acum sunt în `src/seed/`. Nou: **fallback
> content** (`frontend/src/lib/server/fallback/`) pentru shell + pagini fixe când Strapi e jos
> (conectat: layout + homepage). Vezi CLAUDE.md (secțiunile seed + fallback).

> Numerotarea epicelor (#0–8) urmează lista originală de todo-uri. Coloana „Ordine"
> e succesiunea reală de execuție. Epicul 1 (filiale) e cel mai detaliat fiindcă a
> fost specificat complet; restul au task-uri + decizii deschise marcate.

### Decizii confirmate (sesiune planificare)
- **Cloudflare cache (Epic 4)** — se face **la final de tot**, după ce toate
  modificările de conținut/funcționalitate sunt gata. Nu optimizăm cache peste o țintă mobilă.
- **Analytics + monitorizare (Epic 6)** — la fel, **la final**, după restul modificărilor.
- **Formulare = server actions** (`+page.server.ts` actions). Se aplică la petiții (Epic 7)
  și, retroactiv, la `/inscrie-te` (acum client POST → migrăm pe action).

### Starea curentă a codebase-ului (relevant)
- **Fetch date:** rulează în `+page.ts` (load universal) → browserul lovește Strapi
  **direct** pe navigare client-side, cu `VITE_STRAPI_URL` (public, inlined la build).
  Doar `+layout.server.ts` (nav/footer/temă) e server-only. `strapi.ts` are deja
  `STRAPI_URL_INTERNAL` pregătit. → vezi Epic 3.
- **Cache:** `hooks.server.ts` setează `cache-control: public, max-age=30, swr=60`
  pe HTML + CSP complet. Fără purge/invalidare din Strapi. → vezi Epic 4.
- **Analytics:** `Analytics.svelte` încarcă GTM **necondiționat** (problemă GDPR).
  Fără monitorizare erori. → vezi Epic 5 + 6.
- **Forms:** `membership-request` = modelul de aur (collection type + controller
  custom care validează consimțăminte, forțează `status`, curăță câmpuri private +
  `rate-limit` middleware). Petiția se clonează din el. → vezi Epic 7.

---

# EPIC 1 — Filiale, structură teritorială & filtrare pe județ

## 1. Decizii luate

| Subiect | Decizie | Motiv |
|---|---|---|
| URL filiale | **Prefix** `/filiale/{chapter}/{page}` | Namespace izolat → zero coliziune cu `/stiri`, `/[slug]`, rute fixe. Fără guard de slug rezervat. |
| Adâncime pagini | **2 niveluri**: filială + sub-pagină | Acoperă cererea (`/filiale/constanta/pagina1`). Model simplu. |
| Filială ↔ județ | **Una per județ** (41 + București) | `chapter.county` = relație `oneToOne`. |
| Filtrare locație | Prin **`county`** (entitate stabilă), nu prin filială | Județele sunt fixe; filialele apar/dispar. Filiala derivă filtrul din `chapter.county`. |
| `/comunitate` | Redenumit în **`/social-media`** | Pagina e de fapt despre rețele sociale (platforme + embed-uri). |

---

## 2. Structura URL & routing (SvelteKit)

```
src/routes/filiale/
  +page.server.ts            # index: listă filiale + hartă (RomaniaMap)
  +page.svelte
  [chapter]/
    +page.server.ts          # landing filială (404 dacă lipsă/inactivă)
    +page.svelte
    [page]/
      +page.server.ts        # sub-pagină (fetch by chapter.slug + page.slug)
      +page.svelte
```

- `/filiale` → index (toate filialele + hartă).
- `/filiale/constanta` → landing-ul filialei.
- `/filiale/constanta/pagina1` → sub-pagină.
- **Toate `+page.server.ts` din start** (aliniat cu Etapa 3 — SSR; vezi roadmap).
- Namespace izolat prin prefix → fără guard de slug rezervat.

### Resolvere
- `[chapter]/+page.server.ts`: fetch `chapter` după slug; 404 dacă lipsă sau `is_active = false` (cu excepția modului preview).
- `[page]/+page.server.ts`: fetch `chapter-page` cu
  `filters[chapter][slug][$eq]={chapter} & filters[slug][$eq]={page}`; 404 dacă
  combinația nu există. Acoperă și cazul `[page]` inventat sub o filială validă.

---

## 3. Modelul Strapi

### `chapter` (Filială) — collection type, `draftAndPublish: true`

| Câmp | Tip | Note |
|---|---|---|
| `name` | string, required | |
| `slug` | **`uid`** | OK aici: filialele sunt unice global (una/județ). |
| `county` | relație **oneToOne** → `api::county.county` | Sursa filtrării pe locație. |
| `coordinators` | component **`chapter.coordinator`** (repeatable) | „Oamenii" filialei, cu localitate. Vezi nota. |
| `content` | dynamic zone | Landing-ul filialei e **integral dynamic-zone** (editabil din CMS). Refolosește blocurile din `page`. |
| `cover_image` | media (single, images) | |
| `email` / `phone` / `address` | string / string / text | Contact filială. |
| `social_links` | component `shared.social-link` (repeatable) | Există deja. |
| `is_active` | boolean | Filiale în formare = ascunse din listă. |
| `seo` | component `shared.seo` | |

### `chapter-page` (Pagină filială) — collection type, `draftAndPublish: true`

| Câmp | Tip | Note |
|---|---|---|
| `title` | string, required | |
| `slug` | **`string`** (NU `uid`) | Unic **per filială** via lifecycle. Vezi gotcha. |
| `chapter` | relație manyToOne → `api::chapter.chapter`, required | |
| `content` | dynamic zone | Aceleași blocuri ca `page`. |
| `display_order` | integer | |
| `seo` | component `shared.seo` | |

### Component `chapter.coordinator` (nou)
`team-member` nu are localitate, iar o relație manyToMany simplă nu poate ține date
*despre legătură*. Localitatea ține de rolul persoanei în filială, nu de persoană.
Deci `coordinators` e un component repeatable, nu o relație directă:

| Câmp | Tip | Note |
|---|---|---|
| `member` | relație → `api::team-member.team-member` | Refolosește poză/bio/social existente. |
| `locality` | string | Localitatea/sectorul din județ (ex. „Constanța", „Mangalia"). |
| `local_role` | string, opțional | Ex. „Coordonator filială", „Responsabil tineret". |

Afișare pe landing: „Maria Popescu — Constanța", fără dublarea datelor persoanei.

### ⚠️ Gotcha — `chapter-page.slug` NU poate fi `uid`
Tipul `uid` din Strapi e **unic global**. Cu `uid`, doar o singură filială ar putea
avea o pagină „contact". Greșit. Soluție: `slug` = `string` + lifecycle
`beforeCreate`/`beforeUpdate` care impune unicitate **per `chapter`**.
Pattern de copiat: validarea din `src/api/membership-request/controllers/membership-request.ts`
(forțează câmpuri, respinge la create/update).

---

## 4. Filtrare pe locație (42 județe)

Conținutul se leagă de **`county`**, nu de filială.

| Content-type | Relație nouă | Cardinalitate | Motiv |
|---|---|---|---|
| `event` | `county` | manyToOne | Un eveniment are un singur loc. |
| `article` | `counties` | manyToMany | Un articol poate viza mai multe județe sau zero (= național). |
| `campaign` (viitor) | `counties` | manyToMany | La fel ca articolul. |

> Cele 42 de entități `county` există deja (folosite în formularul `/inscrie-te`).
> Filialele și conținutul se leagă direct — fără seed nou.

### Frontend
- `/stiri` și `/evenimente`: param nou `?judet=<county-slug>`.
  - articol → `filters[counties][slug][$eq]=<slug>`
  - eveniment → `filters[county][slug][$eq]=<slug>`
  - `/stiri/+page.ts` parsează deja `categorie`/`tag`/`q` — se adaugă încă un param, fără refactor.
- UI: dropdown de județ + opțional `RomaniaMap` ca filtru vizual.
- Landing filială `/filiale/{chapter}` **refolosește aceleași query-uri**,
  pre-filtrate pe `chapter.county` → știri + evenimente locale automat.

---

## 5. Redenumire `/comunitate` → `/social-media`

Scope (mic, izolat):
- **Frontend:** redenumește folderul rută `src/routes/comunitate/` → `social-media/`.
- **Referințe:** `src/routes/sitemap.xml/+server.ts` (intrarea `/comunitate`);
  comentarii cosmetice în `src/app.css` și `src/routes/[slug]/+page.svelte`.
- **Strapi seed** (`strapi/src/index.ts`): link de meniu
  `{ label: 'Comunitate', url: '/comunitate' }` → `url: '/social-media'`
  (eticheta vizibilă se decide în CMS; poate rămâne „Comunitate" sau „Social Media").
- **Content-type** `community-page`: se **păstrează** (numele intern nu afectează URL-ul);
  se schimbă doar ruta + linkurile. Risc minim.
- **Redirect 301** `/comunitate` → `/social-media` în `src/hooks.server.ts` (SEO + linkuri vechi).

---

## 6. Colaterale de atins la implementare
- **Sitemap** (`sitemap.xml/+server.ts`): adaugă filialele + sub-paginile + `/social-media`.
- **`RomaniaMap` / componenta `county-chapter`:** câmpul `url` poate ținti `/filiale/{slug}`.
- **`/filiale` index:** listă filiale active + hartă de navigare.
- **Migrare date:** cele 42 `county` există deja → fără seed nou pentru filiale.

---

## 7. Întrebări rezolvate
- **Landing filială = integral dynamic-zone**, editabil din CMS (refolosește blocurile din `page`).
  Nu layout fix. Coordonatorii + feed-ul local pot fi blocuri dedicate în zonă.
- **Coordonatorii se afișează cu localitatea** (component `chapter.coordinator`: member + locality + local_role).
- **`/filiale` coexistă cu harta de pe homepage.** `blocks.romania-map` rămâne pe homepage
  ca punct de intrare; `/filiale` e destinația-index completă (listă + hartă). Nu se înlocuiesc.

## 8. Blocuri noi de luat în calcul (dynamic-zone filiale)
Pentru ca landing-ul integral-dynamic-zone să fie util, probabil avem nevoie de blocuri noi:
- **`blocks.chapter-coordinators`** — afișează `coordinators` (member + localitate + rol). Sau extindem `team-grid`.
- **`blocks.chapter-feed`** / refolosire `latest-articles` + `upcoming-events` cu filtru implicit pe `county`-ul filialei.
- **`blocks.chapter-contact`** — email/telefon/adresă/social ale filialei. Sau bloc generic de contact.
Se decid la implementarea Etapei 1.

## 9. Task-uri Epic 1 (ordine de execuție)

**Strapi (backend):**
1. ✅ Component `chapter.coordinator` (member + locality + local_role).
2. ✅ Content-type `chapter` (schema + controller/route/service factory + lifecycle cache).
3. ✅ Content-type `chapter-page` + **lifecycle** uniqueness slug per `chapter` (+ cache purge
   cu rezolvarea slug-ului filialei).
4. ✅ Relații de locație: `event.county` (manyToOne), `article.counties` (manyToMany).
   *(`campaign.counties` se adaugă la Epic 2.)*
5. ✅ Seed `topUpChapters` în `strapi/src/index.ts` (idempotent — filială demo Cluj legată
   de `county`, doar dacă nu există filiale).
6. ✅ Permisiuni public read pentru `chapter`, `chapter-page` în `setupPublicPermissions`.
7. ✅ **Fix descoperit la boot:** cele 42 `county` aveau `slug=null` (uid nu se auto-completează
   la seed programatic). Adăugat `slugifyRo()` + `backfillCountySlugs()` migration. Verificat:
   42/42 au slug acum. **Fără asta, tot filtrul `?judet=` era mort.**

**Frontend:**
8. ✅ Rute `/filiale`, `/filiale/[chapter]`, `/filiale/[chapter]/[page]` — toate `+page.server.ts`.
9. ✅ Blocuri noi dynamic-zone (§8): `chapter-coordinators`, `chapter-feed`, `chapter-contact`
   (componente Strapi + `.svelte` + înregistrate în `DynamicZone.svelte` + populate via
   `chapterPopulate.ts` + îmbogățire în `enrichDynamicZone.ts` cu `ChapterContext`).
10. ✅ Filtrare `?judet=` pe `/stiri` (`filters[counties][slug]`) + `/evenimente`
    (`filters[county][slug]`) — query + param. **UI selector de județ: rămâne de adăugat în
    `.svelte` (vezi „rămas").**
11. ✅ Sitemap: `/filiale`, filiale + sub-pagini (`fetchChapterPageSlugs` cu slug-ul filialei).

**Verificare:** Strapi build verde + boot live verificat — endpoints `/api/chapters` &
`/api/chapter-pages` (200), filtre județ (200), backfill slug (42/42), filiala user „Bucuresti"
rezolvă cu county+coordinator. Frontend `npm run check`: 0 erori noi (cele 3 = Analytics, Epic 6).

### Rămas din Epic 1 (mic, non-blocant)
- **UI selector de județ** în `/stiri/+page.svelte` și `/evenimente/+page.svelte` (param-ul
  `?judet=` merge deja pe server; lipsește doar dropdown-ul/harta vizibilă).
- **Redenumire `/comunitate` → `/social-media`** (§5) — PR separat, mic; nu ține de filiale.
- **Coordinator demo:** seed-ul Cluj n-a rulat (există deja „Bucuresti" → idempotent skip). OK.

### Adăugat ulterior
- ✅ **Hartă interactivă pe `/filiale`** — `+page.server.ts` construiește `mapChapters`
  (`county.slug` → cod ISO via `romania-counties.ts`) și pasează la `RomaniaMap`. Județele cu
  filială activă sunt evidențiate + clickabile spre `/filiale/{slug}`. Verificat lanțul
  slug→cod (bucuresti→B). Harta apare doar dacă există cel puțin o filială mapată.
- ✅ **Fix poziționare breadcrumb** pe cele 3 rute de filiale — aliniat cu convenția site-ului
  (`--page-header-pt` top spacing sub navbar). Index: breadcrumb mutat în secțiunea intro;
  landing + sub-pagină: clasă `.chapter-breadcrumb` scoped cu padding standard.

---

# EPIC 0/8 — Skills Claude + instrucțiuni de proiect

**Stare:** `.claude/` are doar `settings.local.json`. `MANUAL_CONTENT/` e doc pentru
*editori CMS*, nu pentru development. Acest epic se face **devreme** (parțial) fiindcă
accelerează toate celelalte.

### Task-uri (faza timpurie — Epic 0)
1. **`CLAUDE.md`** la rădăcina `site/`: arhitectură (frontend + strapi), comenzi
   (`npm run dev` cu concurrently, build), convenții, și **gotchas critice**:
   - Regula de populate Strapi v5 pe dynamic zone (vezi `[slug]/+page.ts`: shallow `*`
     vs. deep populate, NU le combina pe același bloc).
   - Pattern controller de formular (`membership-request`): validare consimțăminte,
     forțare câmpuri, ștergere câmpuri private.
   - `uid` e unic global → când vrei unicitate per-parent, folosește `string` + lifecycle.
   - Media URL rămâne public chiar și după SSR (Epic 3).
2. **`settings.local.json`**: permisiuni pentru comenzi uzuale (npm, git read, grep)
   ca să reducem prompturile.

### Task-uri (faza finală — Epic 8)
3. Skills proiect în `.claude/skills/`:
   - `add-strapi-block` — component JSON + `.svelte` + înregistrare în `DynamicZone` + populate.
   - `add-content-type` — schema + controller + rute + tipuri frontend + load server.
   - `strapi-populate` — cheat-sheet query-uri v5 (filtre, populate adânc, paginare).
   - `run-dev` / `verify` — pornire dev + smoke-test specific proiectului.
4. Actualizare `CLAUDE.md` cu lecțiile din epicele 1–7.

**DoD:** `CLAUDE.md` complet + ≥3 skills funcționale + permisiuni setate.

---

# EPIC 3 — Toate call-urile API pe SSR

**Stare:** parțial. `load` e universal (`+page.ts`) → Strapi expus în browser pe
navigare client-side. `strapi.ts` are deja `STRAPI_URL_INTERNAL` + comutare server/client.

**De ce primul (după Epic 0):** fundație pentru Epic 4 (cache edge) și influențează
Epic 1, 2, 7 (le construim SSR-native din start).

### Task-uri
1. ✅ **FĂCUT** — Conversie `+page.ts` → `+page.server.ts` pentru cele 12 rute de conținut
   (`/`, `/[slug]`, `/stiri`, `/stiri/[slug]`, `/evenimente`, `/evenimente/[slug]`,
   `/comunitate`, `/contact`, `/doneaza`, `/newsletter`, `/inscrie-te`,
   `/politica-confidentialitate`). `git mv` (istoric păstrat) + `PageLoad`→`PageServerLoad`.
   `npm run check` verde (cele 3 erori rămase = `Analytics.svelte`, pre-existente, Epic 6).
2. ✅ **FĂCUT — API token Strapi read-only**: `fetchStrapi` atașează `STRAPI_API_TOKEN`
   (server-only, citit prin `process.env` guard-uit de `typeof window` — NU se inlinează în
   client). Seed-ul `setupPublicPermissions` **revocă `find`/`findOne` public când tokenul e
   prezent** (idempotent: fără token → read public ca înainte; cu token → read închis). Verificat
   live: read anonim → **403** (37 permisiuni revocate), read cu token → 200.
3. ✅ **FĂCUT — `strapi.ts` server URL**: adăugat `STRAPI_URL` (privat, runtime server) în lanțul
   `STRAPI_URL_INTERNAL → STRAPI_URL → VITE_STRAPI_URL`. `VITE_STRAPI_URL` rămâne pentru media
   (client). `.env.example` actualizat (STRAPI_URL, STRAPI_URL_INTERNAL, STRAPI_API_TOKEN).
4. ✅ **FĂCUT — Preview (draft)**: verificat prin token — draft+secret → 200; draft fără secret
   → 403 (draft-guard din audit rămâne activ, defense-in-depth).
5. ⚠️ **CSP `connect-src` către Strapi — SE PĂSTREAZĂ** (nu se strânge): 5 componente încă
   postează din browser (`mutateStrapi`: NewsletterCta, ContactForm, contact, inscrie-te,
   newsletter). Cât timp formularele sunt client-POST, browserul TREBUIE să ajungă la Strapi.
   Strângerea CSP ar deveni posibilă doar după migrarea acestor formulare pe server actions.

> **Notă:** hardening-ul de READ e complet. Ultimul canal browser→Strapi rămas sunt cele 5
> formulare client-POST (doar `create`, care rămâne public + protejat de honeypot/rate-limit).
> Închiderea completă a canalului = migrarea lor pe server actions (ca petițiile) — vezi mai jos.

### Procedura de CUTOVER în PRODUCȚIE (pasul care nu se face „orb")
1. În admin Strapi (prod): Settings → API Tokens → Create → type **Read-only** → copiază tokenul.
2. Setează `STRAPI_API_TOKEN=<token>` în env-ul **frontend-ului** (server) de producție.
3. Redeploy/restart frontend (ca să citească env-ul).
4. Restart Strapi (prod) — bootstrap-ul revocă automat read-ul public (log `🔒 read închis`).
   Ordinea 2→3 înainte de 4 evită fereastra în care FE n-are token dar read-ul e deja închis.
5. Verifică: `curl https://cms.cusens.eu/api/articles` din exterior → **403**; site-ul → OK.
   Rollback: șterge env-ul + restart Strapi → read-ul public revine (idempotent).

### NU se mută pe SSR
- `/cont/*` și `/auth/*` (JWT user, date personale) → rămân client-side.
- Formularele client-POST (`/inscrie-te`, newsletter, contact) → `create` rămâne public;
  migrarea lor pe server actions (ca petițiile la Epic 7) e follow-up separat, non-blocant.

**DoD:** ✅ Read Strapi inaccesibil anonim din exterior (token read-only); toate paginile
randate server-side prin token; preview funcțional; scrierile de formular încă publice
(protejate); verificat live cap-coadă (matrice A/B/C/D + 10 pagini FE prin token → 200).

---

# EPIC 4 — Cache Cloudflare agresiv + invalidare din Strapi  ⏳ AMÂNAT LA FINAL

> **Decizie:** se implementează **ultimul**, după ce tot conținutul și funcționalitatea
> sunt gata. Optimizarea de cache + invalidare se face peste o țintă stabilă.

> **⚠️ DESCOPERIRE (Epic 0):** invalidarea e **deja implementată**. Există
> `strapi/src/lib/cloudflare-cache.ts` (purge cu batch de 30 URL-uri, `purgeUrls` /
> `purgeEverything` / `cacheUrls` mappers) și TOATE cele 18 content-types au
> `lifecycles.ts` care apelează purge pe afterCreate/Update/Delete. No-op în dev.
> `.env.example` documentează `CF_ZONE_ID`/`CF_API_TOKEN`/`PUBLIC_SITE_URL`.
> **Ce mai rămâne de făcut la Epic 4:** (a) Cache-Control per tip de pagină în
> `+page.server.ts` (după SSR); (b) Cloudflare Cache Rules / Tiered Cache în dashboard;
> (c) URL mappers noi pentru content-types adăugate între timp (chapter, campaign, petition);
> (d) decizia plan Cloudflare (tag vs URL purge); (e) verificare end-to-end în prod.

**Stare:** invalidare din Strapi = gata; lipsește doar tuning-ul edge + Cache-Control SSR.
`hooks.server.ts` setează `cache-control` scurt pe HTML. **Depinde de Epic 3.**

### Task-uri
1. **Cache-Control per tip de pagină** (în `+page.server.ts` via `setHeaders` sau hook):
   - Conținut public (pagini, știri, evenimente, filiale): `s-maxage` mare (ore) + `swr`.
   - Pagini cu date user (`/cont`, `/auth`): `private, no-store`.
2. **Cloudflare Cache Rules / Tiered Cache**: păstrează HTML-ul SSR la edge.
3. **Invalidare la publish din Strapi** — lifecycle hooks (`afterUpdate`/`afterCreate`/
   `afterDelete`/`afterPublish` pe article/event/page/chapter/etc.) → apel Cloudflare purge API.
4. Endpoint/serviciu de purge în Strapi (`src/lib/`) cu token Cloudflare în env.

### Decizie cheie — granularitate purge (depinde de planul Cloudflare)
- **Enterprise** → `Cache-Tag` headers + purge by tag (chirurgical, ideal).
- **Pro/Business** → purge by URL (mapăm content-type → URL-uri afectate) sau by prefix.
- **Fallback** → purge-everything la orice publish (brutal dar simplu).

**⚠️ DECIZIE DE LUAT:** ce plan Cloudflare avem? + TTL-uri dorite per secțiune.

**DoD:** pagini publice servite din cache edge; la publish în Strapi, pagina afectată
se invalidează automat în < câteva secunde.

---

# EPIC 5 — Cookie consent

**Stare:** inexistent. Necesar fiindcă GTM rulează necondiționat (problemă GDPR + Consent Mode v2).

### Task-uri
1. Banner de consimțământ (componentă Svelte) care setează **Google Consent Mode v2**
   în starea „denied" *înainte* de încărcarea GTM.
2. `Analytics.svelte` se încarcă/activează **doar după accept** (sau update consent → granted).
3. Persistă alegerea (cookie/localStorage) + buton de re-configurare (footer).
4. Integrare cu pagina `/politica-confidentialitate` existentă.

### Decizie cheie
- **Cookiebot** (plătit, „la cheie", adaugă un terț) **vs.** banner propriu + Consent Mode
  (gratis, mai mult control, fără terți). Recomandat: **banner propriu** dacă singurul
  tracker e GA/GTM.
- Dacă la Epic 6 alegem **Plausible/Umami (cookieless)** → acest epic se reduce drastic
  (poate doar o notificare informativă, fără gating).

**⚠️ DECIZIE DE LUAT:** Cookiebot vs. banner propriu (legat de alegerea de la Epic 6).

**DoD:** niciun tracker nu se încarcă fără consimțământ; Consent Mode v2 configurat;
alegere persistentă + re-configurabilă.

---

# EPIC 6 — Analytics + monitorizare  ⏳ AMÂNAT LA FINAL

> **Decizie:** se implementează **la final**, după restul modificărilor.

**Stare:** GTM există dar necondiționat; zero monitorizare erori. CSP permite deja GTM/GA.

### Task-uri
1. **Analytics** gated de consimțământ (Epic 5):
   - Varianta A: GA4 prin GTM + Consent Mode v2 + evenimente cheie (înscriere, donație,
     semnătură petiție, submit contact).
   - Varianta B: **Plausible/Umami** (cookieless) — fără banner de gating, mai privacy-friendly.
2. **Monitorizare erori (Sentry sau echiv.)**:
   - SvelteKit: `handleError` în `hooks.server.ts` (server) + `hooks.client.ts` (client).
   - Strapi: integrare error tracking.
3. **Uptime/health:** `/health` există → conectare la UptimeRobot / Better Stack.
4. Opțional: Cloudflare Web Analytics (RUM cookieless).

**⚠️ DECIZIE DE LUAT:** GA4 (cu banner) vs. Plausible/Umami (cookieless); ce tool de erori.

**DoD:** analytics funcțional + conform consimțământului; erori server+client raportate
într-un dashboard; uptime monitorizat.

---

# EPIC 2 — Campanii (mix știri + evenimente)

**Stare:** net-new. Depinde de Epic 3; ideal după Epic 1 (refolosește filtrarea pe județ).

### Strapi
1. ✅ Content-type `campaign` (`draftAndPublish: true`): `title`, `slug` (`uid`), `summary`,
   `cover_image`, `content` (dynamic zone), `start_date`/`end_date`, `cta_label`/`cta_url`,
   `goal`/`progress` (bară progres), `is_featured`, relații `articles`/`events`/`counties`
   (toate manyToMany), `seo`. + controller/route/service factory + lifecycle cache
   (`cacheUrls.campaign`) + permisiune public read.
2. ✅ Bloc `blocks.featured-campaigns` (mode: featured/active/all + limit) — înregistrat în
   `homepage` + `page` dynamic zones; auto-populare în `enrichDynamicZone.ts`.

### Frontend
3. ✅ Rute `/campanii` (tab-uri active/încheiate/toate via `?status=` + `?judet=`) +
   `/campanii/[slug]` (dynamic zone + bară progres + CTA + secțiuni agregate „Evenimente din
   campanie" / „Știri din campanie") — `+page.server.ts`. Bloc `FeaturedCampaigns.svelte`.
4. ✅ Sitemap: `/campanii` + paginile de campanie.

**Decizii luate:** **agregare prin relații manuale** (explicit, fără dependență de tag/Epic 7).
`goal`/`progress` editate manual în CMS deocamdată; integrarea cu petiția (auto-progress din
nr. semnături) se face la Epic 7 dacă se dorește.

**Verificare:** Strapi build verde, endpoint `/api/campaigns` live, filtre active/featured (200),
`/campanii/[slug]` (200) + 404 pe slug invalid, frontend `npm run check` 0 erori noi.
Seed `topUpCampaigns` idempotent (a sărit — exista deja o campanie creată în CMS).

**DoD:** ✅ campanie publicabilă cu pagină agregată + listare + filtrare.

### Rămas (mic, non-blocant)
- Link `/campanii` în meniu (config CMS, nu cod).
- Filtru `?judet=` pe `/campanii` — param-ul merge pe server; UI selector lipsește (la fel ca știri/evenimente).

---

# EPIC 7 — Petiții (formular)

**Stare:** net-new, dar avem modelul de copiat — `membership-request`. Depinde de Epic 3.

### Strapi
1. Content-type `petition`: `title`, `slug` (`uid`), `description`/`content` (dynamic zone),
   `signature_target` (integer), `status` (activă/închisă), `seo`, opțional relație `campaign`.
2. Content-type `petition-signature`: `first_name`, `last_name`, `email`, `county`/`city`,
   consimțăminte GDPR (boolean required, ca la membership), opțional `comment`, `verified` (boolean),
   relație `petition`. **Read-only din admin** (înregistrate prin POST).
3. **Controller custom** (clonă din `membership-request`): validează consimțăminte,
   forțează câmpuri, anti-spam (honeypot), `rate-limit` middleware, dublură pe email/petiție.
4. Contor semnături (count) expus pentru bară de progres.

### Frontend
5. Rute `/petitii` + `/petitii/[slug]` cu form (`superforms` + `zod`), disclaimere GDPR +
   scop prelucrare date, contor + bară de progres.

### Decizii (toate luate)
- ✅ **Server actions** (`+page.server.ts` cu `superValidate` + `message`) — primul loc din
  proiect care folosește pattern-ul. `/inscrie-te` rămâne client POST (migrare ulterioară opțională).
- ✅ **Double opt-in DA** — semnătura e `verified: false` la submit; devine validă (și se
  contorizează) doar după click pe linkul din emailul de confirmare.
- ✅ **Afișăm doar numărul + bară progres** — zero date personale publice. Endpoint custom
  `/petition-signatures/count` numără doar semnăturile `verified`.

### Implementat
**Strapi:**
- `petition` (title, slug uid, summary, content dynamic zone, `signature_target`,
  `petition_status` open/closed, deadline, consent_text, relație `campaign`, `signatures`, seo)
  + lifecycle cache + permisiune public read.
- `petition-signature` (read-only admin) cu controller custom + rute custom:
  - `POST /petition-signatures` — validare consimțământ + honeypot (`website`) + dublură
    (email+petiție) + generare token + email confirmare (degradare grațioasă dacă providerul
    e neconfigurat).
  - `GET /petition-signatures/count?petition=<slug>` — număr semnături **verificate** (public).
  - `GET /petition-signatures/verify?token=<token>` — confirmă (single-use, șterge token).
  - `private` pe `verification_token`; `rate-limit` adăugat pe `/api/petition-signatures`.
- Schema zod în `frontend/src/lib/schemas/petition.ts`.

**Frontend:**
- `/petitii` (tab-uri active/închise/toate) + `/petitii/[slug]` (dynamic zone + contor + bară
  progres + formular superforms cu **server action** `?/sign` + honeypot + disclaimere GDPR) +
  `/petitii/[slug]/confirma?token=` (pagina de confirmare double opt-in). Sitemap actualizat.

### ⚠️ Gotcha prins la testare — `zod` adapter pe Zod 4
Proiectul are **Zod 4**, dar adapterul superforms `zod()` e pentru Zod 3. Trebuie folosit
`zod4()` din `sveltekit-superforms/adapters` (există și `zod4Client`). Cu `zod()` → eroare
de tip „ZodObject is not assignable to ZodObjectType".

### ⚠️ Gotcha prins la testare — seed cu `draftAndPublish` nu publică prin `publishedAt`
La `strapi.documents().create()` cu `draftAndPublish: true`, a pune `publishedAt` în `data`
NU publică — entry-ul rămâne draft și `/api/<type>` (care întoarce doar published) îl ascunde.
Trebuie `create({ data, status: 'published' })`. **Am corectat și seed-urile de la Epic 1
(filială Cluj) și Epic 2 (campanie) care aveau aceeași greșeală** — acum se publică corect.

**DoD:** ✅ petiție publicabilă, formular cu validare + consimțăminte + anti-spam (honeypot +
rate-limit + dedup), double opt-in cu email, contor de semnături verificate, conform GDPR.
Verificat end-to-end pe Strapi + frontend live (count 0→1→2 prin fluxul real).

---

## Decizii globale

### ✅ Confirmate
- **Formulare = server actions** (`+page.server.ts`). Aplicat la Epic 7 + retroactiv `/inscrie-te`.
- **Epic 4 (Cloudflare cache) și Epic 6 (Analytics) — amânate la final**, după restul.

### ⏳ De luat când ajungem la epicul respectiv (nu blochează startul)
- **Plan Cloudflare** (Enterprise / Pro-Business / Free) → strategia de purge — la Epic 4.
- **Analytics:** GA4 + banner *sau* Plausible/Umami cookieless — la Epic 5/6.
  *(Notă: dacă se alege cookieless, Epic 5 cookie-consent se reduce drastic.)*
- **Token Strapi read-only** pentru anon read — la Epic 3 (recomandat: da).
- **Double opt-in petiții** + afișare publică semnatari — la Epic 7.
