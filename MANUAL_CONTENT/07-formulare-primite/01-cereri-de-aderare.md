# Cereri de aderare — cum le vezi și triezi

## Ce sunt
Persoanele care completează formularul de pe `/inscrie-te` ajung aici, ca **intrări** în colecția **Cereri de Aderare**.

## Unde le găsești

Content Manager → **Cereri de Aderare**.

Vezi o listă cu toate cererile, **cele mai recente sus**.

## Câmpuri vizibile

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

## Workflow recomandat de triere

### 1. Vezi cererile noi
Filtrează lista după **Status: pending**:
- Click **Filters** (sus în listă)
- Status → **pending**
- Apply

### 2. Deschizi prima cerere
Click pe rând.

### 3. Verifici datele

**Verificări de bază:**
- [ ] Email valid (verifici formatul)
- [ ] Telefon (10 cifre pentru RO)
- [ ] Județ + oraș se potrivesc
- [ ] Motivația nu e spam (nu repetă cuvinte goale, nu e copy-paste din alte site-uri)

### 4. Decide statusul

| Decizie | Status | Acțiune |
|---|---|---|
| Acceptat | `approved` | Adaugă notă: „Aprobat de [tine] pe [dată]" |
| Respins | `rejected` | Adaugă notă cu motivul respingerii |
| Necesită clarificări | rămâne `pending` | Adaugă notă „Sunat pe [dată], aștept confirmare" |

### 5. Save

Statusul se actualizează. **Nu există Publish** — modificarea e live în CMS imediat.

> **Notă (retenție GDPR):** cererile marcate **`rejected`** pot fi **șterse automat** după o
> perioadă (configurabilă), ca să nu păstrăm date personale mai mult decât e necesar. Dacă vrei
> să păstrezi urma unei respingeri, notează motivul în altă parte înainte — după ștergere, cererea
> dispare complet.

### 6. Contact extern (manual)

⚠️ **CMS-ul NU trimite emailuri automat** către aplicant. Trebuie să **contactezi manual** persoana:
- Email cu confirmare aprobare
- Trimiterea formularelor adiționale (statut, declarație etc.)
- Informații despre următorii pași

## Cum exporți cererile

Pentru raportare sau procesare în Excel:

1. În lista **Cereri de Aderare**
2. Click pe pictograma `...` (sus dreapta)
3. **Export**
4. Alege format: **CSV** sau **JSON**
5. Filtre opționale (doar pending, doar dintr-un anumit județ)
6. Download

## Cereri duplicate

Dacă aceeași persoană trimite de mai multe ori (același email):

1. Sortezi lista după Email (click pe header)
2. Vezi grupurile
3. Păstrezi cea **mai recentă** ca pending
4. Pe celelalte → status `rejected` cu nota „Duplicat — vezi cererea din [dată]"

## ⚠️ Reguli legale

- Datele sunt **personale** sub GDPR
- **NU exporta** și **NU partaja** liste cu date personale fără autorizare
- Notele interne pot conține date sensibile — limitează accesul la cei care au nevoie
- La cerere, persoana are dreptul să i se șteargă datele (drept la uitare)

## Cum ștergi o cerere (la cerere GDPR)

1. Deschizi cererea
2. **Delete** (sus dreapta)
3. Confirmă

⚠️ Acțiune ireversibilă. Verifică identitatea persoanei care face cererea.

## Statistici rapide

În lista cererilor, sus, vezi numărul total. Pentru breakdown:
- Filtrează pe status pentru a vedea câte sunt pending / approved / rejected
- Filtrează pe county pentru distribuție geografică

---

**Pagini conexe:**
- [Abonați newsletter](02-abonati-newsletter.md)
