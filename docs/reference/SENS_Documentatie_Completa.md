# PARTIDUL SENS — Documentație Completă

**Sănătate · Educație · Natură · Sustenabilitate**

> Website & Mobile App — Proiect de Redesign Complet
> Versiunea 1.4 — Februarie 2026

Acest document agregă toate cele 4 documente de proiect:
- Partea I: Specificații Tehnice
- Partea II: User Journeys & Navigation Map
- Partea III: Ghid Strapi CMS
- Partea IV: Wireframes (referință — fișier JSX separat)

---
---

# PARTEA I — SPECIFICAȚII TEHNICE

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
-e 
---
---

# PARTEA II — USER JOURNEYS & NAVIGATION MAP

---

## Hartă generală de navigare

```
                              ┌─────────────┐
                     ┌────────│   ACASĂ (/)  │────────┐
                     │        └──────┬───────┘        │
                     │               │                │
              ┌──────┴──┐    ┌───────┴──────┐   ┌─────┴─────┐
              │  ȘTIRI   │    │  DESPRE NOI  │   │  CONTACT  │
              │ /stiri   │    │  /despre-noi │   │  /contact │
              └────┬─────┘    └──────────────┘   └───────────┘
                   │
           ┌───────┴────────┐
           │ ARTICOL        │
           │ /stiri/[slug]  │
           └────────────────┘

              ┌──────────┐    ┌──────────────┐   ┌───────────┐
              │ DONEAZĂ  │    │  ÎNSCRIE-TE  │   │ DASHBOARD │
              │ /doneaza │    │  /inscrie-te │   │   /cont   │
              └──────────┘    └──────────────┘   └───────────┘
```

---

## Elemente persistente (toate paginile)

### Navbar — Mobile

| Element | Acțiune | Destinație |
|---|---|---|
| ≡ (hamburger, stânga) | Deschide meniul overlay full-screen | → Hamburger Menu |
| Logo SENS | Click | → Acasă |
| Icon user (dreapta) | Click | → Dashboard (/cont) |

### Navbar — Desktop

| Element | Acțiune | Destinație |
|---|---|---|
| Logo SENS | Click | → Acasă |
| Link „Știri" | Click | → Știri (/stiri) |
| Link „Despre" | Click | → Despre Noi (/despre-noi) |
| Link „Contact" | Click | → Contact (/contact) |
| Link „Evenimente" | Click | → Evenimente (/evenimente) |
| Buton „Înscrie-te" | Click | → Înscrie-te (/inscrie-te) |
| Icon user | Click | → Dashboard (/cont) |

### Hamburger Menu (mobile overlay)

| Element | Acțiune | Destinație |
|---|---|---|
| × (buton închidere) | Închide meniul | → Pagina curentă |
| Acasă | Click | → Acasă |
| Știri | Click | → Știri |
| Despre Noi | Click / expand | → Despre Noi |
| — Misiune | Click (sub-meniu) | → Despre Noi (secțiunea Misiune) |
| — Echipa | Click (sub-meniu) | → Despre Noi (secțiunea Echipa) |
| — Program Politic | Click (sub-meniu) | → Despre Noi (secțiunea Program) |
| — Statut | Click (sub-meniu) | → Despre Noi (secțiunea Statut) |
| — Manifest | Click (sub-meniu) | → Despre Noi (secțiunea Manifest) |
| Evenimente | Click | → Evenimente |
| Contact | Click | → Contact |
| Donează | Click | → Donează |
| Buton „Înscrie-te în SENS" | Click (CTA) | → Înscrie-te |
| Text „Contul meu" | Click | → Dashboard |
| Text „RO / EN" | Click | → Language switch (viitor) |

### Footer

| Element | Acțiune | Destinație |
|---|---|---|
| Link „Știri" (desktop) | Click | → Știri |
| Link „Despre" (desktop) | Click | → Despre Noi |
| Link „Contact" (desktop) | Click | → Contact |
| Link „Donează" (desktop) | Click | → Donează |
| „Politica de confidențialitate" | Click | → /politica-confidentialitate |
| „Membru al European Greens / EFA" | Informativ | — (fără link, doar text) |

### Accessibility Widget

| Element | Acțiune | Destinație |
|---|---|---|
| Icon accesibilitate (bottom-right) | Click | → Deschide panoul de accesibilitate (overlay) |

---

## Pagina: ACASĂ (/)

### Hero Section

| Element | Acțiune | Destinație |
|---|---|---|
| Buton „Înscrie-te" | Click (CTA primar) | → Înscrie-te (/inscrie-te) |
| Buton „Donează" | Click (CTA secundar) | → Donează (/doneaza) |

### Valorile noastre

| Element | Acțiune | Destinație |
|---|---|---|
| Card „Sănătate" | Click | → Modal: detalii Sănătate |
| Card „Educație" | Click | → Modal: detalii Educație |
| Card „Natură" | Click | → Modal: detalii Natură |
| Card „Sustenabilitate" | Click | → Modal: detalii Sustenabilitate |
| (în modal) „Citește Programul Politic complet →" | Click | → Despre Noi (/despre-noi) |
| (în modal) × buton | Click | → Închide modal |

### Din programul nostru

| Element | Acțiune | Destinație |
|---|---|---|
| Lista propuneri (6 items) | Informativ | — (fără link individual) |
| Buton „Vezi programul complet →" | Click | → Despre Noi (/despre-noi) |

### Ultimele știri (carousel)

| Element | Acțiune | Destinație |
|---|---|---|
| Card articol (mobile, single) | Click pe card | → Articol (/stiri/[slug]) |
| Buton ‹ (carousel) | Click | → Articol anterior în carousel |
| Buton › (carousel) | Click | → Articol următor în carousel |
| Dots indicator | Informativ | — (arată poziția curentă) |
| Card articol 1 (desktop) | Click | → Articol (/stiri/[slug]) |
| Card articol 2 (desktop) | Click | → Articol (/stiri/[slug]) |
| Card articol 3 (desktop) | Click | → Articol (/stiri/[slug]) |
| Buton „Toate știrile →" | Click | → Știri (/stiri) |

### Evenimente următoare

| Element | Acțiune | Destinație |
|---|---|---|
| Card eveniment (fiecare) | Click | → Evenimente (/evenimente) |
| Buton „Toate evenimentele →" | Click | → Evenimente (/evenimente) |

### Pe rețelele sociale

| Element | Acțiune | Destinație |
|---|---|---|
| Card postare Instagram | Informativ | — (viitor: link extern spre postarea reală) |
| Card postare Facebook | Informativ | — (viitor: link extern) |

### Newsletter

| Element | Acțiune | Destinație |
|---|---|---|
| Input email | Focus, tastare | — (input field) |
| Buton „Abonează-te" | Click | → Submit form → confirmare / mesaj succes |

---

## Pagina: ȘTIRI (/stiri)

### Filtre și căutare

| Element | Acțiune | Destinație |
|---|---|---|
| Tab „Toate" | Click | → Filtrare: toate categoriile |
| Tab „Comunicate" | Click | → Filtrare: doar comunicate |
| Tab „Analize" | Click | → Filtrare: doar analize |
| Tab „Acțiuni" | Click | → Filtrare: doar acțiuni |
| Tab „Media" | Click | → Filtrare: doar media |
| Input căutare | Focus, tastare | → Filtrare live pe titlu/conținut |
| Icon calendar | Click (toggle) | → Arată/ascunde mini-calendarul |

### Mini-calendar (când e vizibil)

| Element | Acțiune | Destinație |
|---|---|---|
| Zi cu articole (highlight orange) | Click | → Filtrare articole pe acea dată |
| Zi fără articole | — | — (inactivă) |

### Lista articole

| Element | Acțiune | Destinație |
|---|---|---|
| Card articol #1 | Click | → Articol individual (/stiri/[slug]) |
| Card articol #2 | Click | → Articol individual (/stiri/[slug]) |
| Card articol #3 | Click | → Articol individual (/stiri/[slug]) |

---

## Pagina: ARTICOL INDIVIDUAL (/stiri/[slug])

### Breadcrumb

