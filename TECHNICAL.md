# Documentație tehnică — SENS

Acest document e pentru **dezvoltatori și administratori de sistem**. Acoperă arhitectura, dezvoltarea locală, deploy-ul în producție, backup-ul și operațiunile de zi cu zi.

Pentru manual content manageri: [MANUAL_CONTENT/README.md](MANUAL_CONTENT/README.md).

---

## 1. Arhitectura

```
┌─────────────────────────────────────────────────────────────┐
│                          INTERNET                            │
└──────────────┬──────────────────────────────────┬───────────┘
               │ :80 / :443                       │ :443
               ▼                                  ▼
        cusens.eu                          cms.cusens.eu
               │                                  │
        ┌──────┴──────────────────────────────────┴──────┐
        │                  Caddy 2                        │
        │  (reverse-proxy, auto-TLS Let's Encrypt)        │
        │  • gzip / zstd / HTTP/3                         │
        │  • security headers (HSTS, X-Frame, …)          │
        └──────┬──────────────────────────────────┬──────┘
               │ frontend:3000                    │ strapi:1337
               ▼                                  ▼
        ┌─────────────┐                  ┌───────────────┐
        │   Frontend  │ ──── HTTP ────▶  │    Strapi     │
        │  SvelteKit  │   (intern)       │   v5 (Koa)    │
        │  Node SSR   │                  │   admin + API │
        └─────────────┘                  └───────┬───────┘
                                                 │ pg :5432
                                                 ▼
                                         ┌───────────────┐
                                         │  PostgreSQL   │
                                         │     16        │
                                         │  (volume)     │
                                         └───────────────┘

Volumes (persistente):
  pgdata          → /var/lib/postgresql/data  (DB)
  strapi_uploads  → /app/public/uploads       (imagini)
  caddy_data      → /data                     (certificate TLS)
  caddy_config    → /config
```

### Stack tehnologic

| Componentă | Tehnologie | Versiune |
|---|---|---|
| Frontend | SvelteKit 2 + Svelte 5 (rune mode) | latest |
| SSR runtime | Node 20 (`adapter-node`) | 20-alpine |
| CMS | Strapi v5 | latest |
| Database | PostgreSQL | 16-alpine |
| Reverse proxy | Caddy 2 | 2-alpine |
| Container runtime | Docker Engine 24+ | — |
| Orchestrare | Docker Compose v2 | — |
| Build tooling | Vite | latest |
| Stilizare | CSS Modules + custom properties | — |
| Fonts | Self-hosted (`@fontsource/oswald`, `league-spartan`, `jetbrains-mono`) | latin + latin-ext |

### Ce *nu* face stack-ul curent

