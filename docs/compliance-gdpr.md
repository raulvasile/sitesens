# Compliance GDPR & cookies — ghid de referință

> Cadru tehnic/operațional pentru conformitatea site-ului SENS. **Nu e consultanță
> juridică.** SENS prelucrează date din *categorie specială* (opinii politice) → înainte
> de go-live, textele și registrul de prelucrări trebuie validate de un avocat / DPO.
>
> Ultima actualizare: 10 iunie 2026. Vezi și `docs/audit-2026-06-10.md` (securitate).

---

## 1. De ce SENS e „nivel greu": date din categorie specială

GDPR **Art. 9** interzice, ca regulă, prelucrarea datelor care dezvăluie **opinii politice**
(categorie specială, alături de sănătate, religie, etnie). Pe site, mai multe acțiuni
dezvăluie opinia politică *prin natura lor*:

- înscrierea ca membru (`/inscrie-te`) → opinie politică explicită;
- semnarea unei petiții a partidului (`/petitii/[slug]`) → opinie politică;
- (posibil) abonarea la newsletter-ul partidului.

Deci nu prelucrăm doar date „obișnuite" (nume, email) ci **date sensibile** → e nevoie de o
**excepție din Art. 9(2)**:

- **9(2)(a)** — consimțământ **explicit** (de aceea consimțămintele noastre sunt obligatorii,
  granulare, și forțate `true` server-side — NU decorative).
- **9(2)(d)** — o entitate cu scop politic poate prelucra datele **membrilor / foștilor membri /
  contactelor regulate**, cu garanții, fără a le divulga în afară fără consimțământ.

**Consecință de proiectare:** consimțămintele = baza legală. Codul respectă asta (vezi §3).

---

## 2. Două regimuri legale (se aplică simultan)

| Regim | Ce reglementează | Unde ne atinge |
|---|---|---|
| **ePrivacy** (RO: Legea 506/2004) | stocarea/citirea de info în browser (cookies, localStorage, pixeli) | analytics, embed-uri social → **consimțământ ÎNAINTE de a seta** |
| **GDPR** (Reg. 679/2016 + Legea 190/2018) | prelucrarea datelor personale | formulare, membri, semnături, newsletter |

Cookie consent-ul rezolvă ePrivacy. Formularele țin de GDPR. Ambele sunt necesare.

---

## 3. Ce colectează fiecare formular (starea reală a codului)

| Formular | Rută | Câmpuri personale | Consimțăminte | Bază legală | Anti-abuz |
|---|---|---|---|---|---|
| **Înscriere membru** | `/inscrie-te` | prenume, nume, email, telefon, data nașterii, județ, oraș, adresă, motivație, interese | `consent_gdpr` + `consent_statute` + `consent_data_processing` (toate req.) + `consent_newsletter` (opțional) | Art. 9(2)(a)+(d) | rate-limit; ⬜ încă client-POST (vezi SSR hardening) |
| **Semnătură petiție** | `/petitii/[slug]` | prenume, nume, email, județ, oraș, comentariu | `consent_gdpr` (req.) | Art. 9(2)(a) | honeypot + rate-limit + dedup + **double opt-in** (email) |
| **Newsletter** | `/newsletter` | email, nume | `consent_date` (req., server-side) | Art. 6(1)(a) | honeypot + rate-limit + status forțat `pending` |
| **Contact** | bloc `contact-form` | nume, email, subiect, mesaj | `consent_gdpr` (req.) | Art. 6(1)(a)/(f) | honeypot + rate-limit + status forțat `new` |

Toate au: whitelist de câmpuri server-side, `verification_token`/`notes` marcate `private`,
PII neexpus prin API public (confirmat la audit). Minimizarea datelor: respectată.

---

## 4. Checklist GDPR (formulare) — stare

- [x] Consimțământ specific, granular, per formular
- [x] Double opt-in unde e cazul (petiții, newsletter)
- [x] Securitatea datelor (audit 2026-06-10: mass-assignment blocat, rate-limit, honeypot)
- [x] Minimizarea datelor
- [ ] **Politica de confidențialitate completă** — ruta `/politica-confidentialitate` există,
      conținut editabil în CMS; **owner-ul trebuie să pună textul juridic corect** (cine e
      operatorul, scopuri, temeiuri, durată păstrare, drepturi, DPO/contact).
- [ ] **Text de informare la punctul de colectare** — avem disclaimere scurte + link; de
      confirmat că sunt suficiente (ideal: 1-2 fraze + link, la fiecare formular).
