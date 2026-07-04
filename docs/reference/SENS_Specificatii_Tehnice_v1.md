# PARTIDUL SENS — Specificații Tehnice & Wireframes

**Sănătate • Educație • Natură • Sustenabilitate**

> Website & Mobile App — Proiect de Redesign Complet
> Versiunea 1.1 — Februarie 2026 | Document Confidențial

---

## 1. Rezumat Executiv

Acest document definește specificațiile tehnice complete pentru redesign-ul website-ului Partidului SENS (www.cusens.eu), incluzând arhitectura tehnică, structura paginilor, funcționalitățile utilizatorilor, strategia de caching CDN și planul de implementare.

- **Obiectiv:** Construirea unei platforme digitale moderne, mobile-first, care servește atât ca website public cât și ca hub pentru membrii și simpatizanții partidului.
- **Audiență primară:** Tineri 18-35 ani (conform sondajelor INSCOP, SENS este a doua opțiune la categoria 18-29 ani cu 16%).
- **Platforme țintă:** Web responsive + native app wrapper (iOS & Android) via Capacitor.
- **Afiliere europeană:** SENS este membru al European Greens și al grupului Verzi/ALE din Parlamentul European. Această afiliere trebuie reflectată vizual pe site (footer, pagina Despre Noi).

---

## 2. Arhitectură & Stack Tehnologic

### 2.1. Stack Overview

| Componentă | Tehnologie | Justificare |
|---|---|---|
| Frontend | SvelteKit | SSR/SSG nativ, performanță excelentă, bundle size mic |
| CMS (Backend) | Strapi v5 | Headless, open-source, REST + GraphQL, LDAP-ready |
| Bază de date | PostgreSQL 16 | Robustă, scalabilă, compatibilitate completă Strapi |
| Native Wrapper | Capacitor (Ionic) | Web-first approach, acces la API-uri native, build iOS/Android |
| CDN & Security | Cloudflare (Free/Pro) | Edge caching, DDoS protection, SSL, Page Rules, Workers |
| Hosting CMS | VPS (Hetzner/DigitalOcean) | Cost-eficient, Docker-ready, GDPR-compliant (EU datacenter) |
| Hosting Frontend | Cloudflare Pages / Vercel | Deploy automat din Git, edge network, free tier generos |
| Email/Newsletter | Listmonk (self-hosted) sau Brevo | GDPR-compliant, cost-eficient, API integration |
| Procesare plăți | Netopia / Stripe | Donații online, conformitate CMF, card & transfer bancar |
| Autentificare | Strapi Auth + OAuth2 (Google, Facebook) | JWT tokens, extensibil cu LDAP în viitor |
| Monitorizare | Plausible Analytics (self-hosted) | Privacy-first, GDPR-compliant, fără cookies |

### 2.2. Diagrama Arhitecturală

Arhitectura urmează modelul JAMstack extins cu SSR on-demand:

```
[Utilizator/Browser] ──► [Cloudflare CDN Edge]
     ├── Cache HIT → Servire directă (< 50ms)
     └── Cache MISS → [SvelteKit on Cloudflare Pages/Vercel]
                         ├── SSG pages (static, pre-built)
                         └── SSR pages → [Strapi API + PostgreSQL]

[Capacitor Native Shell] ──► [WebView → same SvelteKit app]
     └── Native APIs: Push Notifications, Camera, Share, Deep Links
```

### 2.3. SvelteKit — Detalii Frontend

SvelteKit oferă avantaje majore pentru acest proiect prin compilare la build-time, rezultând în JavaScript minimal trimis către client. Structura de routing file-based se aliniază perfect cu sitemap-ul planificat.

**Rendering Strategy:** Hybrid SSG + SSR

- Pagini statice (Despre Noi, Contact, Program Politic): Pre-rendered la build time (SSG)
- Pagini dinamice (Știri, Dashboard Membru, Evenimente): Server-Side Rendered (SSR) cu revalidare
- Componente interactive (Formular Donații, Social Feed): Client-side hydration

**Dependențe cheie:**

- `@sveltejs/adapter-auto` sau `adapter-cloudflare` (deploy pe Cloudflare Pages)
- `@capacitor/core` + `@capacitor/cli` (native wrapper)
- `svelte-i18n` (dacă se adaugă multilingvism)
- `sveltekit-superforms` (validare formulare)
- `mdsvex` (dacă se doresc articole Markdown din Strapi)

### 2.4. Strapi v5 — Content Architecture

Strapi va gestiona toate tipurile de conținut prin Collections și Single Types:

| Content Type | Tip | Câmpuri principale |
|---|---|---|
| Article (Știri) | Collection | title, slug, excerpt, body (Rich Text), cover_image, category, author, published_at, SEO fields |
| Category | Collection | name, slug, color, articles (inverse) |
| Tag | Collection | name, slug |
| Event (Evenimente) | Collection | title, date, location, description, max_participants, event_type, cover_image, attendees |
| TeamMember | Collection | name, role, bio, photo, social_links, display_order, is_leadership |
| Page (Pagini statice) | Collection | title, slug, content (Dynamic Zone), SEO fields |
| Donation | Collection | amount, donor_name, CNP (encrypted), date, payment_method, status, CMF_reference |
| MemberProfile | Collection | user (relation), membership_type, card_number, filial, joined_date, status |
| VolunteerAction | Collection | title, description, date, location, required_volunteers, hours_credited, status |
| NewsletterSubscriber | Collection | email, name, consent_date, source, status |

