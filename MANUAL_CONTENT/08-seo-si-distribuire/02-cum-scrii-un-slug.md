# Cum scrii un slug bun

## Ce e un slug
**Slug-ul** e partea din URL care identifică pagina ta:

```
https://cusens.eu/stiri/manifest-pentru-clima
                       └────────┬────────┘
                              slug
```

Pentru articole, evenimente, pagini, categorii, etichete — fiecare are slug propriu.

## Cum se generează

CMS-ul îl creează **automat** din titlu:

| Titlu | Slug auto |
|---|---|
| „Manifest pentru o Românie verde" | `manifest-pentru-o-romanie-verde` |
| „Dezbatere despre educație 2026" | `dezbatere-despre-educatie-2026` |
| „Întâlnire SENS — Cluj-Napoca" | `intalnire-sens-cluj-napoca` |

Diacriticele se înlocuiesc, spațiile devin liniuțe, totul lowercase.

## Reguli pentru slug-uri bune

### ✅ Bun
- **Lowercase** (litere mici)
- **Liniuțe** între cuvinte (`-`), nu underscore (`_`)
- **Fără diacritice** (`a` în loc de `ă`, `t` în loc de `ț`)
- **Fără spații**
- **Scurt** (max 5–7 cuvinte)
- **Descriptiv** (cititorul înțelege subiectul fără să intre)

### ❌ Rău
| Slug rău | Problemă |
|---|---|
| `Manifest-Pentru-Clima` | Litere mari nepermise |
| `manifest pentru clima` | Spații nepermise |
| `manifest_pentru_clima` | Underscore (folosește liniuțe) |
| `manifest-pentru-clima-din-romania-2026-aprilie-publicat-de-sens` | Prea lung |
| `articol-1234` | Nu spune nimic |
| `manifest-pentru-clîmă` | Diacritice (chiar dacă funcționează tehnic, urâte în URL) |

## Cum modifici un slug

1. Deschizi intrarea
2. La câmpul **Slug**, click → editezi
3. Save

⚠️ **Foarte important:** dacă **modifici slug-ul unei intrări publicate**:
- Toate **link-urile vechi** (în Facebook, Twitter, alte site-uri) se **rup**
- Google va trebui să reindexeze (poate dura zile)
- Vizitatorii care au link-ul vechi vor vedea **404 Not Found**

**Recomandare:** nu modifica slug-ul după publish dacă nu e absolut necesar.

## Slug-uri pentru categorii și etichete

Mai scurte:
- Categorie „Politici publice" → `politici-publice` sau `politici`
- Etichetă „energie regenerabilă" → `energie-regenerabila`

## Slug-uri pentru pagini libere (Pagini)

Slug-ul devine URL-ul direct al paginii:

| Slug | URL |
|---|---|
| `despre-noi` | `cusens.eu/despre-noi` |
| `program` | `cusens.eu/program` |
| `voluntariat` | `cusens.eu/voluntariat` |

Folosește **slug-uri scurte** pentru pagini importante.

## Slug-uri rezervate (nu folosi)

Anumite slug-uri sunt **rezervate** pentru rute existente ale site-ului. Nu le poți folosi pentru pagini noi:

- `stiri` (lista articolelor)
- `evenimente` (lista evenimentelor)
- `contact`, `doneaza`, `inscrie-te`, `newsletter`, `comunitate`, `politica-confidentialitate`
- `api`, `admin`, `_app`, `assets`

Dacă încerci să creezi o pagină cu slug rezervat, va apărea o eroare sau va fi suprascrisă pagina existentă.

## Slug-uri cu cifre

Adesea utile pentru:
- **Anul** evenimentului: `congres-2026`
- **Versiunea** programului: `program-v2`
- **Numărul** ediției: `edicia-3-newsletter`

## Cum gestionezi conflictele

Dacă încerci să salvezi un slug deja folosit (duplicat), CMS-ul îți dă eroare:

> "Slug must be unique"

Adaugă un prefix/sufix care diferențiază:
- `manifest-clima` → `manifest-clima-2026`
- `dezbatere-cluj` → `dezbatere-cluj-mai`

## Slug bun pentru SEO

- **Cuvinte-cheie** în slug ajută Google
- ❌ `articol-123` → invizibil pentru SEO
- ✅ `manifest-romania-verde-2026` → conține cuvinte-cheie

---

**Pagini conexe:**
- [Cum completezi SEO](01-cum-completezi-seo.md)
- [Cum gestionezi categoriile](../05-taxonomii/01-cum-gestionezi-categoriile.md)