- [ ] **Registru de prelucrări (Art. 30)** + eventual **DPIA (Art. 35)** — obligatorii la
      prelucrare de date sensibile la scară. Document juridic, nu cod.
- [ ] **Procedură pentru drepturile persoanei** (acces/ștergere/rectificare/portabilitate) —
      operațional; tehnic datele sunt în Strapi, ușor de exportat/șters.
- [ ] **Perioada de păstrare** definită per tip de date (ex: semnături petiție cât timp e
      relevantă campania; cereri respinse — șterse după X luni).

---

## 5. Checklist cookies/analytics (ePrivacy) — DE FĂCUT (Epic 5+6)

Stare curentă: `Analytics.svelte` încarcă GTM **necondiționat** → **neconform** (semnalat la audit).

Ce înseamnă „compliant" tehnic:

1. [ ] **Niciun tracker ne-esențial înainte de consimțământ** — inversează logica: GA/GTM
   pornesc doar *după* accept.
2. [ ] **Consimțământ granular pe categorii** (necesare = mereu on; analytics = opțional;
   marketing = opțional). NU doar „Accept tot".
3. [ ] **„Refuz" la fel de vizibil ca „Accept"** — fără dark-patterns (autoritățile amendează
   exact butonul „Accept" mare + „Refuz" ascuns).
4. [ ] **Google Consent Mode v2** — DOAR dacă folosim Google (GA4). Setează `denied` înainte
   de GTM, actualizează la `granted` pe accept. Obligatoriu tehnic din 2024.
5. [ ] **Embed-urile social = cookies!** — TikTok / Facebook / Instagram (sunt în CSP) setează
   cookies terță-parte. Soluție: **click-to-load** (placeholder → embed real doar la click) sau
   gate în spatele consimțământului.
6. [ ] **Buton „Setări cookies"** în footer (reconfigurare oricând).
7. [ ] **Dovada consimțământului** — stocată (cookie/localStorage) cu timestamp + versiune.

---

## 6. Decizia strategică: GA4 vs. cookieless (NEDECIS)

Alegerea schimbă mult efortul de la Epic 5.

### Opțiunea A — GA4 (prin GTM) + cookie banner
- ➕ analytics bogat, integrare Google Ads.
- ➖ banner complet + Consent Mode v2 + o parte din trafic dispare (refuzuri) + transfer date
  către Google (un terț de gestionat în politică).

### Opțiunea B — Cookieless self-hosted (Umami / Matomo fără cookies) ⭐ recomandat
- ➕ **fără cookies → în multe interpretări fără banner** (doar mențiune în politică); datele
  rămân la voi (self-host); imagine privacy-friendly (coerent cu mesajul unui partid ecologist).
- ➖ statistici mai simple (fără funnels avansate/Ads); trebuie găzduit.

### Opțiunea C — Cookieless SaaS (Plausible)
- ➕ cookieless, fără banner, setup rapid.
- ➖ plătit lunar; datele trec printr-un terț (de menționat în politică).

**Recomandare tehnică:** B (cookieless self-hosted). Pentru un partid, tracking-ul Google
agresiv e o vulnerabilitate de imagine, nu doar de compliance. Cookieless reduce Epic 5 la
o notificare informativă (fără gating) — rămâne doar problema embed-urilor social (click-to-load).

> **Decizie de luat de owner** înainte de Epic 5/6. Odată aleasă, se consemnează aici + în roadmap.

---

## 7. Monitorizare (Epic 6, parte tehnică — nu compliance)
- Erori: Sentry (server `hooks.server.ts` + client) + Strapi.
- Uptime: ruta `/health` există → UptimeRobot / Better Stack.
- Notă: dacă tool-ul de monitorizare procesează IP-uri/date, intră și el în politică.

---

## 8. Ce e cod vs. ce e juridic

| Zonă | Cod (noi) | Juridic (avocat/DPO/owner) |
|---|---|---|
| Consimțăminte formulare | ✅ implementat | validare texte |
| Cookie banner / gating | ⬜ Epic 5 | — |
| Analytics condiționat | ⬜ Epic 5/6 | alegere tool |
| Politica de confidențialitate | ruta + CMS gata | **textul** |
| Registru prelucrări / DPIA | — | **document** |
| Perioade păstrare | putem implementa cleanup | **definire** |
| Drepturile persoanei | export/ștergere ușoare | **procedură** |

Concluzie: partea de **cod** e în mare parte pregătită sau ușor de făcut. Blocajul real e
**decizia de analytics** (§6) + **conținutul juridic** (politică, registru) care ține de owner.
