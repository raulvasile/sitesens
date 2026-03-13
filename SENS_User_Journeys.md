# SENS — User Journeys & Navigation Map

> Companion document pentru wireframes v1.3
> Toate acțiunile utilizatorului, pagină cu pagină, cu destinațiile fiecărui element interactiv.

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
