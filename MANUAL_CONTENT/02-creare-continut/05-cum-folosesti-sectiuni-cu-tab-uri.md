# Cum folosești secțiuni cu tab-uri

## Ce vei face
Adaugi **tab-uri** într-o pagină existentă. Fiecare tab are propriul lui conținut cu blocuri.

## Când e util

Pagini cu informație multă, organizată în categorii care nu se potrivesc într-un scroll lung. Exemple:
- `/despre-noi` → tab-uri: „Cine suntem", „Conducere", „Echipă", „Statut"
- `/program` → tab-uri pentru fiecare direcție majoră
- `/presa` → tab-uri: „Comunicate", „Galerie media", „Contact presă"

## Concept

| Termen | Ce e |
|---|---|
| **Pagină** | Containerul principal (ex: „Despre noi") |
| **Secțiune** | Un tab din interior (ex: „Conducere"); fiecare are conținutul lui propriu |

O pagină poate avea **0, 1 sau mai multe secțiuni**. Dacă are 0, conținutul vine doar din câmpul „Conținut" al paginii. Dacă are 1+, apar tab-uri în partea de sus a paginii.

## Pași — adăugare secțiune nouă

### 1. Mergi la pagina destinație
Content Manager → **Pagini** → găsești pagina (ex: „Despre noi") → click pe ea.

### 2. Notează ID-ul paginii (opțional)
Sus în URL-ul Strapi vezi ceva ca `…/api::page.page/n34s2k…`. Nu e necesar pentru fluxul standard.

### 3. Mergi la Secțiuni
Content Manager → **Secțiuni** → **„Create new entry"**.

### 4. Completează

| Câmp | Ce pui |
|---|---|
| **Titlu** | Numele tab-ului afișat (ex: „Conducere") |
| **Ordine afișare** | Număr (1, 2, 3…) — controlează ordinea tab-urilor |
| **Pagină (Page)** | Selectezi pagina din care face parte (ex: „Despre noi") |
| **Conținut** | Dynamic Zone — blocuri pentru acest tab |

### 5. Adaugi blocuri în „Conținut"

Vezi [Cum adaugi un bloc](../03-dynamic-zone/02-cum-adaugi-un-bloc.md) și [Catalog de blocuri](../03-dynamic-zone/04-catalog-blocuri.md).

### 6. Save + Publish

Tab-ul apare automat pe pagina părinte.

## Recipe — pagina /despre-noi

Asta e modelul pe care îl poți copia:

| Tab | Conținut tipic |
|---|---|
| **Cine suntem** | Page Header + Text Block + Mission Band + Stats |
| **Conducere** | Team Grid (filtru: doar leadership) |
| **Echipă** | Team Grid (filtru: non-leadership) |
| **Statut** | Text Block lung sau link spre PDF |

## 🔗 Link direct către un tab specific (anchor `#`)

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

## Cum modifici ordinea tab-urilor

Schimbi **„Ordine afișare"** la fiecare secțiune.

## Cum scoți un tab

**Unpublish** secțiunea respectivă. Dispare din pagină dar rămâne în CMS.

Sau **Delete** dacă nu mai ai nevoie de ea.

## Cum stergi pagina părinte fără să afectezi tab-urile

Nu poți. Dacă ștergi pagina, **toate secțiunile rămân orfane** (fără părinte). Mai bine **Unpublish** pagina.

---

**Pagini conexe:**
- [Cum construiești o pagină simplă](04-cum-construiesti-o-pagina-simpla.md)
- [Catalog de blocuri](../03-dynamic-zone/04-catalog-blocuri.md)
