# Cum ascunzi sau ștergi conținut

## Trei opțiuni — alege cu grijă

| Opțiune | Vizibil pe site? | Vizibil în CMS? | Recuperabil? |
|---|---|---|---|
| **Unpublish** | ❌ | ✅ | ✅ ușor (Publish din nou) |
| **Delete** | ❌ | ❌ | ⚠️ doar din backup |
| **Modificare conținut** | ✅ (versiunea modificată) | ✅ | ✅ |

## 🟡 Unpublish — recomandat în 90% din cazuri

Conținutul dispare de pe site dar rămâne salvat în CMS.

### Când folosești
- Eveniment anulat sau amânat
- Articol cu informație depășită temporar
- Membru care iese în concediu / pauză
- Pagină în refacere

### Pași
1. Deschide intrarea
2. Sus dreapta, lângă **Publish**, vei vedea **Unpublish**
3. Click → confirmă
4. Pe site dispare imediat

### Cum publici la loc
Deschizi din nou intrarea → **Publish**.

## 🔴 Delete — definitiv

Conținutul dispare complet din CMS și de pe site. **Nu se mai poate recupera ușor.**

### Când folosești
- Conținut creat din greșeală
- Spam sau test
- Membru care a părăsit organizația definitiv (și nu are articole pe el)

### Pași
1. Deschide intrarea
2. Buton **Delete** (sus dreapta)
3. Confirmă

### ⚠️ Verificări înainte de Delete

| Tip | Verifică |
|---|---|
| **Articol** | Are imagini unice care nu sunt folosite altundeva? Verifică Media Library înainte. |
| **Eveniment** | A trecut peste 1 an? Mai bine păstrează ca arhivă. |
| **Membru de echipă** | E autorul vreunui articol? Articolele rămân fără autor — mai bine **Unpublish**. |
| **Pagină** | Are secțiuni copii? Acestea rămân orfane. |
| **Categorie** | Sunt articole în ea? Articolele rămân fără categorie — mută-le mai întâi. |

## 🗑️ Bulk delete (mai multe odată)

În lista oricărei colecții:
1. Bifezi checkbox-urile din stânga rândurilor
2. Sus apare un buton **„Delete X entries"**
3. Confirmă

⚠️ **Foarte periculos.** Folosește doar când ești sigur — nu există „undo".

## ❓ Pot recupera ceva șters din greșeală?

Există backup zilnic al CMS-ului. Dacă realizezi în următoarele **24 ore** că ai șters ceva important, contactează tehnicianul **imediat** — există o șansă de recuperare.

După 14 zile, backup-ul e suprascris.

## Workflow recomandat

```
Vrei să scoți temporar?     → Unpublish
Vrei să modifici?           → Edit + Publish
Vrei să scoți pentru totdeauna?
  ↓
  Verifici dependențe (autor, categorie, etc.)
  ↓
  Mai bine Unpublish dacă ai dubii
  ↓
  Delete doar dacă ești 100% sigur
```

---

**Pagini conexe:**
- [Cum modifici un conținut existent](06-cum-modifici-continut-existent.md)
- [Greșeli comune](../09-ajutor/01-greseli-comune.md)
