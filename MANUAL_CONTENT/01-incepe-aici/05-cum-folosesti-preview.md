# Cum folosești Preview-ul

Preview-ul îți arată **cum va arăta conținutul pe site** înainte să-l publici. Util mai ales când lucrezi cu blocuri DynamicZone (vezi catalogul de blocuri).

## Când e disponibil Preview

Pe orice intrare cu un câmp pentru pagină web:
- Pagina Principală
- Articole
- Evenimente
- Pagini

Pentru categorii, etichete, județe, abonați newsletter etc. — **nu** există Preview.

## Cum îl deschizi

1. Deschide intrarea pe care o editezi
2. **Save** modificările (Preview vede ultimul draft salvat)
3. Apasă butonul **„Open Preview"** (sus dreapta, lângă **Save**/**Publish**)
4. Se va deschide o pagină nouă pe site arătând **draftul curent**, nu versiunea publicată

## Ce e diferit la Preview

- URL-ul are un parametru special (ex: `?status=draft&secret=...`) — așa frontend-ul știe să afișeze draftul
- **Doar tu vezi această pagină** — nu apare publicului
- Layout-ul, imaginile, blocurile arată exact ca în prod

## Workflow recomandat cu Preview

```
1. Editezi conținut
2. Save (draft)
3. Preview → verifici cum arată
4. Modifici dacă e ceva în neregulă → Save din nou
5. Re-Preview → confirmi
6. Publish
```

## Probleme frecvente

| Simptom | De ce se întâmplă | Fix |
|---|---|---|
| Preview-ul arată versiunea veche | Nu ai dat **Save** după ultima modificare | Save → Preview |
| Preview-ul arată „404 Not Found" | Slug-ul e gol sau invalid | Completează **Slug** și salvează |
| Preview-ul nu se deschide | Browser blochează popup-uri | Permite popup-uri pentru `cms.cusens.eu` |
| Imaginea nouă nu se vede în Preview | Imaginea era încărcată dar nu salvată | Save după upload |

## ❗ Important

**Preview NU înlocuiește Publish.** Doar vezi cum *ar* arăta. Pentru a face conținutul live, trebuie **Publish**.

---

**Mergi mai departe la:**
- [Cum adaugi un articol nou](../02-creare-continut/01-cum-adaugi-un-articol-nou.md)
- Sau înapoi la [README](../README.md)
