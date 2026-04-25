# Cum adaugi un membru de echipă

## Ce vei face
Adaugi o persoană în colecția **Echipă**. Va apărea automat în:
- Blocurile **Team Grid** unde sunt configurate
- Pagina `/despre-noi` (tabul „Echipă" sau „Conducere", după cum bifezi)
- Lista de autori disponibili pentru articole

## Înainte să începi

- Ai gata: nume, funcție, fotografie (1:1, 800×800 ideal), bio scurt
- (opțional) text lung pentru modal cu detalii
- (opțional) link-uri sociale (LinkedIn, Twitter etc.)

## Pași

### 1. Mergi la Echipă
Content Manager → **Echipă** → **„Create new entry"**.

### 2. Câmpuri principale

| Câmp | Ce pui |
|---|---|
| **Nume** | „Maria Popescu" |
| **Funcție** | „Coordonator politici climatice" |
| **Bio** | 1–2 propoziții; afișat pe card-ul mic |
| **Detalii (modal)** | Text lung; afișat când utilizatorul dă click pe card |
| **Fotografie** | Pătrat sau aproape pătrat (ideal 800×800) |
| **Ordine afișare** | Număr (1, 2, 3…). Cei cu număr mai mic apar primii. |
| **Conducere** | ⚠️ Toggle critic — vezi mai jos |

### 3. Toggle „Conducere" — important

| Stare | Unde apare |
|---|---|
| **🟢 Bifat (`is_leadership: true`)** | Tabul „Conducere" de pe `/despre-noi` |
| **⚪ Debifat** | Tabul „Echipă" de pe `/despre-noi` |

Dacă debifezi după ce era bifat, persoana se mută între tab-uri.

### 4. Linkuri sociale

Click **„Add an entry to social_links"**:

| Câmp | Ce pui |
|---|---|
| **Platform** | linkedin / twitter / facebook / instagram / etc. |
| **URL** | Link-ul complet (cu `https://`) |

Repetă pentru fiecare rețea.

### 5. Save + Publish

Membrul apare:
- Pe `/despre-noi` în tabul corespunzător
- Ca opțiune în dropdown-ul **Autor** la articole
- În orice **Team Grid** configurat să afișeze grupul lui

## Verificare finală

- [ ] Numele și funcția apar pe card-ul de pe `/despre-noi`
- [ ] Click pe card deschide modal cu **Detalii**
- [ ] Fotografia nu e tăiată ciudat (pătrat e safest)
- [ ] Linkurile sociale (dacă există) au icon-uri și se deschid corect

## Cum modifici ordinea în care apar

Schimbi **„Ordine afișare"** la fiecare membru. Cei cu numărul mai mic apar primii.

Recomandare: lasă spații (10, 20, 30) ca să poți insera ușor pe cineva între ei mai târziu.

## Cum scoți un membru

Două opțiuni:

**Temporar** — **Unpublish**. Dispare de pe site dar rămâne în CMS.

**Definitiv** — **Delete**.

⚠️ Dacă persoana e **autorul unor articole**, vor apărea „fără autor". Mai bine păstrează intrarea și doar **Unpublish**.

---

**Pagini conexe:**
- [Reguli pentru imagini](../04-imagini/02-reguli-pentru-imagini.md)
- [Cum adaugi un articol](01-cum-adaugi-un-articol-nou.md) (autorul vine din Echipă)
