# Cum modifici pagina de contact

## Ce vei face
Modifici emailul, adresa, programul, sau textele de pe `/contact`.

## Unde se află

Single Types → **Pagină Contact**.

## Câmpuri principale

### Header

| Câmp | Ce pui |
|---|---|
| **Title** | Titlul mare al paginii (ex: „Contact") |
| **Header eyebrow** | Eyebrow opțional (ex: „— Vorbește cu noi"). **Dacă lași gol, nu apare nimic** deasupra titlului. |
| **Subtitle** | Subtitlu lead sub titlu |

### Date de contact

| Câmp | Ce pui |
|---|---|
| **Email** | `contact@cusens.eu` |
| **Address** | Adresa fizică (ex: „Str. X nr. Y, București") |
| **Schedule** | Programul de lucru (ex: „L–V, 09:00–18:00") |
| **Phone** | Telefon (opțional) |

### Formular de contact

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

### Mesaje de validare

Câmpul **Validation** configurează ce vede utilizatorul când greșește:

| Sub-câmp | Ce pui |
|---|---|
| **Required** | „Acest câmp e obligatoriu" |
| **Email format** | „Te rugăm să introduci un email valid" |
| **Min length** | „Trebuie să aibă minim {n} caractere" |

### SEO

Cum la orice pagină. Vezi [Cum completezi SEO](../08-seo-si-distribuire/01-cum-completezi-seo.md).

## Cum funcționează formularul de contact

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

## Linkurile sociale de pe pagina de contact

**Nu** se setează aici. Vin din **Footer** → **Social links**. Vezi [Cum modifici footer-ul](02-cum-modifici-footer-ul.md).

## Verificare după modificare

1. Refresh `/contact`
2. Verifici email + adresă + program afișate corect
3. Completezi formularul → click „Trimite" → verifici că se deschide clientul de email cu adresa și mesajul corecte

---

**Pagini conexe:**
- [Cum modifici footer-ul](02-cum-modifici-footer-ul.md) (linkuri sociale)
- [Cum modifici pagina de comunitate](05-cum-modifici-pagina-de-comunitate.md)
