# Cum construiești o pagină simplă

## Ce vei face
Creezi o pagină nouă (ex: `/program`, `/voluntariat`, `/presa`) folosind blocuri DynamicZone.

## Tipuri de pagini posibile

În CMS există colecția **Pagini** care îți permite să creezi pagini libere. Fiecare pagină nouă apare la `/[slug]`.

Exemple:
- `/despre-noi` (există deja)
- `/program` (poți crea)
- `/voluntariat` (poți crea)

## Pași

### 1. Mergi la Pagini
Content Manager → **Pagini** → **„Create new entry"**.

### 2. Câmpuri de bază

| Câmp | Ce pui |
|---|---|
| **Titlu** | Apare ca H1 pe pagină (ex: „Programul nostru") |
| **Slug** | URL-ul (ex: `program` → pagina e la `/program`) |

### 3. Construiește conținutul cu blocuri

Câmpul **„Conținut"** e o **Dynamic Zone**. Vezi:
- [Ce este Dynamic Zone](../03-dynamic-zone/01-ce-este-dynamic-zone.md)
- [Cum adaugi un bloc](../03-dynamic-zone/02-cum-adaugi-un-bloc.md)
- [Catalog de blocuri](../03-dynamic-zone/04-catalog-blocuri.md)

### Recipe-uri tipice

#### Pagină de tip „Despre"
1. **Page Header** — kicker + titlu + subtitlu
2. **Text Block** — paragrafe introductive
3. **Mission Band** — bandă verde cu misiunea (cuvinte cheie evidențiate în lime cu `**asterisc-uri**`)
4. **Stats Counter** — 3-4 numere mari (ex: „150+ voluntari", „12 filiale")
5. **Team Grid** — afișare automată echipă
6. **CTA Banner** — îndemn la acțiune (Înscrie-te / Donează)

#### Pagină de tip „Program"
1. **Page Header**
2. **Text Block** — intro
3. **Program Points** — direcțiile programului (icon + titlu + descriere)
4. **Card Grid** — politici detaliate, click pe card deschide modal
5. **CTA Banner**

#### Pagină de tip „Presa / Resurse"
1. **Page Header**
2. **Text Block** — intro scurt
3. **Card Grid** — fiecare card = un comunicat / fișier / contact presă
4. **Newsletter CTA** — îndemn la abonare

### 4. SEO

Completează **SEO** (la sfârșit). Vezi [Cum completezi SEO](../08-seo-si-distribuire/01-cum-completezi-seo.md).

### 5. Save → Preview → Publish

Pagina e live la `https://cusens.eu/[slug]`.

## Cum modifici Pagina Principală (homepage)

Homepage-ul e **Single Type → Pagină Principală**, nu o pagină din colecția „Pagini". Procesul de adăugare/modificare a blocurilor e **identic**:

1. Single Types → **Pagină Principală**
2. Câmpul **„Conținut"** are aceleași blocuri
3. Save → Publish

Diferența: homepage-ul nu are slug — e mereu la `/`.

## Cum adaugi pagina nouă în meniu

După ce ai publicat pagina, adaug-o în meniu:

1. Single Types → **Header**
2. Adaugi un nou **menu_item** cu:
   - **Label** = „Program"
   - **URL** = `/program`
3. Save (header-ul nu are publish)

Pagina apare în meniul de sus pe toate paginile.

## Verificare finală

- [ ] Pagina se încarcă la `/[slug]` fără 404
- [ ] Toate blocurile arată cum trebuie (verifică pe mobil)
- [ ] SEO complet
- [ ] (opțional) Adăugată în meniu

---

**Pagini conexe:**
- [Cum folosești secțiuni cu tab-uri](05-cum-folosesti-sectiuni-cu-tab-uri.md) (pentru pagini cu mai multe sub-zone)
- [Catalog de blocuri](../03-dynamic-zone/04-catalog-blocuri.md)
- [Cum modifici meniul](../06-configurare-site/01-cum-modifici-meniul.md)
