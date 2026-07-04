# 01. Începe aici

## Cuprins

1. [Cum te loghezi în CMS](#cum-te-loghezi-în-cms)
2. [Cum arată CMS-ul — tur rapid](#cum-arată-cms-ul-tur-rapid)
3. [Pagini unice vs colecții — diferența](#pagini-unice-vs-colecții-diferența)
4. [Draft și Publish — cum funcționează](#draft-și-publish-cum-funcționează)
5. [Cum folosești Preview-ul](#cum-folosești-preview-ul)
6. [Cum citești etichetele câmpurilor în CMS](#cum-citești-etichetele-câmpurilor-în-cms)

---

## Cum te loghezi în CMS

### Ce vei face
Te conectezi la panoul Strapi de unde gestionezi tot conținutul site-ului.

### Pași

1. Deschide în browser:
   **`https://cms.cusens.eu/admin`**

2. Vei vedea un formular cu două câmpuri:
   - **Email** — adresa primită de la administrator
   - **Password** — parola pe care ai setat-o (sau cea provizorie din emailul de invitație)

3. Apasă **Login**.

4. Dacă e prima dată când te loghezi cu o parolă provizorie, CMS-ul îți va cere să o schimbi imediat. Alege una **lungă și unică** (minim 12 caractere, cu litere mari, cifre și un simbol).

### Ce vezi după login

- **Bara stângă** — meniul principal
- **Center stage** — dashboard cu statistici (rar folosit)
- **Bara sus dreapta** — utilizatorul tău, notificări, setări cont

### Dacă uiți parola

1. Click pe **„Forgot password?"** sub formularul de login
2. Introdu emailul tău
3. Vei primi un link de reset (verifică și folderul Spam)
4. Click pe link → setezi parolă nouă

### Dacă nu ai cont

Cere administratorului să-ți creeze unul. Vei primi un email de invitație cu linkul de activare.

---

## Cum arată CMS-ul — tur rapid

După login, vei vedea o interfață împărțită în trei zone.

### 🗂 Bara stângă — meniul principal

Cele mai importante secțiuni:

| Secțiune | La ce folosește |
|---|---|
| **Content Manager** | Aici editezi articole, evenimente, pagini, echipă etc. **Petreci 95% din timp aici.** |
| **Media Library** | Biblioteca de imagini și fișiere uploaded |
| **Content-Type Builder** | ⛔ **Nu atinge** — schimbarea structurii cere intervenție tehnică |
| **Settings** | ⛔ **Nu atinge** — utilizatori, roles, permisii. Doar pentru administrator. |

### 📦 Content Manager — sub-meniul

Când dai click pe **Content Manager**, se deschide o listă cu două grupe:

#### Collection Types
Conținut din care **poți avea oricâte** intrări:
- Articole
- Evenimente
- Echipă
- Pagini
- Categorii / Etichete / Județe / Domenii de Interes
- Cereri de Aderare (doar citire)
- Abonați Newsletter (doar citire)

#### Single Types
Pagini **unice** — există o singură instanță:
- Pagină Principală
- Pagină Contact / Donații / Înscriere / Newsletter / Comunitate
- Header (Navigation)
- Footer
- Tema Site (⛔ nu atinge)

> Diferența detaliată: vezi [Pagini unice vs colecții](#pagini-unice-vs-colecții-diferența).

### 🎯 Center stage — zona principală

Aici editezi efectiv conținutul. În funcție de ce ai selectat:
- **Listă** (pentru colecții) — vezi toate intrările, poți filtra/sorta/căuta
- **Formular** (când deschizi o intrare) — toate câmpurile editabile

**Toate câmpurile au și o descriere sub ele** (text mic) care îți spune **unde apare pe site**. Vezi [Cum citești etichetele câmpurilor](#cum-citești-etichetele-câmpurilor-în-cms).

### 🧰 Bara sus dreapta — acțiuni globale

| Iconiță | Ce face |
|---|---|
| 🔔 Clopoțel | Notificări (rar folosit) |
| 👤 Avatar | Profilul tău, schimbare parolă, logout |

### 🔘 Butoanele esențiale (sus dreapta în formulare)

| Buton | Când îl apeși |
|---|---|
| **Save** | Salvezi modificările ca **draft** (nu apar pe site) |
| **Publish** | Faci modificările **publice** pe site |
| **Unpublish** | Ascunzi de pe site (rămân în CMS) |
| **Preview** | Vezi cum arată pe site înainte să publici |
| **Delete** | ⚠️ Ștergi definitiv |

---

## Pagini unice vs colecții — diferența

CMS-ul împarte tot conținutul în două categorii. Înțelege diferența ca să găsești rapid ce cauți.

### 🔵 Single Types — pagini unice

**Există o singură instanță.** Nu poți „crea o pagină principală nouă" — există doar una.

#### Exemple pe site-ul SENS

| În CMS | Apare pe site la |
|---|---|
| Pagină Principală | `/` |
| Pagină Contact | `/contact` |
| Pagină Donații | `/doneaza` |
| Pagină Înscriere | `/inscrie-te` |
| Pagină Newsletter | `/newsletter` |
| Pagină Comunitate | `/comunitate` |
| Pagină Politică Confidențialitate | `/politica-confidentialitate` |
| Pagină Evenimente (lista) | `/evenimente` |
| Header | (sus, peste tot) |
| Footer | (jos, peste tot) |

#### Cum lucrezi cu ele
- Click pe numele lor în **Single Types** → se deschide direct formularul de editare
- Modifici câmpurile → **Save** → **Publish**
- **Nu există listă** și nu există buton „Create new"

### 🟢 Collection Types — colecții

**Poți avea oricâte intrări vrei.** Ele apar pe site într-un format de listă/grid.

#### Exemple pe site-ul SENS

| În CMS | Câte? | Unde apar |
|---|---|---|
| Articole | nelimitat | `/stiri` (lista) și `/stiri/[slug]` (individual) |
| Evenimente | nelimitat | `/evenimente` și `/evenimente/[slug]` |
| Echipă | ~10–30 | În blocurile Team Grid din `/despre-noi` |
| Pagini | nelimitat | `/[slug]` (ex: `/despre-noi`, `/program`) |
| Categorii articole | ~5–15 | Filtru pe `/stiri` și badge pe articol |
| Etichete | nelimitat | Filtru pe `/stiri` și jos pe articol |
| Cereri de Aderare | nelimitat | (nu apar public) |
| Abonați Newsletter | nelimitat | (nu apar public) |

#### Cum lucrezi cu ele
- Click pe numele lor în **Collection Types** → vezi **lista** cu toate intrările
- **„Create new entry"** (sus dreapta) → adaugi una nouă
- Click pe o intrare → editezi
- Filtrare/căutare: bara de sus a listei

### 🤔 Cum decizi unde mergi

Întreabă-te: **„Pe site, unde se vede asta?"**

| Vrei să modifici… | Mergi la |
|---|---|
| Hero-ul de pe homepage | Single Type → **Pagină Principală** |
| Un articol publicat | Collection Type → **Articole** → găsești articolul |
| Adresa de email contact | Single Type → **Pagină Contact** |
| Lista de evenimente | Collection Type → **Evenimente** |
| Linkurile din meniul de sus | Single Type → **Header** |
| Linkurile sociale din footer | Single Type → **Footer** |

---

## Draft și Publish — cum funcționează

Cea mai importantă regulă de înțeles: **Save ≠ Publish**.

### 🟡 Draft (ciornă)

- Salvat în CMS
- **Nu** apare pe site-ul public
- Util pentru lucru în desfășurare
- Vizibil prin **Preview** (doar pentru tine)

### 🟢 Published (publicat)

- Vizibil pe site-ul public
- Indexat de Google
- Vede toată lumea

### 🔘 Cele 3 butoane

Sus dreapta în formularul oricărei intrări:

#### `Save`
Salvează modificările ca **draft**. Dacă intrarea era deja publicată, **versiunea publicată rămâne neschimbată** până când apeși și **Publish**.

#### `Publish`
Trimite versiunea curentă (cu modificările salvate) pe site, înlocuind ce era acolo.

#### `Unpublish`
Ascunde de pe site. Conținutul rămâne în CMS ca draft. Util când:
- Un eveniment e anulat și vrei să-l ascunzi temporar
- Un articol are o eroare și vrei să-l retragi rapid

### ⚠️ Capcana clasică

Editezi un articol publicat → modifici titlul → apeși **Save**.

**Rezultat:** ai salvat draftul, dar **versiunea publicată rămâne cu titlul vechi** până când apeși **Publish**.

Cum recunoști: când ai modificări nepublicate, lângă titlu apare un mic indicator portocaliu („Modified").

### 🟢 Două status-uri pe care le vezi în liste

În lista unei colecții, fiecare rând are un status:

| Status | Ce înseamnă |
|---|---|
| 🟢 **Published** | Pe site, fără modificări nepublicate |
| 🟡 **Modified** | Pe site, dar **există modificări salvate ca draft** care nu sunt încă live |
| ⚪ **Draft** | Doar în CMS, nu e pe site |

### ❓ Tipuri fără draft/publish

Câteva pagini de configurare **nu au** acest mecanism — modificările lor sunt live imediat ce apeși **Save**:
- Header (Navigation)
- Footer
- Categorii articole
- Etichete
- Județe / Domenii de Interes
- Tema Site

Pentru ele, butonul **Publish** nu există. Ai grijă: nu poți „testa în draft" — modificarea apare imediat pe site.

---

## Cum folosești Preview-ul

Preview-ul îți arată **cum va arăta conținutul pe site** înainte să-l publici. Util mai ales când lucrezi cu blocuri DynamicZone (vezi catalogul de blocuri).

### Când e disponibil Preview

Pe orice intrare cu un câmp pentru pagină web:
- Pagina Principală
- Articole
- Evenimente
- Pagini

Pentru categorii, etichete, județe, abonați newsletter etc. — **nu** există Preview.

### Cum îl deschizi

1. Deschide intrarea pe care o editezi
2. **Save** modificările (Preview vede ultimul draft salvat)
3. Apasă butonul **„Open Preview"** (sus dreapta, lângă **Save**/**Publish**)
4. Se va deschide o pagină nouă pe site arătând **draftul curent**, nu versiunea publicată

### Ce e diferit la Preview

- URL-ul are un parametru special (ex: `?status=draft&secret=...`) — așa frontend-ul știe să afișeze draftul
- **Doar tu vezi această pagină** — nu apare publicului
- Layout-ul, imaginile, blocurile arată exact ca în prod

### Workflow recomandat cu Preview

```
1. Editezi conținut
2. Save (draft)
3. Preview → verifici cum arată
4. Modifici dacă e ceva în neregulă → Save din nou
5. Re-Preview → confirmi
6. Publish
```

### Probleme frecvente

| Simptom | De ce se întâmplă | Fix |
|---|---|---|
| Preview-ul arată versiunea veche | Nu ai dat **Save** după ultima modificare | Save → Preview |
| Preview-ul arată „404 Not Found" | Slug-ul e gol sau invalid | Completează **Slug** și salvează |
| Preview-ul nu se deschide | Browser blochează popup-uri | Permite popup-uri pentru `cms.cusens.eu` |
| Imaginea nouă nu se vede în Preview | Imaginea era încărcată dar nu salvată | Save după upload |

### ❗ Important

**Preview NU înlocuiește Publish.** Doar vezi cum *ar* arăta. Pentru a face conținutul live, trebuie **Publish**.

---

## Cum citești etichetele câmpurilor în CMS

Toate câmpurile din CMS au:
- Un **label scurt** (deasupra câmpului) — ce este
- O **descriere** (sub câmp, text mai mic) — **unde apare** pe site sau ce face

### Exemplu vizual

```
┌──────────────────────────────────────────────┐
│  Titlu *                                     │   ← LABEL
│  ┌────────────────────────────────────────┐  │
│  │ [câmpul de input]                       │ │
│  └────────────────────────────────────────┘  │
│  Apare ca H1 sus pe pagina articolului și   │   ← DESCRIPTION
│  ca text principal pe cardul din lista        │     (locul în site)
│  /stiri.                                      │
└──────────────────────────────────────────────┘
```

### Citește descrierea înainte de a completa

Descrierea îți spune **exact unde apare** câmpul tău. Citește-o înainte să decizi:
- Cât de scurt sau lung trebuie să fie textul
- Dacă e vizibil sau intern
- Dacă e folosit la filtrare sau doar afișare

### Exemple de descrieri tipice

| Tip descriere | Ce înseamnă |
|---|---|
| „Apare ca H1 sus pe pagina X" | Text mare, vizibil principal |
| „Apare ca chip pe card" | Text scurt, max 1-2 cuvinte |
| „Apare în Google și pe Facebook" | SEO; max 60-160 caractere |
| „Apare în meniul hamburger pe mobil" | Vizibil doar mobil |
| „Folosit intern pentru filtrare" | Nu e vizibil; afectează URL-uri |
| „Bifat = X / Debifat = Y" | Toggle binar |
| „Generat automat dacă lipsește" | Opțional — sistemul completează |

### Câmpuri cu asterisc roșu (*)

Câmpurile marcate cu **asterisc roșu** sunt **obligatorii**. Nu poți salva intrarea fără să le completezi.

### Câmpuri opționale

Câmpurile **fără asterisc** sunt opționale. Le poți lăsa goale dacă nu sunt relevante. Multe au comportament „dacă lipsește, folosește X" (vezi descrierea).

### Limbajul descrierilor

- „Apare" / „Vizibil" → vizibil utilizatorului final pe site
- „Folosit" / „Intern" → nu apare direct, dar afectează ceva
- „Default" → ce se folosește dacă lipsește
- „Toggle" → bifabil/debifabil