### 2.5. Capacitor — Native App Strategy

Capacitor va wrapa aplicația SvelteKit existentă într-un WebView nativ, adăugând acces la funcționalități native:

| Funcționalitate Nativă | Plugin Capacitor | Utilizare |
|---|---|---|
| Push Notifications | @capacitor/push-notifications | Alerte știri, evenimente, call-to-action campanii |
| Share | @capacitor/share | Partajare articole pe social media |
| Camera | @capacitor/camera | Upload foto profil, documentare evenimente |
| Local Storage | @capacitor/preferences | Cache offline, setări utilizator |
| Deep Links | @capacitor/app | Deschidere directă articole din link-uri externe |
| Biometric Auth | @capacitor-community/biometric-auth | Login rapid cu fingerprint/Face ID |
| Badge | @capacitor/badge | Notificări necitite pe icon app |

Build-ul nativ se va face prin GitHub Actions CI/CD, generând `.ipa` (iOS) și `.apk`/`.aab` (Android) automat la fiecare release tag.

---

## 3. Sitemap & Structura Paginilor

### 3.1. Sitemap Complet

```
/                               → Acasă (Landing Page)
/stiri                          → Lista știri (paginată)
/stiri/[slug]                   → Articol individual
/despre-noi                     → Despre Partidul SENS
/despre-noi/echipa              → Echipa & Conducere
/despre-noi/program-politic     → Program Politic
/despre-noi/statut              → Statutul Partidului
/despre-noi/manifest            → Manifestul Generației Egalitate
/contact                        → Formular contact + date filiale
/evenimente                      → Lista evenimente (viitoare + trecute, filtre)
/evenimente/[slug]              → Eveniment individual (detalii, înscriere, reminder, social posts)
/contact                        → Formular contact + newsletter + date filiale
/inscrie-te                     → Formular înscriere membru
/doneaza                        → Pagina donații
/evenimente                     → Calendar evenimente
/evenimente/[slug]              → Eveniment individual
/newsletter                     → Pagina abonare newsletter
/politica-confidentialitate     → GDPR & Privacy Policy

── Zona Autentificată (Membri) ──
/auth/login                     → Login (email + OAuth)
/auth/register                  → Înregistrare simpatizant
/cont                           → Dashboard membru
/cont/profil                    → Profil & Card digital
/cont/evenimente                → Evenimentele mele
/cont/voluntariat               → Acțiuni voluntariat
/cont/donatii                   → Istoricul donațiilor mele
/cont/social                    → Social feed agregat
```

### 3.2. Descrierea Detaliată a Paginilor Principale

#### ACASĂ (Landing Page)

Pagina principală trebuie să comunice instant identitatea SENS și să ofere multiple call-to-action-uri. Layout-ul este conceput pentru impact vizual maxim pe mobile.

**Secțiuni (top → bottom):**

1. **Hero Section:** Headline puternic + subheadline + 2 CTA buttons ("Înscrie-te" și "Donează") + background video/imagine cu overlay verde
2. **Bare de valori:** 4 carduri clicabile (Sănătate, Educație, Natură, Sustenabilitate) — la click deschid modal cu detalii extinse + link către Programul Politic complet
3. **Din Programul Nostru:** Secțiune cu 3-6 propuneri concrete din programul politic (sănătate mintală, tranziție energetică, spații verzi, educație climatică, etc.) cu link către programul complet
4. **Ultimele Știri:** Carousel — pe mobile afișează un singur articol cu imagine mărită + swipe, pe desktop grid de 3 carduri. Click pe articol deschide pagina individuală de știre.
4. **Evenimente Următoare:** Max 3 carduri cu dată, locație, buton înregistrare
5. **Social Media Feed:** Ultimele postări agregate din Instagram, X, Facebook, TikTok
6. **Newsletter CTA:** Input email + buton subscribe, text convingător
7. **Footer:** Logo, link-uri rapide, social media, date legale (CMF), GDPR links

#### ȘTIRI

Lista de articole paginată cu filtrare pe categorii și funcționalitate de căutare.

- Filtru categorii: Tabs orizontale (Toate, Comunicate, Analize, Acțiuni, Media)
- Filtru calendar: Buton calendar lângă search — deschide mini-calendar cu zilele care au articole evidențiate, permite filtrare pe dată/interval
- Carduri articole: Thumbnail, titlu, excerpt (max 120 caractere), dată, autor, categorie badge
- Paginare: Infinite scroll pe mobile, paginare numerică pe desktop
- Articol individual: Hero image full-width, breadcrumb (Acasă / Știri / Categorie), titlu prominent, metadate, body rich text, butoane social share (Facebook, X, LinkedIn, WhatsApp, Copiază link) atât sus cât și jos, taguri, secțiune "Articole similare"