- **Email automation** — formularele de înscriere și newsletter doar **stochează** datele; nu trimit emailuri. Vezi [secțiunea 9](#9-trimitere-emailuri).
- **CDN** pentru imagini — totul vine direct din Strapi prin `/uploads/`. Pentru trafic mare, considerează Cloudflare R2 sau bunny.net.
- **CI/CD pipelines** — deploy-ul curent e manual (`git pull && docker compose up -d --build`).
- **Logging centralizat** — log-urile rămân în volumele Docker. Pentru long-term, configurează `loki`/`vector`.

---

## 2. Structura proiectului

```
site/
├── docker-compose.yml          ◀ orchestrare prod
├── Caddyfile                   ◀ reverse-proxy config
├── .env.example                ◀ template variabile
├── .env                        ◀ secrete (NU în git)
├── backup.sh                   ◀ script DB + uploads
├── MANUAL_CONTENT.md           ◀ manual content managers
├── TECHNICAL.md                ◀ acest document
│
├── frontend/                   ◀ SvelteKit app
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── svelte.config.js
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── app.css             # tokens CSS globale (Direction C)
│       ├── app.html
│       ├── hooks.server.ts     # CSP, security headers
│       ├── lib/
│       │   ├── components/
│       │   │   ├── blocks/     # 30+ blocuri pentru DynamicZone
│       │   │   ├── layout/     # Navbar, Footer, HamburgerMenu
│       │   │   └── ui/         # Image, Modal, Toast, etc.
│       │   ├── strapi.ts       # client API + getStrapiMediaUrl
│       │   └── icons/, sanitize/, stores/
│       └── routes/
│           ├── +layout.svelte  # navbar, footer, modals globale
│           ├── +layout.server.ts # carcasa (navigation, footer, theme)
│           ├── +error.svelte   # 404/500/503 cu spirit Direction C
│           ├── +page.svelte    # homepage (DynamicZone)
│           ├── stiri/, evenimente/, despre-noi/, contact/, doneaza/, …
│           └── api/preview/    # endpoint preview din Strapi
│
└── strapi/                     ◀ Strapi CMS
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    ├── tsconfig.json
    ├── favicon.png
    ├── config/
    │   ├── server.ts           # host, port, url, proxy
    │   ├── database.ts         # postgres / sqlite / mysql
    │   ├── admin.ts            # auth, preview redirect
    │   ├── middlewares.ts      # CORS, rate-limit, security
    │   └── plugins.ts          # upload, email
    ├── database/migrations/    # (gol; folosim bootstrap)
    ├── types/generated/        # types auto-generate Strapi
    ├── src/
    │   ├── index.ts            # bootstrap: permisii, seed, migrations
    │   ├── api/                # 22 content types
    │   │   ├── homepage/, contact-page/, donate-page/, …
    │   │   ├── article/, event/, team-member/, page/, section/
    │   │   ├── category/, tag/, county/, interest-area/
    │   │   └── membership-request/, newsletter-subscriber/
    │   ├── components/         # 60+ components reutilizabile
    │   │   ├── blocks/         # blocuri pentru DynamicZone
    │   │   ├── shared/         # seo, social-link
    │   │   ├── form/           # form configs
    │   │   ├── donate/, event/, footer/, navigation/, social/, theme/
    │   │   └── homepage/
    │   └── middlewares/
    │       └── rate-limit.ts   # custom IP throttle
    └── public/uploads/         # imagini (volum în prod)
```

---

## 3. Variabile de mediu

Toate definite în `site/.env` (copiat din `site/.env.example`).

### Domeniu

| Var | Exemplu | Folosit de |
|---|---|---|
| `SITE_DOMAIN` | `cusens.eu` | Caddy, frontend ORIGIN, Strapi CLIENT_URL/CORS |
| `STRAPI_DOMAIN` | `cms.cusens.eu` | Caddy, Strapi PUBLIC_URL, frontend Vite build |
| `ACME_EMAIL` | `admin@cusens.eu` | Caddy (notificări Let's Encrypt) |

### Secrete (toate generate cu `openssl rand -base64 32`)

| Var | Folosit de | Note |
|---|---|---|
| `DB_PASSWORD` | Postgres + Strapi | — |
| `APP_KEYS` | Strapi | **4 chei** comma-separated; rotația invalidează sesiunile admin |
| `API_TOKEN_SALT` | Strapi | Salt pentru API tokens; **NU** schimba după prima rulare (invalidează tokens existente) |
| `ADMIN_JWT_SECRET` | Strapi | JWT admin panel |
| `TRANSFER_TOKEN_SALT` | Strapi | Strapi transfer feature |
| `JWT_SECRET` | Strapi | JWT users-permissions |
| `ENCRYPTION_KEY` | Strapi | Encrypt internal data; **NU** schimba după prima rulare |
| `PREVIEW_SECRET` | Strapi → frontend | Validare preview din admin |

### Opționale

| Var | Default | Folosit de |
|---|---|---|
| `VITE_GTM_ID` | (gol) | Frontend Google Tag Manager ID, se „înghețează" la build time |
| `RETENTION_DAYS` | `14` | `backup.sh` |

### Variabile derivate (setate automat în `docker-compose.yml`)

Nu le pui tu în `.env`; compose-ul le construiește din cele de mai sus:

| Var | Valoare | Container |
|---|---|---|
| `PUBLIC_URL` | `https://${STRAPI_DOMAIN}` | strapi |
| `IS_PROXIED` | `true` | strapi |
| `CLIENT_URL` | `https://${SITE_DOMAIN}` | strapi |
| `CORS_ORIGIN` | `https://${SITE_DOMAIN}` | strapi |
| `FRONTEND_URL` | `https://${SITE_DOMAIN}` | strapi |
| `ORIGIN` | `https://${SITE_DOMAIN}` | frontend |
| `STRAPI_URL_INTERNAL` | `http://strapi:1337` | frontend (server-side fetch) |
| `BODY_SIZE_LIMIT` | `10485760` (10MB) | frontend |
| `VITE_STRAPI_URL` | `https://${STRAPI_DOMAIN}` | frontend (build arg) |
| `VITE_SITE_URL` | `https://${SITE_DOMAIN}` | frontend (build arg) |

⚠️ **Vite freezuie `VITE_*` în bundle la build time.** Schimbarea lor cere `docker compose build frontend` din nou — nu doar restart.

---

## 4. Dezvoltare locală

### Cerințe
- Node 20+
- npm 10+
- (opțional) Docker, dacă vrei să testezi exact ce rulează în prod

### Setup minimal

```bash
git clone <repo> && cd sens/site

# Backend (Strapi)
cd strapi
cp .env.example .env   # opțional; default-urile merg
npm install
npm run develop        # http://localhost:1337/admin
# La prima rulare: creezi admin în UI

# Frontend (Svelte) — în alt terminal
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Frontend-ul se conectează prin `PUBLIC_STRAPI_URL` (default `http://localhost:1337`).

### Setup cu Docker Compose local

Pentru a testa fix ce rulează în prod:

```bash
cd site

# /etc/hosts:
echo "127.0.0.1 cusens.local cms.cusens.local" | sudo tee -a /etc/hosts

# .env:
cat > .env <<EOF
SITE_DOMAIN=cusens.local
STRAPI_DOMAIN=cms.cusens.local
ACME_EMAIL=test@example.com
DB_PASSWORD=$(openssl rand -base64 24)
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
PREVIEW_SECRET=$(openssl rand -base64 32)
EOF

docker compose up -d --build
# Caddy emite cert internal (browserul va avertisa — OK)
# https://cms.cusens.local/admin → creezi admin
# https://cusens.local → frontend
```

### Comenzi utile

```bash
# Frontend
cd frontend
npm run dev              # dev server cu HMR
npm run build            # build prod (output: build/)
npm run preview          # rulează build-ul local
./node_modules/.bin/svelte-check --threshold error   # type check

# Strapi
cd strapi
npm run develop          # dev cu hot-reload
npm run start            # rulează prod build (necesită npm run build întâi)
npm run build            # build admin panel
npm run console          # REPL în context Strapi
```

### Network exposure pentru testare LAN/mobil

Vite are `server: { host: true }` în `vite.config.ts`, deci dev-server-ul ascultă pe toate interfețele. Strapi v5: rulează `HOST=0.0.0.0 npm run develop`.

⚠️ Pe device mobil, `localhost` în URL-uri din Strapi nu va funcționa. În dev, frontend folosește `http://<IP-PC>:1337`. Setează `PUBLIC_STRAPI_URL=http://192.168.1.X:1337` în `frontend/.env.local`.

---

## 5. Deploy în producție (VPS)

### Cerințe VPS
- 2 GB RAM minim (4 GB confortabil pentru build-ul Strapi)
- 20 GB SSD
- Ubuntu 22.04+ sau Debian 12+
- Acces root / sudo
- Porturi `80` + `443` deschise (TCP + UDP pentru HTTP/3)

### Pași

#### 1. DNS

Adaugă **2 A-records** la registrar:

```
cusens.eu       A   <IP-VPS>
cms.cusens.eu   A   <IP-VPS>
```

Verifică propagarea: `dig +short cusens.eu` → IP-ul VPS-ului.

#### 2. Instalare Docker

```bash
ssh user@<IP-VPS>
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

#### 3. Cod sursă

```bash
sudo mkdir -p /opt/sens && sudo chown $USER:$USER /opt/sens
cd /opt/sens
git clone <repo-url> .
cd site
```

#### 4. Generează secretele

```bash
cp .env.example .env

# Pentru fiecare secret, rulează:
openssl rand -base64 32

# Pune valorile în .env. APP_KEYS = 4 valori comma-separate.
nano .env
```

Verifică: `grep -c "^[A-Z_]*=$" .env` ar trebui să întoarcă **0** (zero linii goale).

#### 5. Pornește stack-ul

```bash
docker compose up -d --build
# Build durează 3–6 minute (Strapi admin + frontend SvelteKit)

docker compose ps
# Toate trebuie Up. Strapi durează ~60s să devină healthy.
```

#### 6. Verifică Caddy a obținut cert

```bash
docker compose logs -f caddy
# Caută: "certificate obtained successfully"
# Per fiecare domeniu (poate dura până la 30s)
```

Dacă Caddy întoarce `no challenge passed` → DNS încă nu propagă, sau firewall blochează `:80`.

#### 7. Creează admin Strapi

`https://cms.cusens.eu/admin` → completezi formularul de prim-admin.

#### 8. Verificare

- `https://cusens.eu` → încarcă cu cert valid
- `https://cms.cusens.eu/admin` → loghezi cu admin creat
- Upload o imagine în Strapi → URL-ul absolut e `https://cms.cusens.eu/uploads/...`
- Editezi un articol → buton **Preview** deschide `https://cusens.eu/stiri/...?secret=...`

---

## 6. Operațiuni de rutină

### Update aplicație

```bash
cd /opt/sens
git pull
cd site
docker compose up -d --build
```

DB și volumele de uploads supraviețuiesc rebuild-ului. Caddy nu se restartează decât dacă config-ul lui s-a schimbat.

Pentru update doar al unui serviciu:
```bash
docker compose up -d --build frontend
```

### Restart fără rebuild

```bash
docker compose restart frontend
docker compose restart strapi
```

### Vezi logs

```bash
docker compose logs -f --tail=200 strapi
docker compose logs -f --tail=200 frontend
docker compose logs -f --tail=200 caddy

# Toate odată
docker compose logs -f --tail=100
```

Logs sunt rotative: max **10 MB per fișier × 3 fișiere** per container (configurat în `docker-compose.yml`).

### Status și resurse

```bash
docker compose ps                  # status servicii
docker stats                       # CPU/RAM live
docker system df                   # spațiu disc folosit de Docker
df -h                              # spațiu disc total
```

### Backup manual

```bash
cd /opt/sens/site
./backup.sh                        # default: /var/backups/sens/, retenție 14 zile
RETENTION_DAYS=30 ./backup.sh      # 30 zile
./backup.sh /mnt/external          # alt director
```

### Backup automat (cron)

```bash
crontab -e
# Adaugă (rulare zilnică la 03:17):
17 3 * * * cd /opt/sens/site && ./backup.sh >> /var/log/sens-backup.log 2>&1
```

### Restore

```bash
cd /opt/sens/site

# DB
gunzip -c /var/backups/sens/db_20260426_031700.dump.gz \
  | docker compose exec -T db pg_restore -U strapi -d strapi --clean --if-exists

# Uploads
docker run --rm \
  -v site_strapi_uploads:/data \
  -v /var/backups/sens:/backup:ro \
  alpine:3 \
  sh -c "rm -rf /data/* && tar xzf /backup/uploads_20260426_031700.tar.gz -C /data"

docker compose restart strapi
```

⚠️ **Verifică numele volumului** cu `docker volume ls | grep strapi_uploads`. Compose îl prefixează cu numele directorului proiectului (default `site_strapi_uploads`).

### Migrare conținut între medii (dev → prod)

Pentru a copia conținut local pe VPS:

```bash
# Pe local:
docker compose exec -T db pg_dump -U strapi -F c strapi | gzip > db_local.dump.gz
docker run --rm -v site_strapi_uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads_local.tar.gz -C /data .

# Transfer:
scp db_local.dump.gz uploads_local.tar.gz user@vps:/tmp/

# Pe VPS:
gunzip -c /tmp/db_local.dump.gz | docker compose exec -T db pg_restore -U strapi -d strapi --clean --if-exists
docker run --rm -v site_strapi_uploads:/data -v /tmp:/backup:ro alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/uploads_local.tar.gz -C /data"
docker compose restart strapi
```

---

## 7. Conținut: cum funcționează DynamicZone & blocks

### Schema vs render

Fiecare bloc Strapi (componentă în `strapi/src/components/blocks/`) are un echivalent Svelte în `frontend/src/lib/components/blocks/`. Convenția:

```
strapi/src/components/blocks/cta-banner.json   ◀ schemă date
                                              │
                                              ▼ (numele componentei: blocks.cta-banner)
frontend/src/lib/components/blocks/CtaBanner.svelte   ◀ render
```

Map-ul nume→componentă e în `frontend/src/lib/components/DynamicZone.svelte`.

### Flow de date

1. **Browser** cere `/stiri/<slug>` → Frontend SvelteKit (`+page.ts`) face `fetch` către `STRAPI_URL_INTERNAL` (intern, prin rețeaua Docker)
2. Strapi întoarce JSON cu câmpul `content` ca array de blocks: `[{ __component: 'blocks.hero', title: '...' }, …]`
3. SvelteKit `+page.svelte` randează `<DynamicZone {content} />`
4. `DynamicZone.svelte` itererază blocurile și randează componenta corespunzătoare per `__component`
5. Imaginile primesc URL absolut prin `getStrapiMediaUrl()` — folosește `PUBLIC_STRAPI_URL` (browserul descarcă direct de pe `cms.cusens.eu/uploads/...`)

### Cum adaugi un bloc nou

1. **Strapi** — creezi `strapi/src/components/blocks/<my-block>.json`:
   ```json
   {
     "collectionName": "components_blocks_my_blocks",
     "info": { "displayName": "Blocul Meu", "icon": "star" },
     "attributes": {
       "heading": { "type": "string", "required": true },
       "items": { "type": "component", "repeatable": true, "component": "blocks.my-block-item" }
     }
   }
   ```
2. Adaugi `blocks.my-block` în lista DynamicZone-ului destinație (ex: `homepage/content-types/homepage/schema.json` → `attributes.content.components`)
3. Adaugi labels RO în `strapi/src/index.ts` → `componentLabels['blocks.my-block']`
4. **Frontend** — creezi `frontend/src/lib/components/blocks/MyBlock.svelte`
5. Înregistrezi în `frontend/src/lib/components/DynamicZone.svelte` (map `'blocks.my-block': MyBlock`)
6. `npm run develop` în Strapi (re-generează tipurile) + restart frontend

---

## 8. Endpoint-uri publice & permisii

Configurate prin `setupPublicPermissions()` în `strapi/src/index.ts`.

### Citire publică (GET, fără auth)

**Single types:**
- `/api/homepage`, `/api/contact-page`, `/api/donate-page`, `/api/inscription-page`
- `/api/newsletter-page`, `/api/community-page`, `/api/privacy-policy-page`, `/api/events-page`
- `/api/navigation`, `/api/footer`, `/api/site-theme`

**Collections:**
- `/api/articles`, `/api/categories`, `/api/tags`
- `/api/events`, `/api/team-members`
- `/api/pages`, `/api/sections`
- `/api/counties`, `/api/interest-areas`

Toate cu `find` și `findOne`. Conținutul nepublicat (`draft`) **nu** apare prin API public.

### Scriere publică (POST, fără auth — DAR rate-limited)

- `/api/membership-requests` — formular înscriere
- `/api/newsletter-subscribers` — abonare newsletter

**Rate-limit:** 10 cereri / 15 minute / IP (configurat în `strapi/src/middlewares/rate-limit.ts`).

### Auth required

- Tot ce ține de admin: `/admin/*`, `/users-permissions/*`, `/upload`
- Citire conținut nepublicat (preview cu `?status=draft`)

---

## 9. Trimitere emailuri

**Stare curentă: NU trimitem emailuri automat.**

Configurația `email` în `strapi/config/plugins.ts` e setată pentru `sendmail` (placeholder). În realitate:

- Formularul de înscriere → salvează ca `membership-request` cu status `pending`. **Nu** se trimite email nici utilizatorului, nici administratorului.
- Newsletter signup → salvează ca `newsletter-subscriber` cu `status: confirmed`. **Nu** se trimite confirmare double-opt-in.
- Contact form → folosește `mailto:` în browser ca să deschidă clientul de email al utilizatorului. **Nu** trece prin Strapi.

### Pentru a activa trimitere emailuri reale

1. Alege un provider SMTP: **Brevo** (recomandat), Resend, SendGrid, Mailgun, AWS SES
2. Instalează provider-ul Strapi:
   ```bash
   cd strapi
   npm install @strapi/provider-email-nodemailer
   ```
3. Editează `strapi/config/plugins.ts`:
   ```ts
   email: {
     config: {
       provider: 'nodemailer',
       providerOptions: {
         host: env('SMTP_HOST'),
         port: env.int('SMTP_PORT', 587),
         auth: {
           user: env('SMTP_USER'),
           pass: env('SMTP_PASS'),
         },
       },
       settings: {
         defaultFrom: 'noreply@cusens.eu',
         defaultReplyTo: 'contact@cusens.eu',
       },
     },
   },
   ```
4. Adaugă `SMTP_*` în `.env`
5. Adaugă lifecycle hook în `strapi/src/api/membership-request/content-types/membership-request/lifecycles.ts`:
   ```ts
   export default {
     async afterCreate(event) {
       const { result } = event;
       await strapi.plugins['email'].services.email.send({
         to: 'admin@cusens.eu',
         subject: `Cerere nouă de aderare: ${result.first_name} ${result.last_name}`,
         text: `Vezi în admin: https://cms.cusens.eu/admin/content-manager/...`,
       });
     },
   };
   ```

---

## 10. Securitate

### Headers (Caddy)

Setate în `Caddyfile` per-vhost:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS 1 an)
- `X-Frame-Options: DENY` (anti-clickjacking)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### CSP (Content Security Policy)

Setat în `frontend/src/hooks.server.ts`. Permite:
- Self
- TikTok embed (`tiktok.com`, `tiktokv.com`, `bytedance.com`, `bytedancecdn.com`)
- Facebook embed
- Strapi origin (pentru imagini)
- Google Tag Manager (dacă `VITE_GTM_ID` setat)

Modifică CSP-ul când adaugi un embed nou (Vimeo, Spotify etc.).

### CORS (Strapi)

Restricționat la `https://cusens.eu` în prod prin `CORS_ORIGIN` env var.

