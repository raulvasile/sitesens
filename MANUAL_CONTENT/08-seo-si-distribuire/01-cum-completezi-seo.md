# Cum completezi SEO-ul unei pagini

## Ce vei face
Setezi **cum apare pagina ta în Google** și **cum arată când e partajată pe Facebook/Twitter**.

## Unde se află

Pe orice articol, eveniment, pagină, single type — **scroll jos** până la secțiunea **SEO**.

E un component care apare la sfârșit, separat vizual de restul câmpurilor.

## Câmpuri SEO

### Meta Title

**Ce e:** titlul afișat în:
- Tab-ul browserului
- Rezultatele Google (linia albastră de sus)
- Linkurile partajate

**Reguli:**
- **Lungime:** 50–60 caractere ideal (peste, Google îl trunchează cu „…")
- **Format:** Titlu specific + brand
- **Exemple:**
  - ✅ „Manifest pentru o Românie verde — SENS"
  - ✅ „Dezbatere despre educație, Cluj-Napoca, 26 mai"
  - ❌ „Pagina principală" (prea generic)
  - ❌ „SENS — Cel mai bun partid politic din România cu cele mai bune politici" (prea lung)

**Tip:** dacă lași câmpul gol, se folosește titlul intrării ca fallback.

### Meta Description

**Ce e:** descrierea sub titlul Google și pe link-uri partajate.

**Reguli:**
- **Lungime:** 140–160 caractere ideal
- **Conținut:** explică **ce** e pagina și **de ce** ar trebui cititorul să apese
- **Folosește** verbe de acțiune: „Află", „Vezi", „Descoperă"
- **Exemple:**
  - ✅ „Citește manifestul SENS pentru o Românie verde, echitabilă și modernă. 5 direcții concrete pentru schimbare."
  - ✅ „Înscrie-te la dezbaterea despre educație din Cluj, 26 mai. Acces gratuit, locuri limitate."
  - ❌ „Pagina noastră de SENS." (nu spune nimic)

### OG Image (imagine partajare)

**Ce e:** imaginea afișată când cineva partajează linkul pe Facebook, Twitter, WhatsApp, LinkedIn.

**Reguli:**
- **Dimensiune:** 1200×630 px (ratio 1.91:1)
- **Format:** JPG sau PNG
- **Sub:** 300 KB
- **Conținut:** text mare lizibil + logo + culori brand
- **Test:** thumbnail mic (cum apare în feed) trebuie să fie tot lizibil

**Tip:** dacă lași gol, se folosește **cover image** ca fallback. Pentru articole/evenimente, cover image e de obicei suficient.

### Canonical URL

**Ce e:** URL-ul „original" al paginii, dacă același conținut apare în alt loc.

**Când îl completezi:**
- Republici un articol care a apărut prima dată pe alt site
- În 99% din cazuri **lasă gol**

### No Index

**Ce e:** toggle care ascunde pagina de Google.

**Când îl bifezi:**
- Pagini de **mulțumire** după form-uri (ex: „/contact/multumesc")
- Pagini **interne** sau **de test**
- Conținut **temporar** (campanii sezonale terminate)

**Default:** debifat (pagina e indexată).

## Workflow recomandat

Pentru fiecare intrare nouă (articol, eveniment, pagină):

```
1. Termini conținutul
2. Mergi la secțiunea SEO
3. Meta Title:
   - Scurt, captivant
   - 50-60 caractere
   - Verifici că nu e identic cu titlul (dacă da, lasă gol)
4. Meta Description:
   - 140-160 caractere
   - Verbe de acțiune
5. OG Image:
   - Dacă cover image e bună, lasă gol
   - Dacă vrei imagine specifică pentru share, încarci
6. Save + Publish
```

## Cum verifici dacă e bine

### Test 1 — Lungime caractere
- **Meta title:** numără caracterele (sau folosește un tool ca [serpsim.com](https://www.serpsim.com))
- **Meta description:** la fel

### Test 2 — Cum arată în Google
1. După publish, deschide Google
2. Caută `site:cusens.eu [titlul tău]`
3. Vezi cum apare în SERP
4. Notă: poate dura 24-48h ca Google să reindexeze

### Test 3 — Cum arată pe Facebook
Vezi [Cum verifici cum arată pe Facebook](03-cum-arata-pe-facebook.md).

## Greșeli comune

| Greșeală | Consecință | Fix |
|---|---|---|
| Meta title identic cu titlul afișat | Redundanță; Google poate alege singur | Lasă gol sau scrie variantă scurtă |
| Meta description peste 160 caractere | Google taie cu „…" | Scurtează |
| OG image cu text mic | Ilizibil pe Twitter / mobile | Mărește text-ul, contrast puternic |
| Lași SEO gol pe articol cheie | Apare URL-ul ca titlu pe Google (urât) | Completează **mereu** SEO |
| Activezi No Index din greșeală | Pagina dispare din Google | Debifează |

## SEO pentru imagini

⚠️ Diferit de SEO pentru pagini, dar important: **alt text-ul** imaginilor contează pentru SEO. Vezi [Cum scrii un alt text bun](../04-imagini/03-cum-scrii-alt-text.md).

---

**Pagini conexe:**
- [Cum scrii un slug bun](02-cum-scrii-un-slug.md)
- [Cum verifici cum arată pe Facebook](03-cum-arata-pe-facebook.md)
- [Cum scrii un alt text bun](../04-imagini/03-cum-scrii-alt-text.md)