#### EVENIMENTE (/evenimente)

Pagina de evenimente combină evenimentele viitoare cu cele trecute, oferind filtrare și acces la detalii:

**Lista evenimente:**
- Tabs „Viitoare" / „Trecute" — switch-ul schimbă sursa datelor
- Filtru locație: pills orizontale generate dinamic din locațiile evenimentelor (Toate locațiile, București, Cluj-Napoca, Online, etc.)
- Fiecare card: dată (zi + lună) evidențiată vizual, badge tip eveniment (Dezbatere, Acțiune, Marș, Online — cod de culoare per tip), titlu, locație, oră, locuri disponibile
- Evenimentele trecute au badge „Încheiat" și dată gri

**Eveniment individual (/evenimente/[slug]):**
- Header: imagine full-width + breadcrumb (Acasă / Evenimente / Titlu)
- Badge tip eveniment + badge status (Încheiat dacă e cazul)
- Titlu mare, prominent
- Info box cu: dată + oră (icon calendar), locație (icon pin), capacitate (icon users)
- Descrierea completă a evenimentului
- **Pentru evenimente viitoare:**
  - Buton „Mă înscriu la eveniment" (CTA primar)
  - Buton „Adaugă în calendar" — generează fișier .ics descărcabil sau deep link Google Calendar / Apple Calendar
  - Buton „Activează reminder" — setează notificări push la 24h și 1h înainte
  - Text informativ: „Vei primi o notificare cu 24h și 1h înainte de eveniment"
- **Pentru evenimente trecute:**
  - Secțiune „Postări de la acest eveniment" — afișează postări reale din social media (Instagram, Facebook, X) legate de eveniment, cu media, text, engagement
  - Legătura cu social media se face prin tag-ul evenimentului sau referința manuală din Strapi (câmp `social_posts` pe Event, Component repeatable cu platform + url + embed data)

**Notificări și Calendar — implementare tehnică:**
- Calendar: endpoint `GET /api/events/:id/ical` returnează fișier .ics standard
- Reminder push: `POST /api/events/:id/remind` — backend-ul stochează preferința și trimite notificări via Firebase Cloud Messaging (web) sau native push (Capacitor)
- Permisiuni: notificările necesită autentificare; adăugarea în calendar funcționează și pentru vizitatori

#### CONTACT

Pagina de contact combină formularul de contact cu înscrierea la newsletter:

- **Formular contact:** Nume, email, subiect, mesaj (textarea), buton trimite
- **Secțiune newsletter:** Nume (opțional), email, consimțământ GDPR, buton abonează-te — evidențiată vizual cu fundal orange deschis
- **Date de contact:** Email contact, sediu central, program de lucru

#### DESPRE NOI

Structură de sub-pagini cu navigare laterală (desktop) sau accordion (mobile):

- **Prezentare generală:** Misiune, viziune, valori — text + infografice
- **Echipa:** Grid de carduri cu foto, nume, rol, bio scurt, link social media
- **Program Politic:** Viewer PDF integrat sau breakdown pe secțiuni cu iconuri
- **Statut:** Accordion cu capitolele statutului
- **Manifest:** Full-page design editorial cu citate highlight

#### ÎNSCRIE-TE

Formular multi-step cu progress indicator:

1. **Step 1 — Date personale:** nume, prenume, email, telefon, data nașterii
2. **Step 2 — Adresă:** județ, localitate, adresă completă (pentru alocarea la filiala locală)
3. **Step 3 — Motivație:** textarea + checkbox-uri interese (voluntariat, comunicare, policy, etc.)
4. **Step 4 — Consimțământ:** GDPR + Declarație (nu face parte din alt partid, nu a promovat extremism)
5. **Step 5 — Confirmare:** next steps (vei fi contactat pentru interviul de admitere)

> **Notă:** Conform statutului SENS, admiterea necesită interviu. Formularul online inițiază procesul.

#### DONEAZĂ

Pagina de donații trebuie să respecte legislația CMF din România:

- Sume predefinite: Butoane rapide (25 RON, 50 RON, 100 RON, 200 RON) + sumă custom
- Tipuri donație: Unică sau recurentă (lunară)
- Date donator: Nume complet, CNP (obligatoriu legal pt donații politice), email
- Metode plată: Card (Netopia/Stripe), transfer bancar (afișare IBAN + generare referință)
- Transparență: Secțiune "Unde merg banii tăi" cu breakdown vizual
- Conformitate: Disclaimer CMF, număr mandatar financiar, limite legale afișate

#### ZONA DE MEMBRU (Dashboard)

Interfața autentificată este hub-ul principal pentru membrii și simpatizanții SENS:

- **Dashboard (Home):** Bine ai venit + card digital de membru + upcoming events + acțiuni recomandate
- **Profil & Card Digital:** Informații personale editabile + card digital (generabil PNG/PDF) cu QR code, număr membru, dată înregistrare
- **Evenimente:** Calendar vizual cu evenimentele la care ești înscris, înscriere la noi evenimente, reminder-uri
- **Voluntariat:** Lista acțiunilor disponibile, istoricul participărilor, "ore de voluntariat" acumulate, badge-uri
- **Donații:** Istoricul donațiilor personale, descărcare confirmare, setup donație recurentă
- **Social Feed:** Feed agregat din rețelele sociale ale partidului, filtrabil pe platformă