În dev (fără var setată) → `*` (permite tot).

### Rate-limiting

Custom middleware `strapi/src/middlewares/rate-limit.ts`:
- Window: 15 min
- Max: 10 cereri / IP
- Aplicat pe: `/api/membership-requests`, `/api/newsletter-subscribers`

### DB

Nu e expusă pe internet. Doar containerul Strapi se poate conecta prin rețeaua internă Docker.

### Secrete

Toate prin env vars; `.env` în `.gitignore`. Pentru rotație:
- `JWT_SECRET`, `ADMIN_JWT_SECRET` — schimbarea invalidează sesiunile active (toți admins trebuie să se relogheze)
- `APP_KEYS` — la fel
- `API_TOKEN_SALT`, `ENCRYPTION_KEY` — **NU** schimba; invalidează tokens API existente și criptarea conținutului

### Updates de securitate

```bash
# Pull noile imagini de bază (Postgres, Caddy, Node)
cd /opt/sens/site
docker compose pull
docker compose up -d --build

# Update dependențe Node (verifică breaking changes manual)
cd frontend && npm audit && npm update
cd ../strapi && npm audit && npm update
```

---

## 11. Bootstrap migrations & seed data

`strapi/src/index.ts` execută o serie de migrations idempotente la fiecare boot:

