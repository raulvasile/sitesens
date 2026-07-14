# Lucruri pe care nu trebuie să le atingi

CMS-ul are zone care, modificate greșit, pot **strica site-ul** sau **pierde date**. Aceasta e lista zonelor **interzise** pentru content manageri.

## 🚫 1. Settings (în meniul stâng, jos)

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

## 🚫 2. Content-Type Builder

În meniul stânga, sub Content Manager. Modifici **structura** datelor (adaugi câmpuri, ștergi câmpuri, schimbi tipuri).

**De ce:**
- Frontend-ul e construit pe schema curentă; o modificare îl **rupe**
- Câmpurile șterse → date pierdute permanent
- Nu există „undo"

**Cine poate atinge:** doar **tehnician**, în timpul dezvoltării.

## 🚫 3. Pagina „Tema Site" (Site Theme)

Single Type → **Tema Site**.

Aici sunt setate **culorile globale** ale site-ului (verde închis, lime, cream etc.) și fonturile.

**De ce:** o modificare schimbă **aspectul tuturor paginilor** instant. Dacă alegi o culoare cu contrast slab → text invizibil. Dacă schimbi un font care nu există → site rupt.

**Cine poate atinge:** doar **designer + administrator**, după validare.

## 🚫 4. Pagina „Politica de Confidențialitate"

Conține text **legal obligatoriu** sub GDPR. Modificarea greșită = **risc legal**.

**Ce poți face:**
- Citești
- Verifici că e actuală

**Ce nu poți face:**
- Modifici fără validare juridică
- Ștergi paragrafe
- Schimbi adrese de contact (acelea sunt în pagina Contact)

## 🚫 5. Bootstrap / Seed data

Nu e accesibil prin UI, dar dacă vezi referințe la `seed*` sau la conținutul de bază
(navigație, footer, temă) generat automat la pornirea CMS-ului — nu modifica din afara admin-ului.

**De ce:** seed-ul rulează automat la pornirea CMS-ului (creează conținutul de bază dacă lipsește);
modificarea lui din cod poate corupe DB. Editarea normală a conținutului **din admin** e OK — seed-ul
nu suprascrie ce ai editat tu.

## 🚫 6. Câmpurile interne ale intrărilor

Pe fiecare intrare (articol, eveniment, etc.) vei vedea câmpuri ca:
- `id`
- `documentId`
- `createdAt`
- `updatedAt`
- `publishedAt`
- `locale`
- `__component` (în blocuri)

**De ce:** sunt **automate**. Modificarea lor manuală nu e posibilă din UI normal, dar dacă găsești cumva un mod, **NU** o face.

## 🚫 7. URL-uri cu `?` lung în admin

Câteodată copiezi din URL-ul admin pe mail/slack și ai grijă: poate conține **session tokens**. Nu partaja URL-uri admin care încep cu `https://cms.cusens.eu/admin/...?token=...` etc.

## 🚫 8. Ștergerea utilizatorilor admin

Dacă ești admin și ai acces la lista de utilizatori — **NU șterge** alți admini fără să fii sigur că au cineva backup pentru rolul lor.

Pentru a-i opri să acceseze, mai bine **dezactivezi** (toggle „Active" off).

## 🚫 9. Modificarea masivă neverificată

Nu modifica **multe intrări odată** (bulk edit) fără să fii sigur ce se întâmplă. Dacă greșești 1, ai greșit 100.

## ⚠️ 10. Modificarea slug-urilor după publish

Tehnic e permis, dar:
- Rupe link-uri externe
- Strică SEO
- Confuzează vizitatorii cu link salvat

**Modifică doar dacă absolut necesar.**

## ✅ Ce ai voie să faci fără frică

Tot ce e în:
- **Content Manager** → Single Types (cu excepția Tema Site și Politica de Confidențialitate)
- **Content Manager** → Collection Types (Articole, Evenimente, Pagini, Echipă, Categorii, Etichete, Județe, Domenii de Interes)
- **Media Library** (upload, ștergere imagini neutilizate, organizare)
- **Profilul tău** (parolă, preferințe)

## 🆘 Dacă ai atins ceva din greșeală

1. **NU închide browser-ul** încă
2. Vezi dacă există buton **Cancel** sau **Discard changes**
3. Dacă ai apăsat Save → contactează tehnicianul **imediat**
4. Backup zilnic poate recupera

---

**Pagini conexe:**
- [Greșeli comune](01-greseli-comune.md)
- [Cui te adresezi când ceva nu merge](04-cui-te-adresezi.md)
