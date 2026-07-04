# 03. Dynamic Zone — construire pagini cu blocuri

## Cuprins

1. [Ce este Dynamic Zone](#ce-este-dynamic-zone)
2. [Cum adaugi un bloc](#cum-adaugi-un-bloc)
3. [Cum reordonezi, ștergi sau duplici blocuri](#cum-reordonezi-ștergi-sau-duplici-blocuri)
4. [Catalog de blocuri](#catalog-de-blocuri)
5. [Cum faci un link direct la un bloc (anchor_id)](#cum-faci-un-link-direct-la-un-bloc-anchor_id)

---

## Ce este Dynamic Zone

### În scurt
**Dynamic Zone** e un câmp special în CMS unde **construiești conținutul ca pe LEGO** — combini blocuri pre-fabricate într-o ordine pe care o alegi tu.

### Unde îl găsești

În următoarele tipuri de conținut există un câmp numit **„Conținut"** (Content) care e Dynamic Zone:

- **Pagină Principală** (homepage)
- **Articole**
- **Pagini**
- **Secțiuni** (tab-uri în interiorul Paginilor)

### De ce e diferit de un câmp text obișnuit

Un câmp text îți dă o singură cutie unde scrii. Dynamic Zone îți dă **o listă de blocuri** pe care le poți:
- Adăuga
- Reordona
- Șterge
- Configura individual

### Exemplu vizual

Pentru pagina principală, Dynamic Zone arată în CMS aproximativ așa:

```
┌─────────────────────────────────────┐
│ 🎨 Bloc 1: Hero                      │  ← titlu, subtitlu, CTA, imagine
│  Titlu: „Construim o Românie..."     │
├─────────────────────────────────────┤
│ 📊 Bloc 2: Stats Counter             │  ← „150+ voluntari", „12 filiale"
├─────────────────────────────────────┤
│ 📅 Bloc 3: Upcoming Events           │  ← se populează automat
├─────────────────────────────────────┤
│ 🎯 Bloc 4: CTA Banner                │  ← „Înscrie-te azi"
├─────────────────────────────────────┤
│ ➕ Add a component to content        │
└─────────────────────────────────────┘
```

Pe site, blocurile apar în aceeași ordine, una sub alta.

### Tipuri de blocuri disponibile

Sunt **27 de blocuri** grupate în categorii:
- 🎨 Hero (3 variante)
- 📝 Conținut (text, citate, video, galerii)
- 📊 Liste & grile (carduri, statistici, FAQ, timeline)
- 🤖 Auto-generate (ultimele articole, evenimente, echipă)
- 🎯 CTA & formulare
- 📱 Social

Vezi [Catalog de blocuri](#catalog-de-blocuri) pentru detalii despre fiecare.

### Ce înseamnă „auto-generat"

Câteva blocuri **se populează automat** cu conținut din alte părți ale CMS-ului:

| Bloc | Ia date din |
|---|---|
| **Latest Articles** | Colecția Articole (ultimele N publicate) |
| **Upcoming Events** | Colecția Evenimente (următoarele N) |
| **Team Grid** | Colecția Echipă (filtrată după conducere/non-conducere) |
| **Chapters Grid** | Colecția Județe (cele active) |
| **Romania Map** | Colecția Județe |

Asta înseamnă că **NU** trebuie să le actualizezi manual — pui blocul o singură dată și el rămâne mereu la zi.

### Avantaje

- ✅ Pagini **diferite** chiar dacă folosesc aceleași blocuri
- ✅ Modifici un bloc fără să atingi restul paginii
- ✅ Riordonezi rapid prin drag-and-drop
- ✅ Reutilizezi același tip de bloc de oricâte ori vrei pe aceeași pagină

---

## Cum adaugi un bloc

### Pași

#### 1. Deschide intrarea
Mergi la pagina/articolul/secțiunea unde vrei să adaugi un bloc.

#### 2. Scroll la câmpul „Conținut"
E un câmp mare cu blocurile existente listate.

#### 3. Click pe „+ Add a component to content"
Buton mare la sfârșitul listei. Dacă lista e goală, apare imediat în prim-plan.

#### 4. Alege blocul

Se deschide o fereastră cu **lista tuturor blocurilor disponibile**. Sunt grupate vizual și au icon-uri.

Caută blocul potrivit:
- **Pentru text** → Text Block, Quote
- **Pentru imagini** → Image Gallery, Video Embed
- **Pentru carduri** → Card Grid
- **Pentru statistici** → Stats Counter
- **Pentru CTA-uri** → CTA Banner, Newsletter CTA
- **Pentru conținut auto** → Latest Articles, Upcoming Events, Team Grid

Vezi descrierea completă în [Catalog de blocuri](#catalog-de-blocuri).

#### 5. Click pe blocul ales
Se adaugă imediat în lista blocurilor, **gol**, gata de configurare.

#### 6. Completează câmpurile blocului

Fiecare bloc are câmpurile lui specifice. Exemple:

##### Pentru Hero:
- Titlu, Subtitlu, Background image, CTA primar, CTA secundar

##### Pentru Card Grid:
- Titlu secțiune
- Număr coloane (2/3/4)
- Lista de carduri (fiecare cu titlu, descriere, link, icon)

##### Pentru Stats Counter:
- Titlu (opțional)
- Lista de statistici (fiecare cu valoare + label)

#### 7. Save

Salvează modificările ca draft.

#### 8. Preview → Publish

Vezi [Cum folosești Preview-ul](01-incepe-aici.md#cum-folosești-preview-ul).

### Tip-uri rapide

#### Câmpuri „Repeatable"
Multe blocuri au câmpuri **repetabile** (ex: cardurile dintr-un Card Grid). Click **„Add an entry"** ca să adaugi unul nou. Click pe pictograma **🗑️** ca să-l ștergi.

#### Câmpuri opționale
Câmpurile fără asterisc roșu (`*`) sunt **opționale**. Dacă le lași goale, nu apar pe site.

#### Câmpuri cu „rotating words"
Hero-ul are un câmp `rotating_words` (cuvinte rotative). Acolo adaugi cuvinte care se schimbă pe rând în titlu (ex: „Construim o Românie [verde / educată / sănătoasă]").

#### Câmpuri cu emphasis lime
Mission Band evidențiază cuvinte între `**asterisc-uri**` în lime. Exemplu:
> `Construim o Românie **echitabilă** și **modernă**.`

Cuvintele „echitabilă" și „modernă" vor apărea în lime pe site.

### Greșeli frecvente

| Greșeală | Consecință | Fix |
|---|---|---|
| Câmpuri obligatorii (asterisc roșu) goale | Nu poți Save | Completează-le |
| Imagine nesalvată după upload | Apare ca placeholder gri | Save după upload |
| Adaugi blocul dar uiți să Save | Pierzi configurarea la refresh | Save după fiecare modificare majoră |
| Adaugi același bloc de mai multe ori din greșeală | Apare duplicat pe site | Vezi [Cum reordonezi/ștergi blocuri](#cum-reordonezi-ștergi-sau-duplici-blocuri) |

---

## Cum reordonezi, ștergi sau duplici blocuri

### 🔄 Reordonare (drag & drop)

#### Pași
1. În câmpul **„Conținut"**, vezi blocurile listate vertical
2. La fiecare bloc, în partea stângă, e o **iconiță cu 6 puncte** (`⋮⋮`) — handle de drag
3. **Apasă și ține** pe această iconiță
4. **Trage** blocul în sus sau în jos
5. Eliberezi în poziția dorită
6. **Save**

#### Tip
Pentru reordonări mari, e mai rapid:
1. Colaps toate blocurile (vezi mai jos)
2. Reordonezi în starea minimală
3. Le re-deschizi

### 📂 Colaps / expand bloc

Când blocurile sunt multe și lungi, e dificil de navigat. Soluția:

1. La fiecare bloc, **click pe titlul lui** (sau pictograma `▼` din dreapta sus)
2. Blocul se minimează — vezi doar tipul și un sumar
3. Click din nou să-l re-deschizi

Așa vezi tot conținutul ca o **listă scurtă** și navighezi mai ușor.

### 🗑️ Ștergere bloc

#### Pași
1. Click pe pictograma **🗑️** din dreapta sus a blocului
2. Confirmă (Strapi întreabă „Are you sure?")
3. **Save** ca să persiste ștergerea

⚠️ **Înainte de Save, ștergerea e reversibilă** (un refresh la pagină recuperează blocul). După Save, e definitivă.

### 📋 Duplicare bloc

Câteodată vrei un al doilea bloc de același tip cu configurație similară (ex: două Card Grid-uri identice ca structură).

#### Opțiunea A — buton Duplicate (dacă există)
Sub iconița de drag, în unele versiuni Strapi există o pictogramă **📋 Duplicate**:
1. Click pe ea
2. Apare un bloc nou identic, sub cel original
3. Modifici ce e diferit (titlu etc.)
4. Save

#### Opțiunea B — manual
1. Adaugi un bloc nou de același tip (vezi [Cum adaugi un bloc](#cum-adaugi-un-bloc))
2. Recopiezi câmpurile din original
3. Save

### ➕ Inserare la mijloc

Implicit, **„Add a component"** adaugă blocul la **sfârșit**. Dacă vrei să inserezi între două blocuri existente:

#### Opțiunea A — adaugă la sfârșit, apoi mută
1. Adaugi blocul nou (apare jos)
2. Drag-and-drop până la poziția dorită
3. Save

#### Opțiunea B — buton „Insert here" (între blocuri)
În unele versiuni Strapi, când treci mouse-ul **între** două blocuri, apare un buton mic **„+"** chiar acolo. Click pe el → alegi tipul → blocul se inserează în acea poziție.

### 🔄 Conversie tip de bloc

**NU se poate.** Dacă ai pus un Text Block dar voiai un Quote, trebuie să:
1. Creezi noul bloc de tipul corect
2. Copiezi conținutul manual
3. Ștergi blocul vechi

### Workflow recomandat — refacere pagină

```
1. Decizi structura nouă pe hârtie / Figma
2. Eventual notezi: „blocul X rămâne, blocul Y dispare, adaug Z"
3. Editezi pagina:
   a. Ștergi blocurile care nu mai sunt necesare
   b. Adaugi blocurile noi
   c. Le configurezi
   d. Reordonezi totul în ordinea finală
4. Save
5. Preview → verifici
6. Publish
```

---

## Catalog de blocuri

Lista completă a blocurilor disponibile în Dynamic Zone, grupate pe categorii. Pentru fiecare: ce face și ce câmpuri esențiale are.

> 💡 **Toate blocurile** au și un câmp comun **„ID ancoră"** — vezi [Cum faci un link direct la un bloc](#cum-faci-un-link-direct-la-un-bloc-anchor_id).

---

### 🎨 Hero (3 variante)

Folosit ca prima secțiune mare a unei pagini.

#### Hero (clasic)
**Folosit pentru:** homepage, pagini standard.

Conține: titlu mare cu „cuvinte rotative", subtitlu, două butoane CTA, opțional imagine background.

| Câmp esențial | Ce pui |
|---|---|
| `title` | Titlul cu placeholder `{{rotating}}` (ex: „Construim o Românie {{rotating}}") |
| `rotating_words` | Lista cuvintelor care rotesc (ex: verde, educată, sănătoasă) |
| `subtitle` | Subtitlu sub titlu |
| `cta_text` + `cta_link` | Buton primar |
| `cta_secondary_text` + `cta_secondary_link` | Buton secundar (opțional) |
| `background_image` | Imagine fundal (opțional) |

#### Hero Refined
**Folosit pentru:** pagini cu impact vizual mare (ex: pagini campanii).

Imagine background full-screen + overlay verde închis + titlu în stânga + descriere și CTA-uri în dreapta.

| Câmp esențial | Ce pui |
|---|---|
| `background_image` | **Obligatoriu** — acoperă tot heroul |
| `top_meta_left` / `top_meta_right` | Text mic mono în partea de sus (ex: „CLUJ-NAPOCA · 2026") |
| `title` | Titlu mare uppercase |
| `title_italic_accent` | Cuvânt italic verde-lime pe linie nouă |
| `description` | Descriere coloana dreaptă |
| `cta_text/link` + `cta_secondary_text/link` | Două butoane |

#### Hero Editorial
**Folosit pentru:** pagini de tip manifest, declarații.

Titlu enorm (până la 200px) cu un cuvânt evidențiat în lime și ușor înclinat.

| Câmp esențial | Ce pui |
|---|---|
| `title` | Titlu uppercase |
| `title_emphasis` | Cuvânt evidențiat (ex: „construim.") |
| `manifesto_lead` | Paragraf mare introductiv |
| `directions` | Lista numerotată de direcții (până la 4) |
| `pull_quote_text` + `pull_quote_author_*` | Citat mare cu autor |

---

### 📝 Conținut

#### Text Block
Editor rich text: paragrafe, headings (H2, H3), liste (bullets sau numbers), citate, link-uri, bold/italic.

Pentru articole, e blocul **principal** unde scrii corpul textului.

#### Quote
Citat mare ieșit în evidență cu autor și rol.

#### Image Gallery
Grilă sau carusel de imagini.

| Câmp | Ce pui |
|---|---|
| `images` | Lista de imagini (drag-and-drop multiplu permis) |
| `layout` | `grid` (default) sau `carousel` |
| `caption` | Caption global (opțional, apare sub galerie ca eyebrow mono) |

**Layout `carousel`** — slider cu:
- Imagine mare (16:9, max 75% înălțime ecran), tranziție smooth la schimbare
- Counter mono `01 / 06` în colțul stânga sus
- Caption per imagine (din `caption` sau `alt text`) afișat sus dreapta
- Săgeți navigare lime/ink în lateral
- Strip cu thumbnails sub (clickabile)
- Suportă **swipe** pe mobil și **săgeți tastatură** pe desktop

**Layout `grid`** — 1/2/3 coloane responsive, hover zoom 4%, caption opțional ca overlay jos.

⭐ **Tip:** completează **caption** la fiecare imagine (în Media Library) — apare în carousel deasupra și ca overlay în grid.

#### Video Embed
Încastrare video YouTube sau Vimeo. Lipești URL-ul, restul e automat.

#### Page Header
Header pentru începutul unei pagini: kicker (text mic mono) + titlu mare + subtitlu lead.

#### Spacer
Spațiu vertical liber. Util când vrei mai mult „aer" între două blocuri.

---

### 📊 Liste & grile

#### Card Grid
Grilă 2/3/4 coloane de carduri. Fiecare card are titlu, descriere, listă bullet-uri, link, icon.

**Variantă specială:** dacă completezi `details` (text lung) pe un card, click pe card deschide un **modal** cu detalii. Util pentru "puncte de program".

| Câmp esențial | Ce pui |
|---|---|
| `heading` | Titlu deasupra grilei |
| `columns` | „2", „3", sau „4" |
| `cards` | Lista de carduri (repeatable) |

**Câmpuri per card:**

| Câmp | Ce pui |
|---|---|
| `title` | Titlul cardului |
| `description` | Text scurt sub titlu |
| `points` | Puncte cheie (bullet-uri cu săgeți) |
| `link_text` + `link_url` | Buton link în josul cardului |
| `image` | Imagine **inline** (apare ca o bandă deasupra titlului) |
| `background_image` | 🆕 Imagine **fundal** (acoperă tot cardul, în spatele textului) |
| `overlay` | 🆕 Bifat (default) = pune un strat color peste imagine pentru lizibilitate text. Debifează doar dacă imaginea e deja întunecată. |
| `icon` | Pictogramă (emoji ex: `🌱` sau ID icon) |
| `details` | Text lung pentru modal (când e completat, click pe card deschide modal) |

**Tip pentru `background_image`:** culoarea overlay-ului vine **automat** din culoarea naturală a card-ului (cream / lime / verde închis / verde foarte închis, după poziția în grilă). Tu doar bifezi sau debifezi — culoarea o alege design-ul.

⭐ **Workflow recomandat cu background image:**
1. Încarci imaginea fundal (1200×800 ideal, JPG, sub 400 KB)
2. Bifezi `overlay` (default e bifat) — textul rămâne lizibil
3. Verifici pe Preview pe mobil + desktop
4. Dacă imaginea e foarte întunecată și textul cream e deja vizibil, debifezi overlay (tot textul devine cream + text shadow subtil)

#### Stats Counter
Statistici evidențiate (număr mare + label scurt sub).

Ex: „**150+** voluntari · **12** filiale · **3000+** semnături".

#### Program Points
Lista direcțiilor programului: icon + titlu + descriere scurtă.

#### Timeline
Cronologie verticală cu date și evenimente. Pentru istoric, etape.

#### Accordion
Întrebări frecvente expandabile.

| Câmp per item | Ce pui |
|---|---|
| `title` | Întrebarea / titlul (text simplu) |
| `content` | Răspunsul — **rich text** (paragrafe, liste, link-uri, bold/italic). Folosește toolbar-ul Strapi. |

⭐ **Important:** câmpul `content` trebuie completat cu **editorul rich text**, nu cu text gol. Dacă vezi cod ca `[{"type":"paragraph"...}]` pe site, înseamnă că nu ai folosit editorul vizual — re-deschide câmpul și scrie textul în el direct.

#### Word Carousel
Cuvinte rotative pe ecran complet (ex: „IDEI · ACȚIUNI · SCHIMBARE"). Set culoare fundal.

#### Mission Band
Bandă verde mare cu misiunea partidului. Cuvintele între `**asterisc-uri**` apar evidențiate în lime.

Ex: `Construim o Românie **echitabilă** și **modernă**`.

---

### 🤖 Conținut auto-generat

Aceste blocuri **se populează automat** din alte secțiuni ale CMS-ului. Le pui o dată, ele rămân la zi.

#### Latest Articles
Afișează ultimele N articole publicate.

| Câmp | Ce pui |
|---|---|
| `heading` | Titlu secțiune (ex: „Ultimele știri") |
| `count` | Câte articole afișezi (3, 6 etc.) |
| `cta_text` + `cta_link` | Buton „Vezi toate" |

#### Upcoming Events
Afișează următoarele N evenimente.

| Câmp | Ce pui |
|---|---|
| `heading` | „Următoarele evenimente" |
| `count` | Câte (3, 4) |
| `cta_text` + `cta_link` | Buton „Calendar complet" |

#### Calendar
Calendar interactiv auto-populat cu evenimentele din colecția Evenimente. Are **două vizualizări** între care vizitatorul poate comuta:
- **Grid lună** — calendar clasic 7×6, click pe zi cu eveniment afișează lista detaliată dedesubt; navigare lună înainte/înapoi
- **Listă cronologică** — evenimente grupate pe lună, cu ziua/zi-săpt mare în stânga

| Câmp | Ce pui |
|---|---|
| `heading` | Titlul mare al calendarului |
| `default_view` | `month` (grid) sau `list` (cronologic) — care apare prima |
| `show_view_toggle` | Bifat = vizitatorul poate comuta între cele două vizualizări |
| `include_past_events` | Bifat = afișează și evenimentele din trecut |
| `limit` | Câte evenimente preia maxim (default 50, max 200) |
| `filter_event_type` | Opțional, filtrează doar un tip (dezbatere/acțiune/marș/online) |

⭐ **Tip:** Pentru o pagină dedicată calendarului (ex: `/calendar`), creează o Pagină nouă cu doar acest bloc + `default_view: month`.

⭐ **Diferența vs Upcoming Events:** Upcoming Events e o listă scurtă de 3-4 evenimente apropiate, perfect pentru homepage. Calendar e exhaustiv, perfect pentru o pagină dedicată sau secțiune mare.

#### Calendar personalizat
Calendar **manual**, independent de colecția Evenimente. Editorul adaugă fiecare intrare direct în CMS. Aceeași vizualizare (grid lună + listă cronologică) ca la **Calendar** evenimente.

Când îl folosești:
- Deadlines interne (ex: „Termen depunere candidaturi")
- Lansări de campanii
- Ședințe ale conducerii
- Evenimente publice care nu au nevoie de pagină proprie pe site
- Sărbători legale sau date importante

| Câmp | Ce pui |
|---|---|
| `heading` | Titlul mare al calendarului |
| `subheading` | Paragraf scurt sub titlu (opțional) |
| `entries` | Lista intrărilor (vezi mai jos) |
| `default_view` | `month` (grid) sau `list` (cronologic) |
| `show_view_toggle` | Bifat = vizitatorul poate comuta vizualizarea |
| `empty_state_text` | Mesaj când lista e goală |

**Câmpuri per intrare (`Intrare calendar`):**

| Câmp | Ce pui |
|---|---|
| `title` | Numele intrării — apare ca text principal |
| `start_date` | Data și ora de început (obligatoriu) |
| `end_date` | Data/ora finală (opțional) — apare ca interval `09:00 – 12:00` |
| `description` | Descriere scurtă (apare ca meta sub titlu, doar dacă lipsește locația) |
| `location` | Loc fizic sau platformă online (precedență față de descriere) |
| `url` | Link opțional. URL extern (`https://...`) → tab nou. Internal (`/...`) → aceeași filă. |
| `category` | Etichetă scurtă afișată ca chip (ex: „Intern", „Public", „Important") |
| `accent_color` | Culoare chip categorie: default / lime / cream / rose |

⭐ **Diferența vs Calendar evenimente:**
- **Calendar evenimente** = preia automat din colecția Evenimente. Folosit pentru evenimente publice cu pagină proprie (`/evenimente/[slug]`).
- **Calendar personalizat** = editorul adaugă manual. Folosit când nu vrei să creezi un Eveniment complet, doar o intrare în calendar.

#### Team Grid
Afișează membrii din colecția Echipă.

| Câmp | Ce pui |
|---|---|
| `heading` | „Echipa noastră" |
| `mode` | `leadership` / `team` / `all` (filtru) |
| `cta_text` + `cta_link` | Buton opțional |

#### Chapters Grid
Grila filialelor active (din colecția Județe).

#### Romania Map
Harta interactivă a României. Click pe județ → tooltip cu info despre filială + link.

#### Next Event widget
(folosit doar în Hero) Afișează următorul eveniment ca un mic card-link.

---

### 🎯 CTA & formulare

#### CTA Banner
Bandă mare cu titlu, descriere și buton.

| Câmp | Ce pui |
|---|---|
| `title` | Îndemn (ex: „Hai să construim împreună!") |
| `description` | Subtitlu |
| `button_text` + `button_link` | CTA |
| `variant` | „green" / „orange" / „white" — culoarea fundalului |

#### Newsletter CTA
Formular de abonare la newsletter, integrat în pagină.

#### Contact Form
Formular de contact, preia config din **Pagină Contact**.

#### File List (Listă fișiere)
Listă de fișiere descărcabile (PDF, Word, Excel). Fiecare apare ca un rând cu iconiță color (roșu pentru PDF, albastru pentru Word, verde pentru Excel), titlu, descriere opțională, dimensiune și buton de download.

| Câmp | Ce pui |
|---|---|
| `heading` | Titlul secțiunii (ex: „Statut și documente oficiale") |
| `subheading` | Paragraf scurt sub titlu (opțional) |
| `files` | Lista fișierelor (repeatable) — fiecare cu titlu, descriere, fișier |

⭐ **Tip pentru o pagină de Resurse:** Creezi o Pagină nouă cu slug `/resurse`, adaugi un bloc **File List** cu toate documentele oficiale (statut, manifest, rapoarte). Adaugi pagina în Header → vizitatorii au tot ce le trebuie într-un loc.

**Tipuri permise**: PDF (.pdf), Word (.doc, .docx), Excel (.xls, .xlsx). Mărime max per fișier: 10 MB.

---

### 📱 Social

#### Social Feed
Embed-uri din rețele sociale. Adaugi mai multe platforme (Facebook, Instagram, TikTok, etc.) și pentru fiecare:
- Numele platformei
- Handle-ul/URL-ul paginii
- (opțional) Embed code pentru postări specifice

---

### ❓ Cum aleg blocul potrivit

Întrebări de pus:

| Vreau să arăt… | Folosesc… |
|---|---|
| Text liber, paragrafe | Text Block |
| Un citat important | Quote |
| Mai multe poze | Image Gallery |
| Un video YouTube | Video Embed |
| Statistici cu numere mari | Stats Counter |
| Lista direcțiilor programului | Program Points |
| Carduri colorate cu link-uri | Card Grid |
| FAQ | Accordion |
| Cronologie | Timeline |
| Ultimele știri | Latest Articles |
| Evenimente viitoare | Upcoming Events |
| Echipa | Team Grid |
| Harta filialelor | Romania Map / Chapters Grid |
| Îndemn la acțiune | CTA Banner |
| Buton de abonare la newsletter | Newsletter CTA |
| Formular de contact | Contact Form |
| Linkuri rețele sociale | Social Feed |

---

**Pagini conexe:**
- [Cum adaugi un bloc](#cum-adaugi-un-bloc)
- [Cum reordonezi blocuri](#cum-reordonezi-ștergi-sau-duplici-blocuri)
- [Cum construiești o pagină simplă](02-creare-continut.md#cum-construiești-o-pagină-simplă)

---

## Cum faci un link direct la un bloc (anchor_id)

### Ce vei face
Permiți unui link să **deschidă o pagină și să sară automat** la un bloc anume — util pentru CTA-uri, share link-uri, sau cuprinsuri.

### Concept

Fiecare bloc dintr-un Dynamic Zone poate avea un **ID ancoră** (`anchor_id`) opțional. Când e setat, blocul devine accesibil printr-un URL ca:

```
https://cusens.eu/despre-noi#valori
                            └──┬──┘
                              anchor_id
```

Browser-ul deschide pagina și **scroll-ează automat** la blocul cu acel id.

### Pași

#### 1. Deschide intrarea cu blocul (articol, pagină, homepage etc.)

#### 2. Găsește blocul căruia vrei să-i pui ancoră

#### 3. Completează câmpul „ID ancoră"

Vei vedea în partea de sus a oricărui bloc DynamicZone un câmp **„ID ancoră (opțional, pentru link-uri directe ex: #valori)"**.

Scrie în el ID-ul (fără `#`):

| Exemplu valid | URL rezultat |
|---|---|
| `valori` | `/despre-noi#valori` |
| `echipa-conducere` | `/despre-noi#echipa-conducere` |
| `program-2026` | `/program#program-2026` |

#### 4. Save + Publish

#### 5. Testează

Deschide URL-ul cu hash în browser:
- `https://cusens.eu/despre-noi#valori`
- Pagina se deschide
- Scroll automat la blocul cu acea ancoră

### Reguli pentru `anchor_id`

#### ✅ Permis
- Litere mici (`a–z`)
- Cifre (`0–9`)
- Liniuțe (`-`)
- Underscore (`_`)
- Maxim **60 caractere**

#### ❌ Nepermis (sunt curățate automat)
- Spații
- Diacritice (`ă`, `î`, `ț`, `ș`, `â`)
- Litere mari
- Caracterul `#` (e adăugat automat în URL)
- Începere cu cifre (HTML nu acceptă; se taie până la prima literă)

#### ⚠️ Important
- **Unicitatea contează** — dacă două blocuri din aceeași pagină au același `anchor_id`, browserul va sări la primul. Folosește ID-uri unice per pagină.
- **Dacă schimbi anchor_id-ul** după ce link-uri către el au fost partajate — link-urile vechi se rup.

### Cazuri tipice de folosire

#### Cuprins manual la începutul paginii
Faci un Text Block la începutul paginii cu o listă de link-uri:
```
- [Misiunea noastră](#misiune)
- [Valori](#valori)
- [Programul nostru](#program)
- [Cum poți contribui](#contribuie)
```
Apoi setezi `anchor_id` corespunzător la fiecare bloc relevant.

#### Share link la o secțiune anume
Vrei să trimiți un email cu „uite ce facem la educație":
- Pe pagina `/program`, blocul „Educație" are `anchor_id: educatie`
- Trimiți link-ul: `https://cusens.eu/program#educatie`

#### CTA dintr-un articol către o secțiune din altă pagină
În Text Block-ul unui articol, scrii: „Vezi [valorile noastre](/despre-noi#valori) pentru context."

#### Buton CTA configurat în Strapi
În câmpul **Link** al unui buton CTA, pui `/despre-noi#echipa` în loc de `/despre-noi`. Click → pagina se deschide direct la secțiunea echipă.

### Diferența vs. tab-urile cu hash

Există DOUĂ tipuri de hash-uri:

| Tip | Pentru ce | Exemplu |
|---|---|---|
| **`anchor_id` pe bloc** | Scroll la un bloc anume într-o pagină | `/program#educatie` |
| **Hash pentru tab-uri** | Deschide un tab anume într-o pagină cu Secțiuni | `/despre-noi#echipa` |

Dacă o pagină are ambele (ex: are tab-uri ȘI blocuri cu anchor), hash-ul potrivit cu un nume de tab are prioritate. Asigură-te că `anchor_id`-urile sunt diferite de slug-urile tab-urilor.

### Workflow recomandat

```
1. Identifici blocurile principale ale paginii
2. Le pui anchor_id descriptiv (ex: "valori", "echipa", "program")
3. Save + Publish
4. Testezi fiecare URL #anchor în browser
5. Folosești link-urile în:
   - Meniu (Header) — ex: link „Echipa" → /despre-noi#echipa
   - Comunicate de presă (CTA-uri precise)
   - Postări social media
```

---

**Pagini conexe:**
- [Cum adaugi un bloc](#cum-adaugi-un-bloc)
- [Catalog de blocuri](#catalog-de-blocuri)
- [Cum folosești secțiuni cu tab-uri](02-creare-continut.md#cum-folosești-secțiuni-cu-tab-uri)