| Migration | Ce face |
|---|---|
| `setupPublicPermissions()` | Configurează permisiile public role |
| `seedData()` | Creează categorii/tag-uri/echipă demo dacă DB e gol |
| `topUpEvents()` | Adaugă evenimente sample dacă nu există |
| `topUpCounties()` | Asigură că toate cele 42 județe există |
| `topUpInterestAreas()` | Lista domenii (Mediu, Educație, Sănătate, etc.) |
| `topUpInscriptionPage()` / `topUpNewsletterPage()` / `topUpCommunityPage()` / `topUpPrivacyPolicyPage()` / `topUpEventsPage()` | Populează single types dacă goale |
| `migrateSocialFeedPlatforms()` | Backfill platforme social-feed |
| `migrateHeroFeaturedLink()` | Adaugă câmpuri auto_next_event/meta_text pe hero homepage |
| `migrateWordCarouselBackground()` | Update culoare word-carousel green→lime |
| `migrateAboutTeamSection()` | Înlocuiește card-grid static cu TeamGrid dinamic |
| `migrateArticleBodyToContent()` | Articol: rich text body → DynamicZone content |
| `migrateContactRebrand()` | Email-uri default partidulsens.ro → cusens.eu |
| `configureAdminLabels()` | Labels RO în admin pentru toate content types/components |

