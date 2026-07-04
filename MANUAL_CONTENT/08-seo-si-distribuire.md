# 08. SEO și distribuire

## Cuprins

1. [Cum completezi SEO-ul unei pagini](#cum-completezi-seo-ul-unei-pagini)
2. [Cum scrii un slug bun](#cum-scrii-un-slug-bun)
3. [Cum verifici cum arată pe Facebook](#cum-verifici-cum-arată-pe-facebook)

---

## Cum completezi SEO-ul unei pagini

### Ce vei face
Setezi **cum apare pagina ta în Google** și **cum arată când e partajată pe Facebook/Twitter**.

### Unde se află

Pe orice articol, eveniment, pagină, single type — **scroll jos** până la secțiunea **SEO**.

E un component care apare la sfârșit, separat vizual de restul câmpurilor.

### Câmpuri SEO

#### Meta Title

**Ce e:** titlul afișat în:
- Tab-ul browserului
- Rezultatele Google (linia albastră de sus)
- Linkurile partajate

**Reguli:**
- **Lungime:** 50–60 caractere ideal (peste, Google îl trunchează cu „…")
- **Format:** Titlu specific + brand
- **Exemple:**
  - ✅ „Manifest pentru o Românie verde — SENS"
  - ✅ „Dezbatere despre educație, Cluj-Napoca, 26 mai"
  - ❌ „Pagina principală" (prea generic)
  - ❌ „SENS — Cel mai bun partid politic din România cu cele mai bune politici" (prea lung)

**Tip:** dacă lași câmpul gol, se folosește titlul intrării ca fallback.

#### Meta Description

**Ce e:** descrierea sub titlul Google și pe link-uri partajate.

**Reguli:**
- **Lungime:** 140–160 caractere ideal
- **Conținut:** explică **ce** e pagina și **de ce** ar trebui cititorul să apese
- **Folosește** verbe de acțiune: „Află", „Vezi", „Descoperă"
- **Exemple:**
  - ✅ „Citește manifestul SENS pentru o Românie verde, echitabilă și modernă. 5 direcții concrete pentru schimbare."
  - ✅ „Înscrie-te la dezbaterea despre educație din Cluj, 26 mai. Acces gratuit, locuri limitate."
  - ❌ „Pagina noastră de SENS." (nu spune nimic)

#### OG Image (imagine partajare)

**Ce e:** imaginea afișată când cineva partajează linkul pe Facebook, Twitter, WhatsApp, LinkedIn.

**Reguli:**
- **Dimensiune:** 1200×630 px (ratio 1.91:1)
- **Format:** JPG sau PNG
- **Sub:** 300 KB
- **Conținut:** text mare lizibil + logo + culori brand
- **Test:** thumbnail mic (cum apare în feed) trebuie să fie tot lizibil

**Tip:** dacă lași gol, se folosește **cover image** ca fallback. Pentru articole/evenimente, cover image e de obicei suficient.

#### Canonical URL

**Ce e:** URL-ul „original" al paginii, dacă același conținut apare în alt loc.

**Când îl completezi:**
- Republici un articol care a apărut prima dată pe alt site
- În 99% din cazuri **lasă gol**

#### No Index

**Ce e:** toggle care ascunde pagina de Google.

**Când îl bifezi:**
- Pagini de **mulțumire** după form-uri (ex: „/contact/multumesc")
- Pagini **interne** sau **de test**
- Conținut **temporar** (campanii sezonale terminate)

**Default:** debifat (pagina e indexată).

### Workflow recomandat

Pentru fiecare intrare nouă (articol, eveniment, pagină):

```
1. Termini conținutul
2. Mergi la secțiunea SEO
3. Meta Title:
   - Scurt, captivant
   - 50-60 caractere
   - Verifici că nu e identic cu titlul (dacă da, lasă gol)
4. Meta Description:
   - 140-160 caractere
   - Verbe de acțiune
5. OG Image:
   - Dacă cover image e bună, lasă gol
   - Dacă vrei imagine specifică pentru share, încarci
6. Save + Publish
```

### Cum verifici dacă e bine

#### Test 1 — Lungime caractere
- **Meta title:** numără caracterele (sau folosește un tool ca [serpsim.com](https://www.serpsim.com))
- **Meta description:** la fel

#### Test 2 — Cum arată în Google
1. După publish, deschide Google
2. Caută `site:cusens.eu [titlul tău]`
3. Vezi cum apare în SERP
4. Notă: poate dura 24-48h ca Google să reindexeze

#### Test 3 — Cum arată pe Facebook
Vezi [Cum verifici cum arată pe Facebook](#cum-verifici-cum-arată-pe-facebook).

### Greșeli comune

| Greșeală | Consecință | Fix |
|---|---|---|
| Meta title identic cu titlul afișat | Redundanță; Google poate alege singur | Lasă gol sau scrie variantă scurtă |
| Meta description peste 160 caractere | Google taie cu „…" | Scurtează |
| OG image cu text mic | Ilizibil pe Twitter / mobile | Mărește text-ul, contrast puternic |
| Lași SEO gol pe articol cheie | Apare URL-ul ca titlu pe Google (urât) | Completează **mereu** SEO |
| Activezi No Index din greșeală | Pagina dispare din Google | Debifează |

### SEO pentru imagini

⚠️ Diferit de SEO pentru pagini, dar important: **alt text-ul** imaginilor contează pentru SEO. Vezi [Cum scrii un alt text bun](04-imagini.md#cum-scrii-un-alt-text-bun).

---

**Pagini conexe:**
- [Cum scrii un slug bun](#cum-scrii-un-slug-bun)
- [Cum verifici cum arată pe Facebook](#cum-verifici-cum-arată-pe-facebook)
- [Cum scrii un alt text bun](04-imagini.md#cum-scrii-un-alt-text-bun)

---

## Cum scrii un slug bun

### Ce e un slug
**Slug-ul** e partea din URL care identifică pagina ta:

```
https://cusens.eu/stiri/manifest-pentru-clima
                       └────────┬────────┘
                              slug
```

Pentru articole, evenimente, pagini, categorii, etichete — fiecare are slug propriu.

### Cum se generează

CMS-ul îl creează **automat** din titlu:

| Titlu | Slug auto |
|---|---|
| „Manifest pentru o Românie verde" | `manifest-pentru-o-romanie-verde` |
| „Dezbatere despre educație 2026" | `dezbatere-despre-educatie-2026` |
| „Întâlnire SENS — Cluj-Napoca" | `intalnire-sens-cluj-napoca` |

Diacriticele se înlocuiesc, spațiile devin liniuțe, totul lowercase.

### Reguli pentru slug-uri bune

#### ✅ Bun
- **Lowercase** (litere mici)
- **Liniuțe** între cuvinte (`-`), nu underscore (`_`)
- **Fără diacritice** (`a` în loc de `ă`, `t` în loc de `ț`)
- **Fără spații**
- **Scurt** (max 5–7 cuvinte)
- **Descriptiv** (cititorul înțelege subiectul fără să intre)

#### ❌ Rău
| Slug rău | Problemă |
|---|---|
| `Manifest-Pentru-Clima` | Litere mari nepermise |
| `manifest pentru clima` | Spații nepermise |
| `manifest_pentru_clima` | Underscore (folosește liniuțe) |
| `manifest-pentru-clima-din-romania-2026-aprilie-publicat-de-sens` | Prea lung |
| `articol-1234` | Nu spune nimic |
| `manifest-pentru-clîmă` | Diacritice (chiar dacă funcționează tehnic, urâte în URL) |

### Cum modifici un slug

1. Deschizi intrarea
2. La câmpul **Slug**, click → editezi
3. Save

⚠️ **Foarte important:** dacă **modifici slug-ul unei intrări publicate**:
- Toate **link-urile vechi** (în Facebook, Twitter, alte site-uri) se **rup**
- Google va trebui să reindexeze (poate dura zile)
- Vizitatorii care au link-ul vechi vor vedea **404 Not Found**

**Recomandare:** nu modifica slug-ul după publish dacă nu e absolut necesar.

### Slug-uri pentru categorii și etichete

Mai scurte:
- Categorie „Politici publice" → `politici-publice` sau `politici`
- Etichetă „energie regenerabilă" → `energie-regenerabila`

### Slug-uri pentru pagini libere (Pagini)

Slug-ul devine URL-ul direct al paginii:

| Slug | URL |
|---|---|
| `despre-noi` | `cusens.eu/despre-noi` |
| `program` | `cusens.eu/program` |
| `voluntariat` | `cusens.eu/voluntariat` |

Folosește **slug-uri scurte** pentru pagini importante.

### Slug-uri rezervate (nu folosi)

Anumite slug-uri sunt **rezervate** pentru rute existente ale site-ului. Nu le poți folosi pentru pagini noi:

- `stiri` (lista articolelor)
- `evenimente` (lista evenimentelor)
- `contact`, `doneaza`, `inscrie-te`, `newsletter`, `comunitate`, `politica-confidentialitate`
- `api`, `admin`, `_app`, `assets`

Dacă încerci să creezi o pagină cu slug rezervat, va apărea o eroare sau va fi suprascrisă pagina existentă.

### Slug-uri cu cifre

Adesea utile pentru:
- **Anul** evenimentului: `congres-2026`
- **Versiunea** programului: `program-v2`
- **Numărul** ediției: `edicia-3-newsletter`

### Cum gestionezi conflictele

Dacă încerci să salvezi un slug deja folosit (duplicat), CMS-ul îți dă eroare:

> "Slug must be unique"

Adaugă un prefix/sufix care diferențiază:
- `manifest-clima` → `manifest-clima-2026`
- `dezbatere-cluj` → `dezbatere-cluj-mai`

### Slug bun pentru SEO

- **Cuvinte-cheie** în slug ajută Google
- ❌ `articol-123` → invizibil pentru SEO
- ✅ `manifest-romania-verde-2026` → conține cuvinte-cheie

---

**Pagini conexe:**
- [Cum completezi SEO](#cum-completezi-seo-ul-unei-pagini)
- [Cum gestionezi categoriile](05-taxonomii.md#cum-gestionezi-categoriile-de-articole)

---

## Cum verifici cum arată pe Facebook

### De ce contează
Când cineva partajează un link de pe site-ul tău pe Facebook, Twitter, WhatsApp, LinkedIn — apare un **card mare cu imagine + titlu + descriere**.

Cum arată acest card determină **dacă oamenii apasă** sau scrollează mai departe.

### Ce influențează cardul

Trei câmpuri din **SEO** (vezi [Cum completezi SEO](#cum-completezi-seo-ul-unei-pagini)):

1. **Meta Title** — titlul mare al cardului
2. **Meta Description** — text mic sub titlu
3. **OG Image** — imaginea (sau cover image ca fallback)

### Tool-uri de verificare

#### 🔵 Facebook Sharing Debugger
**URL:** [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)

1. Lipești URL-ul tău (ex: `https://cusens.eu/stiri/manifest-clima`)
2. Click **„Debug"**
3. Vezi exact cum apare cardul
4. Dacă imaginea e veche → click **„Scrape Again"** (Facebook re-citește pagina)

#### ⚫ Twitter Card Validator (X)
**URL:** [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) — momentan poate fi indisponibil din cauza schimbărilor X.

Alternative: lipește direct linkul într-un draft de tweet și vezi preview-ul.

#### 💬 LinkedIn Post Inspector
**URL:** [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)

1. Lipești URL-ul
2. Click **„Inspect"**
3. Vezi cardul

#### 📱 Test direct pe WhatsApp
1. Trimite-ți ție linkul în WhatsApp
2. Aștepți 2-3 secunde să se încarce preview-ul
3. Vezi cum arată

### Workflow tipic

#### La publicarea unui articol nou
```
1. Publish articol în Strapi
2. Aștepți 30 secunde (cache frontend)
3. Deschizi Facebook Debugger
4. Lipești URL-ul → Debug
5. Verifici:
   ✓ Imaginea apare (mare, lizibilă)
   ✓ Titlul nu e tăiat
   ✓ Descrierea conține teasere
6. Dacă ceva e greșit:
   - Modifici SEO în Strapi
   - Save + Publish
   - "Scrape Again" în Debugger
   - Re-verifici
```

#### Cache-ul Facebook
Facebook **cachează** preview-urile **30 zile** după prima accesare a unui URL. Dacă schimbi imaginea sau titlul după ce link-ul a fost partajat:

1. Modifici SEO în Strapi → Publish
2. Mergi la **Facebook Debugger**
3. Lipești URL → **„Scrape Again"**
4. Acum cardul actualizat e folosit pentru noi share-uri

⚠️ **Share-urile vechi NU se actualizează retroactiv** — cardurile partajate înainte rămân cu versiunea veche.

### Probleme frecvente

#### Imaginea nu apare
| Cauză | Fix |
|---|---|
| OG image lipsește | Setezi în SEO sau cover image |
| Imagine prea mare (>5 MB) | Comprimă |
| Imagine prea mică (<200×200) | Folosește 1200×630 |
| Cale relativă în URL | Trebuie URL absolut (Strapi îl generează automat) |

#### Titlul e tăiat
- Mai scurt: maxim 60 caractere
- Editezi `Meta Title` în SEO

#### Descrierea greșită
- Editezi `Meta Description` în SEO
- Maxim 160 caractere

#### Apare alt site / titlu
- Verifici că URL-ul e corect (nu cu typo)
- Verifici că pagina e **publicată** (nu draft)
- Refreshezi cu „Scrape Again" în Debugger

### Recomandări design OG image

Pentru o imagine OG care convertește:

- **1200×630 px**
- **Text mare** — lizibil chiar și în thumbnail mic
- **Logo SENS** — colț (ex: stânga jos)
- **Culori brand** — verde închis, lime
- **Fără text mic** — doar 1-2 cuvinte cheie
- **Contrast puternic** — text alb/lime pe verde închis

#### Exemple de bune practici
- Articol despre alegeri → text mare „ALEGERI 2026" + logo
- Eveniment → data + locația + numele evenimentului
- Pagină program → un cuvânt-cheie central + slogan

### Tool-uri pentru a crea OG images

- **Canva** (canva.com) — template-uri 1200×630 ready
- **Figma** — pentru control total
- **Pablo** (buffer.com/pablo) — drag & drop simplu

---

**Pagini conexe:**
- [Cum completezi SEO](#cum-completezi-seo-ul-unei-pagini)
- [Reguli pentru imagini](04-imagini.md#reguli-pentru-imagini-dimensiuni-format)