---

## 4. Strategia Cloudflare CDN & Caching

Cloudflare va acționa ca reverse proxy între utilizatori și infrastructura SENS, oferind caching, securitate și performanță.

### 4.1. Configurare DNS & SSL

- Domeniu principal: `cusens.eu` (sau `sens.ro` dacă e disponibil) cu Cloudflare ca nameserver
- SSL: Full (Strict) — certificat origin pe server + certificat edge Cloudflare
- HSTS: Activat cu `max-age=31536000`, `includeSubDomains`
- Subdomenii: `api.cusens.eu` (Strapi), `app.cusens.eu` (dacă se separă SPA-ul)

### 4.2. Cache Rules

| Pattern URL | Cache Level | TTL | Observații |
|---|---|---|---|
| `/*.css, /*.js, /*.woff2` | Cache Everything | 1 an | Assets statice, cache-busted prin hash-uri |
| `/stiri/*` | Standard | 5 min edge, 1h browser | Articolele se pot actualiza; revalidare frecventă |
| `/despre-noi/*, /program-politic` | Cache Everything | 1 săptămână | Conținut rar modificat |
| `/api/*` | Bypass Cache | — | API Strapi — nu se cachează la edge |
| `/cont/*, /auth/*` | Bypass Cache | — | Zone autentificate — niciodată cached |
| `/doneaza` | Bypass Cache | — | Pagina de donații — mereu fresh |
| `/images/*, /media/*` | Cache Everything | 30 zile | Imagini optimizate, WebP auto-convert |

### 4.3. Cloudflare Workers (Edge Computing)

Workers pot rula logic la edge pentru funcționalități avansate:

- **A/B Testing:** Servire variante diferite de landing page pentru optimizare conversie
- **Geo-redirect:** Redirect utilizatori din diaspora către versiunea EN (dacă se implementează)
- **Bot Protection:** Rate limiting pe formularele de înscriere și donații
- **Image Optimization:** Resize on-the-fly via Cloudflare Images (plan Pro)
- **API Caching Inteligent:** Cache Strapi responses cu stale-while-revalidate pattern

### 4.4. Security Headers & Protection

- **WAF:** Ruleset OWASP activat, reguli custom pentru forms
- **Rate Limiting:** Max 10 req/min pe `/api/auth/*`, max 5 req/min pe `/api/donations`
- **DDoS Protection:** Always-on (gratuit pe toate planurile)
- **Content Security Policy:** Strict CSP header via Transform Rules
- **Bot Fight Mode:** Activat pentru reducerea scraping-ului

### 4.5. Cloudflare Plan Recomandat

Pentru începutul proiectului, planul **Free** este suficient. Upgrade la **Pro** ($20/mo) se recomandă când:

- Traficul depășește 100K vizite/lună consistent
- Se dorește Image Optimization (Polish + WebP auto)
- Se necesită WAF rules avansate (> 5 custom rules)
- Se dorește Cache Analytics detaliat

---

## 5. Design System & UI Guidelines

### 5.1. Identitate Vizuală

Se păstrează identitatea vizuală existentă SENS cu modernizare și sistematizare:

| Element | Valoare | Utilizare |
|---|---|---|
| Primary Green Dark | `#003827` | Headere, text principal, fundal navbar |
| Primary Green Mid | `#004B24` | Hover states, accente secundare |
| Accent Green Leaf | `#49BF07` | Elemente interactive, succese, badge-uri |
| Accent Orange | `#D89302` | CTA buttons, highlights, notification badges |
| Background Light | `#F7FAF6` | Fundal pagini, carduri |
| Text Dark | `#1A1A1A` | Body text principal |
| Text Muted | `#6B7280` | Text secundar, metadate |
| Error Red | `#DC2626` | Erori formulare, alerte |
| White | `#FFFFFF` | Fundal carduri, spații libere |

### 5.2. Tipografie

| Rol | Font | Weight | Dimensiune (mobile / desktop) |
|---|---|---|---|
| Display / Hero | Cabinet Grotesk (sau Satoshi) | Bold 700 | 32px / 56px |
| Heading H1 | Cabinet Grotesk | Bold 700 | 28px / 40px |
| Heading H2 | Cabinet Grotesk | Semibold 600 | 22px / 32px |
| Heading H3 | Cabinet Grotesk | Semibold 600 | 18px / 24px |
| Body | Inter (sau Instrument Sans) | Regular 400 | 16px / 18px |
| Body Small | Inter | Regular 400 | 14px / 14px |
| Button | Inter | Medium 500 | 14px / 16px |
| Caption | Inter | Regular 400 | 12px / 12px |

### 5.3. Spacing & Grid

- Grid System: CSS Grid cu 12 coloane pe desktop, 4 coloane pe mobile
- Gutter: 16px mobile, 24px tablet, 32px desktop
- Max-width container: 1280px
- Spacing scale (rem): 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8
- Border radius: 8px (carduri), 12px (butoane mari), 24px (badge-uri), 50% (avatare)

