# Cum verifici cum arată pe Facebook

## De ce contează
Când cineva partajează un link de pe site-ul tău pe Facebook, Twitter, WhatsApp, LinkedIn — apare un **card mare cu imagine + titlu + descriere**.

Cum arată acest card determină **dacă oamenii apasă** sau scrollează mai departe.

## Ce influențează cardul

Trei câmpuri din **SEO** (vezi [Cum completezi SEO](01-cum-completezi-seo.md)):

1. **Meta Title** — titlul mare al cardului
2. **Meta Description** — text mic sub titlu
3. **OG Image** — imaginea (sau cover image ca fallback)

## Tool-uri de verificare

### 🔵 Facebook Sharing Debugger
**URL:** [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)

1. Lipești URL-ul tău (ex: `https://cusens.eu/stiri/manifest-clima`)
2. Click **„Debug"**
3. Vezi exact cum apare cardul
4. Dacă imaginea e veche → click **„Scrape Again"** (Facebook re-citește pagina)

### ⚫ Twitter Card Validator (X)
**URL:** [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) — momentan poate fi indisponibil din cauza schimbărilor X.

Alternative: lipește direct linkul într-un draft de tweet și vezi preview-ul.

### 💬 LinkedIn Post Inspector
**URL:** [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)

1. Lipești URL-ul
2. Click **„Inspect"**
3. Vezi cardul

### 📱 Test direct pe WhatsApp
1. Trimite-ți ție linkul în WhatsApp
2. Aștepți 2-3 secunde să se încarce preview-ul
3. Vezi cum arată

## Workflow tipic

### La publicarea unui articol nou
```
1. Publish articol în Strapi
2. Aștepți 30 secunde (cache frontend)
3. Deschizi Facebook Debugger
4. Lipești URL-ul → Debug
5. Verifici:
   ✓ Imaginea apare (mare, lizibilă)
   ✓ Titlul nu e tăiat
   ✓ Descrierea conține teasere
6. Dacă ceva e greșit:
   - Modifici SEO în Strapi
   - Save + Publish
   - "Scrape Again" în Debugger
   - Re-verifici
```

### Cache-ul Facebook
Facebook **cachează** preview-urile **30 zile** după prima accesare a unui URL. Dacă schimbi imaginea sau titlul după ce link-ul a fost partajat:

1. Modifici SEO în Strapi → Publish
2. Mergi la **Facebook Debugger**
3. Lipești URL → **„Scrape Again"**
4. Acum cardul actualizat e folosit pentru noi share-uri

⚠️ **Share-urile vechi NU se actualizează retroactiv** — cardurile partajate înainte rămân cu versiunea veche.

## Probleme frecvente

### Imaginea nu apare
| Cauză | Fix |
|---|---|
| OG image lipsește | Setezi în SEO sau cover image |
| Imagine prea mare (>5 MB) | Comprimă |
| Imagine prea mică (<200×200) | Folosește 1200×630 |
| Cale relativă în URL | Trebuie URL absolut (Strapi îl generează automat) |

### Titlul e tăiat
- Mai scurt: maxim 60 caractere
- Editezi `Meta Title` în SEO

### Descrierea greșită
- Editezi `Meta Description` în SEO
- Maxim 160 caractere

### Apare alt site / titlu
- Verifici că URL-ul e corect (nu cu typo)
- Verifici că pagina e **publicată** (nu draft)
- Refreshezi cu „Scrape Again" în Debugger

## Recomandări design OG image

Pentru o imagine OG care convertește:

- **1200×630 px**
- **Text mare** — lizibil chiar și în thumbnail mic
- **Logo SENS** — colț (ex: stânga jos)
- **Culori brand** — verde închis, lime
- **Fără text mic** — doar 1-2 cuvinte cheie
- **Contrast puternic** — text alb/lime pe verde închis

### Exemple de bune practici
- Articol despre alegeri → text mare „ALEGERI 2026" + logo
- Eveniment → data + locația + numele evenimentului
- Pagină program → un cuvânt-cheie central + slogan

## Tool-uri pentru a crea OG images

- **Canva** (canva.com) — template-uri 1200×630 ready
- **Figma** — pentru control total
- **Pablo** (buffer.com/pablo) — drag & drop simplu

---

**Pagini conexe:**
- [Cum completezi SEO](01-cum-completezi-seo.md)
- [Reguli pentru imagini](../04-imagini/02-reguli-pentru-imagini.md)
