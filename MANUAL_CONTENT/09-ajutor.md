# 09. Ajutor

## Cuprins

1. [Greșeli comune — cum le eviți](#greșeli-comune-cum-le-eviți)
2. [Lucruri pe care nu trebuie să le atingi](#lucruri-pe-care-nu-trebuie-să-le-atingi)
3. [Cum îți schimbi parola](#cum-îți-schimbi-parola)
4. [Cui te adresezi când ceva nu merge](#cui-te-adresezi-când-ceva-nu-merge)
5. [Cum funcționează cache-ul site-ului](#cum-funcționează-cache-ul-site-ului)

---

## Greșeli comune — cum le eviți

Cele mai dese încurcături în CMS și cum scapi de ele.

### 🔴 1. „Am modificat dar nu apare pe site"

**Cauză:** ai apăsat **Save** dar nu **Publish**.

**Fix:**
1. Deschizi din nou intrarea
2. Vezi indicatorul **🟡 Modified** lângă titlu
3. Apasă **Publish**

**Cum eviți pe viitor:** după Save, **mereu** verifici indicatorul. Dacă e portocaliu → încă nu e live.

### 🔴 2. „Schimbarea apare în Preview dar nu pe site"

**Cauză:** Preview arată **draftul**. Site-ul public arată versiunea **publicată**.

**Fix:** **Publish**. Preview ≠ Publish.

### 🔴 3. „Am șters categoria și articolele au dispărut"

**Cauză:** ai șters categoria fără să muți articolele întâi.

**Fix:**
1. Articolele **există** încă, doar fără categorie
2. Mergi la **Articole**, le filtrezi după „No category"
3. Re-asignezi o categorie nouă
4. Save + Publish per articol (sau bulk dacă disponibil)

**Cum eviți:** **înainte** să ștergi o categorie → muți articolele pe alta. [Vezi Cum gestionezi categoriile](05-taxonomii.md#cum-gestionezi-categoriile-de-articole).

### 🔴 4. „Imaginea e tăiată ciudat pe site"

**Cauză:** aspect ratio greșit (ex: imagine portrait la cover landscape).

**Fix:**
1. Crop imaginea la 16:9 înainte de upload (ex: cu Preview pe Mac)
2. Re-upload
3. Save

**Cum eviți:** vezi [Reguli pentru imagini](04-imagini.md#reguli-pentru-imagini-dimensiuni-format).

### 🔴 5. „URL-ul are spații sau majuscule"

**Cauză:** ai modificat **Slug-ul** manual cu spații / majuscule.

**Fix:**
1. Editezi slug-ul: doar **litere mici** + **liniuțe**
2. Save
3. ⚠️ Dacă pagina era publicată, link-urile vechi se rup — vezi #15

**Cum eviți:** lasă slug-ul auto-generat sau scrie tu cu reguli (vezi [Cum scrii un slug](08-seo-si-distribuire.md#cum-scrii-un-slug-bun)).

### 🔴 6. „Apare URL-ul ca titlu pe Google"

**Cauză:** SEO necompletat (Meta Title gol).

**Fix:**
1. Mergi la intrare
2. Scroll la **SEO**
3. Completezi **Meta Title** și **Meta Description**
4. Save + Publish
5. Aștepți 24-48h ca Google să reindexeze

**Cum eviți:** completează **mereu** SEO. Vezi [Cum completezi SEO](08-seo-si-distribuire.md#cum-completezi-seo-ul-unei-pagini).

### 🔴 7. „Am uitat să debifez 'No index' și pagina nu apare în Google"

**Fix:** debifezi **No Index** în SEO → Save → Publish → aștepți reindexare.

### 🔴 8. „Două intrări apar identice pe site"

**Cauză:** ai duplicat o intrare dar uitat să schimbi slug-ul / titlul.

**Fix:** ștergi una.

### 🔴 9. „Am modificat slug-ul și acum link-uri vechi nu mai merg"

**Cauză:** schimbarea slug-ului = URL nou.

**Fix preventiv:** evită modificarea slug-ului după publish.

**Fix recuperare:** dacă ai modificat din greșeală, poți reveni la slug-ul vechi (din câmp).

### 🔴 10. „Imaginea uploadată nu se vede"

**Cauză:** ai uploadat dar nu ai apăsat **Save** la intrare.

**Fix:**
1. Verifici câmpul: dacă imaginea apare în CMS → e doar nesalvată
2. Save
3. Refreshezi pagina pe site

### 🔴 11. „Pe mobil arată diferit decât pe desktop"

**Cauză:** layout responsive normal — unele blocuri se rearanjează pe mobil.

**Fix:** verifici cum arată pe **ambele** înainte să publici. Folosește DevTools (F12) → toggle mobile view.

### 🔴 12. „Cardul de Facebook arată o imagine veche"

**Cauză:** Facebook cachează preview-uri 30 zile.

**Fix:**
1. [Facebook Debugger](https://developers.facebook.com/tools/debug/)
2. Lipești URL → **Scrape Again**

Vezi [Cum verifici cum arată pe Facebook](08-seo-si-distribuire.md#cum-verifici-cum-arată-pe-facebook).

### 🔴 13. „Am pus un link extern dar se deschide în aceeași filă"

**Cauză:** nu ai bifat **Open in new tab**.

**Fix:** editezi link-ul → bifezi → Save.

### 🔴 14. „Articolul apare cu autor `Anonim`"

**Cauză:** câmpul **Author** e gol sau membrul a fost șters din Echipă.

**Fix:**
1. Verifici dacă autorul există în Echipă
2. Dacă nu → îl creezi (vezi [Cum adaugi un membru](02-creare-continut.md#cum-adaugi-un-membru-de-echipă))
3. Re-selectezi autorul în articol → Save + Publish

### 🔴 15. „Am șters din greșeală o intrare importantă"

**Fix urgent:**
1. **NU închizi** sesiunea browser
2. Contactează **tehnicianul imediat**
3. Backup-ul zilnic poate recupera data
4. Cu cât mai repede, cu atât mai bine

### 🔴 16. „Apare 'Slug must be unique' la Save"

**Cauză:** există deja o intrare cu același slug.

**Fix:** modifici slug-ul (adaugi prefix/sufix unic — ex: an, locație).

### 🔴 17. „Filtrele de pe site nu funcționează"

**Cauză:** poate ai schimbat slug-ul unei categorii / etichete și link-urile nu mai potrivesc.

**Fix:** verifici că URL-urile filtrelor (`/stiri?categorie=X`) folosesc slug-ul actual, nu cel vechi.

### 🔴 18. „Am adăugat un bloc nou (Team Grid, Mission Band etc.) și nu apare pe site"

**Cauză posibilă A:** la **Team Grid**, dacă **mode = leadership** (default) și nu ai membri marcați **Conducere** în Echipă, lista apare goală.

**Fix:** schimbi `mode` la `team` (non-leadership) sau `all`. Sau marchezi măcar 1 membru ca **Conducere**.

**Cauză posibilă B:** Strapi nu returnează blocul către frontend (config tehnic). Dacă blocul e nou-nou, contactează **tehnicianul** ca să confirme că e inclus în lista de blocuri populate de loader.

**Fix preventiv:** mereu testează un bloc nou pe **Preview** înainte de Publish.

### 🔴 19. „În Accordion îmi apare cod ca `[{"type":"paragraph"...}]`"

**Cauză:** ai lipit text fără să folosești editorul rich text al lui Strapi.

**Fix:**
1. Deschizi accordion-ul în CMS
2. Pentru fiecare item, ștergi conținutul actual din **Content**
3. Scrii din nou folosind **toolbar-ul** (B/I/U, listă, link)
4. Save + Publish

### 🔴 20. „Iconițele social media din footer arată greșit"

**Cauză:** câmpul **Platform** e scris greșit (ex: „Facebook" în loc de „facebook").

**Fix:** ediția câmpului — folosește **doar** valorile din enum (lowercase): `facebook`, `instagram`, `twitter`, `linkedin`, `tiktok`, `youtube`.

### ✅ Workflow defensiv

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
- [Lucruri pe care nu trebuie să le atingi](#lucruri-pe-care-nu-trebuie-să-le-atingi)
- [Cui te adresezi când ceva nu merge](#cui-te-adresezi-când-ceva-nu-merge)

---

## Lucruri pe care nu trebuie să le atingi

CMS-ul are zone care, modificate greșit, pot **strica site-ul** sau **pierde date**. Aceasta e lista zonelor **interzise** pentru content manageri.

### 🚫 1. Settings (în meniul stâng, jos)

Toate sub-secțiunile:
- **Administration Panel** (utilizatori, roles, permissions)
- **Email Designer**
- **Internationalization**
- **Media Library settings**
- **Webhooks**
- **API Tokens**
- **Transfer Tokens**

**De ce:** modificarea poate **bloca accesul tuturor**, **expune secrete**, sau **trimite date la terți neautorizați**.

**Cine poate atinge:** doar **administrator** sau **tehnician**.

### 🚫 2. Content-Type Builder

În meniul stânga, sub Content Manager. Modifici **structura** datelor (adaugi câmpuri, ștergi câmpuri, schimbi tipuri).

**De ce:**
- Frontend-ul e construit pe schema curentă; o modificare îl **rupe**
- Câmpurile șterse → date pierdute permanent
- Nu există „undo"

**Cine poate atinge:** doar **tehnician**, în timpul dezvoltării.

### 🚫 3. Pagina „Tema Site" (Site Theme)

Single Type → **Tema Site**.

Aici sunt setate **culorile globale** ale site-ului (verde închis, lime, cream etc.) și fonturile.

**De ce:** o modificare schimbă **aspectul tuturor paginilor** instant. Dacă alegi o culoare cu contrast slab → text invizibil. Dacă schimbi un font care nu există → site rupt.

**Cine poate atinge:** doar **designer + administrator**, după validare.

### 🚫 4. Pagina „Politica de Confidențialitate"

Conține text **legal obligatoriu** sub GDPR. Modificarea greșită = **risc legal**.

**Ce poți face:**
- Citești
- Verifici că e actuală

**Ce nu poți face:**
- Modifici fără validare juridică
- Ștergi paragrafe
- Schimbi adrese de contact (acelea sunt în pagina Contact)

### 🚫 5. Bootstrap migrations / Seed data

Nu e accesibil prin UI, dar dacă vezi referințe la `migrate*` sau `topUp*` sau `seed*` în URL-uri sau cod — nu modifica.

**De ce:** rulează automat la pornirea CMS-ului; modificarea poate corupe DB.

### 🚫 6. Câmpurile interne ale intrărilor

Pe fiecare intrare (articol, eveniment, etc.) vei vedea câmpuri ca:
- `id`
- `documentId`
- `createdAt`
- `updatedAt`
- `publishedAt`
- `locale`
- `__component` (în blocuri)

**De ce:** sunt **automate**. Modificarea lor manuală nu e posibilă din UI normal, dar dacă găsești cumva un mod, **NU** o face.

### 🚫 7. URL-uri cu `?` lung în admin

Câteodată copiezi din URL-ul admin pe mail/slack și ai grijă: poate conține **session tokens**. Nu partaja URL-uri admin care încep cu `https://cms.cusens.eu/admin/...?token=...` etc.

### 🚫 8. Ștergerea utilizatorilor admin

Dacă ești admin și ai acces la lista de utilizatori — **NU șterge** alți admini fără să fii sigur că au cineva backup pentru rolul lor.

Pentru a-i opri să acceseze, mai bine **dezactivezi** (toggle „Active" off).

### 🚫 9. Modificarea masivă neverificată

Nu modifica **multe intrări odată** (bulk edit) fără să fii sigur ce se întâmplă. Dacă greșești 1, ai greșit 100.

### ⚠️ 10. Modificarea slug-urilor după publish

Tehnic e permis, dar:
- Rupe link-uri externe
- Strică SEO
- Confuzează vizitatorii cu link salvat

**Modifică doar dacă absolut necesar.**

### ✅ Ce ai voie să faci fără frică

Tot ce e în:
- **Content Manager** → Single Types (cu excepția Tema Site și Politica de Confidențialitate)
- **Content Manager** → Collection Types (Articole, Evenimente, Pagini, Echipă, Categorii, Etichete, Județe, Domenii de Interes)
- **Media Library** (upload, ștergere imagini neutilizate, organizare)
- **Profilul tău** (parolă, preferințe)

### 🆘 Dacă ai atins ceva din greșeală

1. **NU închide browser-ul** încă
2. Vezi dacă există buton **Cancel** sau **Discard changes**
3. Dacă ai apăsat Save → contactează tehnicianul **imediat**
4. Backup zilnic poate recupera

---

**Pagini conexe:**
- [Greșeli comune](#greșeli-comune-cum-le-eviți)
- [Cui te adresezi când ceva nu merge](#cui-te-adresezi-când-ceva-nu-merge)

---

## Cum îți schimbi parola

### Când să o faci
- La primul login (e o parolă provizorie)
- Periodic (recomandat la 6 luni)
- Imediat dacă suspectezi că cineva ți-a aflat-o
- Dacă ai folosit aceeași parolă pe alt site care a fost compromis

### Cum o schimbi din interiorul CMS

#### Pași
1. Loghează-te în CMS
2. Click pe **avatarul tău** (sus dreapta)
3. **Profile** (sau pictograma de utilizator)
4. Scroll la secțiunea **„Change password"**
5. Completezi:
   - **Current password** — parola actuală
   - **New password** — parola nouă
   - **Confirm new password** — la fel
6. **Save**

### Reguli pentru o parolă bună

#### ✅ Folosește
- **Minim 12 caractere**
- **Litere mari + litere mici**
- **Cifre**
- **Cel puțin un simbol** (ex: `!@#$%^&*`)
- **Unică** — diferită de alte conturi

#### ❌ Evită
- Cuvinte din dicționar (ex: „parola123")
- Numele tău, anul nașterii
- „qwerty", „123456"
- Aceeași parolă cu alte servicii

### Recomandare: Password Manager

Folosește un **password manager** care generează și salvează parole complexe automat:
- **1Password** (paid, foarte bun)
- **Bitwarden** (gratuit, open-source)
- **iCloud Keychain** (gratuit, doar Apple)
- **Google Password Manager** (gratuit, în Chrome)

Avantaje:
- Nu trebuie să ții minte parolele
- Generează automat parole sigure
- Auto-fill când te loghezi

### Dacă ai uitat parola

#### De pe pagina de login
1. Mergi la `https://cms.cusens.eu/admin`
2. Click **„Forgot password?"** sub formular
3. Introdu emailul tău
4. Vei primi un link pe email (verifică și folderul Spam)
5. Click pe link → setezi parolă nouă

#### Dacă nu primești emailul
1. Verifici Spam / Promotions
2. Verifici că emailul e cel corect (cel cu care ai contul)
3. Aștepți 5 minute (poate fi întârziere)
4. Dacă tot nu primești → contactezi **administratorul** ca să-ți resetez parola manual

### Doi factori (2FA)

Momentan, CMS-ul **NU** are 2FA implementat nativ. Pentru securitate adițională:
- Folosește o parolă **foarte puternică**
- Nu o salvezi în browser pe computere publice
- Te deloghezi la sfârșitul sesiunii

Dacă ai nevoie de 2FA pentru securitate sporită, vorbește cu tehnicianul — există plugin-uri Strapi.

### Securitate generală cont

| Practică | De ce |
|---|---|
| **Logout** la sfârșitul zilei | În caz că laptopul e furat / accesat |
| **Nu partaja contul** cu colegii | Fiecare să aibă cont propriu pentru audit trail |
| **Verifici „Last login"** ocazional | Vezi dacă cineva s-a logat fără tine |
| **Notifică imediat dacă vezi activitate suspectă** | Tehnician poate dezactiva contul |

### Deconectare (logout)

1. Click pe avatarul tău (sus dreapta)
2. **Logout**

Sesiunile expiră automat după **7 zile** de inactivitate.

---

**Pagini conexe:**
- [Cum te loghezi în CMS](01-incepe-aici.md#cum-te-loghezi-în-cms)
- [Cui te adresezi când ceva nu merge](#cui-te-adresezi-când-ceva-nu-merge)

---

## Cui te adresezi când ceva nu merge

Tabel rapid cu cine se ocupă de ce.

### 📞 Contactele cheie

| Rol | Pentru ce | Când |
|---|---|---|
| **Administrator CMS** | Cont, parolă, accesuri | Probleme cont, parolă uitată dincolo de „Forgot" |
| **Tehnician (developer)** | Site / cod / structură | Site jos, blocuri noi, restore date pierdute |
| **Designer** | Branding, culori, font | Schimbări vizuale globale |
| **Manager content** | Aprobări editoriale | Înainte de publish-uri sensibile |
| **Juridic** | Texte legale, GDPR | Privacy policy, cereri ștergere date |

> Înlocuiește cu contactele reale ale echipei tale.

### 🆘 Probleme și cui te adresezi

#### Probleme tehnice

| Simptom | Contactezi |
|---|---|
| Site-ul `cusens.eu` nu se încarcă | **Tehnician — URGENT** |
| `cms.cusens.eu/admin` nu se încarcă | **Tehnician** |
| Eroare la upload imagine | Tehnician (dacă persistă mai mult de 1 oră) |
| Schimbarea nu apare pe site după 5 min | Tehnician |
| Logo nou nu apare | Tehnician (verificare cache CDN) |
| Newsletter signup nu funcționează | Tehnician |

#### Probleme de cont

| Simptom | Contactezi |
|---|---|
| Nu mă pot loga (parola uitată) | „Forgot password?" mai întâi → dacă nu merge: **Administrator** |
| Vreau cont pentru un coleg nou | **Administrator** |
| Vreau să-mi schimb emailul | **Administrator** |
| Vreau să fiu scos din lista de admini | **Administrator** |

#### Probleme conținut

| Simptom | Contactezi |
|---|---|
| Am șters din greșeală un articol important | **Tehnician — în max 24h** (există backup) |
| Am modificat ceva important și vreau să revin | Tehnician (versionare) |
| Nu știu ce bloc să folosesc | Designer / acest manual |
| Nu sunt sigur dacă să public ceva | **Manager content** |
| Cineva m-a contactat să-i șterg datele | **Juridic** + Administrator |

#### Probleme funcționale

| Simptom | Contactezi |
|---|---|
| Vreau un câmp nou la un tip existent | **Tehnician** |
| Vreau un bloc nou (diferit de cele 27 existente) | **Tehnician + Designer** |
| Vreau o pagină cu funcționalitate specială (ex: hartă interactivă) | Tehnician |
| Vreau să exportez toate articolele dintr-un an | Tehnician (sau încearcă export CSV din CMS) |

### 📋 Înainte de a contacta tehnicianul

Pentru a primi ajutor mai rapid, **adună aceste informații**:

1. **Ce încercai să faci?** (ex: „Publicam un articol nou")
2. **Ce s-a întâmplat?** (ex: „Apare eroare 'Slug must be unique'")
3. **Ce ai încercat deja?** (ex: „Am refresh-uit pagina")
4. **Captură de ecran** (screenshot — Cmd+Shift+4 pe Mac, Win+Shift+S pe Windows)
5. **URL-ul** la care ești când apare problema
6. **Browser-ul folosit** (Chrome / Safari / Firefox)
7. **Dispozitivul** (laptop / mobil / iPad)

Trimitere prin Slack / email cu toate astea = răspuns mult mai rapid.

### 📚 Înainte de a contacta — verifici dacă e în manual

Multe probleme au răspuns aici. Înainte să trimiți email:

1. **Caută cu Ctrl+F** în [README](README.md) după cuvântul cheie
2. Verifici secțiunea relevantă
3. Verifici [Greșeli comune](#greșeli-comune-cum-le-eviți)

Dacă nu găsești răspunsul, **abia atunci** contactezi.

### 🗓 Program estimat de răspuns

| Tip problemă | Timp răspuns așteptat |
|---|---|
| **Site jos / data pierdută** | < 1 oră |
| **Cont blocat / parolă** | < 4 ore |
| **Bug funcțional** | < 1 zi lucrătoare |
| **Cerere feature nou** | 1-2 săptămâni (depinde de complexitate) |
| **Întrebare manual / clarificări** | 1 zi lucrătoare |

### 📨 Canal recomandat

| Tip mesaj | Folosește |
|---|---|
| Urgent (site jos) | Telefon / Slack DM (cu „URGENT" în subiect) |
| Bug / problemă | Slack channel `#sens-cms` (sau email) |
| Întrebări manual | Slack channel `#sens-cms` |
| Cerere feature nou | Email cu subiect „[FEATURE]" |
| Cerere acces / cont | Email Administrator |

> Înlocuiește canalele cu cele folosite efectiv în echipa ta.

### 🆘 Pentru urgențe absolute (site complet jos)

1. **Verifici** că nu e doar conexiunea ta: cere unui coleg să încerce
2. **Verifici** [downforeveryoneorjustme.com](https://downforeveryoneorjustme.com/cusens.eu)
3. **Sună** tehnicianul (nu doar email — pentru urgențe)
4. **Postează** pe rețelele sociale ale partidului că „site-ul e momentan în mentenanță" dacă e nevoie
5. **NU încerca** să modifici tu nimic în CMS dacă site-ul e jos

---

**Pagini conexe:**
- [Greșeli comune](#greșeli-comune-cum-le-eviți)
- [Lucruri pe care nu trebuie să le atingi](#lucruri-pe-care-nu-trebuie-să-le-atingi)
- [Cum îți schimbi parola](#cum-îți-schimbi-parola)

---

## Cum funcționează cache-ul site-ului

### Ce trebuie să știi (esențialul)

Site-ul folosește **cache agresiv prin Cloudflare** ca să se încarce rapid și să nu suprasolicite serverul. Asta înseamnă că vizitatorii nu cer pagina direct de la serverul nostru — primesc o copie salvată de Cloudflare, mult mai aproape de ei geografic.

**Implicit:** o pagină stă în cache **30 zile** până să fie cerută din nou de la server.

### Ce se întâmplă când editezi conținut

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

### Cât durează până vede vizitatorul schimbarea?

- **5-30 secunde**: timp de propagare globală Cloudflare după Save+Publish
- Browserele unor vizitatori (cache local) pot reține versiunea veche **5 minute** suplimentar

⚠️ **Dacă tu (editorul) ai vizitat pagina înainte**, browserul tău ar putea afișa varianta veche pentru câteva minute. **Hard refresh** (Ctrl+F5 / Cmd+Shift+R) rezolvă imediat. Vizitatorii noi primesc varianta nouă instant.

### Cum verifici că schimbarea a apărut

1. **Deschide pagina într-o filă incognito** (Ctrl+Shift+N / Cmd+Shift+N)
2. Verifici că modificarea apare
3. Dacă tot vezi varianta veche după 1 minut, contactează tehnicianul

### Ce NU se cache-uiește

- **Admin Strapi** (`cms.cusens.eu/admin`) — niciodată cache, mereu live
- **API Strapi** (`cms.cusens.eu/api/*`) — niciodată cache
- **Preview din admin** — folosește mereu draftul, nu cache

### Cazuri speciale

#### Schimbare pe Header sau Footer
Cache-ul **întregului site** se golește. Toate paginile se vor încărca o dată mai lent (de la server) după modificare. **Folosește cu cumpătare**: nu refactor zilnic header-ul.

#### Schimbare la Tema Site (culori, fonturi)
La fel — golește **tot cache-ul**. Recomandare: ⛔ **NU atinge Tema** fără confirmare (vezi [Lucruri pe care nu trebuie să le atingi](#lucruri-pe-care-nu-trebuie-să-le-atingi)).

#### Adăugare/ștergere membru de echipă
Cache-ul întregului site se golește (membrul ar putea apărea ca autor pe articole, în Team Grid pe diverse pagini). E **OK** să faci asta — operația e rară.

#### Adăugare/ștergere categorie sau etichetă
Cache total. Operațiile pe taxonomii sunt rare — nu te îngrijora.

### Probleme cunoscute

#### „Am editat articolul dar pe Facebook arată varianta veche"
**Cauza**: Facebook are cache-ul lui (separat de Cloudflare), 30 zile. Vezi [Cum verifici cum arată pe Facebook](08-seo-si-distribuire.md#cum-verifici-cum-arată-pe-facebook) — folosește **Sharing Debugger → Scrape Again**.

#### „Am modificat o imagine cu același nume și nu se vede noua versiune"
**Cauza**: Imaginile cu `/uploads/` au cache de 1 an. Dacă suprascrii o imagine păstrând numele, browserele și Cloudflare cred că e tot vechea.
**Soluție**: încarcă imaginea cu nume nou (Strapi îi pune un ID unic oricum).

#### „Schimbarea de pe homepage nu apare după 5 minute"
**Verifică**:
1. Ai apăsat **Publish** (nu doar Save)?
2. Hard refresh: Ctrl+F5 / Cmd+Shift+R
3. Filă incognito
4. Dacă tot nu apare → contactează tehnicianul (poate fi nevoie de purge manual)

### Întrebări frecvente

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
- [Draft și Publish — cum funcționează](01-incepe-aici.md#draft-și-publish-cum-funcționează)
- [Greșeli comune](#greșeli-comune-cum-le-eviți)
- [Cui te adresezi](#cui-te-adresezi-când-ceva-nu-merge)

