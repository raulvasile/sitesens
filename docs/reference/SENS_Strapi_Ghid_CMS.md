# SENS — Ghid Strapi CMS

> Cum construiești și administrezi conținutul site-ului SENS în Strapi v5
> Companion document pentru Specificațiile Tehnice v1.3

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
