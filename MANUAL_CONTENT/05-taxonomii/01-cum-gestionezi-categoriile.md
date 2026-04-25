# Cum gestionezi categoriile de articole

## Ce sunt categoriile

Categoriile sunt **etichete primare** pentru organizarea articolelor (ex: „Politici publice", „Mediu", „Educație"). Fiecare articol are **o singură categorie**.

Apar:
- Ca **chip color** pe cardurile articolelor în lista `/stiri`
- Ca **filtru** în lista `/stiri` (`/stiri?categorie=mediu`)
- Pe **pagina articolului**, deasupra titlului

## Cum vezi categoriile existente

Content Manager → **Categorii articole** → vezi toată lista.

## Cum adaugi o categorie nouă

1. Content Manager → **Categorii articole** → **„Create new entry"**
2. Completezi:

| Câmp | Ce pui |
|---|---|
| **Nume** | „Educație" (cum apare pe site) |
| **Slug** | Auto din nume; poți edita (ex: `educatie`). Vezi [Cum scrii un slug](../08-seo-si-distribuire/02-cum-scrii-un-slug.md). |
| **Color** | Cod hex (ex: `#0C5118`). Apare ca background pentru chip. |
| **Description** | Opțional. Apare pe pagina de filtrare. |
| **Parent** | Opțional. Pentru sub-categorii (ex: „Educație → Primar"). |

3. **Save** (categoriile NU au draft/publish — modificarea e live imediat)

## Sub-categorii

Poți crea **ierarhie**:
- „Educație" (parent)
  - „Educație preșcolară" (child)
  - „Educație universitară" (child)

În frontend, sub-categoriile apar grupate sub parent.

## Cum redenumești o categorie

1. Click pe categorie în listă
2. Modifici **Nume**
3. ⚠️ **NU modifica Slug-ul** dacă există articole în categorie — link-urile externe către `/stiri?categorie=[slug-vechi]` se vor rupe

## Cum ștergi o categorie

⚠️ **Verifică întâi** că nu există articole care o folosesc.

### Dacă există articole
1. Mergi la fiecare articol → schimbi categoria
2. Apoi ștergi categoria

### Sau alternativa
1. **NU** ștergi categoria
2. O **redenumești** (ex: „[ARHIVAT] Educație")
3. O folosești pentru articole istorice

## Recomandări

### Câte categorii?
- **Ideal: 5–10**. Mai multe = utilizatorul nu mai știe ce să aleagă.
- Dacă ai 15+, probabil vrei **etichete** în loc.

### Ce nume să aleg?
- Scurte (1-2 cuvinte)
- Clare pentru cititor (nu jargon intern)
- Plural sau singular consistent (alege unul)

### Ce culori?
Folosește paleta SENS:
- Verde închis: `#0C5118`
- Verde mid: `#1B7A2F`
- Lime: `#91FF00`
- Cream: `#F5F1E8`

Pentru a fi diferențiabile vizual, alege culori distincte. Cere ajutorul designerului dacă nu ești sigur.

## Diferența categorie vs etichetă

| Aspect | Categorie | Etichetă |
|---|---|---|
| Câte per articol | 1 (sau 0) | Mai multe |
| Total | 5–10 | Nelimitat |
| Apare pe card | Da (chip color) | Nu |
| Apare în filtru `/stiri` | Da | Da |
| Are culoare | Da | Nu |
| Apare în meniu | Posibil | Nu |

Vezi [Cum gestionezi etichetele](02-cum-gestionezi-etichetele.md).

---

**Pagini conexe:**
- [Cum gestionezi etichetele](02-cum-gestionezi-etichetele.md)
- [Cum scrii un slug bun](../08-seo-si-distribuire/02-cum-scrii-un-slug.md)
