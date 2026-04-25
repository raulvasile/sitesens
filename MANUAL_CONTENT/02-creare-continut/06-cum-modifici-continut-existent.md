# Cum modifici un conținut existent

## Ce vei face
Editezi un articol, eveniment, pagină sau membru deja publicat și publici modificările.

## Pași

### 1. Găsește intrarea
Content Manager → secțiunea potrivită (Articole / Evenimente / Pagini / Echipă) → caută în listă.

**Caută rapid:**
- Bara de search (sus în listă) — caută după titlu
- Sortează coloanele click pe header
- Filtrează după categorie / status / dată din butonul **„Filters"**

### 2. Click pe intrare → editezi câmpurile

Modifici ce ai nevoie. Vei observa că lângă titlul intrării apare un **indicator portocaliu „Modified"** când există modificări nesalvate.

### 3. Save

**Save** doar = ai salvat draft, **dar versiunea publicată rămâne neschimbată**.

### 4. Publish

Apasă **Publish** ca modificările să apară pe site.

⚠️ **Asta e capcana clasică:** mulți cred că **Save** publică. Nu — trebuie **Publish** explicit.

## Indicator status — ce vezi

În lista de articole/evenimente, fiecare rând arată statusul:

| Status | Ce înseamnă |
|---|---|
| 🟢 **Published** | Pe site, fără modificări nepublicate |
| 🟡 **Modified** | Pe site, dar **există un draft cu modificări** care nu sunt încă live |
| ⚪ **Draft** | Doar în CMS, nu e pe site |

Dacă vezi 🟡 **Modified** la o intrare publicată, **nu ai apăsat Publish**.

## Cum revii la versiunea publicată

Dacă ai făcut modificări pe care nu vrei să le păstrezi:
1. Deschizi intrarea
2. **„Discard changes"** (sus dreapta) — drop-down lângă Save
3. Pierzi draftul; versiunea publicată rămâne

## Cum revii la o versiune mai veche

Strapi păstrează un istoric al versiunilor publicate:
1. Deschizi intrarea
2. Sus dreapta, lângă Publish, vezi un drop-down cu **„Versions"**
3. Alegi o versiune anterioară
4. Click → o vezi
5. **Restore** ca să o faci versiunea curentă

⚠️ Funcția există doar pentru intrări cu **draft & publish** (articole, evenimente, pagini, echipă).

## Workflow recomandat pentru update mare

```
1. Open intrare publicată
2. Editezi (multe schimbări)
3. Save (draft)
4. Preview → verifici
5. Mai modifici? Save din nou.
6. Când ești mulțumit/ă → Publish
```

## Dacă altcineva editează în paralel

Strapi nu blochează editarea simultană. Dacă tu și un coleg editați aceeași intrare:
- Cine apasă **Save** primul → modificările lui sunt salvate
- Cine apasă **Save** după → suprascrie modificările primului

Coordonați-vă verbal sau pe Slack înainte să modificați aceeași intrare.

---

**Pagini conexe:**
- [Draft și Publish](../01-incepe-aici/04-draft-si-publish.md)
- [Cum folosești Preview](../01-incepe-aici/05-cum-folosesti-preview.md)
- [Cum ascunzi sau ștergi conținut](07-cum-ascunzi-sau-stergi-continut.md)
