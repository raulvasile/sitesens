# Abonați newsletter — cum îi vezi și exporți

## Ce sunt
Persoanele care s-au abonat la newsletter de pe pagina `/newsletter`, din formularele de pe pagina de contact, sau din orice bloc **Newsletter CTA** din site.

## Unde îi găsești

Content Manager → **Abonați Newsletter**.

Vezi lista cu toate abonările, **cele mai recente sus**.

## Câmpuri vizibile

Pentru fiecare abonat:

| Câmp | Conținut |
|---|---|
| **Email** | Adresa de email |
| **Name** | Numele (opțional, dacă a fost completat) |
| **Consent date** | Data consimțământului (timestamp automat) |
| **Source** | De unde a venit (ex: `/newsletter`, `/contact`, `homepage`) |
| **Status** | pending / confirmed / unsubscribed |

> **Notă:** abonații rămași în **`pending`** (care nu confirmă double opt-in) pot fi
> **șterși automat** după o perioadă (curățare de retenție GDPR), dacă e activată în
> configurare. Nu e o eroare — sunt înscrieri neconfirmate, fără bază legală de păstrare.

## Status-uri explicate

| Status | Înseamnă |
|---|---|
| **pending** | A trimis formularul, așteaptă confirmare double-opt-in (dacă e activ) |
| **confirmed** | E activ — poate primi emailuri |
| **unsubscribed** | S-a dezabonat — nu îi mai trimite |

⚠️ **Notă:** sistemul curent NU implementează automat double-opt-in (email de confirmare). Toate abonările apar direct ca `confirmed`. Dacă ai nevoie de double-opt-in, vorbește cu tehnicianul.

## Cum exporți lista pentru email-marketing

### Pentru Mailchimp / Brevo / Substack

1. Filtrezi lista după **Status: confirmed**
2. Click pictograma `...` (sus dreapta)
3. **Export** → CSV
4. Importi CSV-ul în platforma ta de email-marketing

### Coloane recomandate la export

- `email`
- `name`
- `consent_date`
- `source`

Restul (IP, status, etc.) **nu** îl imporți în platformele externe.

## Cum dezabonezi pe cineva manual

### Cerere primită prin email
1. Cauți emailul în lista de abonați
2. Click → modifici **Status** la `unsubscribed`
3. Save

### Bulk: dezabonezi pe toți dintr-o sursă
1. Filtrezi după Source (ex: o campanie de test)
2. Selectezi toate
3. Bulk edit (dacă disponibil) sau le modifici unul câte unul

## Cum ștergi un abonat (cerere GDPR)

⚠️ Differența între `unsubscribed` și `delete`:

- **Unsubscribed** = nu mai primește emailuri, dar înregistrarea rămâne (cu IP + dată)
- **Delete** = înregistrarea dispare complet

Pentru cereri GDPR „dreptul la uitare" → **Delete**.

1. Deschizi abonatul
2. **Delete**
3. Confirmă

## Statistici rapide

În lista de abonați:
- **Total** apare sus
- Filtrezi după status pentru breakdown
- Filtrezi după source pentru a vedea care formular e mai eficient

## Cum verifici creșterea

Periodic (ex: lunar):
1. Filtrezi lista după **Created at** într-un interval (ex: ultimele 30 zile)
2. Vezi câți abonați noi ai
3. Compari cu luna anterioară

## Bune practici

- ✅ **Trimite emailuri doar persoanelor cu status `confirmed`** și care **NU** sunt `unsubscribed`
- ✅ **Include link de dezabonare** în fiecare email — obligatoriu legal
- ✅ **Nu vinde / nu partaja** lista cu terți — încălcare GDPR
- ✅ **Backup periodic** — exportează lista cel puțin lunar (în caz de pierdere de date)
- ❌ **Nu importa contacte** care nu s-au abonat explicit
- ❌ **Nu trimite** spre persoane `unsubscribed` chiar dacă „te-ai întâlnit cu ei la eveniment"

## ⚠️ Reguli GDPR cheie

- Pentru fiecare abonat trebuie **consimțământ explicit**, **clear**, **informat**
- Trebuie să le poți **demonstra** consimțământul (de aceea avem `consent_date` — timestamp la înscriere)
- Au dreptul să-și **vadă** datele și să **fie șterși** la cerere
- Datele se păstrează **doar cât timp e necesar** scopului

---

**Pagini conexe:**
- [Cereri de aderare](01-cereri-de-aderare.md)
