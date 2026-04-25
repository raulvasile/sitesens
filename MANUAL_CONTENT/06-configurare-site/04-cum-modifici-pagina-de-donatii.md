# Cum modifici pagina de donații

## Ce vei face
Modifici sumele preset, IBAN-ul, textele de transparență sau mențiunile CMF de pe `/doneaza`.

## Unde se află

Single Types → **Pagină Donații**.

## Câmpuri principale

### Header

| Câmp | Ce pui |
|---|---|
| **Title** | „Donează pentru SENS" |
| **Header eyebrow** | „— Susține mișcarea" |
| **Description** | Paragraf scurt sub titlu |

### Sume preset

Componenta **Amounts** — listă de sume între care utilizatorul alege.

#### Cum modifici sumele

1. Scroll la **Amounts**
2. Vezi lista actuală (ex: 25, 50, 100, 200 RON)
3. Pentru a **modifica o sumă**: click pe ea → editezi câmpul `amount`
4. Pentru a **adăuga**: **„Add an entry to amounts"** → completezi `amount`
5. Pentru a **șterge**: pictograma **🗑️**
6. Save

#### Câmpuri per sumă

| Câmp | Ce pui |
|---|---|
| **Amount** | Valoarea în RON (număr întreg, ex: 50) |
| **Label** | Opțional. Etichetă personalizată (ex: „Donează un copil la educație") |

### Texte secțiuni

| Câmp | Ce pui |
|---|---|
| **Amounts kicker** | Eyebrow secțiune sume (ex: „Pasul 1") |
| **Amounts heading** | Titlu (ex: „Alege suma donației") |
| **Custom amount label** | Text pentru opțiunea „altă sumă" (ex: „Sau introdu o sumă personalizată") |
| **Donate button text** | Text buton final (ex: „Donează acum") |

### Transfer bancar (IBAN)

| Câmp | Ce pui |
|---|---|
| **IBAN** | Codul IBAN cu spații (ex: `RO49 AAAA 1B31 0075 9384 0000`) |
| **Bank name** | Numele băncii (ex: „Banca Transilvania") |
| **Transfer kicker** | Eyebrow (ex: „Pasul 2") |
| **Transfer heading** | Titlu (ex: „Transfer bancar") |
| **Transfer notes** | Note importante (ex: „Menționează 'Donație SENS' în detaliile transferului") |

⚠️ **Verifică de două ori IBAN-ul.** O singură cifră greșită = banii ajung la altcineva.

### Transparență

Componenta **Transparency** — afișează **cum sunt cheltuiți** banii donați.

#### Cum modifici alocările

1. Scroll la **Transparency**
2. Vezi lista actuală (ex: 40% Comunicare, 30% Evenimente, 20% Operațional, 10% Rezervă)
3. Pentru fiecare item:

| Câmp | Ce pui |
|---|---|
| **Label** | Categoria (ex: „Comunicare campanii") |
| **Percentage** | Procentul (1–100) |
| **Description** | Opțional, apare sub bară |

4. ⚠️ **Procentele trebuie să adune 100%**. Verifici manual.

5. Save

### Texte secțiune transparență

| Câmp | Ce pui |
|---|---|
| **Transparency kicker** | „Transparență" |
| **Transparency heading** | „Unde merg banii tăi" |

### Mențiune CMF (mandatar financiar)

Obligatoriu legal pentru partide politice care primesc donații:

| Câmp | Ce pui |
|---|---|
| **CMF kicker** | „Mandatar financiar" |
| **CMF text** | Mențiunea legală completă (ex: „Mandatar financiar coordonator înregistrat la AEP cu nr. CMF…") |

⚠️ **Nu modifica** acest text fără consultare juridică. E reglementat de Legea 334/2006.

### SEO

Vezi [Cum completezi SEO](../08-seo-si-distribuire/01-cum-completezi-seo.md).

## Workflow recomandat

### Modificare sume sau transparență
1. Editezi câmpurile
2. Save
3. Refresh `/doneaza` → verifici vizual

### Modificare IBAN
1. **Pregătește o altă persoană să verifice** IBAN-ul nou
2. Editezi câmpul **IBAN**
3. Save
4. Refresh `/doneaza` → copiezi IBAN-ul → confirmi cu pagina ta de internet banking că e corect

## Verificare după modificare

- [ ] Toate sumele apar corect ca butoane
- [ ] „Altă sumă" funcționează (poți tasta o sumă custom)
- [ ] IBAN apare corect și se poate copia
- [ ] Procentajele transparență adună 100%
- [ ] Mențiune CMF prezentă

---

**Pagini conexe:**
- [Cum completezi SEO](../08-seo-si-distribuire/01-cum-completezi-seo.md)
