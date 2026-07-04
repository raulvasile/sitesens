# Inventar PII — harta datelor personale

> Sursă unică de adevăr pentru **ce date personale există, unde, cine le poate citi**.
> Util pentru: (1) prevenirea regresiilor de tip C1 (leak prin populate — vezi
> `audit-2026-07-02.md`), (2) registrul de prelucrări GDPR Art. 30, (3) răspuns la
> cererile persoanei vizate (acces/ștergere). **Actualizează-l când adaugi/modifici
> un câmp personal sau o permisiune.**

## Legendă acces
- **Public create** = oricine poate POST-a (formular public, cu honeypot + rate-limit + consimțământ).
- **Admin-only read** = citibil DOAR din panoul admin Strapi (autentificat). NICIUN `find`/`findOne` public.
- **`private`** = câmpul are `"private": true` în schema → eliminat din ORICE răspuns REST/GraphQL,
  inclusiv prin `populate`. Vizibil doar în content-manager (admin).

## Content-types cu PII

| Content-type | Rută formular | Câmpuri personale | Toate `private`? | Acces API | Bază legală |
|---|---|---|---|---|---|
| `petition-signature` | `/petitii/[slug]` | first_name, last_name, email, county, city, comment | ✅ da | create + count + verify (custom). **NU** find/findOne. | Art. 9(2)(a) |
| `membership-request` | `/inscrie-te` | first_name, last_name, email, phone, birth_date, county, city, address, motivation, interests | ✅ da (+ `notes` private) | create only. Admin-only read. | Art. 9(2)(a)+(d) |
| `newsletter-subscriber` | `/newsletter` | email, name | ✅ da | create only. Admin-only read. | Art. 6(1)(a) |
| `contact-submission` | bloc `contact-form` | name, email, subject, message | ✅ da | create only. Admin-only read. | Art. 6(1)(a)/(f) |

## Garanții tehnice (verificate — audit 2026-07-02)
1. **Flag-uri `private`** pe toate câmpurile PII → nu ies prin API nici măcar prin `populate`
   dintr-un tip public relaționat (fix-ul pentru leak-ul `petition.signatures`).
2. **PII lockdown în seed** (`index.ts` `setupPublicPermissions`) — revocă activ orice
   `find`/`findOne`/`update`/`delete` public pe cele 4 tipuri, indiferent de token.
3. **Controllere custom** cu whitelist strict de câmpuri, consimțăminte forțate `true` server-side,
   status forțat, honeypot, răspuns idempotent (fără oracle de apartenență).
4. **Retenție** (opțional, `RETENTION_ENABLED=true`): șterge semnături neverificate / abonați
   pending / cereri respinse după ferestre configurabile.

## Regulă la fiecare câmp/relație nou(ă)
- Câmp personal nou → adaugă `"private": true` în schema + rândul aici.
- Relație nouă dinspre un tip **public** către un tip cu PII → testează live:
  `curl '.../api/<public>?populate[<rel>][fields][0]=email'` **nu** trebuie să întoarcă PII.
