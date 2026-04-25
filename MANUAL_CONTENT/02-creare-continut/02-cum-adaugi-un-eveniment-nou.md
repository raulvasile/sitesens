# Cum adaugi un eveniment nou

## Ce vei face
Creezi un eveniment care apare la `/evenimente` și are propria pagină la `/evenimente/[slug]`.

## Înainte să începi

- Ai gata: titlu, dată/oră, locație, descriere, cover image
- Decizi tipul: **dezbatere**, **acțiune**, **marș**, sau **online**

## Pași

### 1. Mergi la Evenimente
Content Manager → **Evenimente** → **„Create new entry"**.

### 2. Câmpuri esențiale

| Câmp | Ce pui |
|---|---|
| **Titlu** | Ex: „Dezbatere — Educația în România 2030" |
| **Slug** | Auto din titlu. Editează doar dacă vrei. |
| **Tip eveniment** | Alege din enum: dezbatere / actiune / mars / online |
| **Data început** | Date + oră (calendar widget) |
| **Data sfârșit** | Opțional. Dacă lipsește, se afișează doar ora de start. |
| **Imagine copertă** | 1920×1080 ideal |

### 3. Locație

Trei câmpuri pentru locație, **toate opționale**:

| Câmp | Exemplu | Apare ca |
|---|---|---|
| **Locație (scurt)** | „Casa de Cultură" | Fallback dacă lipsește venue |
| **Loc (venue)** | „Sala Mare, Casa de Cultură a Studenților" | Numele complet al locului |
| **Oraș** | „Cluj-Napoca" | Apare ca chip pe card-ul evenimentului |

Pentru evenimente **online**, completează doar **Locație** (ex: „Zoom" sau „YouTube Live").

### 4. Descriere

Câmpul **„Descriere"** acceptă text formatat: paragrafe, headings, liste, citate. Folosește editorul de blocuri integrat (toolbar deasupra textului).

### 5. Înscrieri

| Câmp | Ce pui |
|---|---|
| **Locuri disponibile** | Opțional. Număr max participanți. |
| **Locuri ocupate** | Cât e completat (manual) — apare ca „X libere" |
| **Înscrieri deschise** | Toggle. Dacă debifezi, butonul „Rezervă" devine „Înscrieri închise" |
| **URL înregistrare** | Opțional. Dacă completezi, butonul te trimite acolo în loc de `/inscrie-te?event=…` |

### 6. Eveniment evidențiat (Featured)

Toggle **„Eveniment evidențiat"** — dacă bifezi, apare **mare în topul listei** `/evenimente` cu un layout special.

⚠️ Recomandat doar **un singur eveniment featured** la un moment dat.

### 7. SEO

Completează ca la articole. Vezi [Cum completezi SEO](../08-seo-si-distribuire/01-cum-completezi-seo.md).

### 8. Save → Preview → Publish

Apare la `https://cusens.eu/evenimente/[slug]`.

## După eveniment — adaugi galerie social

Când evenimentul s-a încheiat, întoarce-te în CMS și completează:

### „Descriere secțiune Pe rețele"
Text scurt deasupra grilei cu link-uri sociale. Ex:
> „Găsești poze de la marș aici:"

### „Postări social media"
Lista de link-uri spre postări de Facebook / Instagram / TikTok / YouTube cu poze și video-uri:
1. Click **„Add an entry to social_posts"**
2. **Platform** — alege din dropdown
3. **URL** — paste link-ul postării
4. Repetă pentru fiecare postare
5. **Save** + **Publish**

## Verificare finală

- [ ] Apare în lista `/evenimente`
- [ ] Data + ora corectă (nu uita timezone — se folosește ora locală)
- [ ] Locația completă
- [ ] Tipul corect (vine cu un chip color)
- [ ] Cover image arată bine
- [ ] Buton „Rezervă" duce unde trebuie

## Anularea unui eveniment

Două opțiuni:

**Anulare temporară** (e încă în calcul) — intri la eveniment → **Unpublish**. Dispare de pe site dar rămâne în CMS.

**Anulare definitivă** — schimbă titlul în „[ANULAT] Titlu original" și debifează **Înscrieri deschise**. Lasă-l publicat ca utilizatorii care aveau link-ul să vadă mesajul.

---

**Pagini conexe:**
- [Reguli pentru imagini](../04-imagini/02-reguli-pentru-imagini.md)
- [Cum modifici un conținut existent](06-cum-modifici-continut-existent.md)
- [Cum ascunzi sau ștergi conținut](07-cum-ascunzi-sau-stergi-continut.md)
