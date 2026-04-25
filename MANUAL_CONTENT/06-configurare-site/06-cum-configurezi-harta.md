# Cum configurezi harta României (filiale)

## Ce vei face
Adaugi sau modifici filialele care apar pe harta interactivă a României. Click pe județ → tooltip cu nume + buton spre pagina filialei.

## Unde se află

Harta e un **bloc Dynamic Zone** numit **„Hartă România"** (`blocks.romania-map`). Apare pe orice pagină unde a fost adăugat (de obicei `/comunitate` sau `/despre-noi`).

Pentru a o configura, mergi la pagina care conține blocul:
- Single Types → **Pagină Comunitate** (sau ce pagină ai)
- Sau Collection Types → **Pagini** → găsești pagina cu harta

## Câmpuri principale ale blocului

| Câmp | Ce pui |
|---|---|
| **Kicker** | Eyebrow mic deasupra titlului (opțional) |
| **Heading** | Titlu (ex: „Filiale active") |
| **Subheading** | Text scurt sub titlu (opțional) |
| **Background color** | „paper" (alb) sau „cream" |
| **Chapters** | Lista filialelor (vezi mai jos) |

## Cum adaugi o filială nouă

1. Scroll la câmpul **Chapters** (în interiorul blocului Hartă)
2. **„Add an entry to chapters"**
3. Completezi:

| Câmp | Ce pui |
|---|---|
| **Code** | Codul ISO 3166-2 al județului — vezi tabelul de mai jos |
| **Name** | Numele filialei (opțional). Dacă lasi gol, se folosește numele județului |
| **URL** | Link-ul către pagina filialei (intern: `/filiale/cluj`, extern: `https://...`) |
| **Open in new tab** | Toggle. **Bifat = deschide în tab nou.** Debifat = navighează în aceeași filă. |

4. Save

## Coduri ISO pentru județe

Codurile sunt **majuscule, 1-2 litere**, conforme cu ISO 3166-2:RO.

### Exemple frecvente

| Județ | Code |
|---|---|
| București | `B` |
| Cluj | `CJ` |
| Timiș | `TM` |
| Iași | `IS` |
| Constanța | `CT` |
| Brașov | `BV` |
| Sibiu | `SB` |
| Mureș | `MS` |
| Prahova | `PH` |
| Dolj | `DJ` |

### Toate cele 41 de județe + București

`AB AR AG BC BH BN BT BV BR B BZ CL CS CJ CT CV DB DJ GL GR GJ HR HD IL IS IF MM MH MS NT OT PH SM SJ SB SV TR TM TL VS VL VN`

### Greșeli frecvente
- ❌ `Cluj` — trebuie `CJ`
- ❌ `cj` — trebuie majuscule
- ❌ `BUC` pentru București — corect e doar `B`
- ❌ `BI` pentru București — corect e doar `B`

## Cum modifici o filială existentă

1. În lista **Chapters**, identifici filiala
2. Modifici câmpurile (Code, Name, URL, Open in new tab)
3. Save

⚠️ Schimbarea **Code-ului** schimbă județul pe care apare pe hartă — verifică să fie cel corect.

## Cum scoți o filială

1. În lista **Chapters**, click pe pictograma **🗑️**
2. Save

Pe hartă, județul respectiv va deveni **gri** (inactiv) — click-ul nu mai face nimic.

## Open in new tab — ce să alegi?

| Opțiune | Recomandat pentru |
|---|---|
| **🟢 Bifat (default)** | Link-uri externe (Facebook, Instagram, alte site-uri ale filialelor); link-uri către PDF-uri sau resurse în alt format |
| **⚪ Debifat** | Link-uri **interne** către alte pagini ale site-ului SENS (ex: `/filiale/cluj`) — utilizatorul rămâne în navigare normală cu butonul Back |

## Verificare după modificare

1. Refresh pagina cu harta în browser
2. Județul trebuie să fie **verde închis** (active) — nu gri
3. Hover pe județ (desktop) → tooltip apare
4. Click pe județ:
   - Cu Open in new tab **bifat**: tab nou se deschide
   - Cu Open in new tab **debifat**: navigare în aceeași filă
5. Pe mobil: tap = tooltip; al doilea tap = navigare

## Stilul vizual al județelor

| Stare | Culoare pe hartă |
|---|---|
| **Activ** (are filială) | Verde închis |
| **Hover/Selected** | Lime (verde deschis) |
| **Inactiv** (fără filială) | Gri deschis |

## Sfat — tooltip text

Numele afișat în tooltip vine din câmpul **Name** al filialei. Dacă lași gol, se folosește numele oficial al județului. Dacă vrei un nume mai personal (ex: „Filiala SENS Cluj-Napoca"), îl pui aici.

---

**Pagini conexe:**
- [Cum modifici pagina de comunitate](05-cum-modifici-pagina-de-comunitate.md)
- [Cum adaugi un bloc](../03-dynamic-zone/02-cum-adaugi-un-bloc.md)
