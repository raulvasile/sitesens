# Greșeli comune — cum le eviți

Cele mai dese încurcături în CMS și cum scapi de ele.

## 🔴 1. „Am modificat dar nu apare pe site"

**Cauză:** ai apăsat **Save** dar nu **Publish**.

**Fix:**
1. Deschizi din nou intrarea
2. Vezi indicatorul **🟡 Modified** lângă titlu
3. Apasă **Publish**

**Cum eviți pe viitor:** după Save, **mereu** verifici indicatorul. Dacă e portocaliu → încă nu e live.

## 🔴 2. „Schimbarea apare în Preview dar nu pe site"

**Cauză:** Preview arată **draftul**. Site-ul public arată versiunea **publicată**.

**Fix:** **Publish**. Preview ≠ Publish.

## 🔴 3. „Am șters categoria și articolele au dispărut"

**Cauză:** ai șters categoria fără să muți articolele întâi.

**Fix:**
1. Articolele **există** încă, doar fără categorie
2. Mergi la **Articole**, le filtrezi după „No category"
3. Re-asignezi o categorie nouă
4. Save + Publish per articol (sau bulk dacă disponibil)

**Cum eviți:** **înainte** să ștergi o categorie → muți articolele pe alta. [Vezi Cum gestionezi categoriile](../05-taxonomii/01-cum-gestionezi-categoriile.md).

## 🔴 4. „Imaginea e tăiată ciudat pe site"

**Cauză:** aspect ratio greșit (ex: imagine portrait la cover landscape).

**Fix:**
1. Crop imaginea la 16:9 înainte de upload (ex: cu Preview pe Mac)
2. Re-upload
3. Save

**Cum eviți:** vezi [Reguli pentru imagini](../04-imagini/02-reguli-pentru-imagini.md).

## 🔴 5. „URL-ul are spații sau majuscule"

**Cauză:** ai modificat **Slug-ul** manual cu spații / majuscule.

**Fix:**
1. Editezi slug-ul: doar **litere mici** + **liniuțe**
2. Save
3. ⚠️ Dacă pagina era publicată, link-urile vechi se rup — vezi #15

**Cum eviți:** lasă slug-ul auto-generat sau scrie tu cu reguli (vezi [Cum scrii un slug](../08-seo-si-distribuire/02-cum-scrii-un-slug.md)).

## 🔴 6. „Apare URL-ul ca titlu pe Google"

**Cauză:** SEO necompletat (Meta Title gol).

**Fix:**
1. Mergi la intrare
2. Scroll la **SEO**
3. Completezi **Meta Title** și **Meta Description**
4. Save + Publish
5. Aștepți 24-48h ca Google să reindexeze

**Cum eviți:** completează **mereu** SEO. Vezi [Cum completezi SEO](../08-seo-si-distribuire/01-cum-completezi-seo.md).

## 🔴 7. „Am uitat să debifez 'No index' și pagina nu apare în Google"

**Fix:** debifezi **No Index** în SEO → Save → Publish → aștepți reindexare.

## 🔴 8. „Două intrări apar identice pe site"

**Cauză:** ai duplicat o intrare dar uitat să schimbi slug-ul / titlul.

**Fix:** ștergi una.

## 🔴 9. „Am modificat slug-ul și acum link-uri vechi nu mai merg"

**Cauză:** schimbarea slug-ului = URL nou.

**Fix preventiv:** evită modificarea slug-ului după publish.

**Fix recuperare:** dacă ai modificat din greșeală, poți reveni la slug-ul vechi (din câmp).

## 🔴 10. „Imaginea uploadată nu se vede"

**Cauză:** ai uploadat dar nu ai apăsat **Save** la intrare.

**Fix:**
1. Verifici câmpul: dacă imaginea apare în CMS → e doar nesalvată
2. Save
3. Refreshezi pagina pe site

## 🔴 11. „Pe mobil arată diferit decât pe desktop"

**Cauză:** layout responsive normal — unele blocuri se rearanjează pe mobil.