### 5.4. Componente UI Cheie

- **Navbar:** Sticky, glassmorphism pe scroll. Pe mobile: hamburger (stânga) + logo + buton profil/login (dreapta, icon user). Pe desktop: logo + link-uri navigare + buton Înscrie-te + icon profil/login. Hamburger menu full-screen cu navigare ierarhică, sub-meniuri expandabile, CTA buttons, link European Greens.
- **Carduri:** Shadow subtle, hover lift effect, thumbnail aspect ratio 16:9
- **Butoane:** Primary (orange, rounded), Secondary (green outline), Ghost (text only)
- **Forms:** Floating labels, inline validation, progress stepper pentru multi-step
- **Toast Notifications:** Bottom-right, auto-dismiss, stacked
- **Modal:** Backdrop blur, slide-up pe mobile, centered pe desktop
- **Loading States:** Skeleton screens (nu spinner-uri)
- **Accessibility Widget:** Buton flotant (bottom-right) care deschide panoul de accesibilitate — opțiuni: mărire font, contrast ridicat, dezactivare animații, mod dyslexia-friendly. Persistent pe toate paginile.

---

## 6. Zona de Utilizator — Detalii Funcționale

### 6.1. Roluri & Permisiuni

| Rol | Descriere | Permisiuni Cheie |
|---|---|---|
| Vizitator | Utilizator neautentificat | Citire conținut public, subscribe newsletter, donație |
| Simpatizant | Cont creat, neînscris în partid | Vizitator + profil, calendar evenimente, social feed |
| Membru | Membru oficial acceptat | Simpatizant + card digital, voluntariat, vot intern |
| Moderator | Membru cu drepturi extra | Membru + moderare conținut, gestionare evenimente locale |
| Admin Filială | Conducere filială | Moderator + gestionare membri filială, rapoarte locale |
| Admin Național | Conducere centrală | Acces complet CMS, gestionare globală |

### 6.2. Fluxul de Autentificare

Autentificarea va folosi JWT tokens gestionate de Strapi, cu suport OAuth2:

- **Login email/parolă:** Form clasic cu forgot password flow
- **OAuth2:** Google și Facebook (via Strapi providers) — crează cont de simpatizant automat
- **Magic Link:** Opțional — login fără parolă via email (util pentru mobile)
- **Biometric (app nativă):** Face ID / Fingerprint via Capacitor plugin
- **Token refresh:** Silent refresh via httpOnly cookies (nu localStorage pentru securitate)
- **Session management:** Max 3 sesiuni simultane, opțiune de logout din toate dispozitivele

```
JWT Flow:
1. POST /api/auth/local → { jwt, user }
2. Store: Web = httpOnly cookie (secure, SameSite=Strict)
         Mobile = @capacitor/preferences (encrypted)
3. Requests: Authorization: Bearer <jwt>
4. Refresh: POST /api/auth/refresh-token (silent)
5. Logout: POST /api/auth/logout → invalidate + clear

OAuth2 Flow (Google/Facebook):
1. Frontend redirect → /api/connect/google
2. Google OAuth consent screen
3. Callback → /api/auth/google/callback?code=...
4. Strapi: validează code → creează/update user (Simpatizant) → returnează JWT
5. Frontend stochează JWT → redirect la /cont
```

### 6.3. Card Digital de Membru

Fiecare membru va primi un card digital vizibil în dashboard și descărcabil:

- **Design:** Card format 85.6 × 54mm, culorile SENS, logo, foto membru
- **Informații:** Nume, prenume, număr membru, filiala, data înscrierii
- **QR Code:** Link către endpoint de verificare publică (confirmă statutul de membru activ)
- **Export:** Descărcare ca imagine PNG sau adăugare în Apple Wallet / Google Wallet

### 6.4. Sistemul de Voluntariat

- **Acțiuni disponibile:** Lista cu filtrare (județ, dată, tip acțiune)
- **Înscriere:** Buton rapid + confirmare email
- **Check-in:** QR code scan la locație (via app nativă) sau confirmare manuală de organizator

> **TODO — Sistem de gamification avansat:** Simpla acumulare de ore de voluntariat și badge-uri nu este suficientă ca mecanism de motivare. Trebuie investigat un sistem de gamification mai sofisticat care să includă: nivele de progresie (nu doar badge-uri punctuale), recompense tangibile (ex: acces prioritar la evenimente, merchandise, recunoaștere publică), competiții pe echipe/filiale cu obiective comune, streak-uri pentru participare constantă, și posibil un sistem de puncte convertibile. Se recomandă o fază de research dedicată cu benchmarking pe alte organizații civice/politice europene care au implementat gamification cu succes. Această decizie impactează schema `MemberProfile.gamification_data` din Strapi.

### 6.5. Social Media Feed

Feed agregat din rețelele sociale SENS, înlocuind forumul intern:

