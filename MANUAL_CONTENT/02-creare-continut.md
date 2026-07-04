# 02. Creare conținut

## Cuprins

1. [Cum adaugi un articol nou](#cum-adaugi-un-articol-nou)
2. [Cum adaugi un eveniment nou](#cum-adaugi-un-eveniment-nou)
3. [Cum adaugi un membru de echipă](#cum-adaugi-un-membru-de-echipă)
4. [Cum construiești o pagină simplă](#cum-construiești-o-pagină-simplă)
5. [Cum folosești secțiuni cu tab-uri](#cum-folosești-secțiuni-cu-tab-uri)
6. [Cum modifici un conținut existent](#cum-modifici-un-conținut-existent)
7. [Cum ascunzi sau ștergi conținut](#cum-ascunzi-sau-ștergi-conținut)
8. [Cum duplici un articol sau o pagină](#cum-duplici-un-articol-sau-o-pagină)
9. [Cum atașezi documente la un articol](#cum-atașezi-documente-la-un-articol)

---

## Cum adaugi un articol nou

### Ce vei face
Creezi un articol care apare la `/stiri` și are propria pagină la `/stiri/[slug]`.

### Înainte să începi

- Ai gata: titlu, text, cover image (1920×1080 ideal)
- Verifici că există **categoria** potrivită; dacă nu, vezi [Cum gestionezi categoriile](05-taxonomii.md#cum-gestionezi-categoriile-de-articole)
- Verifici că **autorul** există în **Echipă**; dacă nu, vezi [Cum adaugi un membru](#cum-adaugi-un-membru-de-echipă)

### Pași

#### 1. Mergi la Articole
Content Manager → **Articole** → buton **„Create new entry"** (sus dreapta).

#### 2. Completează metadata

| Câmp | Ce pui |
|---|---|
| **Titlu** | Titlul vizibil pe site (ex: „Manifest pentru o Românie verde") |
| **Slug** | Generat automat din titlu. Editează doar dacă vrei (ex: `manifest-verde`). Vezi [Cum scrii un slug bun](08-seo-si-distribuire.md#cum-scrii-un-slug-bun). |
| **Rezumat (Excerpt)** | 1–2 propoziții. Apare în lista `/stiri` și pe Facebook când partajezi. |
| **Imagine copertă** | Click → încarci imaginea. Vezi [Reguli pentru imagini](04-imagini.md#reguli-pentru-imagini-dimensiuni-format). |
| **Categorie** | Alege una singură din dropdown (ex: Politici publice) |
| **Etichete** | Opțional. Mai multe permise. Pentru filtrare secundară. |
| **Autor** | Alege un membru de echipă din dropdown |
| **Reading time** | În minute. Lasă gol dacă vrei să-l calculeze automat. |

#### 3. Adaugă conținut

Câmpul **„Conținut"** e o **Dynamic Zone** — vezi [Cum folosești Dynamic Zone](03-dynamic-zone.md#ce-este-dynamic-zone).

Tipic pentru un articol:
1. **Text Block** — paragrafele tale
2. (opțional) **Quote** — un citat important
3. (opțional) **Image Gallery** — poze
4. (opțional) **Video Embed** — un YouTube
5. **Text Block** — restul textului

#### 4. Featured Stat (opțional)

Bifează doar dacă vrei o statistică evidențiată (număr mare + descriere) care apare ca un highlight separat în pagină. Ex: „**73%** din români consideră că schimbările climatice sunt o problemă urgentă".

#### 5. SEO

Mergi în jos la secțiunea **SEO** și completează:
- **Meta Title** — diferit de titlu dacă e cazul (max 60 caractere)
- **Meta Description** — descriere atractivă (max 160 caractere)
- **OG Image** — opțional; dacă lipsește, se folosește cover image

Vezi [Cum completezi SEO](08-seo-si-distribuire.md#cum-completezi-seo-ul-unei-pagini).

#### 6. Save → Preview → Publish

1. **Save** (salvezi ca draft)
2. **Preview** (sus dreapta) — verifici cum arată
3. Corecturi → **Save** din nou
4. **Publish** (sus dreapta)

Articolul e live la `https://cusens.eu/stiri/[slug-ul-tău]`.

### Verificare finală

- [ ] Apare în lista `/stiri` (ordonat după dată)
- [ ] Pagina articolului se încarcă fără erori
- [ ] Imaginea copertă se vede mare
- [ ] Categorie + etichete + autor afișate corect
- [ ] SEO complet (verifică [cum arată pe Facebook](08-seo-si-distribuire.md#cum-verifici-cum-arată-pe-facebook))

### Cum modifici un articol publicat

Vezi [Cum modifici un conținut existent](#cum-modifici-un-conținut-existent).

---

**Pagini conexe:**
- [Cum folosești Dynamic Zone](03-dynamic-zone.md#ce-este-dynamic-zone)
- [Cum gestionezi categoriile](05-taxonomii.md#cum-gestionezi-categoriile-de-articole)
- [Reguli pentru imagini](04-imagini.md#reguli-pentru-imagini-dimensiuni-format)

---

## Cum adaugi un eveniment nou

### Ce vei face
Creezi un eveniment care apare la `/evenimente` și are propria pagină la `/evenimente/[slug]`.

### Înainte să începi

- Ai gata: titlu, dată/oră, locație, descriere, cover image
- Decizi tipul: **dezbatere**, **acțiune**, **marș**, sau **online**

### Pași

#### 1. Mergi la Evenimente
Content Manager → **Evenimente** → **„Create new entry"**.

#### 2. Câmpuri esențiale

| Câmp | Ce pui |
|---|---|
| **Titlu** | Ex: „Dezbatere — Educația în România 2030" |
| **Slug** | Auto din titlu. Editează doar dacă vrei. |
| **Tip eveniment** | Alege din enum: dezbatere / actiune / mars / online |
| **Data început** | Date + oră (calendar widget) |
| **Data sfârșit** | Opțional. Dacă lipsește, se afișează doar ora de start. |
| **Imagine copertă** | 1920×1080 ideal |

#### 3. Locație

Trei câmpuri pentru locație, **toate opționale**:

| Câmp | Exemplu | Apare ca |
|---|---|---|
| **Locație (scurt)** | „Casa de Cultură" | Fallback dacă lipsește venue |
| **Loc (venue)** | „Sala Mare, Casa de Cultură a Studenților" | Numele complet al locului |
| **Oraș** | „Cluj-Napoca" | Apare ca chip pe card-ul evenimentului |

Pentru evenimente **online**, completează doar **Locație** (ex: „Zoom" sau „YouTube Live").

#### 4. Descriere

Câmpul **„Descriere"** acceptă text formatat: paragrafe, headings, liste, citate. Folosește editorul de blocuri integrat (toolbar deasupra textului).

#### 5. Înscrieri

| Câmp | Ce pui |
|---|---|
| **Locuri disponibile** | Opțional. Număr max participanți. |
| **Locuri ocupate** | Cât e completat (manual) — apare ca „X libere" |
| **Înscrieri deschise** | Toggle. Dacă debifezi, butonul „Rezervă" devine „Înscrieri închise" |
| **URL înregistrare** | Opțional. Dacă completezi, butonul te trimite acolo în loc de `/inscrie-te?event=…` |

#### 6. Eveniment evidențiat (Featured)

Toggle **„Eveniment evidențiat"** — dacă bifezi, apare **mare în topul listei** `/evenimente` cu un layout special.

⚠️ Recomandat doar **un singur eveniment featured** la un moment dat.

#### 7. SEO

Completează ca la articole. Vezi [Cum completezi SEO](08-seo-si-distribuire.md#cum-completezi-seo-ul-unei-pagini).

#### 8. Save → Preview → Publish

Apare la `https://cusens.eu/evenimente/[slug]`.

### După eveniment — adaugi galerie social

Când evenimentul s-a încheiat, întoarce-te în CMS și completează:

#### „Descriere secțiune Pe rețele"
Text scurt deasupra grilei cu link-uri sociale. Ex:
> „Găsești poze de la marș aici:"

#### „Postări social media"
Lista de link-uri spre postări de Facebook / Instagram / TikTok / YouTube cu poze și video-uri:
1. Click **„Add an entry to social_posts"**
2. **Platform** — alege din dropdown
3. **URL** — paste link-ul postării
4. Repetă pentru fiecare postare
5. **Save** + **Publish**

### Verificare finală

- [ ] Apare în lista `/evenimente`
- [ ] Data + ora corectă (nu uita timezone — se folosește ora locală)
- [ ] Locația completă
- [ ] Tipul corect (vine cu un chip color)
- [ ] Cover image arată bine
- [ ] Buton „Rezervă" duce unde trebuie

### Anularea unui eveniment

Două opțiuni:

**Anulare temporară** (e încă în calcul) — intri la eveniment → **Unpublish**. Dispare de pe site dar rămâne în CMS.

**Anulare definitivă** — schimbă titlul în „[ANULAT] Titlu original" și debifează **Înscrieri deschise**. Lasă-l publicat ca utilizatorii care aveau link-ul să vadă mesajul.

---

**Pagini conexe:**
- [Reguli pentru imagini](04-imagini.md#reguli-pentru-imagini-dimensiuni-format)
- [Cum modifici un conținut existent](#cum-modifici-un-conținut-existent)
- [Cum ascunzi sau ștergi conținut](#cum-ascunzi-sau-ștergi-conținut)

---

## Cum adaugi un membru de echipă

### Ce vei face
Adaugi o persoană în colecția **Echipă**. Va apărea automat în:
- Blocurile **Team Grid** unde sunt configurate
- Pagina `/despre-noi` (tabul „Echipă" sau „Conducere", după cum bifezi)
- Lista de autori disponibili pentru articole

### Înainte să începi

- Ai gata: nume, funcție, fotografie (1:1, 800×800 ideal), bio scurt
- (opțional) text lung pentru modal cu detalii
- (opțional) link-uri sociale (LinkedIn, Twitter etc.)

### Pași

#### 1. Mergi la Echipă
Content Manager → **Echipă** → **„Create new entry"**.

#### 2. Câmpuri principale

| Câmp | Ce pui |
|---|---|
| **Nume** | „Maria Popescu" |
| **Funcție** | „Coordonator politici climatice" |
| **Bio** | 1–2 propoziții; afișat pe card-ul mic |
| **Detalii (modal)** | Text lung; afișat când utilizatorul dă click pe card |
| **Fotografie** | Pătrat sau aproape pătrat (ideal 800×800) |
| **Ordine afișare** | Număr (1, 2, 3…). Cei cu număr mai mic apar primii. |
| **Conducere** | ⚠️ Toggle critic — vezi mai jos |

#### 3. Toggle „Conducere" — important

| Stare | Unde apare |
|---|---|
| **🟢 Bifat (`is_leadership: true`)** | Tabul „Conducere" de pe `/despre-noi` |
| **⚪ Debifat** | Tabul „Echipă" de pe `/despre-noi` |

Dacă debifezi după ce era bifat, persoana se mută între tab-uri.

#### 4. Linkuri sociale

Click **„Add an entry to social_links"**:

| Câmp | Ce pui |
|---|---|
| **Platform** | linkedin / twitter / facebook / instagram / etc. |
| **URL** | Link-ul complet (cu `https://`) |

Repetă pentru fiecare rețea.

#### 5. Save + Publish

Membrul apare:
- Pe `/despre-noi` în tabul corespunzător
- Ca opțiune în dropdown-ul **Autor** la articole
- În orice **Team Grid** configurat să afișeze grupul lui

### Verificare finală

- [ ] Numele și funcția apar pe card-ul de pe `/despre-noi`
- [ ] Click pe card deschide modal cu **Detalii**
- [ ] Fotografia nu e tăiată ciudat (pătrat e safest)
- [ ] Linkurile sociale (dacă există) au icon-uri și se deschid corect

### Cum modifici ordinea în care apar

Schimbi **„Ordine afișare"** la fiecare membru. Cei cu numărul mai mic apar primii.

Recomandare: lasă spații (10, 20, 30) ca să poți insera ușor pe cineva între ei mai târziu.

### Cum scoți un membru

Două opțiuni:

**Temporar** — **Unpublish**. Dispare de pe site dar rămâne în CMS.

**Definitiv** — **Delete**.

⚠️ Dacă persoana e **autorul unor articole**, vor apărea „fără autor". Mai bine păstrează intrarea și doar **Unpublish**.

---

**Pagini conexe:**
- [Reguli pentru imagini](04-imagini.md#reguli-pentru-imagini-dimensiuni-format)
- [Cum adaugi un articol](#cum-adaugi-un-articol-nou) (autorul vine din Echipă)

---

## Cum construiești o pagină simplă

### Ce vei face
Creezi o pagină nouă (ex: `/program`, `/voluntariat`, `/presa`) folosind blocuri DynamicZone.

### Tipuri de pagini posibile

În CMS există colecția **Pagini** care îți permite să creezi pagini libere. Fiecare pagină nouă apare la `/[slug]`.

Exemple:
- `/despre-noi` (există deja)
- `/program` (poți crea)
- `/voluntariat` (poți crea)

### Pași

#### 1. Mergi la Pagini
Content Manager → **Pagini** → **„Create new entry"**.

#### 2. Câmpuri de bază

| Câmp | Ce pui |
|---|---|
| **Titlu** | Apare ca H1 pe pagină (ex: „Programul nostru") |
| **Slug** | URL-ul (ex: `program` → pagina e la `/program`) |

#### 3. Construiește conținutul cu blocuri

Câmpul **„Conținut"** e o **Dynamic Zone**. Vezi:
- [Ce este Dynamic Zone](03-dynamic-zone.md#ce-este-dynamic-zone)
- [Cum adaugi un bloc](03-dynamic-zone.md#cum-adaugi-un-bloc)
- [Catalog de blocuri](03-dynamic-zone.md#catalog-de-blocuri)

#### Recipe-uri tipice

##### Pagină de tip „Despre"
1. **Page Header** — kicker + titlu + subtitlu
2. **Text Block** — paragrafe introductive
3. **Mission Band** — bandă verde cu misiunea (cuvinte cheie evidențiate în lime cu `**asterisc-uri**`)
4. **Stats Counter** — 3-4 numere mari (ex: „150+ voluntari", „12 filiale")
5. **Team Grid** — afișare automată echipă
6. **CTA Banner** — îndemn la acțiune (Înscrie-te / Donează)

##### Pagină de tip „Program"
1. **Page Header**
2. **Text Block** — intro
3. **Program Points** — direcțiile programului (icon + titlu + descriere)
4. **Card Grid** — politici detaliate, click pe card deschide modal
5. **CTA Banner**

##### Pagină de tip „Presa / Resurse"
1. **Page Header**
2. **Text Block** — intro scurt
3. **Card Grid** — fiecare card = un comunicat / fișier / contact presă
4. **Newsletter CTA** — îndemn la abonare

#### 4. SEO

Completează **SEO** (la sfârșit). Vezi [Cum completezi SEO](08-seo-si-distribuire.md#cum-completezi-seo-ul-unei-pagini).

#### 5. Save → Preview → Publish

Pagina e live la `https://cusens.eu/[slug]`.

### Cum modifici Pagina Principală (homepage)

Homepage-ul e **Single Type → Pagină Principală**, nu o pagină din colecția „Pagini". Procesul de adăugare/modificare a blocurilor e **identic**:

1. Single Types → **Pagină Principală**
2. Câmpul **„Conținut"** are aceleași blocuri
3. Save → Publish

Diferența: homepage-ul nu are slug — e mereu la `/`.

### Cum adaugi pagina nouă în meniu

După ce ai publicat pagina, adaug-o în meniu:

1. Single Types → **Header**
2. Adaugi un nou **menu_item** cu:
   - **Label** = „Program"
   - **URL** = `/program`
3. Save (header-ul nu are publish)

Pagina apare în meniul de sus pe toate paginile.

### Verificare finală

- [ ] Pagina se încarcă la `/[slug]` fără 404
- [ ] Toate blocurile arată cum trebuie (verifică pe mobil)
- [ ] SEO complet
- [ ] (opțional) Adăugată în meniu

---

**Pagini conexe:**
- [Cum folosești secțiuni cu tab-uri](#cum-folosești-secțiuni-cu-tab-uri) (pentru pagini cu mai multe sub-zone)
- [Catalog de blocuri](03-dynamic-zone.md#catalog-de-blocuri)
- [Cum modifici meniul](06-configurare-site.md#cum-modifici-meniul-header)

---

## Cum folosești secțiuni cu tab-uri

### Ce vei face
Adaugi **tab-uri** într-o pagină existentă. Fiecare tab are propriul lui conținut cu blocuri.

### Când e util

Pagini cu informație multă, organizată în categorii care nu se potrivesc într-un scroll lung. Exemple:
- `/despre-noi` → tab-uri: „Cine suntem", „Conducere", „Echipă", „Statut"
- `/program` → tab-uri pentru fiecare direcție majoră
- `/presa` → tab-uri: „Comunicate", „Galerie media", „Contact presă"

### Concept

| Termen | Ce e |
|---|---|
| **Pagină** | Containerul principal (ex: „Despre noi") |
| **Secțiune** | Un tab din interior (ex: „Conducere"); fiecare are conținutul lui propriu |

O pagină poate avea **0, 1 sau mai multe secțiuni**. Dacă are 0, conținutul vine doar din câmpul „Conținut" al paginii. Dacă are 1+, apar tab-uri în partea de sus a paginii.

### Pași — adăugare secțiune nouă

#### 1. Mergi la pagina destinație
Content Manager → **Pagini** → găsești pagina (ex: „Despre noi") → click pe ea.

#### 2. Notează ID-ul paginii (opțional)
Sus în URL-ul Strapi vezi ceva ca `…/api::page.page/n34s2k…`. Nu e necesar pentru fluxul standard.

#### 3. Mergi la Secțiuni
Content Manager → **Secțiuni** → **„Create new entry"**.

#### 4. Completează

| Câmp | Ce pui |
|---|---|
| **Titlu** | Numele tab-ului afișat (ex: „Conducere") |
| **Ordine afișare** | Număr (1, 2, 3…) — controlează ordinea tab-urilor |
| **Pagină (Page)** | Selectezi pagina din care face parte (ex: „Despre noi") |
| **Conținut** | Dynamic Zone — blocuri pentru acest tab |

#### 5. Adaugi blocuri în „Conținut"

Vezi [Cum adaugi un bloc](03-dynamic-zone.md#cum-adaugi-un-bloc) și [Catalog de blocuri](03-dynamic-zone.md#catalog-de-blocuri).

#### 6. Save + Publish

Tab-ul apare automat pe pagina părinte.

### Recipe — pagina /despre-noi

Asta e modelul pe care îl poți copia:

| Tab | Conținut tipic |
|---|---|
| **Cine suntem** | Page Header + Text Block + Mission Band + Stats |
| **Conducere** | Team Grid (filtru: doar leadership) |
| **Echipă** | Team Grid (filtru: non-leadership) |
| **Statut** | Text Block lung sau link spre PDF |

### 🔗 Link direct către un tab specific (anchor `#`)

Tab-urile sunt accesibile și prin URL — utilă pentru a partaja un link care deschide direct un tab anume:

```
/despre-noi#conducere
/despre-noi#echipa
/despre-noi#statut
```

**Cum se generează slug-ul tab-ului automat:**
- Se ia **primul cuvânt** din titlul tab-ului
- Se transformă în lowercase, fără diacritice
- Exemple:
  - „Conducere" → `#conducere`
  - „Misiune & Viziune" → `#misiune`
  - „Despre echipa" → `#despre`

**Tip:** asta înseamnă că dacă două tab-uri au același prim cuvânt (ex: „Misiune" și „Misiunea noastră"), va exista conflict. Asigură-te că **primul cuvânt** al fiecărui tab e unic.

**URL-uri vechi cu `?tab=`** (ex: `/despre-noi?tab=conducere`) **rămân funcționale** ca fallback — link-urile partajate înainte nu se rup.

### Cum modifici ordinea tab-urilor

Schimbi **„Ordine afișare"** la fiecare secțiune.

### Cum scoți un tab

**Unpublish** secțiunea respectivă. Dispare din pagină dar rămâne în CMS.

Sau **Delete** dacă nu mai ai nevoie de ea.

### Cum stergi pagina părinte fără să afectezi tab-urile

Nu poți. Dacă ștergi pagina, **toate secțiunile rămân orfane** (fără părinte). Mai bine **Unpublish** pagina.

---

**Pagini conexe:**
- [Cum construiești o pagină simplă](#cum-construiești-o-pagină-simplă)
- [Catalog de blocuri](03-dynamic-zone.md#catalog-de-blocuri)

---

## Cum modifici un conținut existent

### Ce vei face
Editezi un articol, eveniment, pagină sau membru deja publicat și publici modificările.

### Pași

#### 1. Găsește intrarea
Content Manager → secțiunea potrivită (Articole / Evenimente / Pagini / Echipă) → caută în listă.

**Caută rapid:**
- Bara de search (sus în listă) — caută după titlu
- Sortează coloanele click pe header
- Filtrează după categorie / status / dată din butonul **„Filters"**

#### 2. Click pe intrare → editezi câmpurile

Modifici ce ai nevoie. Vei observa că lângă titlul intrării apare un **indicator portocaliu „Modified"** când există modificări nesalvate.

#### 3. Save

**Save** doar = ai salvat draft, **dar versiunea publicată rămâne neschimbată**.

#### 4. Publish

Apasă **Publish** ca modificările să apară pe site.

⚠️ **Asta e capcana clasică:** mulți cred că **Save** publică. Nu — trebuie **Publish** explicit.

### Indicator status — ce vezi

În lista de articole/evenimente, fiecare rând arată statusul:

| Status | Ce înseamnă |
|---|---|
| 🟢 **Published** | Pe site, fără modificări nepublicate |
| 🟡 **Modified** | Pe site, dar **există un draft cu modificări** care nu sunt încă live |
| ⚪ **Draft** | Doar în CMS, nu e pe site |

Dacă vezi 🟡 **Modified** la o intrare publicată, **nu ai apăsat Publish**.

### Cum revii la versiunea publicată

Dacă ai făcut modificări pe care nu vrei să le păstrezi:
1. Deschizi intrarea
2. **„Discard changes"** (sus dreapta) — drop-down lângă Save
3. Pierzi draftul; versiunea publicată rămâne

### Cum revii la o versiune mai veche

Strapi păstrează un istoric al versiunilor publicate:
1. Deschizi intrarea
2. Sus dreapta, lângă Publish, vezi un drop-down cu **„Versions"**
3. Alegi o versiune anterioară
4. Click → o vezi
5. **Restore** ca să o faci versiunea curentă

⚠️ Funcția există doar pentru intrări cu **draft & publish** (articole, evenimente, pagini, echipă).

### Workflow recomandat pentru update mare

```
1. Open intrare publicată
2. Editezi (multe schimbări)
3. Save (draft)
4. Preview → verifici
5. Mai modifici? Save din nou.
6. Când ești mulțumit/ă → Publish
```

### Dacă altcineva editează în paralel

Strapi nu blochează editarea simultană. Dacă tu și un coleg editați aceeași intrare:
- Cine apasă **Save** primul → modificările lui sunt salvate
- Cine apasă **Save** după → suprascrie modificările primului

Coordonați-vă verbal sau pe Slack înainte să modificați aceeași intrare.

---

**Pagini conexe:**
- [Draft și Publish](01-incepe-aici.md#draft-și-publish-cum-funcționează)
- [Cum folosești Preview](01-incepe-aici.md#cum-folosești-preview-ul)
- [Cum ascunzi sau ștergi conținut](#cum-ascunzi-sau-ștergi-conținut)

---

## Cum ascunzi sau ștergi conținut

### Trei opțiuni — alege cu grijă

| Opțiune | Vizibil pe site? | Vizibil în CMS? | Recuperabil? |
|---|---|---|---|
| **Unpublish** | ❌ | ✅ | ✅ ușor (Publish din nou) |
| **Delete** | ❌ | ❌ | ⚠️ doar din backup |
| **Modificare conținut** | ✅ (versiunea modificată) | ✅ | ✅ |

### 🟡 Unpublish — recomandat în 90% din cazuri

Conținutul dispare de pe site dar rămâne salvat în CMS.

#### Când folosești
- Eveniment anulat sau amânat
- Articol cu informație depășită temporar
- Membru care iese în concediu / pauză
- Pagină în refacere

#### Pași
1. Deschide intrarea
2. Sus dreapta, lângă **Publish**, vei vedea **Unpublish**
3. Click → confirmă
4. Pe site dispare imediat

#### Cum publici la loc
Deschizi din nou intrarea → **Publish**.

### 🔴 Delete — definitiv

Conținutul dispare complet din CMS și de pe site. **Nu se mai poate recupera ușor.**

#### Când folosești
- Conținut creat din greșeală
- Spam sau test
- Membru care a părăsit organizația definitiv (și nu are articole pe el)

#### Pași
1. Deschide intrarea
2. Buton **Delete** (sus dreapta)
3. Confirmă

#### ⚠️ Verificări înainte de Delete

| Tip | Verifică |
|---|---|
| **Articol** | Are imagini unice care nu sunt folosite altundeva? Verifică Media Library înainte. |
| **Eveniment** | A trecut peste 1 an? Mai bine păstrează ca arhivă. |
| **Membru de echipă** | E autorul vreunui articol? Articolele rămân fără autor — mai bine **Unpublish**. |
| **Pagină** | Are secțiuni copii? Acestea rămân orfane. |
| **Categorie** | Sunt articole în ea? Articolele rămân fără categorie — mută-le mai întâi. |

### 🗑️ Bulk delete (mai multe odată)

În lista oricărei colecții:
1. Bifezi checkbox-urile din stânga rândurilor
2. Sus apare un buton **„Delete X entries"**
3. Confirmă

⚠️ **Foarte periculos.** Folosește doar când ești sigur — nu există „undo".

### ❓ Pot recupera ceva șters din greșeală?

Există backup zilnic al CMS-ului. Dacă realizezi în următoarele **24 ore** că ai șters ceva important, contactează tehnicianul **imediat** — există o șansă de recuperare.

După 14 zile, backup-ul e suprascris.

### Workflow recomandat

```
Vrei să scoți temporar?     → Unpublish
Vrei să modifici?           → Edit + Publish
Vrei să scoți pentru totdeauna?
  ↓
  Verifici dependențe (autor, categorie, etc.)
  ↓
  Mai bine Unpublish dacă ai dubii
  ↓
  Delete doar dacă ești 100% sigur
```

---

**Pagini conexe:**
- [Cum modifici un conținut existent](#cum-modifici-un-conținut-existent)
- [Greșeli comune](09-ajutor.md#greșeli-comune-cum-le-eviți)

---

## Cum duplici un articol sau o pagină

### Ce vei face
Creezi o copie a unei intrări existente — util când ai nevoie de un șablon cu o structură similară (ex: comunicate de presă cu același layout).

### ⚠️ Ce trebuie să știi întâi

Strapi v5 **nu are** un buton „Duplicate" nativ pentru toate tipurile de conținut. În funcție de versiunea ta de admin, opțiunile sunt:

#### Opțiunea A — buton „Duplicate" (dacă există)

În unele versiuni / pentru unele tipuri:
1. Deschizi intrarea
2. Sus dreapta, drop-down lângă **Save** → **„Duplicate"**
3. Se deschide o intrare nouă cu toate câmpurile pre-completate
4. Modifici titlul + slug + alte câmpuri specifice
5. Save + Publish

#### Opțiunea B — Manual (mereu funcționează)

1. Deschizi intrarea pe care vrei să o copiezi
2. Selectezi tot conținutul **din câmpul „Conținut"**:
   - Click pe primul bloc → **Save** (ca să te asiguri că e salvat)
   - Notează tipurile și ordinea blocurilor
3. **„Create new entry"**
4. Completezi câmpurile noi
5. **Adaugi blocurile** unul câte unul cu aceeași configurație ca în original

Asta nu e ideal pentru pagini cu 10+ blocuri.

### Recipe — comunicat de presă șablon

Dacă publici regulat conținut cu aceeași structură (comunicate, reguli):

1. Creezi **o pagină șablon** numită „[ȘABLON] Comunicat de presă"
2. O lași **în Draft** (nu Publish)
3. De câte ori ai nevoie:
   - O deschizi
   - „Duplicate" (sau o copiezi manual)
   - Modifici titlul/conținutul
   - Schimbi slug-ul
   - Publish

### Ce câmpuri **NU** copiezi automat

Chiar dacă faci „Duplicate", **trebuie să modifici manual:**

- ❗ **Slug** — altfel ai conflict (URL duplicate)
- ❗ **Titlu** — altfel ai 2 intrări identice în listă
- **Cover image** — dacă vrei o altă poză
- **Data publicării** (pentru evenimente)
- **SEO** — meta title și description

### Tipuri pentru care e util

| Tip | De ce e util de duplicat |
|---|---|
| **Articole** | Același template (intro, citat, paragrafe, CTA) |
| **Evenimente** | Același tip de eveniment recurent (ex: „Adunarea generală 2026" → „2027") |
| **Pagini** | Pagini cu structură similară (ex: pagini per filială) |

### Tipuri pentru care **nu** are sens să duplici

- **Membri echipă** — fiecare e unic
- **Categorii / Etichete** — n-are sens
- **Cereri de aderare / Abonați newsletter** — e date primite, nu creezi tu

---

**Pagini conexe:**
- [Cum adaugi un articol nou](#cum-adaugi-un-articol-nou)
- [Cum modifici un conținut existent](#cum-modifici-un-conținut-existent)

---

## Cum atașezi documente la un articol

### Ce vei face
Atașezi unul sau mai multe fișiere (PDF, Word, Excel) la un articol. Vor apărea ca **listă descărcabilă la finalul articolului**, înainte de etichete.

### Când e util

- Articole despre legi → atașezi textul legii ca PDF
- Comunicate de presă → atașezi versiunea oficială formatată
- Rapoarte → atașezi grafice Excel sau anexe Word
- Manifeste, statute → atașezi documentul oficial

### Pași

#### 1. Deschide articolul
Content Manager → **Articole** → găsești articolul → click pe el.

#### 2. Scroll la câmpul „Documente atașate"
E un câmp media multiplu (poți încărca mai multe fișiere odată).

#### 3. Adaugi fișierele

Două opțiuni:

**A. Drag & drop** — tragi fișierele direct în zona de upload.

**B. Click „Click to add an asset"** → selectezi din computer sau din Media Library.

#### 4. Pentru fiecare fișier completează metadata

După upload, click pe fișier → editezi:
- **File name** — schimbă-l dacă e generic („IMG_1234.pdf" → „Manifest-SENS-2026.pdf")
- **Alternative text** — opțional pentru documente; util doar pentru imagini
- **Caption** — opțional, nu apare pe site

#### 5. Save + Publish

Articolul republicat va afișa lista de documente la final.

### Ce vede vizitatorul

La finalul articolului, deasupra etichetelor, apare:
> — Documente atașate
> 📄 [Manifest-SENS-2026.pdf]   PDF · 1.2 MB   ⬇

Click pe rând → fișierul se descarcă (sau se deschide în tab nou pentru PDF).

### Tipuri de fișiere acceptate

| Format | Extensie | Iconiță afișată |
|---|---|---|
| PDF | `.pdf` | Roșie |
| Microsoft Word | `.doc`, `.docx` | Albastră |
| Microsoft Excel | `.xls`, `.xlsx` | Verde |

Alte tipuri (zip, mp4 etc.) **nu** sunt acceptate de acest câmp.

### Reguli rapide

| Regulă | Detalii |
|---|---|
| **Mărime max per fișier** | 10 MB |
| **Mai multe fișiere** | Permise (drag-drop multiplu) |
| **Reordonare** | Drag pictograma `⋮⋮` pe fiecare fișier |
| **Ștergere** | Pictograma 🗑️ pe fișier |

### Cum reutilizezi un fișier

Dacă fișierul a fost încărcat înainte (ex: pentru alt articol):
1. La upload → **„Browse Media Library"**
2. Cauți fișierul după nume
3. Click pe el → **Finish**

Asta evită duplicarea în storage.

### Sfaturi

- **Nume descriptiv**: `Statut-SENS-v2026.pdf` în loc de `document_final_2.pdf`
- **Comprimă PDF-urile mari** — folosește `tinywow.com` sau ILovePDF înainte de upload
- **Excel cu multe sheet-uri**: redenumește sheet-urile cu nume clare înainte de export
- **Doc → PDF**: dacă documentul e final și nu trebuie editat, exportă ca PDF (mai sigur, deschide oriunde)

### Cum scoți un atașament

1. Deschizi articolul
2. La câmpul **Documente atașate**, click pictograma **🗑️** la fișierul respectiv
3. Save + Publish

⚠️ Asta scoate doar **legătura** dintre articol și fișier. Fișierul rămâne în Media Library — îl ștergi de acolo separat dacă nu mai e folosit nicăieri.

---

**Pagini conexe:**
- [Cum adaugi un articol nou](#cum-adaugi-un-articol-nou)
- [Reguli pentru imagini](04-imagini.md#reguli-pentru-imagini-dimensiuni-format) (similare ca abordare)
- [Catalog de blocuri](03-dynamic-zone.md#catalog-de-blocuri) — vezi blocul **File List** pentru listă de documente independentă pe orice pagină

