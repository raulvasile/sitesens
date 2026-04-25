# Cum duplici un articol sau o pagină

## Ce vei face
Creezi o copie a unei intrări existente — util când ai nevoie de un șablon cu o structură similară (ex: comunicate de presă cu același layout).

## ⚠️ Ce trebuie să știi întâi

Strapi v5 **nu are** un buton „Duplicate" nativ pentru toate tipurile de conținut. În funcție de versiunea ta de admin, opțiunile sunt:

### Opțiunea A — buton „Duplicate" (dacă există)

În unele versiuni / pentru unele tipuri:
1. Deschizi intrarea
2. Sus dreapta, drop-down lângă **Save** → **„Duplicate"**
3. Se deschide o intrare nouă cu toate câmpurile pre-completate
4. Modifici titlul + slug + alte câmpuri specifice
5. Save + Publish

### Opțiunea B — Manual (mereu funcționează)

1. Deschizi intrarea pe care vrei să o copiezi
2. Selectezi tot conținutul **din câmpul „Conținut"**:
   - Click pe primul bloc → **Save** (ca să te asiguri că e salvat)
   - Notează tipurile și ordinea blocurilor
3. **„Create new entry"**
4. Completezi câmpurile noi
5. **Adaugi blocurile** unul câte unul cu aceeași configurație ca în original

Asta nu e ideal pentru pagini cu 10+ blocuri.

## Recipe — comunicat de presă șablon

Dacă publici regulat conținut cu aceeași structură (comunicate, reguli):

1. Creezi **o pagină șablon** numită „[ȘABLON] Comunicat de presă"
2. O lași **în Draft** (nu Publish)
3. De câte ori ai nevoie:
   - O deschizi
   - „Duplicate" (sau o copiezi manual)
   - Modifici titlul/conținutul
   - Schimbi slug-ul
   - Publish

## Ce câmpuri **NU** copiezi automat

Chiar dacă faci „Duplicate", **trebuie să modifici manual:**

- ❗ **Slug** — altfel ai conflict (URL duplicate)
- ❗ **Titlu** — altfel ai 2 intrări identice în listă
- **Cover image** — dacă vrei o altă poză
- **Data publicării** (pentru evenimente)
- **SEO** — meta title și description

## Tipuri pentru care e util

| Tip | De ce e util de duplicat |
|---|---|
| **Articole** | Același template (intro, citat, paragrafe, CTA) |
| **Evenimente** | Același tip de eveniment recurent (ex: „Adunarea generală 2026" → „2027") |
| **Pagini** | Pagini cu structură similară (ex: pagini per filială) |

## Tipuri pentru care **nu** are sens să duplici

- **Membri echipă** — fiecare e unic
- **Categorii / Etichete** — n-are sens
- **Cereri de aderare / Abonați newsletter** — e date primite, nu creezi tu

---

**Pagini conexe:**
- [Cum adaugi un articol nou](01-cum-adaugi-un-articol-nou.md)
- [Cum modifici un conținut existent](06-cum-modifici-continut-existent.md)
