# Cum citești etichetele câmpurilor în CMS

Toate câmpurile din CMS au:
- Un **label scurt** (deasupra câmpului) — ce este
- O **descriere** (sub câmp, text mai mic) — **unde apare** pe site sau ce face

## Exemplu vizual

```
┌──────────────────────────────────────────────┐
│  Titlu *                                     │   ← LABEL
│  ┌────────────────────────────────────────┐  │
│  │ [câmpul de input]                       │ │
│  └────────────────────────────────────────┘  │
│  Apare ca H1 sus pe pagina articolului și   │   ← DESCRIPTION
│  ca text principal pe cardul din lista        │     (locul în site)
│  /stiri.                                      │
└──────────────────────────────────────────────┘
```

## Citește descrierea înainte de a completa

Descrierea îți spune **exact unde apare** câmpul tău. Citește-o înainte să decizi:
- Cât de scurt sau lung trebuie să fie textul
- Dacă e vizibil sau intern
- Dacă e folosit la filtrare sau doar afișare

## Exemple de descrieri tipice

| Tip descriere | Ce înseamnă |
|---|---|
| „Apare ca H1 sus pe pagina X" | Text mare, vizibil principal |
| „Apare ca chip pe card" | Text scurt, max 1-2 cuvinte |
| „Apare în Google și pe Facebook" | SEO; max 60-160 caractere |
| „Apare în meniul hamburger pe mobil" | Vizibil doar mobil |
| „Folosit intern pentru filtrare" | Nu e vizibil; afectează URL-uri |
| „Bifat = X / Debifat = Y" | Toggle binar |
| „Generat automat dacă lipsește" | Opțional — sistemul completează |

## Câmpuri cu asterisc roșu (*)

Câmpurile marcate cu **asterisc roșu** sunt **obligatorii**. Nu poți salva intrarea fără să le completezi.

## Câmpuri opționale

Câmpurile **fără asterisc** sunt opționale. Le poți lăsa goale dacă nu sunt relevante. Multe au comportament „dacă lipsește, folosește X" (vezi descrierea).

## Limbajul descrierilor

- „Apare" / „Vizibil" → vizibil utilizatorului final pe site
- „Folosit" / „Intern" → nu apare direct, dar afectează ceva
- „Default" → ce se folosește dacă lipsește
- „Toggle" → bifabil/debifabil

---

**Următoarea pagină:** [Cum adaugi un articol nou](../02-creare-continut/01-cum-adaugi-un-articol-nou.md)