**Toate sunt idempotente** — pot rula de câte ori și nu duplică date.

---

## 12. Performanță & optimizare

### Frontend

- **Adapter Node** cu compresie integrată; Caddy adaugă gzip + zstd
- **Image lazy loading** prin `<Image>` component (`frontend/src/lib/components/ui/Image.svelte`)
- **Fonturi self-hosted** doar subset latin + latin-ext (acoperă diacriticele române)
- **Hashed assets** în `_app/immutable/` — cache forever
- **SSR cu `+layout.server.ts`** la rădăcină pentru navigation/footer/theme — share-uite între rute

### Strapi

- Răspunde rapid pentru `find` operations cu pagination default
- Pentru optimizare avansată: index-uri Postgres custom, dar rar necesare la trafic <100k vizitatori/lună

### Volume traffic prag

- Stack-ul curent e dimensionat pentru ~50k vizitatori unici / lună fără probleme
- Peste asta, considerează:
  - CDN pentru `/uploads/` (Cloudflare R2 + Strapi `@strapi/provider-upload-aws-s3`)
  - Cache HTTP la nivel Caddy pentru `/api/*` GET

---

## 13. Troubleshooting

| Simptom | Cauză probabilă | Fix |
|---|---|---|
| Caddy: `no challenge passed` | DNS nu propagă, firewall blochează :80 | `dig +short cusens.eu`, deschide :80 în firewall |
| `https://cms.cusens.eu/admin` → 502 | Strapi încă pornește | Așteaptă 60s (start_period); `docker compose logs -f strapi` |
| Upload imagine → URL `http://localhost:1337/...` | `PUBLIC_URL` lipsește | Verifică `.env` și `docker compose config` |
| Frontend stale după edit Strapi | SvelteKit cache local | `docker compose restart frontend` |
| `docker compose up` OOM | RAM <2GB | Adaugă swap: `fallocate -l 2G /swapfile && mkswap /swapfile && swapon /swapfile` |
| Logs cresc rapid | Rotație nedeclanșată | Verifică `docker inspect <container> --format '{{.HostConfig.LogConfig}}'` |
| Backup eșuează cu „no such volume" | Numele proiectului diferit | `docker volume ls`; setează `COMPOSE_PROJECT_NAME=site` în `.env` |
| Build Strapi foarte lent | npm cache nesetat | `docker builder prune` apoi rebuild |
| Cert expirat | Caddy nu se poate reînnoi | Verifică :443 deschis, `docker compose logs caddy` |
| `svelte-check` erori în dev | TypeScript out-of-sync | `cd frontend && npm install && npm run prepare` |

