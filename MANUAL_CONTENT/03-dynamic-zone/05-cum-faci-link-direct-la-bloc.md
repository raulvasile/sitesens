# Cum faci un link direct la un bloc (anchor_id)

## Ce vei face
Permiți unui link să **deschidă o pagină și să sară automat** la un bloc anume — util pentru CTA-uri, share link-uri, sau cuprinsuri.

## Concept

Fiecare bloc dintr-un Dynamic Zone poate avea un **ID ancoră** (`anchor_id`) opțional. Când e setat, blocul devine accesibil printr-un URL ca:

```
https://cusens.eu/despre-noi#valori
                            └──┬──┘
                              anchor_id
```

Browser-ul deschide pagina și **scroll-ează automat** la blocul cu acel id.

## Pași

### 1. Deschide intrarea cu blocul (articol, pagină, homepage etc.)

### 2. Găsește blocul căruia vrei să-i pui ancoră

### 3. Completează câmpul „ID ancoră"

Vei vedea în partea de sus a oricărui bloc DynamicZone un câmp **„ID ancoră (opțional, pentru link-uri directe ex: #valori)"**.

Scrie în el ID-ul (fără `#`):

| Exemplu valid | URL rezultat |
|---|---|
| `valori` | `/despre-noi#valori` |
| `echipa-conducere` | `/despre-noi#echipa-conducere` |
| `program-2026` | `/program#program-2026` |

### 4. Save + Publish

### 5. Testează

Deschide URL-ul cu hash în browser:
- `https://cusens.eu/despre-noi#valori`
- Pagina se deschide
- Scroll automat la blocul cu acea ancoră

## Reguli pentru `anchor_id`

### ✅ Permis
- Litere mici (`a–z`)
- Cifre (`0–9`)
- Liniuțe (`-`)
- Underscore (`_`)
- Maxim **60 caractere**

### ❌ Nepermis (sunt curățate automat)
- Spații
- Diacritice (`ă`, `î`, `ț`, `ș`, `â`)
- Litere mari
- Caracterul `#` (e adăugat automat în URL)
- Începere cu cifre (HTML nu acceptă; se taie până la prima literă)

### ⚠️ Important
- **Unicitatea contează** — dacă două blocuri din aceeași pagină au același `anchor_id`, browserul va sări la primul. Folosește ID-uri unice per pagină.
- **Dacă schimbi anchor_id-ul** după ce link-uri către el au fost partajate — link-urile vechi se rup.

## Cazuri tipice de folosire

### Cuprins manual la începutul paginii
Faci un Text Block la începutul paginii cu o listă de link-uri:
```
- [Misiunea noastră](#misiune)
- [Valori](#valori)
- [Programul nostru](#program)
- [Cum poți contribui](#contribuie)
```
Apoi setezi `anchor_id` corespunzător la fiecare bloc relevant.

### Share link la o secțiune anume
Vrei să trimiți un email cu „uite ce facem la educație":
- Pe pagina `/program`, blocul „Educație" are `anchor_id: educatie`
- Trimiți link-ul: `https://cusens.eu/program#educatie`

### CTA dintr-un articol către o secțiune din altă pagină
În Text Block-ul unui articol, scrii: „Vezi [valorile noastre](/despre-noi#valori) pentru context."

### Buton CTA configurat în Strapi
În câmpul **Link** al unui buton CTA, pui `/despre-noi#echipa` în loc de `/despre-noi`. Click → pagina se deschide direct la secțiunea echipă.

## Diferența vs. tab-urile cu hash

Există DOUĂ tipuri de hash-uri:

| Tip | Pentru ce | Exemplu |
|---|---|---|
| **`anchor_id` pe bloc** | Scroll la un bloc anume într-o pagină | `/program#educatie` |
| **Hash pentru tab-uri** | Deschide un tab anume într-o pagină cu Secțiuni | `/despre-noi#echipa` |

Dacă o pagină are ambele (ex: are tab-uri ȘI blocuri cu anchor), hash-ul potrivit cu un nume de tab are prioritate. Asigură-te că `anchor_id`-urile sunt diferite de slug-urile tab-urilor.

## Workflow recomandat

```
1. Identifici blocurile principale ale paginii
2. Le pui anchor_id descriptiv (ex: "valori", "echipa", "program")
3. Save + Publish
4. Testezi fiecare URL #anchor în browser
5. Folosești link-urile în:
   - Meniu (Header) — ex: link „Echipa" → /despre-noi#echipa
   - Comunicate de presă (CTA-uri precise)
   - Postări social media
```

---

**Pagini conexe:**
- [Cum adaugi un bloc](02-cum-adaugi-un-bloc.md)
- [Catalog de blocuri](04-catalog-blocuri.md)
- [Cum folosești secțiuni cu tab-uri](../02-creare-continut/05-cum-folosesti-sectiuni-cu-tab-uri.md)