- **Platforme:** Instagram, X (Twitter), Facebook, TikTok, YouTube
- **Filtrare:** Per platformă sau toate
- **Agregare:** Cron job la 15 minute care pull-ează din API-urile sociale
- **Afișare:** Carduri native per platformă (cu engagement metrics)
- **Cache:** Cloudflare cache 5 min pe endpoint-ul `/api/social-feed`

---

## 7. Strapi API — Structura Detaliată

### 7.1. REST API Endpoints

**Base URL:** `https://api.cusens.eu/api`
**Auth:** Bearer JWT Token | **Format:** JSON

#### 📰 Articles (Public)

| Method | Endpoint | Descriere | Parametri |
|---|---|---|---|
| GET | `/articles` | Lista paginată + filtre | `?pagination[page]=1&pagination[pageSize]=10&filters[category][slug][$eq]=comunicate&sort=publishedAt:desc&populate=cover_image,category,author` |
| GET | `/articles/:slug` | Articol complet | `?populate=deep` |

#### 📅 Events (Public + Auth)

| Method | Endpoint | Descriere | Parametri |
|---|---|---|---|
| GET | `/events` | Evenimente viitoare | `?filters[start_date][$gte]=today&sort=start_date:asc` |
| POST | `/events/:id/register` | 🔒 Înregistrare eveniment | Auth required — custom controller |
| DELETE | `/events/:id/unregister` | 🔒 Anulare | Auth required |

#### 💰 Donations (Custom Controller)

| Method | Endpoint | Descriere | Parametri |
|---|---|---|---|
| POST | `/donations` | Inițiază donație | Body: `{amount, donor_name, donor_cnp, donor_email, payment_method, is_recurring}` |
| POST | `/donations/webhook` | Callback Netopia/Stripe | Verifică semnătura, update status |
| GET | `/donations/my` | 🔒 Donațiile mele | Filtrat pe user curent |

#### ✍️ Membership (Custom Controller)

| Method | Endpoint | Descriere | Parametri |
|---|---|---|---|
| POST | `/membership/apply` | 🔒 Cerere înscriere | Body: multi-step form data |
| GET | `/membership/status` | 🔒 Status cerere | — |
| GET | `/membership/card` | 🔒 Generare card digital | Returnează PNG/PDF |

#### 🤝 Volunteer (Custom Controller)

| Method | Endpoint | Descriere | Parametri |
|---|---|---|---|
| GET | `/volunteer-actions` | Acțiuni disponibile | `?filters[status][$eq]=upcoming` |
| POST | `/volunteer-actions/:id/join` | 🔒 Înscriere | — |
| POST | `/volunteer-actions/:id/checkin` | 🔒 Check-in QR | — |
| GET | `/volunteer-actions/my-stats` | 🔒 Ore + badge-uri | — |

#### 📬 Newsletter (Public, rate-limited)

| Method | Endpoint | Descriere | Parametri |
|---|---|---|---|
| POST | `/newsletter/subscribe` | Abonare | Body: `{email, name?}` — double opt-in |
| POST | `/newsletter/unsubscribe` | Dezabonare | `?token=...` (din email) |

#### 📱 Social Feed (Public, cached)

| Method | Endpoint | Descriere | Parametri |
|---|---|---|---|
| GET | `/social-feed` | Postări agregate | `?platform=all\|instagram\|twitter\|facebook\|tiktok&limit=10` |

#### 🔐 Auth

| Method | Endpoint | Descriere | Parametri |
|---|---|---|---|
| POST | `/auth/local` | Login email/parolă | → JWT + refresh token |
| POST | `/auth/local/register` | Înregistrare simpatizant | Body: `{email, password, username}` |
| GET | `/auth/:provider/callback` | OAuth Google/Facebook | Auto-create user |
| GET | `/users/me` | 🔒 Profil curent | `?populate=role,memberProfile` |
| PUT | `/users/me` | 🔒 Update profil | — |

### 7.2. Entity Relationships (ERD)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Category   │────<│   Article    │>────│  TeamMember  │
│   (1:M)      │     │              │(M:1)│              │
└──────────────┘     │  ┌─ seo      │     └──────────────┘
                     │  └─ tags ────│──── Tag (M:M)
┌──────────────┐     └──────────────┘
│    Event     │>──── User (M:M attendees)
│              │
└──────────────┘     ┌──────────────┐
                     │    User      │──── MemberProfile (1:1)
┌──────────────┐     │  (Strapi)    │──── Donation (1:M)
│  Volunteer   │>────│              │
│  Action(M:M) │     └──────────────┘
└──────────────┘
┌──────────────┐     ┌──────────────┐
│    Page      │     │  Newsletter  │    (independent)
│ (DynZone)    │     │  Subscriber  │
└──────────────┘     └──────────────┘
```

**Detalii relații:**

| From | Type | To | Descriere |
|---|---|---|---|
| Article | Many-to-One | Category | Fiecare articol are o categorie |
| Article | Many-to-One | TeamMember | Autor articol |
| Article | Many-to-Many | Tag | Taguri multiple |
| Event | Many-to-Many | User | Participanți (attendees) |
| User | One-to-One | MemberProfile | Profil membru |
| User | One-to-Many | Donation | Istoric donații |
| VolunteerAction | Many-to-Many | User | Voluntari înscriși |

### 7.3. Shared Components

```
shared.seo:          meta_title (60ch), meta_description (160ch), og_image (1200x630), canonical_url, no_index
shared.social-link:  platform (facebook|instagram|twitter|tiktok|youtube|linkedin), url

