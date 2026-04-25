# Pagini unice vs colecții — diferența

CMS-ul împarte tot conținutul în două categorii. Înțelege diferența ca să găsești rapid ce cauți.

## 🔵 Single Types — pagini unice

**Există o singură instanță.** Nu poți „crea o pagină principală nouă" — există doar una.

### Exemple pe site-ul SENS

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

### Cum lucrezi cu ele
- Click pe numele lor în **Single Types** → se deschide direct formularul de editare
- Modifici câmpurile → **Save** → **Publish**
- **Nu există listă** și nu există buton „Create new"

## 🟢 Collection Types — colecții

**Poți avea oricâte intrări vrei.** Ele apar pe site într-un format de listă/grid.

### Exemple pe site-ul SENS

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

### Cum lucrezi cu ele
- Click pe numele lor în **Collection Types** → vezi **lista** cu toate intrările
- **„Create new entry"** (sus dreapta) → adaugi una nouă
- Click pe o intrare → editezi
- Filtrare/căutare: bara de sus a listei

## 🤔 Cum decizi unde mergi

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

**Următoarea pagină:** [Draft și Publish — cum funcționează](04-draft-si-publish.md)