### Probleme cu Postgres

```bash
# Conectare la DB
docker compose exec db psql -U strapi -d strapi

# Backup manual
docker compose exec db pg_dump -U strapi strapi > local_dump.sql

# Verifică spațiu DB
docker compose exec db psql -U strapi -d strapi -c "SELECT pg_size_pretty(pg_database_size('strapi'));"

# Vezi conexiuni active
docker compose exec db psql -U strapi -d strapi -c "SELECT * FROM pg_stat_activity;"
```

### Probleme cu Strapi

```bash
# Run console în context Strapi (REPL Node)
docker compose exec strapi npm run console

# Re-bootstrap forțat (re-rulează migrations)
docker compose restart strapi

# Reset admin password (dacă uitat)
docker compose exec strapi npm run strapi admin:reset-user-password -- --email=admin@cusens.eu --password=newpass123
```

---

## 14. Monitoring opțional

```bash
# Pornește Uptime Kuma (legat la loopback, accesibil prin SSH tunnel)
docker compose --profile monitoring up -d

# Pe machine local:
ssh -L 3001:127.0.0.1:3001 user@vps
# deschide http://localhost:3001 în browser
```

Pentru monitoring mai serios:
- **Logs**: Loki + Promtail + Grafana
- **Metrici**: Prometheus + cAdvisor + Grafana
- **Alerte**: Alertmanager → Slack/email