blocks.hero:           title, subtitle, cta_text, cta_link, background_image
blocks.text-block:     body (Rich Text), alignment
blocks.cta-banner:     title, description, button_text, button_link, bg_color
blocks.image-gallery:  images (Media multiple), layout (grid|carousel)
blocks.accordion:      items[title, content]
blocks.quote:          text, author, role
blocks.video-embed:    url (YouTube/Vimeo), caption
blocks.stats-counter:  items[number, label, icon]
```

### 7.4. RBAC Matrix

| Acțiune | Public | Simpatizant | Membru | Moderator | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Citire conținut public | ✅ | ✅ | ✅ | ✅ | ✅ |
| Donează | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profil personal | — | ✅ | ✅ | ✅ | ✅ |
| Înscriere evenimente | — | ✅ | ✅ | ✅ | ✅ |
| Voluntariat | — | — | ✅ | ✅ | ✅ |
| Card digital | — | — | ✅ | ✅ | ✅ |
| Moderare | — | — | — | ✅ | ✅ |
| CMS complet | — | — | — | — | ✅ |

### 7.5. Plugins & Custom Extensions

**Strapi Plugins:**

| Plugin | Tip | Utilizare |
|---|---|---|
| `@strapi/plugin-users-permissions` | Core | Auth, roluri, OAuth providers |
| `@strapi/plugin-upload` | Core | Media library → Cloudflare R2 storage |
| `@strapi/plugin-email` | Core | Email via Brevo/Sendgrid SMTP |
| `@strapi/plugin-i18n` | Core | Internationalizare ro/en |
| `strapi-plugin-ckeditor` | Community | Rich text editor avansat |
| `strapi-plugin-slugify` | Community | Auto-slug din title |
| `strapi-plugin-sitemap` | Community | Generare sitemap.xml automat |
| `strapi-plugin-seo` | Community | SEO analysis în admin |

**Custom Extensions (`src/api/`):**

| Modul | Descriere |
|---|---|
| `donation/` | Validare CNP, integrare Netopia/Stripe, webhook handler, criptare AES-256 at-rest |
| `membership/` | Multi-step application, generare card digital PNG/PDF, verificare QR |
| `volunteer/` | Join/checkin, calcul ore, badge system, leaderboard |
| `newsletter/` | Double opt-in, integrare Listmonk/Brevo API, rate limiting |
| `social-feed/` | Agregare Instagram/Twitter/Facebook/TikTok via APIs, cron job every 15min |

### 7.6. Structura Proiect Strapi

```
strapi-sens/
├── config/
│   ├── database.js              # PostgreSQL connection
│   ├── plugins.js               # Plugin configs
│   ├── middlewares.js            # CORS, rate limiting
│   └── env/
│       ├── development/
│       └── production/
├── src/
│   ├── api/
│   │   ├── article/             # Schema + custom routes
│   │   ├── event/
│   │   ├── donation/            # Custom controller + services
│   │   ├── membership/          # Custom controller + card gen
│   │   ├── volunteer/           # Custom controller + badges
│   │   ├── newsletter/          # Custom controller + provider
│   │   ├── social-feed/         # Aggregator + cron
│   │   ├── page/
│   │   └── team-member/
│   ├── components/
│   │   ├── shared/              # seo, social-link
│   │   └── blocks/              # hero, text-block, cta, etc.
│   ├── extensions/
│   │   └── users-permissions/   # Custom role logic
│   └── middlewares/
│       ├── rate-limiter.js
│       └── cnp-encryption.js
├── public/
├── docker-compose.yml           # Strapi + PostgreSQL + Redis
├── Dockerfile
└── .env                         # Secrets (DB, OAuth, payment keys)
```

---

## 8. Cerințe Non-Funcționale

### 8.1. Performanță

| Metrică | Target | Măsurare |
|---|---|---|
| Lighthouse Performance | > 90 (mobile) | Lighthouse CI în pipeline |
| LCP (Largest Contentful Paint) | < 2.5s | Web Vitals |
| FID (First Input Delay) | < 100ms | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Web Vitals |
| TTI (Time to Interactive) | < 3.5s pe 3G | Lighthouse |
| Bundle Size (initial) | < 100KB gzipped | Build analytics |
| API Response Time | < 200ms (p95) | Server monitoring |

### 8.2. Accesibilitate

- Standard: WCAG 2.1 Level AA
- Contrast: Minim 4.5:1 pentru text, 3:1 pentru text mare
- Keyboard navigation: Tab order logic, focus visible pe toate elementele interactive
- Screen readers: Semantic HTML, ARIA labels, alt text pe toate imaginile
- Motion: Respect `prefers-reduced-motion`, opțiune de dezactivare animații

### 8.3. SEO

- Meta tags: Title, description, og:image pentru fiecare pagină
- Structured Data: Organization, Article, Event, BreadcrumbList (JSON-LD)
- Sitemap XML: Auto-generat de SvelteKit, submis în Google Search Console
- robots.txt: Configurare explicită, blocare `/cont/*`, `/api/*`
- Canonical URLs: Pe fiecare pagină
- Core Web Vitals: Optimizate conform secțiunii Performanță

### 8.4. GDPR & Conformitate

- Cookie Banner: Consent management (doar analytics dacă se folosește Plausible — poate fi opțional)
- Privacy Policy: Pagină dedicată, conform cerințelor ANSPDCP
- Data export: Endpoint pentru utilizator să-și descarce toate datele personale
- Dreptul la ștergere: Funcționalitate de ștergere cont cu confirmare
- Retenție date: Politică clară per tip de date (donații = 10 ani conform legii, newsletter = până la dezabonare)
- Criptare CNP: Câmpul CNP din donații va fi encriptat at rest în baza de date (AES-256)

### 8.5. Conformitate CMF (Campanie & Finanțare)

Donațiile politice în România au cerințe legale stricte:

- Afișare obligatorie: Număr CMF (`11240065`) în footer pe toate paginile
- Limite donații: Afișare clară a limitei legale anuale per donator
- Colectare CNP: Obligatoriu pentru donații, cu criptare și stocare securizată
- Raportare: Export date donații în format compatibil cu raportarea CMF
- Mandatar financiar: Date de contact afișate pe pagina de donații

---

## 9. Plan de Implementare & Faze

| Fază | Durată | Livrabile | Prioritate |
|---|---|---|---|
| **Faza 0:** Setup | 1 săptămână | Repo Git, CI/CD, Strapi deploy, Cloudflare DNS, env-uri dev/staging/prod | Critică |
| **Faza 1:** Website Public | 4-5 săptămâni | Landing page, Știri, Despre Noi, Contact, Newsletter, SEO, responsive | Critică |
| **Faza 2:** Donații & Înscriere | 2-3 săptămâni | Pagina donații (Netopia), formular înscriere multi-step, conformitate CMF | Critică |
| **Faza 3:** Autentificare & Profil | 2-3 săptămâni | Login/register, OAuth, dashboard membru, card digital, profil | Înaltă |
| **Faza 4:** Evenimente & Voluntariat | 2-3 săptămâni | Calendar evenimente, sistem înregistrare, tracking voluntariat, badge-uri | Înaltă |
| **Faza 5:** Social Feed | 1-2 săptămâni | Agregare social media, filtre per platformă, cron job, cache | Medie |
| **Faza 6:** App Nativă | 2 săptămâni | Capacitor build, push notifications, app store submission | Medie |
| **Faza 7:** Optimizări | Continuu | Performance tuning, A/B testing, analytics, Cloudflare Workers | Continuă |

**Total estimat:** 13-18 săptămâni pentru Fazele 0-6 (~3.5-4.5 luni)

Se recomandă lansarea publică după Faza 2, cu adăugarea incrementală a funcționalităților în Fazele 3-6.

---

## 10. Riscuri & Mitigare

| Risc | Impact | Probabilitate | Mitigare |
|---|---|---|---|
| Schimbări legislative CMF | Mare | Medie | Arhitectură modulară donații, monitorizare activă legislație |
| Atacuri DDoS în campanie | Mare | Mare | Cloudflare protection, rate limiting, fallback static pages |
| Spike trafic (viralitate) | Mediu | Mare | CDN caching agresiv, SSG pentru paginile critice, auto-scaling |
| Breșă securitate date membri | Critic | Mică | Criptare at rest, audit security, pen testing, backups criptate |
| App store rejection | Mediu | Mică | Respectare guidelines Apple/Google, PWA ca fallback |
| Strapi breaking changes | Mediu | Medie | Pin versiune, staging testing, migrare incrementală |
| Rate limits API-uri sociale | Mediu | Mare | Cache agresiv, fallback la ultimele postări cached, multiple API keys |

---

## 11. Anexe

### 11.1. Wireframes

Wireframes-urile interactive sunt livrate ca fișier `.jsx` companion (SENS_Wireframes_v1_4.jsx), vizualizabile direct în Claude Artifacts sau orice mediu React. Acoperă: Acasă (cu secțiune Program), Știri (cu filtru calendar), Articol Individual (cu share social), Despre Noi, Evenimente (listă cu filtre locație/status + detaliu cu calendar/reminder/social posts), Contact (cu formular + newsletter), Înscrie-te (formular multi-step complet funcțional), Donează, Dashboard Membru, Social Feed, și structura Strapi API. Toate paginile sunt interconectate prin navigare funcțională — butoanele din meniu, link-urile din conținut și breadcrumb-urile navighează între pagini.

### 11.2. Referințe

- Site actual: https://www.cusens.eu/
- Strapi v5 Docs: https://docs.strapi.io/
- SvelteKit Docs: https://kit.svelte.dev/docs
- Capacitor Docs: https://capacitorjs.com/docs
- Cloudflare Cache Rules: https://developers.cloudflare.com/cache/
- Legislație donații politice: Legea 334/2006 privind finanțarea activității partidelor politice
