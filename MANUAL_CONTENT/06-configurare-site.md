# 06. Configurare site

## Cuprins

1. [Cum modifici meniul (header)](#cum-modifici-meniul-header)
2. [Cum modifici footer-ul](#cum-modifici-footer-ul)
3. [Cum modifici pagina de contact](#cum-modifici-pagina-de-contact)
4. [Cum modifici pagina de donații](#cum-modifici-pagina-de-donații)
5. [Cum modifici pagina de comunitate](#cum-modifici-pagina-de-comunitate)
6. [Cum configurezi harta României (filiale)](#cum-configurezi-harta-româniei-filiale)

---

## Cum modifici meniul (header)

### Ce vei face
Adaugi, scoți, redenumești sau reordonezi link-urile din meniul de sus al site-ului.

### Unde se află

Single Types → **Header** (Navigation).

Modificările se aplică **tuturor paginilor**.

### Structura meniului

Header-ul are **patru zone**:

| Zonă | Pe site |
|---|---|
| **Logo** | Stânga sus, link spre `/` |
| **Main menu** | Mijloc — link-urile principale |
| **Secondary menu** | Dreapta — link-uri secundare + buton CTA (ultimul item) |
| **Mobile extra links** | Doar pe mobil — link-uri suplimentare în meniul hamburger |

### Cum modifici logo-ul

1. Single Types → **Header**
2. Câmpul **Logo** → Click → încarci sau alegi imagine din Media Library
3. Recomandat: SVG, 200×60 (sau similar)
4. **Save**

### Cum adaugi un link în meniul principal

1. Single Types → **Header**
2. Scroll la **Main menu**
3. **„Add an entry to main_menu"**
4. Completezi:

| Câmp | Ce pui |
|---|---|
| **Label** | Textul vizibil (ex: „Despre noi") |
| **URL** | Link-ul (ex: `/despre-noi` sau `https://extern.com`) |
| **Order** | Număr; cei cu număr mai mic apar primii |
| **Open in new tab** | Bifează doar pentru link-uri externe |

5. **Save**

### Cum adaugi un sub-meniu (dropdown)

Link-urile din meniul principal pot avea **copii** (children) — care apar ca dropdown la hover.

1. Editezi un link existent (sau creezi unul nou)
2. La **children** → **„Add an entry"**
3. Completezi label + URL pentru fiecare sub-link
4. Setezi `order` pentru fiecare

Pe site, link-ul părinte va arăta o săgeată în jos. Hover → apare dropdown.

⚠️ Doar **un nivel** de adâncime (părinte → copii). Nu poți avea copii ai copiilor.

### Cum reordonezi link-urile

Două opțiuni:

#### A. Schimbi numerele de **order**
1. Editezi fiecare link
2. Modifici **order**: 1, 2, 3, 4
3. Save

Recomandare: lasă spații (10, 20, 30, 40) ca să poți insera ușor între ele.

#### B. Drag & drop (dacă disponibil)
1. La fiecare item, în lista repeatable, există un handle de drag (`⋮⋮`)
2. Trage în sus/jos
3. Save

### Meniul secundar (dreapta)

Adăugare identică, doar că folosești câmpul **Secondary menu**.

⚠️ **Ultimul item din secondary menu devine automat butonul CTA** (lime, vizibil mai puternic). Folosește-l pentru îndemnul principal: „Donează", „Înscrie-te".

### Mobile extra links

Pe mobil, meniul hamburger are mai mult spațiu. Aici poți pune link-uri secundare care nu încap în meniul desktop:
- „Politica de confidențialitate"
- „Termeni și condiții"
- „Sitemap"

### Cum scoți un link

1. Editezi Header
2. Click pe pictograma **🗑️** la link-ul respectiv
3. Save

### Verificare după modificare

1. Refresh `https://cusens.eu` în browser (Ctrl+F5 / Cmd+Shift+R pentru bypass cache)
2. Verifici desktop, tabletă (resize fereastra), mobil (sau DevTools → modul mobile)
3. Click pe fiecare link nou să confirmi că merge

### Sfaturi

- **Maxim 5–7 link-uri în main menu**, altfel devine aglomerat
- Folosește **labels scurte** (1-2 cuvinte)
- Pentru pagini frecvente, evită URL-uri lungi (mai bine creezi un slug scurt)
- **Testează pe mobil** — meniul hamburger arată diferit

---

**Pagini conexe:**
- [Cum modifici footer-ul](#cum-modifici-footer-ul)
- [Cum construiești o pagină simplă](02-creare-continut.md#cum-construiești-o-pagină-simplă) (după ce creezi pagina, o adaugi în meniu)

---

## Cum modifici footer-ul

### Ce vei face
Modifici link-urile, textul legal sau rețelele sociale din footer-ul site-ului.

### Unde se află

Single Types → **Footer**.

Modificările se aplică **pe toate paginile**.

### Structura footer-ului

| Secțiune | Conținut |
|---|---|
| **Logo + tagline** | Logo SENS, sub el o frază scurtă (ex: „Pentru o Românie modernă") |
| **Footer links** | Link-uri organizate (ex: Despre, Implică-te, Resurse) |
| **Social links** | Iconițe rețele sociale |
| **Legal text** | Copyright, mențiuni legale |
| **EU text** | Mențiune fonduri UE (dacă e cazul) |
| **Privacy link** | Link spre politica de confidențialitate |

### Cum modifici logo-ul footer

1. Single Types → **Footer**
2. Câmpul **Logo** → modifici
3. Save

Recomandare: poate fi diferit de logo-ul header (ex: monochrom pe fundal verde).

### Cum modifici tagline-ul

1. Single Types → **Footer**
2. Câmpul **Tagline** → modifici text
3. Save

### Cum adaugi un link în footer

1. Single Types → **Footer**
2. Scroll la **Footer links**
3. **„Add an entry to footer_links"**
4. Completezi:

| Câmp | Ce pui |
|---|---|
| **Label** | Textul vizibil |
| **URL** | Link-ul |
| **Order** | Pentru ordonare |
| **Open in new tab** | Bifează pentru link-uri externe |

5. Save

Footer-ul **nu** suportă sub-link-uri (dropdown).

### Cum adaugi/modifici linkuri sociale

Tot în Single Types → **Footer**:

1. Scroll la **Social links**
2. **„Add an entry"**
3. Completezi:

| Câmp | Ce pui |
|---|---|
| **Platform** | facebook / twitter / instagram / linkedin / tiktok / youtube |
| **URL** | Link-ul complet către profil (cu `https://`) |
| **Display order** | Ordine în care apar |

4. Save

Pe site apar ca iconițe în zona dedicată.

⚠️ **Important:** linkurile sociale din footer sunt **single source of truth** — sunt folosite și pe pagina de contact, pagina de comunitate etc. Schimbi într-un singur loc, se reflectă peste tot.

### Cum modifici textul legal

1. Single Types → **Footer**
2. Câmpul **Legal text** → modifici
3. Save

Tipic conține:
- „© 2026 Partidul SENS. Toate drepturile rezervate."
- Mențiuni partid politic înregistrat (dacă obligatoriu)

### Cum modifici mențiunea EU

1. Câmpul **EU text** (dacă există)
2. Folosit pentru mențiuni proiecte cu finanțare UE
3. Lasă gol dacă nu e cazul

### Cum modifici link-ul către Privacy

1. Câmpurile **Privacy link text** și **Privacy link URL**
2. Default: „Politica de confidențialitate" → `/politica-confidentialitate`
3. Modifici doar dacă URL-ul s-a schimbat

### Verificare

După Save:
1. Refresh orice pagină → scroll jos
2. Verifici că toate link-urile merg
3. Verifici iconițele sociale (click → se deschide profilul corect)
4. Verifici pe mobil (footer-ul se restructurează)

---

**Pagini conexe:**
- [Cum modifici meniul](#cum-modifici-meniul-header)
- [Cum modifici pagina de contact](#cum-modifici-pagina-de-contact)

---

## Cum modifici pagina de contact

### Ce vei face
Modifici emailul, adresa, programul, sau textele de pe `/contact`.

### Unde se află

Single Types → **Pagină Contact**.

### Câmpuri principale

#### Header

| Câmp | Ce pui |
|---|---|
| **Title** | Titlul mare al paginii (ex: „Contact") |
| **Header eyebrow** | Eyebrow opțional (ex: „— Vorbește cu noi"). **Dacă lași gol, nu apare nimic** deasupra titlului. |
| **Subtitle** | Subtitlu lead sub titlu |

#### Date de contact

| Câmp | Ce pui |
|---|---|
| **Email** | `contact@cusens.eu` |
| **Address** | Adresa fizică (ex: „Str. X nr. Y, București") |
| **Schedule** | Programul de lucru (ex: „L–V, 09:00–18:00") |
| **Phone** | Telefon (opțional) |

#### Formular de contact

Câmpul **Form** (component) configurează formularul integrat:

| Sub-câmp | Ce pui |
|---|---|
| **Form kicker** | Eyebrow deasupra formularului (ex: „— Mesaj direct") |
| **Form title** | Titlu (ex: „Trimite-ne un mesaj") |
| **Name placeholder** | „Nume complet" |
| **Email placeholder** | „adresa@exemplu.com" |
| **Subject placeholder** | „Subiect mesaj" |
| **Message placeholder** | „Mesajul tău..." |
| **Submit button text** | „Trimite mesaj →" |
| **Success title** | „Mesaj trimis!" |
| **Success message** | „Te vom contacta în curând." |

#### Mesaje de validare

Câmpul **Validation** configurează ce vede utilizatorul când greșește:

| Sub-câmp | Ce pui |
|---|---|
| **Required** | „Acest câmp e obligatoriu" |
| **Email format** | „Te rugăm să introduci un email valid" |
| **Min length** | „Trebuie să aibă minim {n} caractere" |

#### SEO

Cum la orice pagină. Vezi [Cum completezi SEO](08-seo-si-distribuire.md#cum-completezi-seo-ul-unei-pagini).

### Cum funcționează formularul de contact

⚠️ **Important de știut:** formularul **NU trimite emailuri automat** prin Strapi.

Când utilizatorul completează și apasă „Trimite":
1. Browser-ul deschide clientul de email al utilizatorului (Gmail, Outlook, Mail.app)
2. Cu mesajul **pre-completat** spre adresa configurată în câmpul **Email**
3. Utilizatorul confirmă trimiterea din clientul lui

Asta înseamnă:
- ✅ Nu trebuie configurare SMTP
- ✅ Răspunsuri vin direct la inbox-ul tău
- ❌ Utilizatorii fără client de email configurat nu pot trimite (rar întâlnit)

Dacă vrei un formular care **chiar** trimite din browser (fără mailto), trebuie modificare tehnică.

### Linkurile sociale de pe pagina de contact

**Nu** se setează aici. Vin din **Footer** → **Social links**. Vezi [Cum modifici footer-ul](#cum-modifici-footer-ul).

### Verificare după modificare

1. Refresh `/contact`
2. Verifici email + adresă + program afișate corect
3. Completezi formularul → click „Trimite" → verifici că se deschide clientul de email cu adresa și mesajul corecte

---

**Pagini conexe:**
- [Cum modifici footer-ul](#cum-modifici-footer-ul) (linkuri sociale)
- [Cum modifici pagina de comunitate](#cum-modifici-pagina-de-comunitate)

---

## Cum modifici pagina de donații

### Ce vei face
Modifici sumele preset, IBAN-ul, textele de transparență sau mențiunile CMF de pe `/doneaza`.

### Unde se află

Single Types → **Pagină Donații**.

### Câmpuri principale

#### Header

| Câmp | Ce pui |
|---|---|
| **Title** | „Donează pentru SENS" |
| **Header eyebrow** | „— Susține mișcarea" |
| **Description** | Paragraf scurt sub titlu |

#### Sume preset

Componenta **Amounts** — listă de sume între care utilizatorul alege.

##### Cum modifici sumele

1. Scroll la **Amounts**
2. Vezi lista actuală (ex: 25, 50, 100, 200 RON)
3. Pentru a **modifica o sumă**: click pe ea → editezi câmpul `amount`
4. Pentru a **adăuga**: **„Add an entry to amounts"** → completezi `amount`
5. Pentru a **șterge**: pictograma **🗑️**
6. Save

##### Câmpuri per sumă

| Câmp | Ce pui |
|---|---|
| **Amount** | Valoarea în RON (număr întreg, ex: 50) |
| **Label** | Opțional. Etichetă personalizată (ex: „Donează un copil la educație") |

#### Texte secțiuni

| Câmp | Ce pui |
|---|---|
| **Amounts kicker** | Eyebrow secțiune sume (ex: „Pasul 1") |
| **Amounts heading** | Titlu (ex: „Alege suma donației") |
| **Custom amount label** | Text pentru opțiunea „altă sumă" (ex: „Sau introdu o sumă personalizată") |
| **Donate button text** | Text buton final (ex: „Donează acum") |

#### Transfer bancar (IBAN)

| Câmp | Ce pui |
|---|---|
| **IBAN** | Codul IBAN cu spații (ex: `RO49 AAAA 1B31 0075 9384 0000`) |
| **Bank name** | Numele băncii (ex: „Banca Transilvania") |
| **Transfer kicker** | Eyebrow (ex: „Pasul 2") |
| **Transfer heading** | Titlu (ex: „Transfer bancar") |
| **Transfer notes** | Note importante (ex: „Menționează 'Donație SENS' în detaliile transferului") |

⚠️ **Verifică de două ori IBAN-ul.** O singură cifră greșită = banii ajung la altcineva.

#### Transparență

Componenta **Transparency** — afișează **cum sunt cheltuiți** banii donați.

##### Cum modifici alocările

1. Scroll la **Transparency**
2. Vezi lista actuală (ex: 40% Comunicare, 30% Evenimente, 20% Operațional, 10% Rezervă)
3. Pentru fiecare item:

| Câmp | Ce pui |
|---|---|
| **Label** | Categoria (ex: „Comunicare campanii") |
| **Percentage** | Procentul (1–100) |
| **Description** | Opțional, apare sub bară |

4. ⚠️ **Procentele trebuie să adune 100%**. Verifici manual.

5. Save

#### Texte secțiune transparență

| Câmp | Ce pui |
|---|---|
| **Transparency kicker** | „Transparență" |
| **Transparency heading** | „Unde merg banii tăi" |

#### Mențiune CMF (mandatar financiar)

Obligatoriu legal pentru partide politice care primesc donații:

| Câmp | Ce pui |
|---|---|
| **CMF kicker** | „Mandatar financiar" |
| **CMF text** | Mențiunea legală completă (ex: „Mandatar financiar coordonator înregistrat la AEP cu nr. CMF…") |

⚠️ **Nu modifica** acest text fără consultare juridică. E reglementat de Legea 334/2006.

#### SEO

Vezi [Cum completezi SEO](08-seo-si-distribuire.md#cum-completezi-seo-ul-unei-pagini).

### Workflow recomandat

#### Modificare sume sau transparență
1. Editezi câmpurile
2. Save
3. Refresh `/doneaza` → verifici vizual

#### Modificare IBAN
1. **Pregătește o altă persoană să verifice** IBAN-ul nou
2. Editezi câmpul **IBAN**
3. Save
4. Refresh `/doneaza` → copiezi IBAN-ul → confirmi cu pagina ta de internet banking că e corect

### Verificare după modificare

- [ ] Toate sumele apar corect ca butoane
- [ ] „Altă sumă" funcționează (poți tasta o sumă custom)
- [ ] IBAN apare corect și se poate copia
- [ ] Procentajele transparență adună 100%
- [ ] Mențiune CMF prezentă

---

**Pagini conexe:**
- [Cum completezi SEO](08-seo-si-distribuire.md#cum-completezi-seo-ul-unei-pagini)

---

## Cum modifici pagina de comunitate

### Ce vei face
Modifici linkurile, embed-urile și textele de pe `/comunitate` — pagina dedicată rețelelor sociale.

### Unde se află

Single Types → **Pagină Comunitate**.

### Câmpuri principale

#### Header

| Câmp | Ce pui |
|---|---|
| **Title** | „Comunitate" |
| **Subtitle** | Subtitlu lead |

#### Platforme sociale

Componenta **Platforms** — fiecare platformă (Facebook, Instagram, TikTok etc.) e configurată separat.

##### Cum adaugi o platformă

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

##### Embed direct (Instagram, TikTok, Facebook)

Pentru a afișa un **embed live** al unei postări specifice:

1. Pe platformă, găsești postarea
2. Apeși „Embed" → copiezi URL-ul (sau codul HTML, ai nevoie doar de URL)
3. În CMS, lipești în câmpul **Embed URL**

Pe site se va încărca embed-ul real (nu doar un link).

#### Secțiunea „Posts"

| Câmp | Ce pui |
|---|---|
| **Posts heading** | Titlu deasupra grilei de embed-uri (ex: „Ultimele postări") |
| **Embed fallback text** | Text afișat dacă embed-urile nu se încarcă (ex: „Vezi postările pe @partidulsens") |

#### Beneficii / features

Componenta **Features** — listă de motive pentru care e bine să urmărești:

1. **„Add an entry to features"**
2. Completezi:

| Câmp | Ce pui |
|---|---|
| **Title** | „Update-uri zilnice" |
| **Description** | „Vezi imediat ce facem și unde poți participa" |
| **Icon** | Emoji sau nume icon (opțional) |

#### SEO

Vezi [Cum completezi SEO](08-seo-si-distribuire.md#cum-completezi-seo-ul-unei-pagini).

### Workflow recomandat

#### Adăugare platformă nouă (ex: Threads)
1. Verifici că CMS-ul recunoaște platforma (vezi enum în câmpul Name)
2. Dacă nu, contactează tehnicianul (necesită update schema)
3. Dacă da:
   - Add entry → completezi
   - Save
   - Refresh `/comunitate` → verifici

#### Refresh embed-uri
Dacă ai schimbat o postare embed-uită:
1. Modifici **Embed URL** la noua postare
2. Save
3. Refresh pagina (poate fi necesar Ctrl+F5)

### ⚠️ Probleme cunoscute cu embed-uri

| Platform | Comportament |
|---|---|
| **Facebook** | Necesită ca postarea să fie publică |
| **Instagram** | Doar conturi business / creator pot fi embed-uite |
| **TikTok** | Embed funcționează dacă postarea nu e privată |
| **Twitter/X** | Restricții recente API; embed-uri pot fi instabile |

Dacă un embed nu se încarcă, va apărea **Embed fallback text**.

### Sincronizare cu Footer

Linkurile sociale din **Footer** sunt independente de cele de aici. Dacă schimbi URL-ul unei rețele sociale, **trebuie să modifici în ambele locuri**:
- Single Types → **Footer** → Social links
- Single Types → **Pagină Comunitate** → Platforms

---

**Pagini conexe:**
- [Cum modifici footer-ul](#cum-modifici-footer-ul)

---

## Cum configurezi harta României (filiale)

### Ce vei face
Adaugi sau modifici filialele care apar pe harta interactivă a României. Click pe județ → tooltip cu nume + buton spre pagina filialei.

### Unde se află

Harta e un **bloc Dynamic Zone** numit **„Hartă România"** (`blocks.romania-map`). Apare pe orice pagină unde a fost adăugat (de obicei `/comunitate` sau `/despre-noi`).

Pentru a o configura, mergi la pagina care conține blocul:
- Single Types → **Pagină Comunitate** (sau ce pagină ai)
- Sau Collection Types → **Pagini** → găsești pagina cu harta

### Câmpuri principale ale blocului

| Câmp | Ce pui |
|---|---|
| **Kicker** | Eyebrow mic deasupra titlului (opțional) |
| **Heading** | Titlu (ex: „Filiale active") |
| **Subheading** | Text scurt sub titlu (opțional) |
| **Background color** | „paper" (alb) sau „cream" |
| **Chapters** | Lista filialelor (vezi mai jos) |

### Cum adaugi o filială nouă

1. Scroll la câmpul **Chapters** (în interiorul blocului Hartă)
2. **„Add an entry to chapters"**
3. Completezi:

| Câmp | Ce pui |
|---|---|
| **Code** | Codul ISO 3166-2 al județului — vezi tabelul de mai jos |
| **Name** | Numele filialei (opțional). Dacă lasi gol, se folosește numele județului |
| **URL** | Link-ul către pagina filialei (intern: `/filiale/cluj`, extern: `https://...`) |
| **Open in new tab** | Toggle. **Bifat = deschide în tab nou.** Debifat = navighează în aceeași filă. |

4. Save

### Coduri ISO pentru județe

Codurile sunt **majuscule, 1-2 litere**, conforme cu ISO 3166-2:RO.

#### Exemple frecvente

| Județ | Code |
|---|---|
| București | `B` |
| Cluj | `CJ` |
| Timiș | `TM` |
| Iași | `IS` |
| Constanța | `CT` |
| Brașov | `BV` |
| Sibiu | `SB` |
| Mureș | `MS` |
| Prahova | `PH` |
| Dolj | `DJ` |

#### Toate cele 41 de județe + București

`AB AR AG BC BH BN BT BV BR B BZ CL CS CJ CT CV DB DJ GL GR GJ HR HD IL IS IF MM MH MS NT OT PH SM SJ SB SV TR TM TL VS VL VN`

#### Greșeli frecvente
- ❌ `Cluj` — trebuie `CJ`
- ❌ `cj` — trebuie majuscule
- ❌ `BUC` pentru București — corect e doar `B`
- ❌ `BI` pentru București — corect e doar `B`

### Cum modifici o filială existentă

1. În lista **Chapters**, identifici filiala
2. Modifici câmpurile (Code, Name, URL, Open in new tab)
3. Save

⚠️ Schimbarea **Code-ului** schimbă județul pe care apare pe hartă — verifică să fie cel corect.

### Cum scoți o filială

1. În lista **Chapters**, click pe pictograma **🗑️**
2. Save

Pe hartă, județul respectiv va deveni **gri** (inactiv) — click-ul nu mai face nimic.

### Open in new tab — ce să alegi?

| Opțiune | Recomandat pentru |
|---|---|
| **🟢 Bifat (default)** | Link-uri externe (Facebook, Instagram, alte site-uri ale filialelor); link-uri către PDF-uri sau resurse în alt format |
| **⚪ Debifat** | Link-uri **interne** către alte pagini ale site-ului SENS (ex: `/filiale/cluj`) — utilizatorul rămâne în navigare normală cu butonul Back |

### Verificare după modificare

1. Refresh pagina cu harta în browser
2. Județul trebuie să fie **verde închis** (active) — nu gri
3. Hover pe județ (desktop) → tooltip apare
4. Click pe județ:
   - Cu Open in new tab **bifat**: tab nou se deschide
   - Cu Open in new tab **debifat**: navigare în aceeași filă
5. Pe mobil: tap = tooltip; al doilea tap = navigare

### Stilul vizual al județelor

| Stare | Culoare pe hartă |
|---|---|
| **Activ** (are filială) | Verde închis |
| **Hover/Selected** | Lime (verde deschis) |
| **Inactiv** (fără filială) | Gri deschis |

### Sfat — tooltip text

Numele afișat în tooltip vine din câmpul **Name** al filialei. Dacă lași gol, se folosește numele oficial al județului. Dacă vrei un nume mai personal (ex: „Filiala SENS Cluj-Napoca"), îl pui aici.

---

**Pagini conexe:**
- [Cum modifici pagina de comunitate](#cum-modifici-pagina-de-comunitate)
- [Cum adaugi un bloc](03-dynamic-zone.md#cum-adaugi-un-bloc)

