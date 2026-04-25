# Ce este Dynamic Zone

## În scurt
**Dynamic Zone** e un câmp special în CMS unde **construiești conținutul ca pe LEGO** — combini blocuri pre-fabricate într-o ordine pe care o alegi tu.

## Unde îl găsești

În următoarele tipuri de conținut există un câmp numit **„Conținut"** (Content) care e Dynamic Zone:

- **Pagină Principală** (homepage)
- **Articole**
- **Pagini**
- **Secțiuni** (tab-uri în interiorul Paginilor)

## De ce e diferit de un câmp text obișnuit

Un câmp text îți dă o singură cutie unde scrii. Dynamic Zone îți dă **o listă de blocuri** pe care le poți:
- Adăuga
- Reordona
- Șterge
- Configura individual

## Exemplu vizual

Pentru pagina principală, Dynamic Zone arată în CMS aproximativ așa:

```
┌─────────────────────────────────────┐
│ 🎨 Bloc 1: Hero                      │  ← titlu, subtitlu, CTA, imagine
│  Titlu: „Construim o Românie..."     │
├─────────────────────────────────────┤
│ 📊 Bloc 2: Stats Counter             │  ← „150+ voluntari", „12 filiale"
├─────────────────────────────────────┤
│ 📅 Bloc 3: Upcoming Events           │  ← se populează automat
├─────────────────────────────────────┤
│ 🎯 Bloc 4: CTA Banner                │  ← „Înscrie-te azi"
├─────────────────────────────────────┤
│ ➕ Add a component to content        │
└─────────────────────────────────────┘
```

Pe site, blocurile apar în aceeași ordine, una sub alta.

## Tipuri de blocuri disponibile

Sunt **27 de blocuri** grupate în categorii:
- 🎨 Hero (3 variante)
- 📝 Conținut (text, citate, video, galerii)
- 📊 Liste & grile (carduri, statistici, FAQ, timeline)
- 🤖 Auto-generate (ultimele articole, evenimente, echipă)
- 🎯 CTA & formulare
- 📱 Social

Vezi [Catalog de blocuri](04-catalog-blocuri.md) pentru detalii despre fiecare.

## Ce înseamnă „auto-generat"

Câteva blocuri **se populează automat** cu conținut din alte părți ale CMS-ului:

| Bloc | Ia date din |
|---|---|
| **Latest Articles** | Colecția Articole (ultimele N publicate) |
| **Upcoming Events** | Colecția Evenimente (următoarele N) |
| **Team Grid** | Colecția Echipă (filtrată după conducere/non-conducere) |
| **Chapters Grid** | Colecția Județe (cele active) |
| **Romania Map** | Colecția Județe |

Asta înseamnă că **NU** trebuie să le actualizezi manual — pui blocul o singură dată și el rămâne mereu la zi.

## Avantaje

- ✅ Pagini **diferite** chiar dacă folosesc aceleași blocuri
- ✅ Modifici un bloc fără să atingi restul paginii
- ✅ Riordonezi rapid prin drag-and-drop
- ✅ Reutilizezi același tip de bloc de oricâte ori vrei pe aceeași pagină

---

**Următoarea pagină:** [Cum adaugi un bloc](02-cum-adaugi-un-bloc.md)