| Element | Acțiune | Destinație |
|---|---|---|
| „Acasă" | Click | → Acasă (/) |
| „Știri" | Click | → Știri (/stiri) |
| Categoria (ex: „Comunicat") | Informativ | — (fără link) |

### Conținut articol

| Element | Acțiune | Destinație |
|---|---|---|
| Hero image | Informativ | — |
| Badge categorie | Informativ | — |
| Titlu | Informativ | — |
| Excerpt | Informativ | — |
| Body text | Informativ | — |
| Tags (#buget, #mediu, etc.) | Informativ (v1) | — (viitor: filtrare pe tag) |

### Share (zona de sus)

| Element | Acțiune | Destinație |
|---|---|---|
| „Facebook" | Click | → Deschide share dialog Facebook (link extern) |
| „X" | Click | → Deschide share dialog X/Twitter (link extern) |
| „LinkedIn" | Click | → Deschide share dialog LinkedIn (link extern) |
| „WhatsApp" | Click | → Deschide share dialog WhatsApp (link extern) |
| „Copiază link" | Click | → Copiază URL articol în clipboard |

### Share (zona de jos, icon-uri)

| Element | Acțiune | Destinație |
|---|---|---|
| Icon FB (cerc albastru) | Click | → Share Facebook (link extern) |
| Icon X (cerc negru) | Click | → Share X/Twitter (link extern) |
| Icon in (cerc albastru) | Click | → Share LinkedIn (link extern) |
| Icon WA (cerc verde) | Click | → Share WhatsApp (link extern) |

### Articole similare

| Element | Acțiune | Destinație |
|---|---|---|
| Card articol similar #1 | Click | → Articol individual (/stiri/[slug-2]) |
| Card articol similar #2 | Click | → Articol individual (/stiri/[slug-3]) |

---

## Pagina: DESPRE NOI (/despre-noi)

### Sub-navigare

| Element | Acțiune | Destinație |
|---|---|---|
| Tab „Misiune" | Click | → Secțiunea Misiune (same page) |
| Tab „Echipa" | Click | → Secțiunea Echipa (same page) |
| Tab „Program" | Click | → Secțiunea Program (same page) |
| Tab „Statut" | Click | → Secțiunea Statut (same page) |
| Tab „Manifest" | Click | → Secțiunea Manifest (same page) |

### Conținut

| Element | Acțiune | Destinație |
|---|---|---|
| Bloc „Misiunea noastră" | Informativ | — |
| Bloc „Familia Europeană" | Informativ | — (viitor: link extern europeangreenparty.eu) |
| Card membru echipă (fiecare) | Informativ (v1) | — (viitor: → profil public membru) |

---

## Pagina: CONTACT (/contact)

### Formular de contact

| Element | Acțiune | Destinație |
|---|---|---|
| Input „Nume complet" | Focus, tastare | — (input field) |
| Input „Email" | Focus, tastare | — (input field) |
| Input „Subiect" | Focus, tastare | — (input field) |
| Textarea „Mesaj" | Focus, tastare | — (input field) |
| Buton „Trimite mesajul" | Click | → Submit form → mesaj confirmare / toast |

### Abonare newsletter

| Element | Acțiune | Destinație |
|---|---|---|
| Input „Nume" | Focus, tastare | — (input field, opțional) |
| Input „Email" | Focus, tastare | — (input field) |
| Checkbox GDPR | Toggle | — (consimțământ obligatoriu) |
| Buton „Abonează-te" | Click | → Submit → mesaj succes / double opt-in email |

### Date de contact

| Element | Acțiune | Destinație |
|---|---|---|
| Email „contact@cusens.eu" | Informativ (v1) | — (viitor: mailto: link) |
| Adresa sediu | Informativ | — |
| Program | Informativ | — |

---

## Pagina: EVENIMENTE (/evenimente)

### Tabs

| Element | Acțiune | Destinație |
|---|---|---|
| Tab „Viitoare" (default) | Click | → Afișează doar evenimentele viitoare |
| Tab „Trecute" | Click | → Afișează doar evenimentele trecute |

### Filtru locație

| Element | Acțiune | Destinație |
|---|---|---|
| „Toate locațiile" (default) | Click | → Afișează toate |
| „București" | Click | → Filtrare doar București |
| „Cluj-Napoca" | Click | → Filtrare doar Cluj-Napoca |
| „Online" | Click | → Filtrare doar online |
| (alte locații, generate dinamic) | Click | → Filtrare respectivă |

### Lista carduri

| Element | Acțiune | Destinație |
|---|---|---|
| Card eveniment (fiecare) | Click | → Detaliu eveniment (view intern) |

### Detaliu eveniment viitor

| Element | Acțiune | Destinație |
|---|---|---|
| Breadcrumb „Acasă" | Click | → Acasă (/) |
| Breadcrumb „Evenimente" | Click | → Lista evenimente |
| Hero image | Informativ | — |
| Info box (dată, locație, capacitate) | Informativ | — |
| Descriere | Informativ | — |
| Buton „Mă înscriu la eveniment" | Click (CTA primar) | → POST /api/events/:id/register (auth) |
| Buton „Adaugă în calendar" | Click | → Descarcă fișier .ics / deep link Google Calendar |
| Buton „Activează reminder" | Click | → POST /api/events/:id/remind → notificare 24h și 1h înainte |

### Detaliu eveniment trecut

| Element | Acțiune | Destinație |
|---|---|---|
| Breadcrumb „Acasă" | Click | → Acasă (/) |
| Breadcrumb „Evenimente" | Click | → Lista evenimente |
| Badge „Încheiat" | Informativ | — |
| Descriere | Informativ | — |
| Card postare Instagram | Informativ (v1) | — (viitor: link extern) |
| Card postare Facebook | Informativ (v1) | — (viitor: link extern) |

---

## Pagina: ÎNSCRIE-TE (/inscrie-te)

Formular multi-step cu 5 etape. Navigarea este secvențială.

### Progress indicator

| Element | Acțiune | Destinație |
|---|---|---|
| Step completat (verde, ✓) | Informativ | — (v1 fără click-back pe step) |
| Step curent (orange) | Informativ | — |
| Step viitor (gri) | Informativ | — |

### Step 1: Date personale

| Element | Acțiune | Destinație |
|---|---|---|
| Input „Prenume" | Focus, tastare | — |
| Input „Nume" | Focus, tastare | — |
| Input „Email" | Focus, tastare | — |
| Input „Telefon" | Focus, tastare | — |
| Input „Data nașterii" | Focus, tastare | — |
| Buton „Continuă →" | Click | → Step 2: Adresă |

### Step 2: Adresă

| Element | Acțiune | Destinație |
|---|---|---|
| Dropdown „Județ" | Select | — |
| Input „Localitate" | Focus, tastare | — |
| Input „Adresă completă" | Focus, tastare | — |
| Buton „← Înapoi" | Click | → Step 1: Date personale |
| Buton „Continuă →" | Click | → Step 3: Motivație |

### Step 3: Motivație

| Element | Acțiune | Destinație |
|---|---|---|
| Textarea motivație | Focus, tastare | — |
| Checkbox „Voluntariat și acțiuni de teren" | Toggle | — |
| Checkbox „Comunicare și social media" | Toggle | — |
| Checkbox „Politici publice" | Toggle | — |
| Checkbox „Organizare filiale" | Toggle | — |
| Checkbox „Mediu și sustenabilitate" | Toggle | — |
| Checkbox „Drepturile omului" | Toggle | — |
| Buton „← Înapoi" | Click | → Step 2: Adresă |
| Buton „Continuă →" | Click | → Step 4: Consimțământ |

### Step 4: Consimțământ

| Element | Acțiune | Destinație |
|---|---|---|
| Declarație de conformitate | Informativ (read-only) | — |
| Checkbox „Confirm declarația" | Toggle (obligatoriu) | — |
| Checkbox „Acord prelucrare date" | Toggle (obligatoriu) | — |
| Checkbox „Accept Statutul" | Toggle (obligatoriu) | — |
| Checkbox „Comunicări email" | Toggle (opțional) | — |
| Buton „← Înapoi" | Click | → Step 3: Motivație |
| Buton „Trimite cererea" | Click | → Step 5: Confirmare |

### Step 5: Confirmare

| Element | Acțiune | Destinație |
|---|---|---|
| Icon succes (checkmark) | Informativ | — |
| Mesaj confirmare | Informativ | — |
| Lista „Pași următori" (1-3) | Informativ | — |
| Buton „Înapoi la pagina principală" | Click | → Acasă (/) |

---

## Pagina: DONEAZĂ (/doneaza)

### Selectare sumă

| Element | Acțiune | Destinație |
|---|---|---|
| Buton „25 RON" | Click | → Selectează suma 25 RON |
| Buton „50 RON" | Click | → Selectează suma 50 RON |
| Buton „100 RON" (default) | Click | → Selectează suma 100 RON |
| Buton „200 RON" | Click | → Selectează suma 200 RON |

### Tip donație

| Element | Acțiune | Destinație |
|---|---|---|
| „Donație unică" (default) | Click | → Selectează donație unică |
| „Donație lunară" | Click | → Selectează donație recurentă |

### Formular donator

| Element | Acțiune | Destinație |
|---|---|---|
| Input „Nume complet" | Focus, tastare | — |
| Input „CNP" | Focus, tastare | — |
| Input „Email" | Focus, tastare | — |

### Metodă de plată

| Element | Acțiune | Destinație |
|---|---|---|
| „Card bancar" (default) | Click | → Selectează plata cu cardul |
| „Transfer bancar" | Click | → Selectează transfer (afișează IBAN) |

### Submit

| Element | Acțiune | Destinație |
|---|---|---|
| Buton „Donează [sumă] RON" | Click | → Redirect la procesatorul de plăți (Netopia/Stripe) |

---

## Pagina: DASHBOARD MEMBRU (/cont)

### Header

| Element | Acțiune | Destinație |
|---|---|---|
| Avatar + nume | Informativ | — |
| Status membru | Informativ | — |

### Card membru

| Element | Acțiune | Destinație |
|---|---|---|
| Card-ul digital (gradient verde) | Informativ | — |
| QR code | Informativ (v1) | — (viitor: expand QR / descarcare) |

### Statistici rapide

| Element | Acțiune | Destinație |
|---|---|---|
| „350 RON — Total donat" | Informativ | — |
| „5 — Evenimente" | Informativ | — |

### Carduri navigare

| Element | Acțiune | Destinație |
|---|---|---|
| Card „Evenimente" | Click | → /cont/evenimente |
| Card „Voluntariat" | Click | → /cont/voluntariat |
| Card „Donațiile mele" | Click | → /cont/donatii |
| Card „Social Feed" | Click | → Social Feed (/social) |
| Card „Setări profil" | Click | → /cont/profil |
| Card „Realizări" | Click | → /cont/realizari (gamification) |

---

## Pagina: SOCIAL FEED

### Filtre platformă

| Element | Acțiune | Destinație |
|---|---|---|
| Tab „Toate" (default) | Click | → Afișează postări de pe toate platformele |
| Tab „Instagram" | Click | → Filtrare doar Instagram |
| Tab „X" | Click | → Filtrare doar X/Twitter |
| Tab „Facebook" | Click | → Filtrare doar Facebook |
| Tab „TikTok" | Click | → Filtrare doar TikTok |

### Postări

| Element | Acțiune | Destinație |
|---|---|---|
| Card postare (fiecare) | Informativ (v1) | — (viitor: link extern la postarea originală) |

---

## User Journeys — Scenarii complete

### Journey 1: Vizitator nou → Simpatizant

```
Acasă (/) 
  → Citește valorile (click card) → Modal detalii → „Programul Politic" → Despre Noi
  → Revine pe Acasă (navbar logo)
  → Citește o știre din carousel → Click → Articol Individual
  → Share pe WhatsApp
  → Revine pe Acasă (breadcrumb)
  → „Înscrie-te" (hero CTA) → Formularul multi-step
  → Completează 5 pași → Confirmare
  → „Înapoi la pagina principală" → Acasă
```

### Journey 2: Simpatizant → Donator

```
Acasă (/)
  → Click „Donează" (hero CTA) → Donează
  → Selectează 50 RON, donație unică
  → Completează nume, CNP, email
  → Selectează card bancar
  → „Donează 50 RON" → Redirect procesator plăți
  → (Return după plată) → Confirmare donație
```

### Journey 3: Membru activ — sesiune tipică

```
Acasă (/)
  → Click icon user (navbar) → Dashboard
  → Verifică statisticile (donații, evenimente)
  → Click „Evenimente" → Lista evenimentelor viitoare
  → Revine în Dashboard
  → Click „Realizări" → Vezi nivelul curent de gamification
  → Click logo → Acasă
  → Citește ultimele știri → Click pe articol → Articol Individual
  → Share pe Facebook
  → Știri (breadcrumb) → Lista completă de știri
  → Filtrare „Analize"
  → Click pe calendar → Selectează o dată cu articole
```

### Journey 4: Vizitator → Abonat newsletter

```
Acasă (/)
  → Scroll la secțiunea newsletter → Completează email → Abonează-te
  SAU
  → Navbar Contact → Contact (/contact)
  → Scroll la secțiunea newsletter
  → Completează nume + email + accept GDPR → Abonează-te
```

### Journey 5: Vizitator → Informare completă despre partid

```
Acasă (/)
  → Click „Despre" (navbar) → Despre Noi
  → Citește Misiunea
  → Vede „Familia Europeană" (European Greens)
  → Browse echipa
  → Tab „Program" → Citește programul politic
  → Tab „Manifest" → Citește manifestul
  → Revine pe Acasă (logo)
  → Scroll la „Din programul nostru" → Citește propunerile
  → „Vezi programul complet →" → Despre Noi
```

### Journey 6: Vizitator din social media → Citire articol → Abonare

```
(Link extern) → Articol Individual (/stiri/[slug])
  → Citește articolul
  → Click „Știri" (breadcrumb) → Lista de știri
  → Browse mai multe articole
  → Click „Contact" (navbar) → Contact
  → Completează formularul de newsletter → Abonează-te
```

### Journey 7: Mobile — Navigare prin hamburger menu

```
Acasă (/)
  → Click ≡ (hamburger, stânga) → Overlay meniu
  → Click „Despre Noi" → Expand sub-meniu
    → Click „Echipa" → Despre Noi (secțiunea Echipa)
  → Click ≡ → Overlay meniu
  → Click „Donează" → Donează
  → Click ≡ → Overlay meniu
  → Click „Înscrie-te în SENS" (buton CTA) → Înscrie-te
```

### Journey 8: Vizitator → Participare la eveniment

```
Acasă (/)
  → Scroll la „Evenimente următoare" → Click pe card → Evenimente (/evenimente)
  → Tab „Viitoare" → Click pe eveniment → Detaliu eveniment
  → Citește descrierea, verifică data + locația
  → „Adaugă în calendar" → Descarcă .ics
  → „Mă înscriu la eveniment" → Login (dacă nu e autentificat) → Confirmare
  → „Activează reminder" → Permite notificări → Confirmare
```

### Journey 9: Membru → Verificare eveniment trecut + social media

```
Evenimente (/evenimente)
  → Tab „Trecute"
  → Filtrare „București"
  → Click pe „Curățenie Parc Herăstrău"
  → Vede badge „Încheiat"
  → Scroll la „Postări de la acest eveniment"
  → Vede galerie foto Instagram + recap Facebook
```

---

## Stări speciale

### Utilizator neautentificat

| Pagină | Comportament |
|---|---|
| Icon user (navbar) | → Redirect la /auth/login |
| Dashboard | → Redirect la /auth/login cu return URL |
| /cont/* (toate subpaginile) | → Redirect la /auth/login |

### Utilizator autentificat (simpatizant)

| Pagină | Comportament |
|---|---|
| Icon user (navbar) | → Dashboard (/cont) |
| Formularul de înscriere | Pre-populat cu datele din profil |
| Donații | Pre-populat cu numele din profil |

### Utilizator autentificat (membru)

| Pagină | Comportament |
|---|---|
| Dashboard | Afișează card digital, statistici complete, toate cardurile de navigare |
| Voluntariat | Acces complet la acțiuni și check-in |
| Realizări | Sistem gamification activ |

---

## Linkuri externe (deschid tab nou)

| Context | Destinație |
|---|---|
| Share Facebook (articol) | https://facebook.com/sharer/sharer.php?u=[url] |
| Share X (articol) | https://twitter.com/intent/tweet?url=[url] |
| Share LinkedIn (articol) | https://linkedin.com/sharing/share-offsite/?url=[url] |
| Share WhatsApp (articol) | https://wa.me/?text=[url] |
| European Greens (viitor) | https://europeangreens.eu |
| Postări social media (viitor) | Link original al postării pe platformă |
| Procesator plăți (donații) | Netopia / Stripe checkout page |

---

## Acțiuni planificate (neincluse în v1.3)

Următoarele acțiuni sunt prevăzute în specificații dar nu sunt încă implementate în wireframes:

| Acțiune | Pagina | Prioritate | Faza |
|---|---|---|---|
| Click pe membru echipă → profil public | Despre Noi | Medie | Faza 4 |
| Click pe tag → filtrare articole pe tag | Articol | Medie | Faza 1 |
| Paginare lista știri | Știri | Înaltă | Faza 1 |
| Language switch RO/EN | Hamburger menu | Medie | Faza 5+ |
| Descărcare card digital (PNG/Wallet) | Dashboard | Înaltă | Faza 3 |
| Panou accesibilitate complet | Toate | Înaltă | Faza 1 |
| Donație prin transfer — afișare IBAN | Donează | Înaltă | Faza 2 |
| Notificări push (native app) | Dashboard | Medie | Faza 6 |
| Gamification avansat | Dashboard / Realizări | De definit | Faza 4+ |
-e 
---
---

# PARTEA III — GHID STRAPI CMS

---

## Cuprins

1. [Despre acest ghid](#1-despre-acest-ghid)
2. [Concepte de bază Strapi](#2-concepte-de-bază-strapi)
3. [Instalare și setup inițial](#3-instalare-și-setup-inițial)
4. [Construirea Collection Types](#4-construirea-collection-types)
5. [Componente reutilizabile](#5-componente-reutilizabile)
6. [Dynamic Zones — pagini flexibile](#6-dynamic-zones--pagini-flexibile)
7. [Cum se mapează fiecare pagină din site](#7-cum-se-mapează-fiecare-pagină-din-site)
8. [Adăugarea de conținut nou](#8-adăugarea-de-conținut-nou)
9. [Adăugarea de pagini și secțiuni noi](#9-adăugarea-de-pagini-și-secțiuni-noi)
10. [Relații între conținuturi](#10-relații-între-conținuturi)
11. [Media și imagini](#11-media-și-imagini)
12. [Roluri și permisiuni](#12-roluri-și-permisiuni)
13. [Custom Controllers și Lifecycles](#13-custom-controllers-și-lifecycles)
14. [Frontend — cum consumă SvelteKit datele](#14-frontend--cum-consumă-sveltekit-datele)
15. [Patterns frecvente și troubleshooting](#15-patterns-frecvente-și-troubleshooting)

---

## 1. Despre acest ghid

Strapi v5 este CMS-ul headless care gestionează tot conținutul site-ului SENS. Acest ghid explică pas cu pas cum se construiesc structurile de date, cum se adaugă conținut, și cum se extinde site-ul cu pagini sau secțiuni noi — fără a fi nevoie de modificări în codul frontend (în cele mai multe cazuri).

**Panoul de administrare** este accesibil la `https://api.cusens.eu/admin` și oferă o interfață vizuală pentru toate operațiile descrise mai jos.

---

## 2. Concepte de bază Strapi

Strapi organizează datele în câteva tipuri fundamentale. Înțelegerea lor este esențială:

### Collection Type

O **colecție** = mai multe înregistrări de același tip. Gândește-te ca la un tabel dintr-o bază de date.

Exemple: Articles (mai multe articole), Events (mai multe evenimente), TeamMembers (mai mulți membri).

Fiecare Collection Type generează automat endpoints REST:
- `GET /api/articles` — lista tuturor articolelor
- `GET /api/articles/:id` — un articol specific
- `POST /api/articles` — creează un articol nou
- `PUT /api/articles/:id` — actualizează un articol
- `DELETE /api/articles/:id` — șterge un articol

### Single Type

Un **single type** = o singură înregistrare. Util pentru conținut care există o singură dată pe site.

Exemple: Homepage (conținutul paginii de acasă), GlobalSettings (setări globale).

Endpoint: `GET /api/homepage` (fără listă, direct obiectul).

### Component

O **componentă** = un grup reutilizabil de câmpuri pe care îl poți insera în mai multe Collection Types sau Single Types.

Exemplu: Componenta `shared.seo` (meta_title, meta_description, og_image) este folosită atât în Article cât și în Page cât și în Event.

Componentele NU au propriile endpoints API — ele sunt incluse (nested) în tipurile care le conțin.

### Dynamic Zone

O **zonă dinamică** = un câmp special care acceptă mai multe tipuri de componente, în orice ordine. Acesta este mecanismul principal pentru a construi pagini flexibile.

Exemplu: Câmpul `content` din tipul Page poate conține, în orice ordine: un Hero, apoi un Text Block, apoi o Galerie, apoi un CTA Banner — fiecare fiind o componentă diferită.

---

## 3. Instalare și setup inițial

### 3.1. Crearea proiectului

```bash
# Creează proiect Strapi cu TypeScript și PostgreSQL
npx create-strapi-app@latest strapi-sens --typescript

# Când ți se cere, alege:
# - Installation type: Custom
# - Database: PostgreSQL
# - Completează credentialele PostgreSQL
```

### 3.2. Structura de directoare rezultată

```
strapi-sens/
├── config/
│   ├── database.ts          # Configurare PostgreSQL
│   ├── middlewares.ts        # CORS, security headers
│   ├── plugins.ts            # Configurare plugins
│   └── server.ts             # Port, host
├── src/
│   ├── api/                  # Collection Types & controllers
│   │   └── article/
│   │       ├── content-types/
│   │       │   └── article/
│   │       │       └── schema.json    ← SCHEMA COLLECTION
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── services/
│   ├── components/           # Componente reutilizabile
│   │   ├── shared/
│   │   │   ├── seo.json
│   │   │   └── social-link.json
│   │   └── blocks/
│   │       ├── hero.json
│   │       ├── text-block.json
│   │       └── ...
│   └── extensions/           # Extensii peste plugins existente
├── public/
├── .env                      # Variabile de mediu
└── package.json
```

### 3.3. Pornirea

```bash
# Development
npm run develop

# Production
npm run build
npm run start
```

Panoul admin este la `http://localhost:1337/admin`. La prima accesare, creezi contul de administrator.

---

## 4. Construirea Collection Types

Poți crea Collection Types fie din panoul admin (Content-Type Builder), fie prin fișiere JSON în cod.

### 4.1. Din panoul admin (recomandat pentru început)

1. Deschide `https://api.cusens.eu/admin`
2. Mergi la **Content-Type Builder** (în sidebar, secțiunea Plugins)
3. Click **Create new Collection Type**
4. Denumește-l (ex: `Article`)
5. Adaugă câmpuri unul câte unul

### 4.2. Câmpurile pentru fiecare Collection Type

Mai jos sunt toate tipurile pe care trebuie să le creezi, în ordinea recomandată (cele fără dependințe mai întâi):

#### Category

Creează mai întâi Category deoarece Article depinde de ea.

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| name | Text (Short text) | Required, Unique |
| slug | UID | Attached to: name |
| color | Text (Short text) | Regex: `^#[0-9A-Fa-f]{6}$`, placeholder: #D89302 |

#### Tag

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| name | Text (Short text) | Required, Unique |
| slug | UID | Attached to: name |

#### TeamMember

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| name | Text (Short text) | Required |
| role | Text (Short text) | Required |
| bio | Text (Long text) | Required, Max length: 500 |
| photo | Media (Single media) | Required, Allowed types: Images |
| social_links | Component (repeatable) | → shared.social-link |
| display_order | Number (Integer) | Required, Default: 0 |
| is_leadership | Boolean | Required, Default: false |

#### Article

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| title | Text (Short text) | Required, Max: 200 |
| slug | UID | Attached to: title |
| excerpt | Text (Long text) | Required, Max: 300 |
| body | Rich text (Blocks) | Required |
| cover_image | Media (Single media) | Required, Allowed types: Images |
| category | Relation | Many-to-One → Category |
| author | Relation | Many-to-One → TeamMember |
| tags | Relation | Many-to-Many → Tag |
| seo | Component (single) | → shared.seo |
| reading_time | Number (Integer) | Not required (auto-calculat) |

Activează **Draft & Publish** pe acest tip (Settings tab la creare).

#### Event

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| title | Text (Short text) | Required |
| slug | UID | Attached to: title |
| description | Rich text (Blocks) | Required |
| start_date | Datetime | Required |
| end_date | Datetime | Not required |
| location_name | Text (Short text) | Required |
| location_coords | JSON | Not required, default: null |
| cover_image | Media (Single media) | Not required |
| max_participants | Number (Integer) | Not required (null = nelimitat) |
| registration_open | Boolean | Required, Default: true |
| event_type | Enumeration | Values: town_hall, action, protest, meeting, online |
| seo | Component (single) | → shared.seo |

#### Page

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| title | Text (Short text) | Required |
| slug | UID | Attached to: title |
| content | Dynamic Zone | → toate componentele blocks.* |
| seo | Component (single) | → shared.seo |

#### Donation

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| amount | Number (Decimal) | Required |
| donor_name | Text (Short text) | Required |
| donor_cnp | Text (Short text) | Required (criptat în custom controller) |
| donor_email | Email | Required |
| payment_method | Enumeration | Values: card, bank_transfer |
| payment_reference | Text (Short text) | Required |
| status | Enumeration | Values: pending, completed, failed, refunded. Default: pending |
| is_recurring | Boolean | Required, Default: false |
| cmf_reported | Boolean | Required, Default: false |

#### MemberProfile

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| membership_type | Enumeration | Values: simpatizant, membru, moderator |
| card_number | Text (Short text) | Unique (auto-generat) |
| filial | Text (Short text) | Not required |
| joined_date | Date | Required |
| status | Enumeration | Values: pending, active, suspended |
| gamification_data | JSON | Default: {} |

Relația cu User se face prin extensia users-permissions (secțiunea 12).

#### VolunteerAction

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| title | Text (Short text) | Required |
| description | Rich text (Blocks) | Required |
| date | Datetime | Required |
| location | Text (Short text) | Required |
| required_volunteers | Number (Integer) | Required |
| status | Enumeration | Values: upcoming, active, completed, cancelled |

#### NewsletterSubscriber

| Câmp | Tip Strapi | Configurare |
|---|---|---|
| email | Email | Required, Unique |
| name | Text (Short text) | Not required |
| consent_date | Datetime | Required |
| source | Enumeration | Values: website, event, manual |
| status | Enumeration | Values: active, unsubscribed, bounced. Default: active |
| ip_address | Text (Short text) | Not required |

---

## 5. Componente reutilizabile

Componentele se creează în **Content-Type Builder → Components** (sau în `src/components/`).

### 5.1. shared.seo

Categoria: `shared`
Numele: `seo`

| Câmp | Tip | Configurare |
|---|---|---|
| meta_title | Text (Short text) | Max: 60 |
| meta_description | Text (Long text) | Max: 160 |
| og_image | Media (Single media) | Allowed: Images (1200×630 recomandat) |
| canonical_url | Text (Short text) | Not required |
| no_index | Boolean | Default: false |

### 5.2. shared.social-link

Categoria: `shared`
Numele: `social-link`

| Câmp | Tip | Configurare |
|---|---|---|
| platform | Enumeration | Values: facebook, instagram, twitter, tiktok, youtube, linkedin |
| url | Text (Short text) | Required |

### 5.3. blocks.hero

Categoria: `blocks`
Numele: `hero`

| Câmp | Tip | Configurare |
|---|---|---|
| title | Text (Short text) | Required |
| subtitle | Text (Long text) | Not required |
| cta_text | Text (Short text) | Not required (ex: "Înscrie-te") |
| cta_link | Text (Short text) | Not required (ex: "/inscrie-te") |
| cta_secondary_text | Text (Short text) | Not required |
| cta_secondary_link | Text (Short text) | Not required |
| background_image | Media (Single media) | Not required |

### 5.4. blocks.text-block

Categoria: `blocks`
Numele: `text-block`

| Câmp | Tip | Configurare |
|---|---|---|
| body | Rich text (Blocks) | Required |
| alignment | Enumeration | Values: left, center, right. Default: left |

### 5.5. blocks.cta-banner

Categoria: `blocks`
Numele: `cta-banner`

| Câmp | Tip | Configurare |
|---|---|---|
| title | Text (Short text) | Required |
| description | Text (Long text) | Not required |
| button_text | Text (Short text) | Required |
| button_link | Text (Short text) | Required |
| background_color | Enumeration | Values: green, orange, white. Default: orange |

### 5.6. blocks.image-gallery

Categoria: `blocks`
Numele: `image-gallery`

| Câmp | Tip | Configurare |
|---|---|---|
| images | Media (Multiple media) | Required, Min: 1 |
| layout | Enumeration | Values: grid, carousel. Default: grid |
| caption | Text (Long text) | Not required |

### 5.7. blocks.accordion

Categoria: `blocks`
Numele: `accordion`

Componentă cu sub-componentă repetabilă:

Mai întâi creează `blocks.accordion-item`:

| Câmp | Tip | Configurare |
|---|---|---|
| title | Text (Short text) | Required |
| content | Rich text (Blocks) | Required |

Apoi creează `blocks.accordion`:

| Câmp | Tip | Configurare |
|---|---|---|
| heading | Text (Short text) | Not required |
| items | Component (repeatable) | → blocks.accordion-item |

### 5.8. blocks.quote

Categoria: `blocks`
Numele: `quote`

| Câmp | Tip | Configurare |
|---|---|---|
| text | Text (Long text) | Required |
| author | Text (Short text) | Not required |
| role | Text (Short text) | Not required |

### 5.9. blocks.video-embed

Categoria: `blocks`
Numele: `video-embed`

| Câmp | Tip | Configurare |
|---|---|---|
| url | Text (Short text) | Required (YouTube sau Vimeo URL) |
| caption | Text (Short text) | Not required |

### 5.10. blocks.stats-counter

Categoria: `blocks`
Numele: `stats-counter`

Sub-componentă `blocks.stat-item`:

| Câmp | Tip | Configurare |
|---|---|---|
| number | Text (Short text) | Required (ex: "200+", "30 mp") |
| label | Text (Short text) | Required (ex: "copaci plantați") |

Apoi `blocks.stats-counter`:

| Câmp | Tip | Configurare |
|---|---|---|
| items | Component (repeatable) | → blocks.stat-item |

### 5.11. blocks.program-points

Categoria: `blocks`
Numele: `program-points`

Componentă specifică pentru secțiunea „Din programul nostru" de pe homepage.

Sub-componentă `blocks.program-item`:

| Câmp | Tip | Configurare |
|---|---|---|
| area | Text (Short text) | Required (ex: "Sănătate mintală") |
| text | Text (Long text) | Required |

Apoi `blocks.program-points`:

| Câmp | Tip | Configurare |
|---|---|---|
| items | Component (repeatable) | → blocks.program-item |
| show_link | Boolean | Default: true |
| link_text | Text (Short text) | Default: "Vezi programul complet" |
| link_url | Text (Short text) | Default: "/despre-noi" |

### 5.12. blocks.newsletter-cta

Categoria: `blocks`
Numele: `newsletter-cta`

| Câmp | Tip | Configurare |
|---|---|---|
| title | Text (Short text) | Required |
| description | Text (Long text) | Not required |
| placeholder_text | Text (Short text) | Default: "email@exemplu.ro" |

---

## 6. Dynamic Zones — pagini flexibile

Dynamic Zones sunt cel mai puternic mecanism din Strapi pentru a crea pagini cu layout flexibil.

### 6.1. Cum funcționează

Când creezi un câmp de tip Dynamic Zone pe un Content Type (ex: `content` pe Page), selectezi care componente pot fi inserate în acea zonă. Apoi, la editare, poți adăuga oricâte instanțe ale acelor componente, în orice ordine.

```
Page: "Despre Noi"
└── content (Dynamic Zone):
    ├── [0] blocks.hero → { title: "Despre SENS", background_image: ... }
    ├── [1] blocks.text-block → { body: "Misiunea noastră...", alignment: "left" }
    ├── [2] blocks.stats-counter → { items: [{number: "16%", label: "tineri 18-29"}] }
    ├── [3] blocks.accordion → { heading: "Statut", items: [...capitolele] }
    └── [4] blocks.cta-banner → { title: "Înscrie-te", button_link: "/inscrie-te" }
```

### 6.2. Adăugarea componentelor la Dynamic Zone

1. Mergi la **Content-Type Builder → Page → content (câmpul Dynamic Zone)**
2. Click **Configure the zone** sau **Add a component to the zone**
3. Selectează componentele dorite din lista de blocks.* existente
4. Salvează

De acum încolo, la editarea oricărei Page, vei avea butonul "+" care îți permite să adaugi oricare din aceste componente.

### 6.3. Cum arată în API

Răspunsul REST conține un array cu `__component` pe fiecare element:

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Despre Noi",
      "slug": "despre-noi",
      "content": [
        {
          "__component": "blocks.hero",
          "title": "Despre SENS",
          "subtitle": "Sănătate · Educație · Natură · Sustenabilitate",
          "background_image": { "url": "/uploads/hero_bg.jpg" }
        },
        {
          "__component": "blocks.text-block",
          "body": "Misiunea noastră este...",
          "alignment": "left"
        },
        {
          "__component": "blocks.cta-banner",
          "title": "Vino alături de noi",
          "button_text": "Înscrie-te",
          "button_link": "/inscrie-te"
        }
      ]
    }
  }
}
```

Frontend-ul (SvelteKit) iterează peste acest array și randează componenta vizuală potrivită pe baza câmpului `__component`.

---

## 7. Cum se mapează fiecare pagină din site

Aceasta este legătura dintre paginile din wireframes și structurile Strapi. Pentru fiecare pagină, se explică de unde vine conținutul.

### ACASĂ (/)

Homepage-ul folosește un **Single Type** numit `Homepage`.

**Cum îl creezi:**

1. Content-Type Builder → Create new Single Type → `Homepage`
2. Adaugă câmpurile:

| Câmp | Tip | Ce controlează |
|---|---|---|
| hero_title | Text | "O Românie verde, echitabilă și modernă." |
| hero_subtitle | Text (Long) | Textul sub titlu |
| hero_cta_primary | Text | Textul butonului primar ("Înscrie-te") |
| hero_cta_primary_link | Text | "/inscrie-te" |
| hero_cta_secondary | Text | "Donează" |
| hero_cta_secondary_link | Text | "/doneaza" |
| hero_background | Media | Imaginea/video din hero |
| values | Component (repeatable) | → custom component `homepage.value-card` |
| program_points | Component (single) | → blocks.program-points |
| newsletter_title | Text | "Rămâi la curent" |
| newsletter_description | Text | "Abonează-te la newsletter" |
| seo | Component | → shared.seo |

Creează și componenta `homepage.value-card`:

| Câmp | Tip |
|---|---|
| title | Text ("Sănătate") |
| short_text | Text ("30 ședințe terapie decontate") |
| description | Text (Long) (textul din modal) |
| points | Component (repeatable) → `homepage.value-point` cu câmp `text` |
| link_text | Text ("Citește Programul Politic complet →") |
| link_url | Text ("/despre-noi") |

**Secțiunile care NU vin din Homepage Single Type:**

| Secțiune pe pagină | Sursa datelor |
|---|---|
| Ultimele știri (carousel) | `GET /api/articles?sort=publishedAt:desc&pagination[limit]=3` |
| Evenimente următoare | `GET /api/events?filters[start_date][$gte]=today&sort=start_date:asc&pagination[limit]=3` |
| Social media feed | `GET /api/social-feed?limit=3` (custom controller) |

### ȘTIRI (/stiri)

Nu necesită Single Type dedicat. Pagina e generată dinamic din colecția Article.

| Ce apare | Request API |
|---|---|
| Lista articole | `GET /api/articles?sort=publishedAt:desc&pagination[page]=1&pagination[pageSize]=10&populate=cover_image,category,author` |
| Filtrare pe categorie | Adaugă `&filters[category][slug][$eq]=comunicate` |
| Căutare | Custom endpoint `GET /api/articles/search?q=buget` |
| Filtrare pe dată | `&filters[publishedAt][$gte]=2026-02-20&filters[publishedAt][$lte]=2026-02-20` |

### ARTICOL INDIVIDUAL (/stiri/[slug])

| Ce apare | Request API |
|---|---|
| Articolul complet | `GET /api/articles?filters[slug][$eq]=sens-solicita-dezbatere&populate=deep` |
| Articole similare | `GET /api/articles?filters[category][id][$eq]=3&filters[id][$ne]=1&pagination[limit]=2` |

### EVENIMENTE (/evenimente)

Nu necesită Single Type dedicat. Pagina se generează din colecția Event.

| Ce apare | Request API |
|---|---|
| Evenimente viitoare | `GET /api/events?filters[start_date][$gte]=today&sort=start_date:asc&populate=cover_image` |
| Evenimente trecute | `GET /api/events?filters[start_date][$lt]=today&sort=start_date:desc&populate=cover_image` |
| Filtrare pe locație | Adaugă `&filters[location_name][$eq]=București` |
| Eveniment individual | `GET /api/events?filters[slug][$eq]=town-hall-buget-verde&populate=deep` |

**Câmpuri suplimentare pe Event pentru funcționalitățile noi:**

Adaugă aceste câmpuri la Event Collection Type:

| Câmp | Tip | Ce controlează |
|---|---|---|
| social_posts | Component (repeatable) | → event.social-post (postări de pe social media legate de eveniment) |
| ical_url | Text | URL generat automat pentru fișierul .ics |

Creează componenta `event.social-post`:

| Câmp | Tip |
|---|---|
| platform | Enumeration (instagram, facebook, twitter, tiktok) |
| post_url | Text (link extern la postarea originală) |
| embed_text | Text (Long) (textul postării) |
| media | Media (Single) (screenshot sau imagine din postare) |

**Endpoints custom pentru notificări și calendar:**

| Endpoint | Descriere |
|---|---|
| `GET /api/events/:id/ical` | Returnează fișier .ics standard pentru adăugare în calendar |
| `POST /api/events/:id/remind` | Setează reminder push (necesită auth). Stochează în tabel `EventReminder` (user_id, event_id, reminded_24h, reminded_1h) |
| `POST /api/events/:id/register` | Înregistrare participare (auth). Adaugă user la relația M:M `attendees` |

### DESPRE NOI (/despre-noi)

Folosește **Collection Type `Page`** cu Dynamic Zones.

Creezi o înregistrare Page cu slug `despre-noi` și compui conținutul din componente:

```
Page: "Despre SENS" (slug: despre-noi)
└── content:
    ├── blocks.hero → titlu, subtitlu
    ├── blocks.text-block → misiunea
    ├── blocks.cta-banner → "Familia Europeană" info box
    └── blocks.text-block → alte informații
```

Echipa vine separat: `GET /api/team-members?sort=display_order:asc&populate=photo,social_links`

Sub-paginile (Program, Statut, Manifest) pot fi fie:
- **Opțiunea A:** Pagini separate în Page collection (slug: `program-politic`, `statut`, `manifest`)
- **Opțiunea B:** Tabs în aceeași pagină, cu conținut structurat prin Dynamic Zone mai complex

Recomandare: Opțiunea A — o pagină separată pentru fiecare, mai ușor de gestionat.

### CONTACT (/contact)

**Single Type `ContactPage`:**

| Câmp | Tip | Ce controlează |
|---|---|---|
| title | Text | "Contact" |
| subtitle | Text | "Scrie-ne sau abonează-te..." |
| email | Text | "contact@cusens.eu" |
| address | Text | "București, Sector 1" |
| schedule | Text | "Luni – Vineri, 10:00 – 18:00" |
| newsletter_title | Text | "Abonează-te la newsletter" |
| newsletter_description | Text (Long) | Descriere |
| seo | Component | → shared.seo |

Formularul de contact se procesează printr-un custom controller (nu stochează în Strapi, ci trimite email).

### ÎNSCRIE-TE (/inscrie-te)

Formularul multi-step este hardcodat în frontend (câmpurile sunt fixe, definite de statut). Datele se trimit la:

```
POST /api/membership/apply
Body: { toate câmpurile din formular }
```

Custom controller-ul validează, creează un MemberProfile cu status `pending`, și trimite email de confirmare.

### DONEAZĂ (/doneaza)

Similar cu Înscrie-te — formularul e în frontend, datele se trimit la custom controller.

**Single Type `DonatePage`** opțional, pentru texte editabile:

| Câmp | Ce controlează |
|---|---|
| title | "Donează pentru SENS" |
| description | "Fiecare leu contează" |
| preset_amounts | JSON ([25, 50, 100, 200]) |
| cmf_text | Textul legal CMF |
| transparency_items | Component (repeatable) → procentajul folosirii banilor |

### DASHBOARD MEMBRU (/cont)

Datele vin din mai multe surse, toate filtrate pe utilizatorul autentificat:

| Secțiune | Request API |
|---|---|
| Profil + Card | `GET /api/users/me?populate=memberProfile` |
| Statistici donații | `GET /api/donations/my` |
| Evenimente | `GET /api/events?filters[attendees][id][$eq]=USER_ID` |
| Card digital | `GET /api/membership/card` (custom, generează PNG) |

### SOCIAL FEED

Custom controller care agregă date din API-urile externe:

```
GET /api/social-feed?platform=all&limit=10
```

Datele NU sunt stocate ca Collection Type — sunt cached temporar (Redis sau in-memory) și refreshed de un cron job la fiecare 15 minute.

---

## 8. Adăugarea de conținut nou

### 8.1. Publicarea unui articol nou

1. Accesează panoul admin → **Content Manager → Article**
2. Click **Create new entry**
3. Completează:
   - `title`: Titlul articolului
   - `slug`: Se auto-generează din title (poți modifica)
   - `excerpt`: Rezumatul scurt (apare pe carduri)
   - `body`: Conținutul complet (rich text — poți adăuga imagini, link-uri, heading-uri)
   - `cover_image`: Upload imaginea principală (recomandare: 1200×675, format 16:9)
   - `category`: Selectează din categoriile existente
   - `author`: Selectează din TeamMembers
   - `tags`: Selectează sau creează tag-uri
   - `seo`: Completează meta_title și meta_description (opțional dar recomandat)
4. Click **Save** (salvează ca draft)
5. Click **Publish** (face articolul vizibil pe site)

### 8.2. Adăugarea unui eveniment

1. Content Manager → **Event** → Create new entry
2. Completează câmpurile (title, date, location, etc.)
3. Setează `registration_open` pe true dacă vrei să se poată înscrie lumea
4. Publish

**După eveniment (adaugare postări social media):**
1. Editează evenimentul din Content Manager
2. La câmpul `social_posts`, click „Add an entry"
3. Selectează platforma (Instagram, Facebook, etc.)
4. Adaugă link-ul postării + textul + imaginea/screenshot
5. Save — postările vor apărea automat pe pagina evenimentului în secțiunea „Postări de la acest eveniment"

### 8.3. Adăugarea unui membru în echipă

1. Content Manager → **TeamMember** → Create new entry
2. Completează name, role, bio, upload photo
3. Adaugă social links (click "Add an entry" pe câmpul repeatable)
4. Setează `display_order` (numărul determină ordinea pe pagină)
5. Setează `is_leadership` pe true dacă face parte din conducere

### 8.4. Editarea conținutului unei pagini statice

1. Content Manager → **Page** → selectează pagina (ex: "Despre SENS")
2. În câmpul `content` (Dynamic Zone), poți:
   - **Reordona** componentele prin drag & drop
   - **Edita** orice componentă existentă (click pe ea)
   - **Șterge** o componentă (icon trash)
   - **Adaugă** o componentă nouă (butonul "+" între componente)
3. Save → Publish

---

## 9. Adăugarea de pagini și secțiuni noi

### 9.1. Adăugarea unei pagini noi (fără cod)

Datorită sistemului Page + Dynamic Zones, poți crea pagini complet noi fără a modifica frontend-ul — **dacă pagina folosește doar componentele block existente**.

**Exemplu: Adaugă pagina „Filiala Cluj"**

1. Content Manager → **Page** → Create new entry
2. `title`: "Filiala Cluj-Napoca"
3. `slug`: "filiala-cluj" (URL-ul va fi /filiala-cluj)
4. `content` (Dynamic Zone) — construiește pagina:
   - Adaugă **blocks.hero** → title: "Filiala Cluj-Napoca", background_image: upload
   - Adaugă **blocks.text-block** → body: "Filiala SENS Cluj..."
   - Adaugă **blocks.stats-counter** → items: [{number: "120", label: "membri"}]
   - Adaugă **blocks.cta-banner** → "Alătură-te filialei", link: "/inscrie-te"
5. Completează SEO
6. Save → Publish

Frontend-ul SvelteKit are o rută `[slug]` care preia automat orice Page după slug și randează componentele.

### 9.2. Adăugarea unui nou tip de componentă block

Dacă ai nevoie de o secțiune care nu există în componentele actuale:

**Exemplu: Adaugă un block „Timeline" pentru istoria partidului**

**Pas 1 — Creează componenta în Strapi:**

1. Content-Type Builder → Components → Create new component
2. Categorie: `blocks`, Nume: `timeline`
3. Adaugă câmp `heading` (Text)
4. Adaugă câmp `items` (Component, repeatable) → creează sub-componenta `blocks.timeline-event`:
   - `date` (Text): "Martie 2024"
   - `title` (Text): "Fondarea SENS"
   - `description` (Text, Long): "Partidul SENS..."
5. Save

**Pas 2 — Adaugă la Dynamic Zone:**

1. Content-Type Builder → Page → câmpul `content` → Configure
2. Adaugă `blocks.timeline` la lista de componente permise
3. Save

**Pas 3 — Adaugă componenta vizuală în frontend:**

Creează fișierul `src/lib/components/blocks/Timeline.svelte`:

```svelte
<script>
  export let data;
</script>

<section class="timeline">
  <h2>{data.heading}</h2>
  {#each data.items as item}
    <div class="timeline-event">
      <span class="date">{item.date}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  {/each}
</section>
```

Adaugă maparea în renderer-ul de Dynamic Zone:

```svelte
<!-- src/lib/components/DynamicZone.svelte -->
<script>
  import Hero from './blocks/Hero.svelte';
  import TextBlock from './blocks/TextBlock.svelte';
  import Timeline from './blocks/Timeline.svelte';
  // ...

  const componentMap = {
    'blocks.hero': Hero,
    'blocks.text-block': TextBlock,
    'blocks.timeline': Timeline,
    // ...
  };

  export let content = [];
</script>

{#each content as block}
  {#if componentMap[block.__component]}
    <svelte:component this={componentMap[block.__component]} data={block} />
  {/if}
{/each}
```

**Pas 4 — Folosește-l:**

Acum poți adăuga blocul Timeline în orice Page din panoul admin, fără alte modificări de cod.

### 9.3. Adăugarea unei secțiuni noi pe Homepage

Homepage folosește un Single Type, deci adăugarea unei secțiuni noi necesită:

1. Content-Type Builder → Homepage → adaugă câmpul nou
2. Frontend → adaugă secțiunea în `src/routes/+page.svelte`

**Exemplu: Adaugă secțiune „Susținători notabili"**

1. Creează componentă `homepage.supporter` (name, role, quote, photo)
2. Adaugă câmp `supporters` (Component, repeatable → homepage.supporter) pe Homepage
3. Completează datele în Content Manager
4. Adaugă secțiunea vizuală în frontend

### 9.4. Transformarea unei secțiuni hardcoded într-una editabilă

Dacă ai o secțiune al cărei conținut e momentan fix în frontend și vrei s-o faci editabilă din Strapi:

1. Identifică ce date are secțiunea (texte, imagini, link-uri)
2. Creează câmpurile corespunzătoare pe Single Type-ul paginii (sau ca componentă)
3. Populează datele inițiale în Content Manager
4. Modifică frontend-ul să preia datele din API în loc de constante

---

## 10. Relații între conținuturi

### 10.1. Tipuri de relații

| Relație | Exemplu | Cum se creează |
|---|---|---|
| One-to-One | User ↔ MemberProfile | Relation field, selectează "has one" |
| One-to-Many | Category → Articles | Pe Article: relation "belongs to one" Category |
| Many-to-Many | Article ↔ Tags | Relation field, selectează "has and belongs to many" |

### 10.2. Crearea relațiilor în Content-Type Builder

1. Pe Collection Type-ul unde vrei relația, adaugă un câmp de tip **Relation**
2. Selectează tipul de Collection Type cu care faci relația
3. Alege natura relației (cu iconițele vizuale din interfață)
4. Denumește câmpul (ex: `category`, `tags`, `author`)

### 10.3. Popularea relațiilor în API

Relațiile nu se returnează automat în API — trebuie să le ceri explicit:

```
# Doar ID-urile relațiilor
GET /api/articles

# Cu datele complete ale relațiilor
GET /api/articles?populate=category,author,tags

# Populare adâncă (relații în relații)
GET /api/articles?populate=deep

# Populare selectivă
GET /api/articles?populate[category][fields]=name,slug&populate[author][fields]=name,photo
```

---

## 11. Media și imagini

### 11.1. Upload

Imaginile se uploadează prin panoul admin (drag & drop sau browse) sau programatic prin API:

```
POST /api/upload
Content-Type: multipart/form-data
Body: files (binary)
```

### 11.2. Dimensiuni recomandate

| Utilizare | Dimensiuni | Format |
|---|---|---|
| Hero background | 1920×1080 | JPG/WebP, max 500KB |
| Article cover | 1200×675 (16:9) | JPG/WebP, max 300KB |
| Team member photo | 400×400 (1:1) | JPG/WebP, max 150KB |
| OG Image (social share) | 1200×630 | JPG/PNG |
| Gallery images | 1200×auto | JPG/WebP, max 400KB |

### 11.3. Provider de stocare

Default: Strapi stochează local în `public/uploads/`. Pentru producție, configurează Cloudflare R2:

```typescript
// config/plugins.ts
export default {
  upload: {
    config: {
      provider: 'strapi-provider-cloudflare-r2',
      providerOptions: {
        accessKeyId: env('R2_ACCESS_KEY_ID'),
        secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
        endpoint: env('R2_ENDPOINT'),
        bucket: env('R2_BUCKET'),
        publicUrl: env('R2_PUBLIC_URL'),
      },
    },
  },
};
```

---

## 12. Roluri și permisiuni

### 12.1. Configurare roluri

Strapi vine cu plugin-ul Users & Permissions. Configurarea se face în Settings → Users & Permissions → Roles.

**Roluri de configurat:**

| Rol Strapi | Mapare SENS | Ce poate face |
|---|---|---|
| Public | Vizitator | GET pe articles, events, pages, team-members, social-feed |
| Authenticated | Simpatizant | Public + profil, inscriere evenimente, donații personale |
| Custom: Membru | Membru | Authenticated + voluntariat, card digital |
| Custom: Moderator | Moderator | Membru + editare conținut |
| Custom: Admin | Admin | Acces complet |

### 12.2. Setare permisiuni per rol

1. Settings → Users & Permissions → Roles → **Public**
2. Pentru fiecare Collection Type, bifează acțiunile permise:
   - Article: find, findOne ✓
   - Event: find, findOne ✓
   - Page: find, findOne ✓
   - TeamMember: find ✓
   - Donation: (nimic) ✗
   - MemberProfile: (nimic) ✗
3. Save

Repetă pentru Authenticated, Membru, etc., adăugând permisiuni incrementale.

---

## 13. Custom Controllers și Lifecycles

### 13.1. Când ai nevoie de custom controllers

Strapi generează automat CRUD controllers, dar unele funcționalități necesită logică personalizată:

| Funcționalitate | De ce custom |
|---|---|
| Donații | Validare CNP, criptare, integrare procesator plăți |
| Membership apply | Logică multi-step, generare card number |
| Volunteer checkin | Validare QR, calcul ore |
| Newsletter subscribe | Rate limiting, double opt-in |
| Social feed | Agregare API-uri externe |
| Article search | Full-text search custom |

### 13.2. Exemplu: Custom controller pentru donații

```typescript
// src/api/donation/controllers/donation.ts
import { factories } from '@strapi/strapi';
import { encrypt } from '../services/cnp-encrypt';

export default factories.createCoreController('api::donation.donation', ({ strapi }) => ({
  
  async create(ctx) {
    const { amount, donor_name, donor_cnp, donor_email, payment_method, is_recurring } = ctx.request.body;
    
    // Validare CNP
    if (!isValidCNP(donor_cnp)) {
      return ctx.badRequest('CNP invalid');
    }
    
    // Criptare CNP
    const encrypted_cnp = encrypt(donor_cnp);
    
    // Creare donație
    const donation = await strapi.entityService.create('api::donation.donation', {
      data: {
        amount,
        donor_name,
        donor_cnp: encrypted_cnp,
        donor_email,
        payment_method,
        is_recurring,
        status: 'pending',
        user: ctx.state.user?.id || null,
      }
    });
    
    // Inițiere plată la Netopia/Stripe
    const paymentUrl = await initiatePayment(donation);
    
    return { donation_id: donation.id, payment_url: paymentUrl };
  },

  // Endpoint custom: donațiile utilizatorului curent
  async findMy(ctx) {
    const userId = ctx.state.user.id;
    const donations = await strapi.entityService.findMany('api::donation.donation', {
      filters: { user: userId },
      sort: { createdAt: 'desc' },
    });
    return donations;
  }
}));
```

### 13.3. Lifecycles — acțiuni automate

Lifecycle hooks rulează automat la anumite acțiuni pe conținut:

```typescript
// src/api/article/content-types/article/lifecycles.ts
export default {
  beforeCreate(event) {
    // Auto-calculează reading_time din body
    const { data } = event.params;
    if (data.body) {
      const wordCount = data.body.split(/\s+/).length;
      data.reading_time = Math.ceil(wordCount / 200);
    }
  },
  
  afterCreate(event) {
    // Trimite notificare push la publicare
    const { result } = event;
    if (result.publishedAt) {
      sendPushNotification({
        title: 'Articol nou SENS',
        body: result.title,
        url: `/stiri/${result.slug}`
      });
    }
  }
};
```

---

## 14. Frontend — cum consumă SvelteKit datele

### 14.1. Fetch din Strapi

```typescript
// src/lib/strapi.ts
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'https://api.cusens.eu';

export async function fetchStrapi(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`/api${endpoint}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  return res.json();
}
```

### 14.2. Exemplu: Pagina de articol

```svelte
<!-- src/routes/stiri/[slug]/+page.server.ts -->
<script lang="ts">
  import { fetchStrapi } from '$lib/strapi';
  
  export async function load({ params }) {
    const { data } = await fetchStrapi(`/articles`, {
      'filters[slug][$eq]': params.slug,
      'populate': 'deep'
    });
    
    if (!data.length) throw error(404, 'Articol negăsit');
    
    const article = data[0];
    
    // Articole similare
    const { data: related } = await fetchStrapi(`/articles`, {
      'filters[category][id][$eq]': article.attributes.category.data.id,
      'filters[id][$ne]': article.id,
      'pagination[limit]': '2',
      'populate': 'cover_image,category'
    });
    
    return { article, related };
  }
</script>
```

### 14.3. Randarea Dynamic Zones

```svelte
<!-- src/routes/[slug]/+page.svelte -->
<script>
  import DynamicZone from '$lib/components/DynamicZone.svelte';
  export let data;
</script>

<DynamicZone content={data.page.attributes.content} />
```

Componenta DynamicZone iterează peste blocks și randează fiecare conform tipului — exact cum e descris în secțiunea 9.2.

---

## 15. Patterns frecvente și troubleshooting

### 15.1. Conținut nou nu apare pe site

**Cauze posibile:**
- Articolul/pagina este în status **Draft** — trebuie dat Publish
- Cache Cloudflare servește versiunea veche — purge cache din Cloudflare dashboard sau așteaptă TTL-ul
- Query-ul API nu include `populate` pentru relații/media

### 15.2. Imaginea nu se afișează

- Verifică dacă URL-ul din API este relativ (`/uploads/img.jpg`) — frontend-ul trebuie să prefixeze cu STRAPI_URL
- Verifică dimensiunea — fișierele peste limita de upload (default 10MB) sunt refuzate
- Verifică formatul — doar jpg, png, gif, webp, svg, pdf sunt acceptate default

### 15.3. Vreau un câmp nou pe un Collection Type existent

1. Content-Type Builder → selectează tipul → Add another field
2. Configurează câmpul
3. Save (Strapi face restart automat în development)
4. Completează datele pentru înregistrările existente (câmpul va fi gol)
5. Actualizează frontend-ul dacă vrei să afișezi noul câmp

**Atenție în producție:** Adăugarea de câmpuri necesită restart Strapi și posibil migrare DB. Testează întâi pe staging.

### 15.4. Vreau să reordonez componentele dintr-o Dynamic Zone

În Content Manager, la editarea paginii, poți face drag & drop pe componentele din Dynamic Zone. Ordinea din admin = ordinea din API = ordinea pe site.

### 15.5. Vreau să duplic o pagină

Strapi v5 are buton de **Clone** pe fiecare entry. Click pe entry → dropdown lângă Save → Clone. Modifică slug-ul (trebuie să fie unic), editează conținutul, Publish.

### 15.6. Performanță API lentă

- Folosește `populate` selectiv, nu `populate=deep` pe liste
- Adaugă `fields` pentru a selecta doar câmpurile necesare: `?fields=title,slug,excerpt`
- Activează cache la nivel de Cloudflare pe endpoint-urile publice
- Adaugă index-uri PostgreSQL pe câmpurile folosite frecvent în filtre (slug, publishedAt)
-e 
---
---

# PARTEA IV — WIREFRAMES (REFERINȚĂ)

Wireframes-urile interactive sunt livrate ca fișier JSX separat: `SENS_Wireframes_v1_4.jsx`

Vizualizare: Deschide fișierul în Claude Artifacts sau orice mediu React.

Pagini incluse (11 total, cu navigare funcțională între ele):

| Pagina | Ce conține |
|---|---|
| Acasă | Hero cu CTA, valori cu modale, secțiune program, carousel știri, evenimente (click → pagina evenimente), social feed, newsletter |
| Știri | Filtre categorii, search, filtru calendar, lista articolelor |
| Articol Individual | Hero image full-width, breadcrumb funcțional, conținut complet, share social (FB/X/LinkedIn/WhatsApp), articole similare |
| Despre Noi | Tabs (Misiune/Echipa/Program/Statut/Manifest), European Greens, grid echipă |
| Evenimente | Tab Viitoare/Trecute, filtre locație dinamice, carduri cu badge tip + status. Detaliu: info box, înscriere, adaugă în calendar, activează reminder. Trecute: postări social media de la eveniment |
| Contact | Formular de contact, secțiune newsletter cu GDPR, date de contact |
| Înscrie-te | Formular multi-step complet funcțional (5 etape: Date → Adresă → Motivație → Consimțământ → Confirmare) |
| Donează | Sume predefinite, tip donație, formular donator cu CNP, metode plată, conformitate CMF |
| Dashboard Membru | Card digital cu QR, statistici, grid navigare (evenimente, voluntariat, donații, social, setări, realizări) |
| Social Feed | Filtre per platformă, postări agregate Instagram/X/Facebook/TikTok |
| Strapi API | Content Types, REST Endpoints, ERD relații, Auth/RBAC, Plugins & Extensions |

Elemente de design transversale:
- Hamburger menu în stânga (mobile) cu navigare ierarhică funcțională
- Buton login/profil (icon user) în navbar în loc de buton Donează
- Iconița de accesibilitate (bottom-right) pe toate paginile
- Design flat, fără emoji-uri, cu SVG-uri simple
- „Membru European Greens / EFA" în footer și hamburger menu
- Vizualizare side-by-side Mobile + Desktop cu toggle
