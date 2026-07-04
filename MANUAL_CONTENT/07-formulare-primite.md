# 07. Formulare primite

## Cuprins

1. [Cereri de aderare — cum le vezi și triezi](#cereri-de-aderare-cum-le-vezi-și-triezi)
2. [Abonați newsletter — cum îi vezi și exporți](#abonați-newsletter-cum-îi-vezi-și-exporți)

---

## Cereri de aderare — cum le vezi și triezi

### Ce sunt
Persoanele care completează formularul de pe `/inscrie-te` ajung aici, ca **intrări** în colecția **Cereri de Aderare**.

### Unde le găsești

Content Manager → **Cereri de Aderare**.

Vezi o listă cu toate cererile, **cele mai recente sus**.

### Câmpuri vizibile

Pentru fiecare cerere:

| Câmp | Conținut |
|---|---|
| **First name** + **Last name** | Numele complet |
| **Email** | Adresa de contact |
| **Phone** | Telefon |
| **Birth date** | Data nașterii |
| **County** | Județul |
| **City** | Orașul |
| **Address** | Adresa completă |
| **Motivation** | Text liber — de ce vrea să se înscrie |
| **Interests** | Domeniile de interes bifate (ex: Mediu, Educație) |
| **Consent GDPR** | Bifat (obligatoriu altfel cererea nu se trimite) |
| **Consent statute** | A acceptat statutul partidului |
| **Consent data processing** | A acceptat prelucrarea datelor |
| **Consent newsletter** | Opțional — vrea newsletter sau nu |
| **Status** | pending / approved / rejected |
| **Notes** | Note interne vizibile doar în CMS |
| **Created at** | Data trimiterii |

### Workflow recomandat de triere

#### 1. Vezi cererile noi
Filtrează lista după **Status: pending**:
- Click **Filters** (sus în listă)
- Status → **pending**
- Apply

#### 2. Deschizi prima cerere
Click pe rând.

#### 3. Verifici datele

**Verificări de bază:**
- [ ] Email valid (verifici formatul)
- [ ] Telefon (10 cifre pentru RO)
- [ ] Județ + oraș se potrivesc
- [ ] Motivația nu e spam (nu repetă cuvinte goale, nu e copy-paste din alte site-uri)

#### 4. Decide statusul

| Decizie | Status | Acțiune |
|---|---|---|
| Acceptat | `approved` | Adaugă notă: „Aprobat de [tine] pe [dată]" |
| Respins | `rejected` | Adaugă notă cu motivul respingerii |
| Necesită clarificări | rămâne `pending` | Adaugă notă „Sunat pe [dată], aștept confirmare" |

#### 5. Save

Statusul se actualizează. **Nu există Publish** — modificarea e live în CMS imediat.

#### 6. Contact extern (manual)

⚠️ **CMS-ul NU trimite emailuri automat** către aplicant. Trebuie să **contactezi manual** persoana:
- Email cu confirmare aprobare
- Trimiterea formularelor adiționale (statut, declarație etc.)
- Informații despre următorii pași

### Cum exporți cererile

Pentru raportare sau procesare în Excel:

1. În lista **Cereri de Aderare**
2. Click pe pictograma `...` (sus dreapta)
3. **Export**
4. Alege format: **CSV** sau **JSON**
5. Filtre opționale (doar pending, doar dintr-un anumit județ)
6. Download

### Cereri duplicate

Dacă aceeași persoană trimite de mai multe ori (același email):

1. Sortezi lista după Email (click pe header)
2. Vezi grupurile
3. Păstrezi cea **mai recentă** ca pending
4. Pe celelalte → status `rejected` cu nota „Duplicat — vezi cererea din [dată]"

### ⚠️ Reguli legale

- Datele sunt **personale** sub GDPR
- **NU exporta** și **NU partaja** liste cu date personale fără autorizare
- Notele interne pot conține date sensibile — limitează accesul la cei care au nevoie
- La cerere, persoana are dreptul să i se șteargă datele (drept la uitare)

### Cum ștergi o cerere (la cerere GDPR)

1. Deschizi cererea
2. **Delete** (sus dreapta)
3. Confirmă

⚠️ Acțiune ireversibilă. Verifică identitatea persoanei care face cererea.

### Statistici rapide

În lista cererilor, sus, vezi numărul total. Pentru breakdown:
- Filtrează pe status pentru a vedea câte sunt pending / approved / rejected
- Filtrează pe county pentru distribuție geografică

---

**Pagini conexe:**
- [Abonați newsletter](#abonați-newsletter-cum-îi-vezi-și-exporți)

---

## Abonați newsletter — cum îi vezi și exporți

### Ce sunt
Persoanele care s-au abonat la newsletter de pe pagina `/newsletter`, din formularele de pe pagina de contact, sau din orice bloc **Newsletter CTA** din site.

### Unde îi găsești

Content Manager → **Abonați Newsletter**.

Vezi lista cu toate abonările, **cele mai recente sus**.

### Câmpuri vizibile

Pentru fiecare abonat:

| Câmp | Conținut |
|---|---|
| **Email** | Adresa de email |
| **Name** | Numele (opțional, dacă a fost completat) |
| **Consent date** | Data consimțământului (timestamp automat) |
| **Source** | De unde a venit (ex: `/newsletter`, `/contact`, `homepage`) |
| **Status** | pending / confirmed / unsubscribed |
| **IP address** | IP-ul de la care s-a abonat (pentru GDPR) |

### Status-uri explicate

| Status | Înseamnă |
|---|---|
| **pending** | A trimis formularul, așteaptă confirmare double-opt-in (dacă e activ) |
| **confirmed** | E activ — poate primi emailuri |
| **unsubscribed** | S-a dezabonat — nu îi mai trimite |

⚠️ **Notă:** sistemul curent NU implementează automat double-opt-in (email de confirmare). Toate abonările apar direct ca `confirmed`. Dacă ai nevoie de double-opt-in, vorbește cu tehnicianul.

### Cum exporți lista pentru email-marketing

#### Pentru Mailchimp / Brevo / Substack

1. Filtrezi lista după **Status: confirmed**
2. Click pictograma `...` (sus dreapta)
3. **Export** → CSV
4. Importi CSV-ul în platforma ta de email-marketing

#### Coloane recomandate la export

- `email`
- `name`
- `consent_date`
- `source`

Restul (IP, status, etc.) **nu** îl imporți în platformele externe.

### Cum dezabonezi pe cineva manual

#### Cerere primită prin email
1. Cauți emailul în lista de abonați
2. Click → modifici **Status** la `unsubscribed`
3. Save

#### Bulk: dezabonezi pe toți dintr-o sursă
1. Filtrezi după Source (ex: o campanie de test)
2. Selectezi toate
3. Bulk edit (dacă disponibil) sau le modifici unul câte unul

### Cum ștergi un abonat (cerere GDPR)

⚠️ Differența între `unsubscribed` și `delete`:

- **Unsubscribed** = nu mai primește emailuri, dar înregistrarea rămâne (cu IP + dată)
- **Delete** = înregistrarea dispare complet

Pentru cereri GDPR „dreptul la uitare" → **Delete**.

1. Deschizi abonatul
2. **Delete**
3. Confirmă

### Statistici rapide

În lista de abonați:
- **Total** apare sus
- Filtrezi după status pentru breakdown
- Filtrezi după source pentru a vedea care formular e mai eficient

### Cum verifici creșterea

Periodic (ex: lunar):
1. Filtrezi lista după **Created at** într-un interval (ex: ultimele 30 zile)
2. Vezi câți abonați noi ai
3. Compari cu luna anterioară

### Bune practici

- ✅ **Trimite emailuri doar persoanelor cu status `confirmed`** și care **NU** sunt `unsubscribed`
- ✅ **Include link de dezabonare** în fiecare email — obligatoriu legal
- ✅ **Nu vinde / nu partaja** lista cu terți — încălcare GDPR
- ✅ **Backup periodic** — exportează lista cel puțin lunar (în caz de pierdere de date)
- ❌ **Nu importa contacte** care nu s-au abonat explicit
- ❌ **Nu trimite** spre persoane `unsubscribed` chiar dacă „te-ai întâlnit cu ei la eveniment"

### ⚠️ Reguli GDPR cheie

- Pentru fiecare abonat trebuie **consimțământ explicit**, **clear**, **informat**
- Trebuie să le poți **demonstra** consimțământul (de aceea avem `consent_date` și `IP address`)
- Au dreptul să-și **vadă** datele și să **fie șterși** la cerere
- Datele se păstrează **doar cât timp e necesar** scopului

---

**Pagini conexe:**
- [Cereri de aderare](#cereri-de-aderare-cum-le-vezi-și-triezi)

