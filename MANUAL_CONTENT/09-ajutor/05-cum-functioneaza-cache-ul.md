# Cum funcționează cache-ul site-ului

## Ce trebuie să știi (esențialul)

Site-ul folosește **cache agresiv prin Cloudflare** ca să se încarce rapid și să nu suprasolicite serverul. Asta înseamnă că vizitatorii nu cer pagina direct de la serverul nostru — primesc o copie salvată de Cloudflare, mult mai aproape de ei geografic.

**Implicit:** o pagină stă în cache **30 zile** până să fie cerută din nou de la server.

## Ce se întâmplă când editezi conținut

CMS-ul **invalidează automat** cache-ul afectat când apeși **Save + Publish**. Nu trebuie să faci nimic special.

| Modificare | Cache invalidat |
|---|---|
| Articol editat / publicat / șters | Pagina articolului + lista `/stiri` + homepage |
| Eveniment editat / publicat / șters | Pagina evenimentului + lista `/evenimente` + homepage |
| Pagină liberă editată (ex: /despre-noi) | Doar URL-ul ei |
| Tab (Secțiune) editat | Pagina părinte care îl conține |
| Pagina de Contact / Donații / Înscriere etc. | Doar pagina respectivă |
| Homepage | Doar `/` |
| **Header, Footer, Tema site** | **TOT site-ul** (apar peste tot) |
| **Membru de echipă** | **TOT site-ul** (poate apărea în multe pagini) |
| **Categorie sau Etichetă** | **TOT site-ul** (apar pe articole, liste, filtre) |

## Cât durează până vede vizitatorul schimbarea?

- **5-30 secunde**: timp de propagare globală Cloudflare după Save+Publish
- Browserele unor vizitatori (cache local) pot reține versiunea veche **5 minute** suplimentar

⚠️ **Dacă tu (editorul) ai vizitat pagina înainte**, browserul tău ar putea afișa varianta veche pentru câteva minute. **Hard refresh** (Ctrl+F5 / Cmd+Shift+R) rezolvă imediat. Vizitatorii noi primesc varianta nouă instant.

## Cum verifici că schimbarea a apărut

1. **Deschide pagina într-o filă incognito** (Ctrl+Shift+N / Cmd+Shift+N)
2. Verifici că modificarea apare
3. Dacă tot vezi varianta veche după 1 minut, contactează tehnicianul

## Ce NU se cache-uiește

- **Admin Strapi** (`cms.cusens.eu/admin`) — niciodată cache, mereu live
- **API Strapi** (`cms.cusens.eu/api/*`) — niciodată cache
- **Preview din admin** — folosește mereu draftul, nu cache

## Cazuri speciale

### Schimbare pe Header sau Footer
Cache-ul **întregului site** se golește. Toate paginile se vor încărca o dată mai lent (de la server) după modificare. **Folosește cu cumpătare**: nu refactor zilnic header-ul.

### Schimbare la Tema Site (culori, fonturi)
La fel — golește **tot cache-ul**. Recomandare: ⛔ **NU atinge Tema** fără confirmare (vezi [Lucruri pe care nu trebuie să le atingi](02-ce-sa-nu-atingi.md)).

### Adăugare/ștergere membru de echipă
Cache-ul întregului site se golește (membrul ar putea apărea ca autor pe articole, în Team Grid pe diverse pagini). E **OK** să faci asta — operația e rară.

### Adăugare/ștergere categorie sau etichetă
Cache total. Operațiile pe taxonomii sunt rare — nu te îngrijora.

## Probleme cunoscute

### „Am editat articolul dar pe Facebook arată varianta veche"
**Cauza**: Facebook are cache-ul lui (separat de Cloudflare), 30 zile. Vezi [Cum verifici cum arată pe Facebook](../08-seo-si-distribuire/03-cum-arata-pe-facebook.md) — folosește **Sharing Debugger → Scrape Again**.

### „Am modificat o imagine cu același nume și nu se vede noua versiune"
**Cauza**: Imaginile cu `/uploads/` au cache de 1 an. Dacă suprascrii o imagine păstrând numele, browserele și Cloudflare cred că e tot vechea.
**Soluție**: încarcă imaginea cu nume nou (Strapi îi pune un ID unic oricum).

### „Schimbarea de pe homepage nu apare după 5 minute"
**Verifică**:
1. Ai apăsat **Publish** (nu doar Save)?
2. Hard refresh: Ctrl+F5 / Cmd+Shift+R
3. Filă incognito
4. Dacă tot nu apare → contactează tehnicianul (poate fi nevoie de purge manual)

## Întrebări frecvente

**Q: De ce e cache-ul atât de agresiv?**
A: Pentru că:
- Site-ul se încarcă de 5-10× mai rapid pentru vizitatori
- Costul de hosting scade semnificativ (server-ul primește 5-15% din requests)
- Site-ul rezistă la trafic mare (campanii, viralizări) fără să cadă

**Q: Pot să dezactivez cache-ul pentru o pagină anume?**
A: Doar tehnicianul poate, prin Cloudflare. Pentru cazuri excepționale (ex: pagină dinamică care se schimbă des).

**Q: Pot să forțez purge manual?**
A: Momentan nu există buton în CMS — dar lifecycle-urile auto sunt suficiente în 99% din cazuri. Dacă chiar ai nevoie, contactează tehnicianul (poate face purge din Cloudflare dashboard în 30 sec).

---

**Pagini conexe:**
- [Draft și Publish — cum funcționează](../01-incepe-aici/04-draft-si-publish.md)
- [Greșeli comune](01-greseli-comune.md)
- [Cui te adresezi](04-cui-te-adresezi.md)
