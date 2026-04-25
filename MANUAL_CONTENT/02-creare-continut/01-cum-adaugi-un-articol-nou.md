# Cum adaugi un articol nou

## Ce vei face
Creezi un articol care apare la `/stiri` și are propria pagină la `/stiri/[slug]`.

## Înainte să începi

- Ai gata: titlu, text, cover image (1920×1080 ideal)
- Verifici că există **categoria** potrivită; dacă nu, vezi [Cum gestionezi categoriile](../05-taxonomii/01-cum-gestionezi-categoriile.md)
- Verifici că **autorul** există în **Echipă**; dacă nu, vezi [Cum adaugi un membru](03-cum-adaugi-un-membru-echipa.md)

## Pași

### 1. Mergi la Articole
Content Manager → **Articole** → buton **„Create new entry"** (sus dreapta).

### 2. Completează metadata

| Câmp | Ce pui |
|---|---|
| **Titlu** | Titlul vizibil pe site (ex: „Manifest pentru o Românie verde") |
| **Slug** | Generat automat din titlu. Editează doar dacă vrei (ex: `manifest-verde`). Vezi [Cum scrii un slug bun](../08-seo-si-distribuire/02-cum-scrii-un-slug.md). |
| **Rezumat (Excerpt)** | 1–2 propoziții. Apare în lista `/stiri` și pe Facebook când partajezi. |
| **Imagine copertă** | Click → încarci imaginea. Vezi [Reguli pentru imagini](../04-imagini/02-reguli-pentru-imagini.md). |
| **Categorie** | Alege una singură din dropdown (ex: Politici publice) |
| **Etichete** | Opțional. Mai multe permise. Pentru filtrare secundară. |
| **Autor** | Alege un membru de echipă din dropdown |
| **Reading time** | În minute. Lasă gol dacă vrei să-l calculeze automat. |

### 3. Adaugă conținut

Câmpul **„Conținut"** e o **Dynamic Zone** — vezi [Cum folosești Dynamic Zone](../03-dynamic-zone/01-ce-este-dynamic-zone.md).

Tipic pentru un articol:
1. **Text Block** — paragrafele tale
2. (opțional) **Quote** — un citat important
3. (opțional) **Image Gallery** — poze
4. (opțional) **Video Embed** — un YouTube
5. **Text Block** — restul textului

### 4. Featured Stat (opțional)

Bifează doar dacă vrei o statistică evidențiată (număr mare + descriere) care apare ca un highlight separat în pagină. Ex: „**73%** din români consideră că schimbările climatice sunt o problemă urgentă".

### 5. SEO

Mergi în jos la secțiunea **SEO** și completează:
- **Meta Title** — diferit de titlu dacă e cazul (max 60 caractere)
- **Meta Description** — descriere atractivă (max 160 caractere)
- **OG Image** — opțional; dacă lipsește, se folosește cover image

Vezi [Cum completezi SEO](../08-seo-si-distribuire/01-cum-completezi-seo.md).

### 6. Save → Preview → Publish

1. **Save** (salvezi ca draft)
2. **Preview** (sus dreapta) — verifici cum arată
3. Corecturi → **Save** din nou
4. **Publish** (sus dreapta)

Articolul e live la `https://cusens.eu/stiri/[slug-ul-tău]`.

## Verificare finală

- [ ] Apare în lista `/stiri` (ordonat după dată)
- [ ] Pagina articolului se încarcă fără erori
- [ ] Imaginea copertă se vede mare
- [ ] Categorie + etichete + autor afișate corect
- [ ] SEO complet (verifică [cum arată pe Facebook](../08-seo-si-distribuire/03-cum-arata-pe-facebook.md))

## Cum modifici un articol publicat

Vezi [Cum modifici un conținut existent](06-cum-modifici-continut-existent.md).

---

**Pagini conexe:**
- [Cum folosești Dynamic Zone](../03-dynamic-zone/01-ce-este-dynamic-zone.md)
- [Cum gestionezi categoriile](../05-taxonomii/01-cum-gestionezi-categoriile.md)
- [Reguli pentru imagini](../04-imagini/02-reguli-pentru-imagini.md)
