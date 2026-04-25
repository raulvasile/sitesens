# Cum reordonezi, ștergi sau duplici blocuri

## 🔄 Reordonare (drag & drop)

### Pași
1. În câmpul **„Conținut"**, vezi blocurile listate vertical
2. La fiecare bloc, în partea stângă, e o **iconiță cu 6 puncte** (`⋮⋮`) — handle de drag
3. **Apasă și ține** pe această iconiță
4. **Trage** blocul în sus sau în jos
5. Eliberezi în poziția dorită
6. **Save**

### Tip
Pentru reordonări mari, e mai rapid:
1. Colaps toate blocurile (vezi mai jos)
2. Reordonezi în starea minimală
3. Le re-deschizi

## 📂 Colaps / expand bloc

Când blocurile sunt multe și lungi, e dificil de navigat. Soluția:

1. La fiecare bloc, **click pe titlul lui** (sau pictograma `▼` din dreapta sus)
2. Blocul se minimează — vezi doar tipul și un sumar
3. Click din nou să-l re-deschizi

Așa vezi tot conținutul ca o **listă scurtă** și navighezi mai ușor.

## 🗑️ Ștergere bloc

### Pași
1. Click pe pictograma **🗑️** din dreapta sus a blocului
2. Confirmă (Strapi întreabă „Are you sure?")
3. **Save** ca să persiste ștergerea

⚠️ **Înainte de Save, ștergerea e reversibilă** (un refresh la pagină recuperează blocul). După Save, e definitivă.

## 📋 Duplicare bloc

Câteodată vrei un al doilea bloc de același tip cu configurație similară (ex: două Card Grid-uri identice ca structură).

### Opțiunea A — buton Duplicate (dacă există)
Sub iconița de drag, în unele versiuni Strapi există o pictogramă **📋 Duplicate**:
1. Click pe ea
2. Apare un bloc nou identic, sub cel original
3. Modifici ce e diferit (titlu etc.)
4. Save

### Opțiunea B — manual
1. Adaugi un bloc nou de același tip (vezi [Cum adaugi un bloc](02-cum-adaugi-un-bloc.md))
2. Recopiezi câmpurile din original
3. Save

## ➕ Inserare la mijloc

Implicit, **„Add a component"** adaugă blocul la **sfârșit**. Dacă vrei să inserezi între două blocuri existente:

### Opțiunea A — adaugă la sfârșit, apoi mută
1. Adaugi blocul nou (apare jos)
2. Drag-and-drop până la poziția dorită
3. Save

### Opțiunea B — buton „Insert here" (între blocuri)
În unele versiuni Strapi, când treci mouse-ul **între** două blocuri, apare un buton mic **„+"** chiar acolo. Click pe el → alegi tipul → blocul se inserează în acea poziție.

## 🔄 Conversie tip de bloc

**NU se poate.** Dacă ai pus un Text Block dar voiai un Quote, trebuie să:
1. Creezi noul bloc de tipul corect
2. Copiezi conținutul manual
3. Ștergi blocul vechi

## Workflow recomandat — refacere pagină

```
1. Decizi structura nouă pe hârtie / Figma
2. Eventual notezi: „blocul X rămâne, blocul Y dispare, adaug Z"
3. Editezi pagina:
   a. Ștergi blocurile care nu mai sunt necesare
   b. Adaugi blocurile noi
   c. Le configurezi
   d. Reordonezi totul în ordinea finală
4. Save
5. Preview → verifici
6. Publish
```

---

**Următoarea pagină:** [Catalog de blocuri](04-catalog-blocuri.md)