**Fix:** verifici cum arată pe **ambele** înainte să publici. Folosește DevTools (F12) → toggle mobile view.

## 🔴 12. „Cardul de Facebook arată o imagine veche"

**Cauză:** Facebook cachează preview-uri 30 zile.

**Fix:**
1. [Facebook Debugger](https://developers.facebook.com/tools/debug/)
2. Lipești URL → **Scrape Again**

Vezi [Cum verifici cum arată pe Facebook](../08-seo-si-distribuire/03-cum-arata-pe-facebook.md).

## 🔴 13. „Am pus un link extern dar se deschide în aceeași filă"

**Cauză:** nu ai bifat **Open in new tab**.

**Fix:** editezi link-ul → bifezi → Save.

## 🔴 14. „Articolul apare cu autor `Anonim`"

**Cauză:** câmpul **Author** e gol sau membrul a fost șters din Echipă.

**Fix:**
1. Verifici dacă autorul există în Echipă
2. Dacă nu → îl creezi (vezi [Cum adaugi un membru](../02-creare-continut/03-cum-adaugi-un-membru-echipa.md))
3. Re-selectezi autorul în articol → Save + Publish

## 🔴 15. „Am șters din greșeală o intrare importantă"

**Fix urgent:**
1. **NU închizi** sesiunea browser
2. Contactează **tehnicianul imediat**
3. Backup-ul zilnic poate recupera data
4. Cu cât mai repede, cu atât mai bine

## 🔴 16. „Apare 'Slug must be unique' la Save"

**Cauză:** există deja o intrare cu același slug.

**Fix:** modifici slug-ul (adaugi prefix/sufix unic — ex: an, locație).

## 🔴 17. „Filtrele de pe site nu funcționează"

**Cauză:** poate ai schimbat slug-ul unei categorii / etichete și link-urile nu mai potrivesc.

**Fix:** verifici că URL-urile filtrelor (`/stiri?categorie=X`) folosesc slug-ul actual, nu cel vechi.

## 🔴 18. „Am adăugat un bloc nou (Team Grid, Mission Band etc.) și nu apare pe site"

**Cauză posibilă A:** la **Team Grid**, dacă **mode = leadership** (default) și nu ai membri marcați **Conducere** în Echipă, lista apare goală.

**Fix:** schimbi `mode` la `team` (non-leadership) sau `all`. Sau marchezi măcar 1 membru ca **Conducere**.

**Cauză posibilă B:** Strapi nu returnează blocul către frontend (config tehnic). Dacă blocul e nou-nou, contactează **tehnicianul** ca să confirme că e inclus în lista de blocuri populate de loader.

**Fix preventiv:** mereu testează un bloc nou pe **Preview** înainte de Publish.

## 🔴 19. „În Accordion îmi apare cod ca `[{"type":"paragraph"...}]`"

**Cauză:** ai lipit text fără să folosești editorul rich text al lui Strapi.

**Fix:**
1. Deschizi accordion-ul în CMS
2. Pentru fiecare item, ștergi conținutul actual din **Content**
3. Scrii din nou folosind **toolbar-ul** (B/I/U, listă, link)
4. Save + Publish

## 🔴 20. „Iconițele social media din footer arată greșit"

**Cauză:** câmpul **Platform** e scris greșit (ex: „Facebook" în loc de „facebook").

**Fix:** ediția câmpului — folosește **doar** valorile din enum (lowercase): `facebook`, `instagram`, `twitter`, `linkedin`, `tiktok`, `youtube`.

## ✅ Workflow defensiv

Pentru a evita 90% din probleme:

```
1. Înainte de Save → recitești formularul
2. După Save → verifici indicator status
3. Înainte de Publish → folosești Preview
4. După Publish → deschizi pagina pe site (nu doar admin)
5. Verifici și pe mobil (DevTools sau telefon)
```

---

**Pagini conexe:**
- [Lucruri pe care nu trebuie să le atingi](02-ce-sa-nu-atingi.md)
- [Cui te adresezi când ceva nu merge](04-cui-te-adresezi.md)
