# Cum modifici meniul (header)

## Ce vei face
Adaugi, scoți, redenumești sau reordonezi link-urile din meniul de sus al site-ului.

## Unde se află

Single Types → **Header** (Navigation).

Modificările se aplică **tuturor paginilor**.

## Structura meniului

Header-ul are **patru zone**:

| Zonă | Pe site |
|---|---|
| **Logo** | Stânga sus, link spre `/` |
| **Main menu** | Mijloc — link-urile principale |
| **Secondary menu** | Dreapta — link-uri secundare + buton CTA (ultimul item) |
| **Mobile extra links** | Doar pe mobil — link-uri suplimentare în meniul hamburger |

## Cum modifici logo-ul

1. Single Types → **Header**
2. Câmpul **Logo** → Click → încarci sau alegi imagine din Media Library
3. Recomandat: SVG, 200×60 (sau similar)
4. **Save**

## Cum adaugi un link în meniul principal

1. Single Types → **Header**
2. Scroll la **Main menu**
3. **„Add an entry to main_menu"**
4. Completezi:

| Câmp | Ce pui |
|---|---|
| **Label** | Textul vizibil (ex: „Despre noi") |
| **URL** | Link-ul (ex: `/despre-noi` sau `https://extern.com`) |
| **Order** | Număr; cei cu număr mai mic apar primii |
| **Open in new tab** | Bifează doar pentru link-uri externe |

5. **Save**

## Cum adaugi un sub-meniu (dropdown)

Link-urile din meniul principal pot avea **copii** (children) — care apar ca dropdown la hover.

1. Editezi un link existent (sau creezi unul nou)
2. La **children** → **„Add an entry"**
3. Completezi label + URL pentru fiecare sub-link
4. Setezi `order` pentru fiecare

Pe site, link-ul părinte va arăta o săgeată în jos. Hover → apare dropdown.

⚠️ Doar **un nivel** de adâncime (părinte → copii). Nu poți avea copii ai copiilor.

## Cum reordonezi link-urile

Două opțiuni:

### A. Schimbi numerele de **order**
1. Editezi fiecare link
2. Modifici **order**: 1, 2, 3, 4
3. Save

Recomandare: lasă spații (10, 20, 30, 40) ca să poți insera ușor între ele.

### B. Drag & drop (dacă disponibil)
1. La fiecare item, în lista repeatable, există un handle de drag (`⋮⋮`)
2. Trage în sus/jos
3. Save

## Meniul secundar (dreapta)

Adăugare identică, doar că folosești câmpul **Secondary menu**.

⚠️ **Ultimul item din secondary menu devine automat butonul CTA** (lime, vizibil mai puternic). Folosește-l pentru îndemnul principal: „Donează", „Înscrie-te".

## Mobile extra links

Pe mobil, meniul hamburger are mai mult spațiu. Aici poți pune link-uri secundare care nu încap în meniul desktop:
- „Politica de confidențialitate"
- „Termeni și condiții"
- „Sitemap"

## Cum scoți un link

1. Editezi Header
2. Click pe pictograma **🗑️** la link-ul respectiv
3. Save

## Verificare după modificare

1. Refresh `https://cusens.eu` în browser (Ctrl+F5 / Cmd+Shift+R pentru bypass cache)
2. Verifici desktop, tabletă (resize fereastra), mobil (sau DevTools → modul mobile)
3. Click pe fiecare link nou să confirmi că merge

## Sfaturi

- **Maxim 5–7 link-uri în main menu**, altfel devine aglomerat
- Folosește **labels scurte** (1-2 cuvinte)
- Pentru pagini frecvente, evită URL-uri lungi (mai bine creezi un slug scurt)
- **Testează pe mobil** — meniul hamburger arată diferit

---

**Pagini conexe:**
- [Cum modifici footer-ul](02-cum-modifici-footer-ul.md)
- [Cum construiești o pagină simplă](../02-creare-continut/04-cum-construiesti-o-pagina-simpla.md) (după ce creezi pagina, o adaugi în meniu)
