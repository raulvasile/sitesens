# Cum gestionezi etichetele

## Ce sunt etichetele

Etichetele sunt **etichete secundare** pentru articole. Spre deosebire de categorii:
- Un articol poate avea **mai multe etichete**
- Pot fi **nelimitat de multe**
- Apar **jos pe articol**, nu sus
- Nu au culoare

Folosite pentru filtrare detaliată (ex: articol din categoria „Politici publice" cu etichetele „climă", „transport", „Cluj").

## Cum vezi etichetele existente

Content Manager → **Etichete** → vezi toată lista.

## Cum adaugi o etichetă nouă

1. Content Manager → **Etichete** → **„Create new entry"**
2. Completezi:

| Câmp | Ce pui |
|---|---|
| **Nume** | „climă" (cu literă mică, fără diacritice ideal) |
| **Slug** | Auto din nume; ex: `clima` |

3. **Save**

## Adăugare rapidă din articol

Mai eficient: când editezi un articol, în câmpul **Etichete**:
1. Click pe câmp
2. Începe să tastezi
3. Dacă eticheta există → click pe ea
4. Dacă nu există → apare opțiunea **„+ Create"** → click → eticheta se creează automat

⚠️ Atenție la **dubluri** (ex: „clima" vs „Clima" vs „climate"). Folosește forma standard mereu.

## Convenții recomandate

| Folosește | Nu folosi |
|---|---|
| Toate cu **literă mică** | „Climate" |
| Fără **diacritice** în slug | „educație" în nume, `educatie` în slug |
| Singular când posibil | „voluntar" mai degrabă decât „voluntari" |
| Doi cuvinți cu spațiu | „energie verde" mai degrabă decât „energie-verde" |

## Cum redenumești o etichetă

1. Click pe ea în listă
2. Modifici **Nume**
3. ⚠️ **NU modifica Slug-ul** — toate link-urile `/stiri?tag=[slug]` se vor rupe

## Cum ștergi o etichetă

1. Verifici câte articole o folosesc (vezi mai jos)
2. Click pe etichetă în listă
3. **Delete**

⚠️ Articolele care o foloseau **rămân** dar pierd asocierea. Nu se șterg.

### Cum vezi articolele care folosesc o etichetă

1. Mergi la **Articole** (lista)
2. Sus, **„Filters"** → **„Etichete"** → alegi eticheta
3. Vezi articolele care o au

## Recomandări de design taxonomic

### Câte etichete pe articol?
**3–7 etichete**. Mai multe = nu mai e util.

### Ce să tag-uiesc?
- Locație (ex: „Cluj", „București", „Iași")
- Persoane menționate (ex: nume politicieni majori)
- Subiecte specifice (ex: „energie regenerabilă", „educație vocațională")
- Tip conținut (ex: „interviu", „opinie", „comunicat")

### Ce să **nu** tag-uiesc
- Cuvinte generice (ex: „Romania", „știre")
- Cuvinte din titlu deja
- Categoria principală (e deja la categorie)

## Workflow recomandat

### La crearea unui articol
1. Termini de scris articolul
2. Identifici 3–7 cuvinte-cheie centrale
3. Verifici dacă există ca etichete → reutilizezi
4. Doar dacă **nu** există, creezi etichetă nouă

### Curățenie periodică (1× per trimestru)
1. Mergi la **Etichete**
2. Cauți etichete folosite o singură dată sau cu typo-uri
3. Le ștergi sau le merge-uiești (manual: schimbi pe articole, ștergi cea veche)

## 🔗 Link direct către articole filtrate după etichetă

Lista de articole filtrată după o etichetă e accesibilă prin URL:

```
https://cusens.eu/stiri?tag=sustenabilitate
```

Pe pagina `/stiri`, când URL-ul are `?tag=...`, apare un **chip activ** sus:
> **Etichetă activă: #sustenabilitate** ✕ Șterge eticheta

Util pentru:
- **Comunicare** — partajezi link-ul „toate articolele despre energie" pe Facebook
- **CTA-uri** — un buton „Vezi toate articolele despre clima" în Card Grid sau Hero
- **Newsletter** — link la digestul subiectelor populare

⚠️ URL-ul folosește **slug-ul** etichetei (lowercase, fără diacritice), nu numele afișat. Verifică în CMS care e slug-ul exact.

Filtrarea după **categorie** funcționează similar: `?categorie=politici-publice`.

---

**Pagini conexe:**
- [Cum gestionezi categoriile](01-cum-gestionezi-categoriile.md)
- [Cum adaugi un articol nou](../02-creare-continut/01-cum-adaugi-un-articol-nou.md)