---

## 15. Limitări cunoscute

| Limitare | Workaround |
|---|---|
| Imagini max 10MB upload | Crește `sizeLimit` în `strapi/config/plugins.ts` |
| Body request max 200MB Caddy | Crește `request_body { max_size }` în `Caddyfile` |
| Fără email automation | Vezi [secțiunea 9](#9-trimitere-emailuri) |
| Fără CDN — uploads servite direct | Configurează provider-ul S3 Strapi |
| Fără CI/CD | Adaugă GitHub Action: build → push registry → SSH deploy |
| Single-region (un VPS) | Pentru HA: Postgres replicat (Patroni) + Strapi clusterizat |
| Locale doar `ro` | Strapi suportă i18n; activează plugin-ul + traduceri UI Svelte |

---

## 16. Roadmap tehnic sugerat

**Prioritate 1 (înainte de lansare):**
- [ ] Activează Brevo SMTP pentru emailuri form-uri
- [ ] Configurează backup off-site (rsync nightly la S3 sau B2)
- [ ] CI/CD: GitHub Action care testează `svelte-check` + `npm run build` la fiecare PR

**Prioritate 2 (post-lansare, primele luni):**
- [ ] Cloudflare DNS în față pentru DDoS protection
- [ ] Move uploads la R2 (provider Strapi S3)
- [ ] Monitoring: Sentry pentru erori frontend + Strapi
- [ ] Newsletter double-opt-in cu Brevo lists

**Prioritate 3 (scaling):**
- [ ] CDN pentru `/uploads/`
- [ ] Postgres replication
- [ ] Multi-region Caddy + Anycast DNS

---

## 17. Cui te adresezi

- **Issues code** — repository GitHub: deschide issue
- **Outage / urgență** — contact tehnician (în chat-ul echipei)
- **Securitate** — security@cusens.eu

---

**Last updated:** 2026-04-26
