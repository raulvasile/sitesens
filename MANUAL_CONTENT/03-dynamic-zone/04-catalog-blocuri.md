# Catalog de blocuri

Lista completă a blocurilor disponibile în Dynamic Zone, grupate pe categorii. Pentru fiecare: ce face și ce câmpuri esențiale are.

> 💡 **Toate blocurile** au și un câmp comun **„ID ancoră"** — vezi [Cum faci un link direct la un bloc](05-cum-faci-link-direct-la-bloc.md).

---

## 🎨 Hero (3 variante)

Folosit ca prima secțiune mare a unei pagini.

### Hero (clasic)
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

### Hero Refined
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

### Hero Editorial
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

## 📝 Conținut

### Text Block
Editor rich text: paragrafe, headings (H2, H3), liste (bullets sau numbers), citate, link-uri, bold/italic.

Pentru articole, e blocul **principal** unde scrii corpul textului.

### Quote
Citat mare ieșit în evidență cu autor și rol.

### Image Gallery
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

### Video Embed
Încastrare video YouTube sau Vimeo. Lipești URL-ul, restul e automat.

### Page Header
Header pentru începutul unei pagini: kicker (text mic mono) + titlu mare + subtitlu lead.

### Spacer
Spațiu vertical liber. Util când vrei mai mult „aer" între două blocuri.

---

## 📊 Liste & grile

### Card Grid
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

### Stats Counter
Statistici evidențiate (număr mare + label scurt sub).

Ex: „**150+** voluntari · **12** filiale · **3000+** semnături".

### Program Points
Lista direcțiilor programului: icon + titlu + descriere scurtă.

### Timeline
Cronologie verticală cu date și evenimente. Pentru istoric, etape.

### Accordion
Întrebări frecvente expandabile.

| Câmp per item | Ce pui |
|---|---|
| `title` | Întrebarea / titlul (text simplu) |
| `content` | Răspunsul — **rich text** (paragrafe, liste, link-uri, bold/italic). Folosește toolbar-ul Strapi. |

⭐ **Important:** câmpul `content` trebuie completat cu **editorul rich text**, nu cu text gol. Dacă vezi cod ca `[{"type":"paragraph"...}]` pe site, înseamnă că nu ai folosit editorul vizual — re-deschide câmpul și scrie textul în el direct.

### Word Carousel
Cuvinte rotative pe ecran complet (ex: „IDEI · ACȚIUNI · SCHIMBARE"). Set culoare fundal.

### Mission Band
Bandă verde mare cu misiunea partidului. Cuvintele între `**asterisc-uri**` apar evidențiate în lime.

Ex: `Construim o Românie **echitabilă** și **modernă**`.

---

## 🤖 Conținut auto-generat

Aceste blocuri **se populează automat** din alte secțiuni ale CMS-ului. Le pui o dată, ele rămân la zi.

### Latest Articles
Afișează ultimele N articole publicate.

| Câmp | Ce pui |
|---|---|
| `heading` | Titlu secțiune (ex: „Ultimele știri") |
| `count` | Câte articole afișezi (3, 6 etc.) |
| `cta_text` + `cta_link` | Buton „Vezi toate" |

### Upcoming Events
Afișează următoarele N evenimente.

| Câmp | Ce pui |
|---|---|
| `heading` | „Următoarele evenimente" |
| `count` | Câte (3, 4) |
| `cta_text` + `cta_link` | Buton „Calendar complet" |

### Calendar
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

### Calendar personalizat
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

### Team Grid
Afișează membrii din colecția Echipă.

| Câmp | Ce pui |
|---|---|
| `heading` | „Echipa noastră" |
| `mode` | `leadership` / `team` / `all` (filtru) |
| `cta_text` + `cta_link` | Buton opțional |

### Chapters Grid
Grila filialelor active (din colecția Județe).

### Romania Map
Harta interactivă a României. Click pe județ → tooltip cu info despre filială + link.

### Next Event widget
(folosit doar în Hero) Afișează următorul eveniment ca un mic card-link.

---

## 🎯 CTA & formulare

### CTA Banner
Bandă mare cu titlu, descriere și buton.

| Câmp | Ce pui |
|---|---|
| `title` | Îndemn (ex: „Hai să construim împreună!") |
| `description` | Subtitlu |
| `button_text` + `button_link` | CTA |
| `variant` | „green" / „orange" / „white" — culoarea fundalului |

### Newsletter CTA
Formular de abonare la newsletter, integrat în pagină.

### Contact Form
Formular de contact, preia config din **Pagină Contact**.

### File List (Listă fișiere)
Listă de fișiere descărcabile (PDF, Word, Excel). Fiecare apare ca un rând cu iconiță color (roșu pentru PDF, albastru pentru Word, verde pentru Excel), titlu, descriere opțională, dimensiune și buton de download.

| Câmp | Ce pui |
|---|---|
| `heading` | Titlul secțiunii (ex: „Statut și documente oficiale") |
| `subheading` | Paragraf scurt sub titlu (opțional) |
| `files` | Lista fișierelor (repeatable) — fiecare cu titlu, descriere, fișier |

⭐ **Tip pentru o pagină de Resurse:** Creezi o Pagină nouă cu slug `/resurse`, adaugi un bloc **File List** cu toate documentele oficiale (statut, manifest, rapoarte). Adaugi pagina în Header → vizitatorii au tot ce le trebuie într-un loc.

**Tipuri permise**: PDF (.pdf), Word (.doc, .docx), Excel (.xls, .xlsx). Mărime max per fișier: 10 MB.

---

## 📱 Social

### Social Feed
Embed-uri din rețele sociale. Adaugi mai multe platforme (Facebook, Instagram, TikTok, etc.) și pentru fiecare:
- Numele platformei
- Handle-ul/URL-ul paginii
- (opțional) Embed code pentru postări specifice

---

## ❓ Cum aleg blocul potrivit

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
- [Cum adaugi un bloc](02-cum-adaugi-un-bloc.md)
- [Cum reordonezi blocuri](03-cum-reordonezi-blocuri.md)
- [Cum construiești o pagină simplă](../02-creare-continut/04-cum-construiesti-o-pagina-simpla.md)
