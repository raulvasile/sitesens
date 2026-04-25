# Cum îți schimbi parola

## Când să o faci
- La primul login (e o parolă provizorie)
- Periodic (recomandat la 6 luni)
- Imediat dacă suspectezi că cineva ți-a aflat-o
- Dacă ai folosit aceeași parolă pe alt site care a fost compromis

## Cum o schimbi din interiorul CMS

### Pași
1. Loghează-te în CMS
2. Click pe **avatarul tău** (sus dreapta)
3. **Profile** (sau pictograma de utilizator)
4. Scroll la secțiunea **„Change password"**
5. Completezi:
   - **Current password** — parola actuală
   - **New password** — parola nouă
   - **Confirm new password** — la fel
6. **Save**

## Reguli pentru o parolă bună

### ✅ Folosește
- **Minim 12 caractere**
- **Litere mari + litere mici**
- **Cifre**
- **Cel puțin un simbol** (ex: `!@#$%^&*`)
- **Unică** — diferită de alte conturi

### ❌ Evită
- Cuvinte din dicționar (ex: „parola123")
- Numele tău, anul nașterii
- „qwerty", „123456"
- Aceeași parolă cu alte servicii

## Recomandare: Password Manager

Folosește un **password manager** care generează și salvează parole complexe automat:
- **1Password** (paid, foarte bun)
- **Bitwarden** (gratuit, open-source)
- **iCloud Keychain** (gratuit, doar Apple)
- **Google Password Manager** (gratuit, în Chrome)

Avantaje:
- Nu trebuie să ții minte parolele
- Generează automat parole sigure
- Auto-fill când te loghezi

## Dacă ai uitat parola

### De pe pagina de login
1. Mergi la `https://cms.cusens.eu/admin`
2. Click **„Forgot password?"** sub formular
3. Introdu emailul tău
4. Vei primi un link pe email (verifică și folderul Spam)
5. Click pe link → setezi parolă nouă

### Dacă nu primești emailul
1. Verifici Spam / Promotions
2. Verifici că emailul e cel corect (cel cu care ai contul)
3. Aștepți 5 minute (poate fi întârziere)
4. Dacă tot nu primești → contactezi **administratorul** ca să-ți resetez parola manual

## Doi factori (2FA)

Momentan, CMS-ul **NU** are 2FA implementat nativ. Pentru securitate adițională:
- Folosește o parolă **foarte puternică**
- Nu o salvezi în browser pe computere publice
- Te deloghezi la sfârșitul sesiunii

Dacă ai nevoie de 2FA pentru securitate sporită, vorbește cu tehnicianul — există plugin-uri Strapi.

## Securitate generală cont

| Practică | De ce |
|---|---|
| **Logout** la sfârșitul zilei | În caz că laptopul e furat / accesat |
| **Nu partaja contul** cu colegii | Fiecare să aibă cont propriu pentru audit trail |
| **Verifici „Last login"** ocazional | Vezi dacă cineva s-a logat fără tine |
| **Notifică imediat dacă vezi activitate suspectă** | Tehnician poate dezactiva contul |

## Deconectare (logout)

1. Click pe avatarul tău (sus dreapta)
2. **Logout**

Sesiunile expiră automat după **7 zile** de inactivitate.

---

**Pagini conexe:**
- [Cum te loghezi în CMS](../01-incepe-aici/01-cum-te-loghezi.md)
- [Cui te adresezi când ceva nu merge](04-cui-te-adresezi.md)
