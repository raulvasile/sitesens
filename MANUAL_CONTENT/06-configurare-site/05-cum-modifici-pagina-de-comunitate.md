# Cum modifici pagina de comunitate

## Ce vei face
Modifici linkurile, embed-urile și textele de pe `/comunitate` — pagina dedicată rețelelor sociale.

## Unde se află

Single Types → **Pagină Comunitate**.

## Câmpuri principale

### Header

| Câmp | Ce pui |
|---|---|
| **Title** | „Comunitate" |
| **Subtitle** | Subtitlu lead |

### Platforme sociale

Componenta **Platforms** — fiecare platformă (Facebook, Instagram, TikTok etc.) e configurată separat.

#### Cum adaugi o platformă

1. **„Add an entry to platforms"**
2. Completezi:

| Câmp | Ce pui |
|---|---|
| **Name** | Numele platformei (facebook, instagram, tiktok, twitter, linkedin, youtube) |
| **Handle** | Handle-ul (ex: `@partidulsens` sau `Partidul SENS`) |
| **URL** | Link-ul complet către profil |
| **Description** | Scurtă descriere (ce postezi pe această platformă) |
| **Color** | Hex color, opțional (ex: `#1877F2` pentru Facebook) |
| **Embed URL** | Opțional — URL pentru embed direct (vezi mai jos) |
| **Icon SVG** | Lasă gol; se completează automat |
| **Follow CTA text** | Text buton (ex: „Urmărește pe Facebook") |
| **Order** | Ordine afișare |

3. Save

#### Embed direct (Instagram, TikTok, Facebook)

Pentru a afișa un **embed live** al unei postări specifice:

1. Pe platformă, găsești postarea
2. Apeși „Embed" → copiezi URL-ul (sau codul HTML, ai nevoie doar de URL)
3. În CMS, lipești în câmpul **Embed URL**

Pe site se va încărca embed-ul real (nu doar un link).

### Secțiunea „Posts"

| Câmp | Ce pui |
|---|---|
| **Posts heading** | Titlu deasupra grilei de embed-uri (ex: „Ultimele postări") |
| **Embed fallback text** | Text afișat dacă embed-urile nu se încarcă (ex: „Vezi postările pe @partidulsens") |

### Beneficii / features

Componenta **Features** — listă de motive pentru care e bine să urmărești:

1. **„Add an entry to features"**
2. Completezi:

| Câmp | Ce pui |
|---|---|
| **Title** | „Update-uri zilnice" |
| **Description** | „Vezi imediat ce facem și unde poți participa" |
| **Icon** | Emoji sau nume icon (opțional) |

### SEO

Vezi [Cum completezi SEO](../08-seo-si-distribuire/01-cum-completezi-seo.md).

## Workflow recomandat

### Adăugare platformă nouă (ex: Threads)
1. Verifici că CMS-ul recunoaște platforma (vezi enum în câmpul Name)
2. Dacă nu, contactează tehnicianul (necesită update schema)
3. Dacă da:
   - Add entry → completezi
   - Save
   - Refresh `/comunitate` → verifici

### Refresh embed-uri
Dacă ai schimbat o postare embed-uită:
1. Modifici **Embed URL** la noua postare
2. Save
3. Refresh pagina (poate fi necesar Ctrl+F5)

## ⚠️ Probleme cunoscute cu embed-uri

| Platform | Comportament |
|---|---|
| **Facebook** | Necesită ca postarea să fie publică |
| **Instagram** | Doar conturi business / creator pot fi embed-uite |
| **TikTok** | Embed funcționează dacă postarea nu e privată |
| **Twitter/X** | Restricții recente API; embed-uri pot fi instabile |

Dacă un embed nu se încarcă, va apărea **Embed fallback text**.

## Sincronizare cu Footer

Linkurile sociale din **Footer** sunt independente de cele de aici. Dacă schimbi URL-ul unei rețele sociale, **trebuie să modifici în ambele locuri**:
- Single Types → **Footer** → Social links
- Single Types → **Pagină Comunitate** → Platforms

---

**Pagini conexe:**
- [Cum modifici footer-ul](02-cum-modifici-footer-ul.md)
