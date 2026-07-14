import type { Core } from '@strapi/strapi';

/**
 * Etichete + descrieri în română pentru câmpurile din panoul admin Strapi.
 * Config de UX pentru editori (NU conținut). Rulat la bootstrap, idempotent.
 * API-ul rămâne în engleză; doar interfața admin devine prietenoasă.
 */
export async function configureAdminLabels(strapi: Core.Strapi) {
  // Mapare: UID content type/componentă → { numeField: 'Etichetă în română' }
  const contentTypeLabels: Record<string, Record<string, FieldLabel>> = {
    // ───────────────── COLLECTION TYPES ─────────────────
    'api::article.article': {
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe pagina articolului și ca text principal pe cardul din lista /stiri.' },
      slug: { label: 'URL (slug)', description: 'Ultima parte din URL: /stiri/<slug>. Folosește litere mici, cifre și liniuțe.' },
      excerpt: { label: 'Rezumat', description: 'Apare pe cardul din lista /stiri și ca descriere în Google și pe Facebook.' },
      content: { label: 'Conținut', description: 'Corpul articolului — combini blocuri (text, citate, galerii, video, statistici).' },
      cover_image: { label: 'Imagine copertă', description: 'Apare mare deasupra titlului în pagina articolului și pe cardul din lista /stiri.' },
      category: { label: 'Categorie', description: 'Categoria principală — afișată ca chip color sub titlu și folosită la filtrare în /stiri.' },
      author: { label: 'Autor', description: 'Membru din colecția Echipă — apare în byline-ul articolului.' },
      tags: { label: 'Etichete', description: 'Apar la finalul articolului și permit filtrare /stiri?tag=...' },
      reading_time: { label: 'Timp de citire (min)', description: 'Apare în byline lângă autor.' },
      featured_stat: { label: 'Statistică evidențiată', description: 'Apare ca highlight separat (număr mare + label) deasupra corpului articolului.' },
      attachments: { label: 'Documente atașate', description: 'PDF / Word / Excel afișate ca listă descărcabilă la finalul articolului, înainte de etichete.' },
      seo: { label: 'SEO', description: 'Cum apare articolul în Google și pe rețele sociale.' },
    },
    'api::category.category': {
      name: { label: 'Nume', description: 'Apare ca chip color pe cardurile articolelor și ca filtru în lista /stiri.' },
      slug: { label: 'URL (slug)', description: 'Folosit în URL-ul de filtrare: /stiri?categorie=<slug>.' },
      color: { label: 'Culoare', description: 'Culoarea chip-ului afișat pe cardul articolului. Cod hex.' },
      description: { label: 'Descriere', description: 'Apare pe pagina de filtrare a categoriei (sub numele ei).' },
      parent: { label: 'Categorie părinte', description: 'Dacă e completat, această categorie devine sub-categorie a celei alese.' },
      children: { label: 'Subcategorii', description: 'Listă auto cu sub-categoriile care au această categorie ca părinte.' },
      articles: { label: 'Articole', description: 'Listă auto cu articolele care au această categorie.' },
    },
    'api::tag.tag': {
      name: { label: 'Nume', description: 'Apare la finalul articolului ca chip cu # în față.' },
      slug: { label: 'URL (slug)', description: 'Folosit în URL-ul de filtrare: /stiri?tag=<slug>.' },
      articles: { label: 'Articole', description: 'Listă auto cu articolele care au această etichetă.' },
    },
    'api::event.event': {
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe pagina evenimentului și pe cardul din lista /evenimente.' },
      slug: { label: 'URL (slug)', description: 'Ultima parte din URL: /evenimente/<slug>.' },
      description: { label: 'Descriere', description: 'Corpul evenimentului — apare sub banda cu data și locația. Acceptă formatare rich text.' },
      start_date: { label: 'Data început', description: 'Data și ora afișată mare pe pagina evenimentului și pe card.' },
      end_date: { label: 'Data sfârșit', description: 'Apare în intervalul din banda evenimentului. Lasă gol dacă nu se cunoaște.' },
      event_type: { label: 'Tip eveniment', description: 'Apare ca chip color pe card și pagină. Folosit și la filtrare /evenimente?type=...' },
      location_name: { label: 'Locație (scurt)', description: 'Folosit ca fallback dacă lipsește „Loc (venue)".' },
      venue: { label: 'Loc (venue)', description: 'Numele complet al locului — apare în banda „Locație" pe pagina evenimentului.' },
      city: { label: 'Oraș', description: 'Apare ca chip pe card și sub locație în banda evenimentului.' },
      location_coords: { label: 'Coordonate GPS', description: 'Folosite intern (rezervat pentru hartă viitoare).' },
      cover_image: { label: 'Imagine copertă', description: 'Apare mare sub banda cu data, pe pagina evenimentului.' },
      max_participants: { label: 'Număr maxim participanți', description: 'Apare în banda „Capacitate" — număr total locuri.' },
      spots_taken: { label: 'Locuri ocupate', description: 'Folosit pentru a calcula „X libere" în banda Capacitate.' },
      is_featured: { label: 'Eveniment evidențiat', description: 'Dacă bifat, apare mare în topul listei /evenimente cu layout special.' },
      registration_url: { label: 'URL înregistrare', description: 'Dacă e completat, butonul „Rezervă loc" duce aici. Altfel duce la /inscrie-te?event=<slug>.' },
      registration_open: { label: 'Înscrieri deschise', description: 'Dacă debifezi, butonul „Rezervă loc" devine „Înscrieri închise".' },
      social_posts_description: { label: 'Descriere secțiune Pe rețele', description: 'Apare ca text scurt deasupra grilei de postări sociale.' },
      social_posts: { label: 'Postări social media', description: 'Apar la finalul paginii evenimentului ca grilă de carduri către Facebook/Instagram/etc.' },
      ical_url: { label: 'Link calendar iCal', description: 'Folosit pentru butonul „Adaugă în calendar".' },
      seo: { label: 'SEO', description: 'Cum apare evenimentul în Google și pe rețele sociale.' },
    },
    'api::team-member.team-member': {
      name: { label: 'Nume', description: 'Apare pe cardul din blocurile Team Grid și ca opțiune în dropdown-ul de Autor pentru articole.' },
      role: { label: 'Funcție', description: 'Apare sub nume pe cardul din Team Grid.' },
      bio: { label: 'Biografie', description: 'Apare sub funcție pe cardul din Team Grid (text scurt).' },
      details: { label: 'Detalii extinse', description: 'Apar într-un modal când utilizatorul dă click pe cardul membrului.' },
      photo: { label: 'Fotografie', description: 'Apare sus pe cardul din Team Grid și în modalul cu detalii.' },
      social_links: { label: 'Rețele sociale', description: 'Apar ca iconițe pe cardul membrului și în modal.' },
      display_order: { label: 'Ordine afișare', description: 'Controlează poziția în Team Grid. Numerele mai mici apar primele.' },
      is_leadership: { label: 'Conducere', description: 'Dacă bifezi, apare în Team Grid cu mode=leadership (ex: tab „Conducere" din /despre-noi).' },
      articles: { label: 'Articole', description: 'Listă auto cu articolele scrise de această persoană.' },
    },
    'api::page.page': {
      title: { label: 'Titlu', description: 'Apare în breadcrumb (Acasă > Titlu) și ca H1 implicit.' },
      slug: { label: 'URL (slug)', description: 'Pagina e accesibilă la /<slug>.' },
      content: { label: 'Conținut pagină', description: 'Combini blocuri (Hero, Text, Stats, etc.) pentru a construi pagina.' },
      sections: { label: 'Secțiuni (tab-uri)', description: 'Dacă adaugi secțiuni, ele apar ca tab-uri sub conținutul principal.' },
      seo: { label: 'SEO', description: 'Cum apare pagina în Google și pe rețele sociale.' },
    },
    'api::section.section': {
      title: { label: 'Titlu tab', description: 'Apare ca buton de tab în partea de sus a paginii părinte.' },
      content: { label: 'Conținut secțiune', description: 'Apare în tab-ul corespunzător când utilizatorul îl selectează.' },
      display_order: { label: 'Ordine afișare', description: 'Controlează poziția tab-ului în pagina părinte.' },
      page: { label: 'Pagină părinte', description: 'Pagina în care apare acest tab.' },
    },
    'api::newsletter-subscriber.newsletter-subscriber': {
      email: { label: 'Email', description: 'Adresa la care se trimit newsletter-ele.' },
      name: { label: 'Nume', description: 'Numele utilizatorului (opțional, completat de el la abonare).' },
      consent_date: { label: 'Data consimțământ', description: 'Setată automat la abonare. Necesară legal pentru GDPR.' },
      source: { label: 'Sursă', description: 'De pe ce pagină s-a abonat utilizatorul.' },
      status: { label: 'Status', description: 'pending / confirmed / unsubscribed. Trimite emailuri doar la confirmed.' },
      ip_address: { label: 'Adresă IP', description: 'IP-ul de la care s-a abonat. Necesar legal pentru GDPR.' },
    },
    'api::membership-request.membership-request': {
      first_name: { label: 'Prenume', description: 'Completat de utilizator în formularul /inscrie-te.' },
      last_name: { label: 'Nume', description: 'Completat de utilizator în formularul /inscrie-te.' },
      email: { label: 'Email', description: 'Adresa de contact a aplicantului.' },
      phone: { label: 'Telefon', description: 'Numărul de telefon al aplicantului.' },
      birth_date: { label: 'Data nașterii', description: 'Necesară pentru verificarea vârstei minime.' },
      county: { label: 'Județ', description: 'Județul ales de aplicant la înscriere.' },
      city: { label: 'Localitate', description: 'Localitatea aplicantului.' },
      address: { label: 'Adresă', description: 'Adresa completă a aplicantului.' },
      motivation: { label: 'Motivație', description: 'Text liber în care aplicantul explică de ce vrea să se înscrie.' },
      interests: { label: 'Domenii de interes', description: 'Bifate de aplicant din lista Domenii de Interes.' },
      consent_gdpr: { label: 'Consimțământ GDPR', description: 'Bifat de aplicant. Obligatoriu altfel cererea nu se trimite.' },
      consent_statute: { label: 'Acceptă statutul', description: 'Bifat de aplicant — confirmă că acceptă statutul partidului.' },
      consent_data_processing: { label: 'Confirmare date corecte', description: 'Bifat de aplicant — confirmă că datele introduse sunt corecte.' },
      consent_newsletter: { label: 'Abonare newsletter', description: 'Opțional — dacă a bifat, va primi newsletter-ul.' },
      status: { label: 'Status cerere', description: 'Setezi tu manual: pending / approved / rejected.' },
      notes: { label: 'Note interne', description: 'Note vizibile doar în CMS — folosește pentru triere.' },
    },
    // ───────────────── SINGLE TYPES ─────────────────
    'api::homepage.homepage': {
      content: { label: 'Conținut pagină', description: 'Toate secțiunile homepage-ului — combini blocuri în ordinea în care apar pe / .' },
      seo: { label: 'SEO', description: 'Cum apare homepage-ul în Google și pe rețele sociale.' },
    },
    'api::county.county': {
      name: { label: 'Nume', description: 'Apare în dropdown-ul de Județ din formularul /inscrie-te.' },
      slug: { label: 'URL (slug)', description: 'Folosit intern pentru filtrare.' },
      order: { label: 'Ordine', description: 'Controlează ordinea în dropdown-uri.' },
    },
    'api::interest-area.interest-area': {
      name: { label: 'Nume', description: 'Apare ca opțiune bifabilă în formularul /inscrie-te.' },
      slug: { label: 'URL (slug)', description: 'Folosit intern pentru identificare.' },
      icon: { label: 'Iconiță', description: 'Emoji care apare lângă numele opțiunii. Opțional.' },
      description: { label: 'Descriere', description: 'Text scurt afișat sub numele opțiunii (opțional).' },
      order: { label: 'Ordine', description: 'Controlează ordinea în lista de bifare.' },
    },
    'api::inscription-page.inscription-page': {
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe /inscrie-te.' },
      subtitle: { label: 'Subtitlu', description: 'Apare ca lead sub titlu.' },
      steps: { label: 'Pași formular', description: 'Apar ca indicator de progres în partea de sus a formularului.' },
      personal_section_heading: { label: 'Titlu secțiune date personale', description: 'Apare deasupra grupului de câmpuri date personale.' },
      address_section_heading: { label: 'Titlu secțiune adresă', description: 'Apare deasupra grupului de câmpuri adresă.' },
      labels: { label: 'Etichete câmpuri', description: 'Texte pentru fiecare câmp și placeholder al formularului.' },
      validation: { label: 'Mesaje validare', description: 'Mesaje afișate când utilizatorul greșește la completare.' },
      consents: { label: 'Consimțăminte', description: 'Lista checkbox-urilor de la finalul formularului.' },
      submit_text: { label: 'Text buton trimite', description: 'Apare pe butonul final de trimitere a formularului.' },
      submitting_text: { label: 'Text buton în procesare', description: 'Apare pe buton în timp ce se trimite cererea.' },
      prev_step_text: { label: 'Text buton anterior', description: 'Apare pe butonul de navigare la pasul anterior.' },
      next_step_text: { label: 'Text buton următor', description: 'Apare pe butonul de navigare la pasul următor.' },
      success: { label: 'Secțiune succes', description: 'Ce vede utilizatorul după trimiterea cu succes a formularului.' },
      seo: { label: 'SEO', description: 'Cum apare /inscrie-te în Google.' },
    },
    'api::newsletter-page.newsletter-page': {
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe /newsletter.' },
      description: { label: 'Descriere', description: 'Apare ca lead sub titlu.' },
      form: { label: 'Configurare formular', description: 'Etichete și placeholder-uri pentru formularul de abonare.' },
      benefits_heading: { label: 'Titlu beneficii', description: 'Apare deasupra listei de beneficii ale abonării.' },
      benefits: { label: 'Beneficii', description: 'Listă de motive pentru care ai abona la newsletter.' },
      seo: { label: 'SEO', description: 'Cum apare /newsletter în Google.' },
    },
    'api::community-page.community-page': {
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe /comunitate.' },
      subtitle: { label: 'Subtitlu', description: 'Apare ca lead sub titlu.' },
      platforms: { label: 'Platforme sociale', description: 'Apar ca lista de carduri cu link spre fiecare profil.' },
      posts_heading: { label: 'Titlu postări', description: 'Apare deasupra grilei de embed-uri postări sociale.' },
      embed_fallback_text: { label: 'Text fallback embed', description: 'Apare dacă embed-urile sociale nu se încarcă.' },
      features_heading: { label: 'Titlu motive', description: 'Apare deasupra listei de motive să ne urmărești.' },
      features: { label: 'Motive să ne urmărești', description: 'Lista de avantaje pentru a urmări conturile sociale.' },
      seo: { label: 'SEO', description: 'Cum apare /comunitate în Google.' },
    },
    'api::privacy-policy-page.privacy-policy-page': {
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe /politica-confidentialitate.' },
      subtitle: { label: 'Subtitlu', description: 'Apare ca lead sub titlu.' },
      content: { label: 'Conținut', description: 'Corpul textului legal — rich text cu paragrafe, headings, liste.' },
      cmf_text: { label: 'Text CMF', description: 'Mențiunea legală despre mandatarul financiar — apare la finalul paginii.' },
      last_updated: { label: 'Ultima actualizare', description: 'Apare ca timestamp jos pe pagină.' },
      seo: { label: 'SEO', description: 'Cum apare politica în Google.' },
    },
    'api::events-page.events-page': {
      eyebrow: { label: 'Kicker header', description: 'Text mic mono deasupra titlului mare al paginii /evenimente.' },
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe /evenimente.' },
      title_italic: { label: 'Titlu italic', description: 'Continuare italică a titlului (linie nouă, accent vizual).' },
      lead: { label: 'Text introducere', description: 'Apare ca paragraf introductiv sub titlu.' },
      featured_label: { label: 'Etichetă featured', description: 'Apare pe cardul evenimentului evidențiat (mare în topul listei).' },
      featured_cta_primary: { label: 'CTA principal featured', description: 'Text buton principal pe cardul evenimentului evidențiat.' },
      featured_cta_secondary: { label: 'CTA secundar featured', description: 'Text buton secundar pe cardul evenimentului evidențiat.' },
      location_label: { label: 'Etichetă locație', description: 'Apare ca prefix înaintea numelui orașului pe carduri.' },
      interval_label: { label: 'Etichetă interval', description: 'Apare ca prefix înaintea orelor (start–end) pe carduri.' },
      spots_template: { label: 'Template locuri', description: 'Format pentru afișare locuri ocupate. Folosește {taken} și {max}.' },
      list_reserve_cta: { label: 'CTA listă rezervă', description: 'Text buton de rezervare pe fiecare card din listă.' },
      filter_all_label: { label: 'Etichetă filtru toate', description: 'Apare pe butonul „Toate" din bara de filtre tip eveniment.' },
      host_section_kicker: { label: 'Kicker secțiune filiale', description: 'Text mic deasupra titlului din banda „Vrei să găzduim un eveniment?".' },
      host_section_title: { label: 'Titlu secțiune filiale', description: 'Titlul mare al benzii de încheiere a paginii.' },
      host_section_body: { label: 'Text secțiune filiale', description: 'Paragraf descriptiv în banda de încheiere.' },
      host_section_cta: { label: 'CTA secțiune filiale', description: 'Text buton din banda de încheiere.' },
      host_section_url: { label: 'URL CTA filiale', description: 'Link buton din banda de încheiere.' },
      host_section_visible: { label: 'Afișează secțiunea filiale', description: 'Toggle pentru ascunderea benzii de încheiere.' },
      empty_state: { label: 'Text listă goală', description: 'Apare când nu există evenimente care să corespundă filtrelor.' },
      seo: { label: 'SEO', description: 'Cum apare /evenimente în Google.' },
    },
    'api::navigation.navigation': {
      logo: { label: 'Logo', description: 'Apare în stânga sus în header, pe toate paginile.' },
      main_menu: { label: 'Meniu principal', description: 'Linkurile centrale din header (desktop) și hamburger (mobile).' },
      secondary_menu: { label: 'Meniu secundar', description: 'Apar în dreapta header-ului. Ultimul item devine automat butonul CTA lime.' },
      mobile_extra_links: { label: 'Linkuri extra mobil', description: 'Apar doar în meniul hamburger pe mobil — pentru link-uri secundare.' },
      mobile_home_label: { label: 'Etichetă Acasă mobil', description: 'Text pentru link-ul Acasă din meniul hamburger.' },
      mobile_language_text: { label: 'Text limbă mobil', description: 'Text mic afișat la finalul meniului hamburger.' },
    },
    'api::footer.footer': {
      logo: { label: 'Logo footer', description: 'Apare în footer pe toate paginile (poate fi diferit de cel din header).' },
      tagline: { label: 'Tagline', description: 'Frază scurtă afișată sub logo în footer.' },
      footer_links: { label: 'Linkuri footer', description: 'Linkuri afișate în coloana centrală a footer-ului.' },
      social_links: { label: 'Rețele sociale', description: 'Iconițe sociale afișate în footer. Folosite și pe pagina de contact.' },
      legal_text: { label: 'Text legal', description: 'Apare jos de tot în footer (copyright, mențiuni legale).' },
      eu_text: { label: 'Text UE', description: 'Mențiune fonduri europene (opțional, apare în footer).' },
      privacy_link_text: { label: 'Text link confidențialitate', description: 'Apare în footer ca link către politica de confidențialitate.' },
      privacy_link_url: { label: 'URL link confidențialitate', description: 'Link către politica de confidențialitate.' },
    },
    'api::contact-page.contact-page': {
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe /contact.' },
      subtitle: { label: 'Subtitlu', description: 'Apare ca lead sub titlu.' },
      header_eyebrow: { label: 'Eyebrow header', description: 'Text mic mono deasupra titlului. Lasă gol dacă nu vrei eyebrow.' },
      form_kicker: { label: 'Kicker formular', description: 'Text mic deasupra titlului formularului de contact.' },
      email: { label: 'Email contact', description: 'Adresa la care se trimit mesajele formularului. Apare și în secțiunea date contact.' },
      address: { label: 'Adresă sediu', description: 'Apare în secțiunea date contact.' },
      schedule: { label: 'Program', description: 'Apare în secțiunea date contact (ore de funcționare).' },
      newsletter_title: { label: 'Titlu newsletter', description: 'Apare deasupra formularului de abonare la newsletter (în partea de jos).' },
      newsletter_description: { label: 'Descriere newsletter', description: 'Apare ca text introductiv pentru formularul de newsletter.' },
      form_title: { label: 'Titlu formular', description: 'Apare deasupra câmpurilor formularului de contact.' },
      info_heading: { label: 'Titlu secțiune date contact', description: 'Apare deasupra grupului email/adresă/program.' },
      social_heading: { label: 'Titlu secțiune rețele sociale', description: 'Apare deasupra iconițelor sociale din pagina de contact.' },
      form: { label: 'Configurare formular', description: 'Etichete și placeholder-uri pentru formularul de contact.' },
      validation: { label: 'Mesaje validare', description: 'Mesaje afișate când utilizatorul greșește la completare.' },
      seo: { label: 'SEO', description: 'Cum apare /contact în Google.' },
    },
    'api::donate-page.donate-page': {
      title: { label: 'Titlu', description: 'Apare ca H1 sus pe /doneaza.' },
      header_eyebrow: { label: 'Eyebrow header', description: 'Text mic mono deasupra titlului mare.' },
      description: { label: 'Descriere', description: 'Apare ca lead sub titlu.' },
      amounts_kicker: { label: 'Kicker secțiune sume', description: 'Eyebrow deasupra titlului secțiunii cu sume preset.' },
      amounts_heading: { label: 'Titlu secțiune sume', description: 'Apare deasupra grilei cu sume predefinite.' },
      amounts: { label: 'Sume predefinite', description: 'Apar ca butoane în grila de selecție sumă.' },
      preset_amounts_json: { label: 'Sume predefinite (legacy JSON)', description: 'Format vechi. Folosește „Sume predefinite" în loc.' },
      custom_amount_label: { label: 'Etichetă altă sumă', description: 'Text pe butonul care permite introducerea unei sume personalizate.' },
      donate_button_text: { label: 'Text buton donează', description: 'Apare pe butonul final de donare.' },
      iban: { label: 'IBAN', description: 'Apare în card-ul IBAN (cu buton de copiere).' },
      bank_name: { label: 'Nume bancă', description: 'Apare în header-ul cardului IBAN.' },
      transfer_kicker: { label: 'Kicker secțiune transfer', description: 'Eyebrow deasupra titlului secțiunii Transfer bancar.' },
      transfer_heading: { label: 'Titlu secțiune transfer', description: 'Apare deasupra cardului IBAN.' },
      transfer_notes: { label: 'Note transfer', description: 'Apare sub IBAN (instrucțiuni transfer).' },
      transparency_kicker: { label: 'Kicker secțiune transparență', description: 'Eyebrow deasupra secțiunii cu alocare procentuală.' },
      transparency_heading: { label: 'Titlu secțiune transparență', description: 'Apare în sidebar-ul cu alocarea procentuală a banilor.' },
      transparency: { label: 'Elemente transparență', description: 'Apar ca bare procentuale în sidebar-ul de transparență.' },
      cmf_kicker: { label: 'Kicker mandatar financiar', description: 'Eyebrow deasupra textului CMF.' },
      cmf_text: { label: 'Text mandatar CMF', description: 'Mențiunea legală obligatorie. Apare la finalul paginii /doneaza.' },
      seo: { label: 'SEO', description: 'Cum apare /doneaza în Google.' },
    },
    'api::site-theme.site-theme': {
      brand: { label: 'Culori Brand', description: 'Paleta de verzi și lime — afectează butoane, accente, headings pe tot site-ul.' },
      surfaces: { label: 'Culori Suprafețe', description: 'Fundaluri principale, fundaluri secundare, culori text. Afectează tot site-ul.' },
      accents: { label: 'Culori Accent & Stare', description: 'Culori pentru chip-uri secundare și mesaje de eroare.' },
      typography: { label: 'Tipografie', description: 'Fonturile folosite pentru titluri, text body și mono.' },
    },
  };

  /** Reusable description for the optional `anchor_id` field on every block. */
  const ANCHOR: FieldLabel = {
    label: 'ID ancoră',
    description: 'Permite link direct către acest bloc cu URL #<id>. Folosește litere mici, cifre și liniuțe.',
  };

  const componentLabels: Record<string, Record<string, FieldLabel>> = {
    // ───────────────── HERO BLOCKS ─────────────────
    'blocks.hero': {
      anchor_id: ANCHOR,
      variant: { label: 'Variantă', description: 'Aspect Hero: default (mare) sau compact (redus pe înălțime).' },
      title: { label: 'Titlu', description: 'Apare ca titlu mare al heroului. Folosește {{rotating}} ca placeholder pentru cuvintele rotative.' },
      subtitle: { label: 'Subtitlu / lead', description: 'Apare ca paragraf sub titlul mare al heroului.' },
      cta_text: { label: 'Text buton principal', description: 'Apare pe butonul lime principal din hero.' },
      cta_link: { label: 'Link buton principal', description: 'Unde duce butonul principal când e apăsat.' },
      cta_secondary_text: { label: 'Text buton secundar', description: 'Apare pe butonul outline secundar din hero.' },
      cta_secondary_link: { label: 'Link buton secundar', description: 'Unde duce butonul secundar când e apăsat.' },
      background_image: { label: 'Imagine fundal', description: 'Apare ca background al întregului hero. Opțional.' },
      rotating_words: { label: 'Cuvinte rotative', description: 'Cuvintele care se rotesc în titlu la poziția {{rotating}}.' },
      featured_link: { label: 'Link evidențiat (legacy)', description: 'Card mic cu link în zona dreaptă a heroului. Înlocuit de „Următorul eveniment".' },
      next_event: { label: 'Următorul eveniment (auto)', description: 'Card auto-populat cu următorul eveniment, în zona dreaptă a heroului.' },
      meta_text: { label: 'Text meta cu dot live', description: 'Apare deasupra titlului, cu un punct verde animat în stânga.' },
      chip_text: { label: 'Text chip foto', description: 'Etichetă afișată peste imaginea de background a heroului.' },
      chip_visible: { label: 'Afișează chip foto', description: 'Toggle pentru ascunderea chip-ului peste imaginea heroului.' },
    },
    'blocks.hero-refined': {
      anchor_id: ANCHOR,
      background_image: { label: 'Imagine fundal', description: 'Acoperă tot heroul cu overlay verde închis. Obligatorie pentru această variantă.' },
      top_meta_left: { label: 'Meta sus stânga', description: 'Text mic mono în colțul stânga sus al heroului.' },
      top_meta_right: { label: 'Meta sus dreapta', description: 'Text mic mono în colțul dreapta sus al heroului.' },
      title: { label: 'Titlu mare', description: 'Apare în coloana stângă a heroului, uppercase.' },
      title_italic_accent: { label: 'Accent italic verde-lime', description: 'Linie nouă italică în titlu, evidențiată cu lime.' },
      description: { label: 'Descriere', description: 'Apare în coloana dreaptă a heroului.' },
      cta_text: { label: 'Text buton principal', description: 'Apare pe butonul lime din coloana dreaptă.' },
      cta_link: { label: 'Link buton principal', description: 'Unde duce butonul principal.' },
      cta_secondary_text: { label: 'Text buton secundar', description: 'Apare pe butonul outline din coloana dreaptă.' },
      cta_secondary_link: { label: 'Link buton secundar', description: 'Unde duce butonul secundar.' },
    },
    'blocks.hero-editorial': {
      anchor_id: ANCHOR,
      top_meta_left: { label: 'Meta sus stânga', description: 'Text mic mono în partea de sus stânga a heroului editorial.' },
      top_meta_center: { label: 'Meta sus centru', description: 'Text mic mono în partea de sus centru a heroului editorial.' },
      top_meta_right: { label: 'Meta sus dreapta', description: 'Text mic mono în partea de sus dreapta a heroului editorial.' },
      title: { label: 'Titlu enorm', description: 'Apare ca titlu uriaș (până la 200px) pe centru.' },
      title_emphasis: { label: 'Cuvânt evidențiat', description: 'Cuvânt din titlu cu fundal lime și ușoară rotire.' },
      manifesto_kicker: { label: 'Kicker manifest', description: 'Eyebrow deasupra paragrafului manifest (coloana stânga sub titlu).' },
      manifesto_lead: { label: 'Lead manifest', description: 'Paragraf mare introductiv în coloana stângă sub titlu.' },
      cta_text: { label: 'Text buton principal', description: 'Apare în coloana stângă sub manifest.' },
      cta_link: { label: 'Link buton principal', description: 'Unde duce butonul principal.' },
      cta_secondary_text: { label: 'Text buton secundar', description: 'Apare în coloana stângă, lângă butonul principal.' },
      cta_secondary_link: { label: 'Link buton secundar', description: 'Unde duce butonul secundar.' },
      directions_kicker: { label: 'Kicker direcții', description: 'Eyebrow deasupra listei de direcții (coloana mijloc).' },
      directions: { label: 'Direcții', description: 'Listă numerotată afișată în coloana mijloc sub titlu.' },
      pull_quote_text: { label: 'Text citat', description: 'Citat mare afișat în coloana dreaptă.' },
      pull_quote_author_name: { label: 'Autor citat', description: 'Numele autorului afișat sub citat.' },
      pull_quote_author_meta: { label: 'Detalii autor', description: 'Text mic mono afișat sub numele autorului citatului.' },
      pull_quote_author_photo: { label: 'Fotografie autor', description: 'Imagine mică rotundă lângă numele autorului citatului.' },
    },
    'blocks.hero-direction': {
      code: { label: 'Cod direcție', description: 'Apare ca număr deasupra numelui în lista de direcții din Hero Editorial.' },
      name: { label: 'Nume direcție', description: 'Apare ca titlu al direcției în lista din Hero Editorial.' },
      body: { label: 'Descriere scurtă', description: 'Frază scurtă afișată sub numele direcției.' },
    },
    'blocks.word-rotation': {
      words: { label: 'Cuvinte', description: 'Lista cuvintelor care se rotesc în titlul Hero (array JSON).' },
      interval_ms: { label: 'Interval schimbare', description: 'La câte milisecunde se schimbă cuvântul.' },
      highlight: { label: 'Evidențiere culoare', description: 'Culoarea folosită pentru cuvântul rotativ.' },
    },
    'blocks.featured-link': {
      label: { label: 'Etichetă mică', description: 'Text mic mono deasupra titlului din cardul featured din Hero.' },
      title: { label: 'Titlu', description: 'Titlul cardului featured din Hero.' },
      url: { label: 'Link', description: 'Unde duce cardul când e apăsat.' },
      icon: { label: 'Iconiță', description: 'Emoji afișat în colțul cardului featured.' },
      auto_next_event: { label: 'Auto: următorul eveniment', description: 'Dacă bifat, cardul preia automat datele următorului eveniment.' },
    },
    'blocks.next-event': {
      label: { label: 'Etichetă', description: 'Text mic mono deasupra titlului evenimentului în cardul Next Event.' },
      cta_text: { label: 'Text CTA', description: 'Text afișat ca link în cardul Next Event.' },
      icon: { label: 'Iconiță', description: 'Emoji afișat în cardul Next Event.' },
      empty_label: { label: 'Etichetă când nu există eveniment', description: 'Apare în card când nu există evenimente viitoare.' },
      empty_url: { label: 'URL când nu există eveniment', description: 'Link folosit când nu există evenimente viitoare.' },
      hide_when_empty: { label: 'Ascunde cardul dacă nu există eveniment', description: 'Toggle pentru a ascunde complet cardul când lipsesc evenimente.' },
    },

    // ───────────────── CONTENT BLOCKS ─────────────────
    'blocks.text-block': {
      anchor_id: ANCHOR,
      body: { label: 'Conținut', description: 'Editor rich text — apare ca paragrafe, headings, liste pe pagină.' },
      alignment: { label: 'Aliniere', description: 'Aliniere text: stânga / centru / dreapta.' },
    },
    'blocks.quote': {
      anchor_id: ANCHOR,
      text: { label: 'Citat', description: 'Textul mare al citatului afișat pe pagină.' },
      author: { label: 'Autor', description: 'Numele autorului afișat sub citat.' },
      role: { label: 'Funcție', description: 'Funcția autorului afișată sub nume.' },
    },
    'blocks.image-gallery': {
      anchor_id: ANCHOR,
      images: { label: 'Imagini', description: 'Lista imaginilor afișate în galerie sau carusel.' },
      layout: { label: 'Aranjament', description: 'grid (toate vizibile) sau carousel (slide-uri).' },
      caption: { label: 'Legendă galerie', description: 'Apare ca eyebrow mono sub întreaga galerie.' },
    },
    'blocks.video-embed': {
      anchor_id: ANCHOR,
      url: { label: 'Link video', description: 'URL YouTube sau Vimeo. Se generează automat embed-ul.' },
      caption: { label: 'Legendă video', description: 'Apare ca text mic sub video.' },
    },
    'blocks.spacer': {
      anchor_id: ANCHOR,
      height: { label: 'Înălțime', description: 'Cât spațiu vertical liber adaugă între blocuri.' },
    },
    'blocks.page-header': {
      anchor_id: ANCHOR,
      eyebrow: { label: 'Eyebrow stânga', description: 'Text mic mono afișat în partea de sus stânga, deasupra titlului.' },
      meta: { label: 'Meta dreapta', description: 'Text mic mono afișat în partea de sus dreapta, deasupra titlului.' },
      title: { label: 'Titlu', description: 'Titlul mare afișat ca H1.' },
      title_italic: { label: 'Parte italică din titlu', description: 'Continuare italică a titlului, accent verde.' },
      lead: { label: 'Lead', description: 'Paragraf scurt afișat sub titlu.' },
      continuation: { label: 'Continuare titlu', description: 'Linie suplimentară de titlu sub titlul principal.' },
      continuation_highlight: { label: 'Cuvânt evidențiat din continuare', description: 'Cuvânt din continuare evidențiat cu lime.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a întregii benzi page header.' },
    },

    // ───────────────── LISTS & GRIDS ─────────────────
    'blocks.card-grid': {
      anchor_id: ANCHOR,
      heading: { label: 'Titlu secțiune', description: 'Apare ca titlu mare deasupra grilei de carduri.' },
      columns: { label: 'Coloane', description: 'Numărul de coloane pe desktop: 2, 3 sau 4.' },
      cards: { label: 'Carduri', description: 'Lista cardurilor afișate în grilă, în ordinea de aici.' },
    },
    'blocks.card-grid-item': {
      title: { label: 'Titlu', description: 'Apare ca H3 pe card.' },
      description: { label: 'Descriere', description: 'Apare ca text scurt sub titlu.' },
      points: { label: 'Puncte cheie', description: 'Bullet-uri cu săgeți, sub descriere.' },
      link_text: { label: 'Text link', description: 'Apare ca buton link în josul cardului. Ignorat dacă există „Detalii extinse".' },
      link_url: { label: 'URL link', description: 'Unde duce link-ul cardului.' },
      image: { label: 'Imagine inline', description: 'Apare ca bandă deasupra titlului în card.' },
      background_image: { label: 'Imagine fundal', description: 'Acoperă tot cardul, în spatele textului. Opțional.' },
      overlay: { label: 'Overlay color', description: 'Strat color peste imaginea fundal pentru lizibilitate text. Bifat = ON.' },
      icon: { label: 'Pictogramă', description: 'Emoji sau ID icon afișat în josul cardului. Ignorat dacă există link.' },
      details: { label: 'Detalii extinse', description: 'Dacă completat, click pe card deschide un modal cu acest text. Are precedență față de link.' },
    },
    'blocks.stats-counter': {
      anchor_id: ANCHOR,
      items: { label: 'Statistici', description: 'Lista statisticilor afișate ca număr mare + label scurt.' },
    },
    'blocks.stat-item': {
      number: { label: 'Număr', description: 'Apare ca cifră mare în card-ul de statistică.' },
      label: { label: 'Etichetă', description: 'Apare ca text mic sub număr.' },
    },
    'blocks.program-points': {
      anchor_id: ANCHOR,
      items: { label: 'Puncte program', description: 'Lista de direcții ale programului partidului.' },
      show_link: { label: 'Afișează link', description: 'Toggle pentru afișarea unui link sub listă.' },
      link_text: { label: 'Text link', description: 'Apare ca buton sub lista de puncte.' },
      link_url: { label: 'URL link', description: 'Unde duce link-ul (de obicei pagina completă a programului).' },
    },
    'blocks.program-item': {
      area: { label: 'Domeniu', description: 'Numele scurt al direcției (apare ca titlu pe card).' },
      text: { label: 'Descriere', description: 'Frază scurtă care explică direcția.' },
      details: { label: 'Detalii extinse', description: 'Dacă completat, click pe card deschide un modal cu acest text.' },
    },
    'blocks.timeline': {
      anchor_id: ANCHOR,
      kicker: { label: 'Kicker', description: 'Text mic mono deasupra titlului secțiunii.' },
      heading: { label: 'Titlu', description: 'Titlul mare al secțiunii Timeline.' },
      heading_italic: { label: 'Parte italică din titlu', description: 'Linie italică din titlu (accent vizual).' },
      items: { label: 'Momente', description: 'Lista momentelor cronologice afișate vertical.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a benzii cu timeline.' },
    },
    'blocks.timeline-item': {
      year: { label: 'An sau perioadă', description: 'Apare evidențiat în stânga momentului din timeline.' },
      body: { label: 'Descriere moment', description: 'Textul afișat în dreapta anului.' },
      is_current: { label: 'Marchează ca momentul curent', description: 'Toggle. Dacă bifat, momentul apare evidențiat.' },
      current_label: { label: 'Etichetă moment curent', description: 'Apare ca chip mic deasupra anului dacă „is_current" e bifat.' },
    },
    'blocks.accordion': {
      anchor_id: ANCHOR,
      heading: { label: 'Titlu secțiune', description: 'Apare ca titlu mare deasupra listei de întrebări.' },
      items: { label: 'Elemente', description: 'Lista de întrebări/răspunsuri expandabile.' },
    },
    'blocks.accordion-item': {
      title: { label: 'Întrebare / titlu', description: 'Apare ca rând clickabil în accordion.' },
      content: { label: 'Răspuns / conținut', description: 'Editor rich text. Apare expandat sub întrebare când e dat click.' },
    },
    'blocks.word-carousel': {
      anchor_id: ANCHOR,
      items: { label: 'Cuvinte / fraze', description: 'Lista cuvintelor afișate în caruselul orizontal.' },
      speed_seconds: { label: 'Viteză ciclu', description: 'Câte secunde durează un ciclu complet al caruselului.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea benzii caruselului (paper/cream/lime).' },
      separator: { label: 'Separator', description: 'Caracter afișat între cuvintele caruselului.' },
    },
    'blocks.word-carousel-item': {
      text: { label: 'Text', description: 'Textul afișat în carusel.' },
      url: { label: 'Link', description: 'Dacă completat, cuvântul devine clickabil. Opțional.' },
      highlight: { label: 'Evidențiat', description: 'Toggle pentru evidențierea cuvântului cu lime.' },
    },
    'blocks.mission-band': {
      anchor_id: ANCHOR,
      kicker: { label: 'Kicker', description: 'Text mic mono deasupra titlului benzii.' },
      heading: { label: 'Titlu', description: 'Titlul mare al benzii misiune (verde închis).' },
      heading_italic: { label: 'Parte italică din titlu', description: 'Linie italică din titlu (accent lime).' },
      paragraphs: { label: 'Paragrafe', description: 'Paragrafele afișate sub titlu. Folosește **cuvânt** pentru evidențiere lime.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a benzii (verde închis sau alternativă).' },
    },
    'blocks.mission-paragraph': {
      text: { label: 'Text paragraf', description: 'Paragraf afișat în Mission Band. Marchează cuvinte cu **cuvânt** pentru lime.' },
    },

    // ───────────────── AUTO-POPULATED BLOCKS ─────────────────
    'blocks.latest-articles': {
      anchor_id: ANCHOR,
      heading: { label: 'Titlu secțiune', description: 'Apare deasupra grilei de articole.' },
      count: { label: 'Număr articole', description: 'Câte articole se afișează (cele mai recente).' },
      show_category: { label: 'Afișează categoria', description: 'Toggle pentru afișarea chip-ului de categorie pe carduri.' },
      cta_text: { label: 'Text buton', description: 'Apare ca link „Vezi toate" la finalul secțiunii.' },
      cta_link: { label: 'Link buton', description: 'Unde duce butonul (de obicei /stiri).' },
    },
    'blocks.upcoming-events': {
      anchor_id: ANCHOR,
      heading: { label: 'Titlu secțiune', description: 'Apare deasupra listei de evenimente viitoare.' },
      count: { label: 'Număr evenimente', description: 'Câte evenimente se afișează (cele mai apropiate).' },
      cta_text: { label: 'Text buton', description: 'Apare ca link „Vezi calendarul complet" la finalul secțiunii.' },
      cta_link: { label: 'Link buton', description: 'Unde duce butonul (de obicei /evenimente).' },
    },
    'blocks.calendar': {
      anchor_id: ANCHOR,
      kicker: { label: 'Kicker', description: 'Text mic mono deasupra titlului calendarului.' },
      heading: { label: 'Titlu', description: 'Apare ca titlu mare deasupra calendarului.' },
      subheading: { label: 'Subtitlu', description: 'Paragraf scurt sub titlu (opțional).' },
      default_view: { label: 'Vizualizare implicită', description: 'Cum se deschide calendarul prima dată: month (grid lună) sau list (cronologic).' },
      show_view_toggle: { label: 'Afișează toggle vizualizare', description: 'Bifat = vizitatorul poate comuta între grid lună și listă. Debifat = doar vizualizarea implicită.' },
      include_past_events: { label: 'Include evenimente trecute', description: 'Bifat = afișează și evenimentele din trecut. Debifat = doar evenimente de azi încolo.' },
      limit: { label: 'Număr maxim evenimente', description: 'Câte evenimente se preiau din colecția Evenimente (max 200).' },
      filter_event_type: { label: 'Filtru tip eveniment', description: 'Dacă completat, afișează doar acest tip. Lasă gol pentru toate tipurile.' },
      empty_state_text: { label: 'Text listă goală', description: 'Apare când nu există niciun eveniment de afișat.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a benzii cu calendarul.' },
    },
    'blocks.calendar-custom': {
      anchor_id: ANCHOR,
      kicker: { label: 'Kicker', description: 'Text mic mono deasupra titlului calendarului.' },
      heading: { label: 'Titlu', description: 'Apare ca titlu mare deasupra calendarului.' },
      subheading: { label: 'Subtitlu', description: 'Paragraf scurt sub titlu (opțional).' },
      entries: { label: 'Intrări calendar', description: 'Lista de intrări adăugate manual. Apar atât în vizualizarea grid lună cât și în listă cronologică.' },
      default_view: { label: 'Vizualizare implicită', description: 'Cum se deschide calendarul prima dată: month (grid lună) sau list (cronologic).' },
      show_view_toggle: { label: 'Afișează toggle vizualizare', description: 'Bifat = vizitatorul poate comuta între grid lună și listă. Debifat = doar vizualizarea implicită.' },
      empty_state_text: { label: 'Text listă goală', description: 'Apare când nu există nicio intrare adăugată.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a benzii cu calendarul.' },
    },
    'blocks.calendar-entry': {
      title: { label: 'Titlu', description: 'Apare ca text principal al intrării (în panou zi sau în lista cronologică).' },
      start_date: { label: 'Dată început', description: 'Data și ora la care începe intrarea. Determină pe ce zi apare în grilă.' },
      end_date: { label: 'Dată sfârșit', description: 'Data și ora finală (opțional). Apare ca interval „09:00 – 12:00".' },
      description: { label: 'Descriere', description: 'Text scurt afișat ca meta sub titlu (folosit doar dacă „Locație" e gol).' },
      location: { label: 'Locație', description: 'Apare ca meta sub titlu, după interval. Are precedență față de descriere.' },
      url: { label: 'Link', description: 'Opțional. Dacă completat, intrarea devine click-abilă. URL absolut (https://) deschide în tab nou.' },
      category: { label: 'Categorie', description: 'Etichetă scurtă afișată ca chip lângă titlu (ex: „Intern", „Public", „Important").' },
      accent_color: { label: 'Culoare accent', description: 'Culoarea chip-ului de categorie: default (verde) / lime / cream / rose. Folosește pentru a diferenția vizual tipuri.' },
    },
    'blocks.file-list': {
      anchor_id: ANCHOR,
      kicker: { label: 'Kicker', description: 'Text mic mono deasupra titlului secțiunii de fișiere.' },
      heading: { label: 'Titlu', description: 'Apare ca titlu mare deasupra listei de fișiere.' },
      subheading: { label: 'Subtitlu', description: 'Paragraf scurt sub titlu (opțional).' },
      files: { label: 'Fișiere', description: 'Lista de fișiere descărcabile (PDF, Word, Excel). Apar ca rânduri cu iconiță, titlu și buton download.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a benzii cu lista de fișiere.' },
    },
    'blocks.file-item': {
      title: { label: 'Titlu', description: 'Numele afișat pentru fișier. Dacă lipsește, se folosește numele original al fișierului.' },
      description: { label: 'Descriere', description: 'Apare ca text mic sub titlul fișierului (opțional).' },
      file: { label: 'Fișier', description: 'Fișierul de descărcat. Acceptă PDF, Word (.doc, .docx), Excel (.xls, .xlsx).' },
    },
    'blocks.team-grid': {
      anchor_id: ANCHOR,
      kicker: { label: 'Kicker', description: 'Text mic mono deasupra titlului.' },
      heading: { label: 'Titlu', description: 'Apare ca titlu mare deasupra grilei de membri.' },
      cta_text: { label: 'Text link', description: 'Apare ca link la finalul secțiunii (opțional).' },
      cta_link: { label: 'URL link', description: 'Unde duce link-ul (opțional).' },
      mode: { label: 'Cine apare', description: 'leadership = doar conducere · team = doar non-conducere · all = toți membrii.' },
      limit: { label: 'Număr maxim membri', description: 'Câți membri se afișează maxim.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a benzii cu grila de echipă.' },
    },
    'blocks.chapters-grid': {
      anchor_id: ANCHOR,
      kicker: { label: 'Kicker', description: 'Text mic mono deasupra titlului.' },
      heading: { label: 'Titlu', description: 'Apare ca titlu mare deasupra grilei de filiale.' },
      cta_text: { label: 'Text link', description: 'Apare ca link la finalul secțiunii (opțional).' },
      cta_link: { label: 'URL link', description: 'Unde duce link-ul (opțional).' },
      items: { label: 'Filiale', description: 'Lista filialelor afișate în grilă.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a benzii cu grila de filiale.' },
    },
    'blocks.chapter-item': {
      name: { label: 'Nume filială', description: 'Apare ca titlu pe cardul filialei.' },
      code: { label: 'Cod filială', description: 'Apare mic pe card. Generat automat dacă lipsește.' },
      url: { label: 'URL pagină filială', description: 'Unde duce click-ul pe card. Opțional.' },
    },
    'blocks.romania-map': {
      anchor_id: ANCHOR,
      kicker: { label: 'Kicker', description: 'Text mic mono deasupra titlului hărții.' },
      heading: { label: 'Titlu', description: 'Apare ca titlu mare deasupra hărții.' },
      subheading: { label: 'Subtitlu', description: 'Apare ca paragraf scurt sub titlu.' },
      chapters: { label: 'Filiale', description: 'Lista județelor cu filială activă (vor fi marcate verde pe hartă).' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea de fundal a benzii cu harta.' },
    },
    'blocks.county-chapter': {
      code: { label: 'Cod ISO județ', description: 'Codul oficial al județului (ex: B, CJ, TM, IS). Determină ce județ apare verde pe hartă.' },
      name: { label: 'Nume filială', description: 'Apare în tooltip-ul hărții. Dacă lipsește, se folosește numele județului.' },
      url: { label: 'URL filială', description: 'Unde duce click-ul pe județ pe hartă.' },
      open_in_new_tab: { label: 'Deschide în tab nou', description: 'Bifat = link extern (tab nou). Debifat = navigare în aceeași filă.' },
    },

    // ───────────────── FORMS ─────────────────
    'blocks.contact-form': {
      anchor_id: ANCHOR,
      heading: { label: 'Titlu', description: 'Apare deasupra formularului de contact.' },
      description: { label: 'Descriere', description: 'Apare ca text introductiv deasupra câmpurilor.' },
      success_message: { label: 'Mesaj de succes', description: 'Apare după trimiterea cu succes a formularului.' },
    },
    'blocks.newsletter-cta': {
      anchor_id: ANCHOR,
      title: { label: 'Titlu', description: 'Apare ca titlu deasupra formularului de abonare.' },
      description: { label: 'Descriere', description: 'Apare ca text introductiv deasupra câmpului email.' },
      placeholder_text: { label: 'Text placeholder', description: 'Apare în câmpul de email când e gol.' },
    },
    'blocks.cta-banner': {
      anchor_id: ANCHOR,
      title: { label: 'Titlu', description: 'Apare ca titlu mare al benzii CTA.' },
      description: { label: 'Descriere', description: 'Apare ca text scurt sub titlul benzii.' },
      button_text: { label: 'Text buton', description: 'Apare pe butonul principal al benzii.' },
      button_link: { label: 'Link buton', description: 'Unde duce butonul când e apăsat.' },
      background_color: { label: 'Culoare fundal', description: 'Culoarea benzii: green / orange / white.' },
    },
    'blocks.social-feed': {
      anchor_id: ANCHOR,
      title: { label: 'Titlu', description: 'Apare ca titlu deasupra grilei de embed-uri sociale.' },
      subtitle: { label: 'Subtitlu', description: 'Apare ca paragraf sub titlu.' },
      platforms: { label: 'Platforme sociale', description: 'Lista conturilor pentru care se afișează embed-uri.' },
      show_embeds: { label: 'Afișează embed-uri', description: 'Toggle pentru afișarea iframe-urilor sociale (vs doar link-uri).' },
      posts_heading: { label: 'Titlu secțiune postări', description: 'Apare deasupra grilei de embed-uri.' },
      embed_fallback_text: { label: 'Text fallback embed', description: 'Apare dacă embed-urile nu se încarcă. Folosește {platform}.' },
      variant: { label: 'Variantă', description: 'full (cu descriere) sau compact (doar iconițe).' },
    },
    'blocks.article-stat': {
      value: { label: 'Valoare', description: 'Apare ca cifră mare în statistica evidențiată a articolului.' },
      label: { label: 'Etichetă', description: 'Apare ca text mic sub valoare.' },
      context: { label: 'Paragraf de context', description: 'Apare ca paragraf de context în statistica evidențiată.' },
    },

    // ───────────────── FORM CONFIG COMPONENTS ─────────────────
    'form.contact-form-config': {
      name_label: { label: 'Etichetă nume', description: 'Label pentru câmpul Nume din formularul de contact.' },
      name_placeholder: { label: 'Placeholder nume', description: 'Text afișat în câmpul Nume când e gol.' },
      email_label: { label: 'Etichetă email', description: 'Label pentru câmpul Email.' },
      email_placeholder: { label: 'Placeholder email', description: 'Text afișat în câmpul Email când e gol.' },
      subject_label: { label: 'Etichetă subiect', description: 'Label pentru câmpul Subiect.' },
      subject_placeholder: { label: 'Placeholder subiect', description: 'Text afișat în câmpul Subiect când e gol.' },
      message_label: { label: 'Etichetă mesaj', description: 'Label pentru câmpul Mesaj.' },
      message_placeholder: { label: 'Placeholder mesaj', description: 'Text afișat în câmpul Mesaj când e gol.' },
      submit_text: { label: 'Text buton trimite', description: 'Apare pe butonul de trimitere a formularului.' },
      submitting_text: { label: 'Text în procesare', description: 'Apare pe buton în timp ce se trimite cererea.' },
      success_title: { label: 'Titlu succes', description: 'Apare după trimiterea cu succes.' },
      success_message: { label: 'Mesaj succes', description: 'Apare ca paragraf sub titlul de succes.' },
    },
    'form.membership-labels': {
      first_name_label: { label: 'Etichetă prenume', description: 'Label pentru câmpul Prenume din formularul /inscrie-te.' },
      first_name_placeholder: { label: 'Placeholder prenume', description: 'Text afișat în câmpul Prenume când e gol.' },
      last_name_label: { label: 'Etichetă nume', description: 'Label pentru câmpul Nume.' },
      last_name_placeholder: { label: 'Placeholder nume', description: 'Text afișat în câmpul Nume când e gol.' },
      email_label: { label: 'Etichetă email', description: 'Label pentru câmpul Email.' },
      email_placeholder: { label: 'Placeholder email', description: 'Text afișat în câmpul Email când e gol.' },
      phone_label: { label: 'Etichetă telefon', description: 'Label pentru câmpul Telefon.' },
      phone_placeholder: { label: 'Placeholder telefon', description: 'Text afișat în câmpul Telefon când e gol.' },
      birth_date_label: { label: 'Etichetă data nașterii', description: 'Label pentru câmpul Data nașterii.' },
      county_label: { label: 'Etichetă județ', description: 'Label pentru dropdown-ul Județ.' },
      county_placeholder: { label: 'Placeholder județ', description: 'Text afișat în dropdown-ul Județ înainte de selectare.' },
      city_label: { label: 'Etichetă localitate', description: 'Label pentru câmpul Localitate.' },
      city_placeholder: { label: 'Placeholder localitate', description: 'Text afișat în câmpul Localitate când e gol.' },
      address_label: { label: 'Etichetă adresă', description: 'Label pentru câmpul Adresă.' },
      address_placeholder: { label: 'Placeholder adresă', description: 'Text afișat în câmpul Adresă când e gol.' },
      motivation_label: { label: 'Etichetă motivație', description: 'Label pentru câmpul Motivație.' },
      motivation_placeholder: { label: 'Placeholder motivație', description: 'Text afișat în câmpul Motivație când e gol.' },
      interests_label: { label: 'Etichetă domenii', description: 'Label pentru lista de bifare a domeniilor de interes.' },
      interests_help: { label: 'Text ajutor domenii', description: 'Text mic afișat sub label-ul listei de domenii.' },
    },
    'form.validation-messages': {
      email_required: { label: 'Email obligatoriu', description: 'Folosit când câmpul Email e gol.' },
      email_invalid: { label: 'Email invalid', description: 'Folosit când Email-ul nu are format valid.' },
      phone_required: { label: 'Telefon obligatoriu', description: 'Folosit când câmpul Telefon e gol.' },
      phone_invalid: { label: 'Telefon invalid', description: 'Folosit când Telefon-ul nu are format valid.' },
      first_name_required: { label: 'Prenume obligatoriu', description: 'Folosit când câmpul Prenume e gol.' },
      last_name_required: { label: 'Nume obligatoriu', description: 'Folosit când câmpul Nume e gol.' },
      birth_date_required: { label: 'Dată naștere obligatorie', description: 'Folosit când câmpul Data nașterii e gol.' },
      county_required: { label: 'Județ obligatoriu', description: 'Folosit când Județ nu e selectat.' },
      city_required: { label: 'Localitate obligatorie', description: 'Folosit când câmpul Localitate e gol.' },
      address_required: { label: 'Adresă obligatorie', description: 'Folosit când câmpul Adresă e gol.' },
      consent_required: { label: 'Consimțământ obligatoriu', description: 'Folosit când un consimțământ obligatoriu nu e bifat.' },
      duplicate_error: { label: 'Eroare duplicat', description: 'Folosit când utilizatorul a trimis deja o cerere.' },
      generic_error: { label: 'Eroare generică', description: 'Folosit pentru erori neprevăzute la trimitere.' },
    },
    'form.newsletter-form': {
      name_label: { label: 'Etichetă nume', description: 'Label pentru câmpul Nume din formularul de newsletter.' },
      name_placeholder: { label: 'Placeholder nume', description: 'Text afișat în câmpul Nume când e gol.' },
      email_label: { label: 'Etichetă email', description: 'Label pentru câmpul Email.' },
      email_placeholder: { label: 'Placeholder email', description: 'Text afișat în câmpul Email când e gol.' },
      submit_text: { label: 'Text buton', description: 'Apare pe butonul de abonare.' },
      submitting_text: { label: 'Text în procesare', description: 'Apare pe buton în timp ce se procesează abonarea.' },
      consent_text: { label: 'Text consimțământ', description: 'Apare lângă bifa de consimțământ.' },
      success_title: { label: 'Titlu succes', description: 'Apare după abonarea cu succes.' },
      success_message: { label: 'Mesaj succes', description: 'Apare ca paragraf sub titlul de succes.' },
    },
    'form.consent-item': {
      key: { label: 'Cheie consimțământ', description: 'Identificator intern (gdpr / statute / data-processing / newsletter).' },
      label: { label: 'Text consimțământ', description: 'Apare ca text al checkbox-ului în formular.' },
      required: { label: 'Obligatoriu', description: 'Dacă bifat, formularul nu se trimite fără acest consimțământ.' },
      help_text: { label: 'Text ajutor', description: 'Apare ca text mic sub textul consimțământului.' },
    },
    'form.step': {
      number: { label: 'Număr pas', description: 'Numărul afișat în indicatorul de progres din formular.' },
      label: { label: 'Etichetă pas', description: 'Numele pasului în indicatorul de progres.' },
      description: { label: 'Descriere pas', description: 'Apare ca text mic sub eticheta pasului.' },
    },
    'form.next-step': {
      icon: { label: 'Iconiță', description: 'Emoji afișat lângă textul pasului următor.' },
      text: { label: 'Text pas', description: 'Descrie ce urmează după trimiterea formularului.' },
    },
    'form.success-section': {
      title: { label: 'Titlu', description: 'Apare ca titlu mare al ecranului de succes.' },
      message: { label: 'Mesaj', description: 'Apare ca paragraf sub titlu pe ecranul de succes.' },
      next_steps_heading: { label: 'Titlu secțiune pași', description: 'Apare deasupra listei de pași următori.' },
      next_steps: { label: 'Pași următori', description: 'Lista pașilor următori afișați pe ecranul de succes.' },
      primary_cta_label: { label: 'Text buton principal', description: 'Apare pe butonul principal al ecranului de succes.' },
      primary_cta_url: { label: 'Link buton principal', description: 'Unde duce butonul principal.' },
      secondary_cta_label: { label: 'Text buton secundar', description: 'Apare pe butonul secundar al ecranului de succes.' },
      secondary_cta_url: { label: 'Link buton secundar', description: 'Unde duce butonul secundar.' },
    },

    // ───────────────── SOCIAL ─────────────────
    'social.platform': {
      name: { label: 'Nume platformă', description: 'Identificatorul platformei (facebook / instagram / tiktok / etc.).' },
      handle: { label: 'Handle', description: 'Numele de utilizator afișat pe cardul platformei.' },
      url: { label: 'URL profil', description: 'Link-ul către profilul oficial.' },
      description: { label: 'Descriere', description: 'Text scurt afișat sub handle pe cardul platformei.' },
      color: { label: 'Culoare brand', description: 'Cod hex folosit pentru accent vizual pe cardul platformei.' },
      embed_url: { label: 'URL embed', description: 'URL pentru iframe embed (postări specifice).' },
      icon_svg: { label: 'Iconiță SVG', description: 'Cod SVG personalizat (lasă gol pentru iconița default).' },
      follow_cta: { label: 'Text CTA urmărește', description: 'Apare pe butonul de urmărire de pe cardul platformei.' },
      order: { label: 'Ordine', description: 'Controlează poziția cardului în lista de platforme.' },
    },
    'social.feature': {
      emoji: { label: 'Emoji', description: 'Apare ca iconiță deasupra titlului motivului.' },
      title: { label: 'Titlu', description: 'Numele motivului (ex: „Update-uri zilnice").' },
      description: { label: 'Descriere', description: 'Frază scurtă care explică motivul.' },
    },
    'shared.seo': {
      meta_title: { label: 'Titlu SEO', description: 'Titlul afișat în Google și pe tab-ul browserului. Lasă gol pentru a folosi titlul intrării.' },
      meta_description: { label: 'Descriere SEO', description: 'Descrierea afișată sub titlul Google. 140-160 caractere.' },
      og_image: { label: 'Imagine partajare', description: 'Apare când link-ul e partajat pe Facebook/Twitter. Ideal 1200×630.' },
      canonical_url: { label: 'URL canonic', description: 'Doar dacă același conținut există în alt loc. Lasă gol în 99% din cazuri.' },
      no_index: { label: 'Ascunde de motoarele de căutare', description: 'Toggle. Bifat = pagina NU apare în Google.' },
    },
    'shared.social-link': {
      platform: { label: 'Platformă', description: 'Numele rețelei (facebook / twitter / etc.).' },
      url: { label: 'Link', description: 'URL-ul complet către profilul personal.' },
    },

    // ───────────────── DONATE ─────────────────
    'donate.transparency-item': {
      label: { label: 'Etichetă', description: 'Numele categoriei de cheltuială afișată în sidebar-ul transparență.' },
      percentage: { label: 'Procent', description: 'Procentul alocat acestei categorii (1-100). Total trebuie să fie 100%.' },
      description: { label: 'Descriere', description: 'Apare ca text mic sub bara de procent.' },
    },
    'donate.preset-amount': {
      amount: { label: 'Sumă (RON)', description: 'Apare ca buton în grila de selecție sumă pe /doneaza.' },
      label: { label: 'Etichetă opțională', description: 'Text afișat sub sumă (ex: „Donează un copil la educație").' },
    },

    // ───────────────── EVENT ─────────────────
    'event.social-post': {
      platform: { label: 'Platformă', description: 'Tipul rețelei sociale (facebook / instagram / etc.).' },
      url: { label: 'Link postare', description: 'Link-ul către postarea originală.' },
    },

    // ───────────────── NAVIGATION ─────────────────
    'navigation.menu-item': {
      label: { label: 'Etichetă', description: 'Textul vizibil al link-ului în meniu.' },
      url: { label: 'URL', description: 'Unde duce link-ul (poate fi intern: /despre-noi sau extern: https://...).' },
      order: { label: 'Ordine', description: 'Numerele mai mici apar primele în meniu.' },
      open_in_new_tab: { label: 'Deschide în tab nou', description: 'Bifează doar pentru link-uri externe.' },
      children: { label: 'Sub-elemente', description: 'Apar ca dropdown la hover pe link-ul părinte.' },
    },
    'navigation.menu-sub-item': {
      label: { label: 'Etichetă', description: 'Textul vizibil al sub-link-ului.' },
      url: { label: 'URL', description: 'Unde duce sub-link-ul.' },
      order: { label: 'Ordine', description: 'Numerele mai mici apar primele în dropdown.' },
      open_in_new_tab: { label: 'Deschide în tab nou', description: 'Bifează pentru link-uri externe.' },
    },
    'footer.social-link': {
      platform: { label: 'Platformă', description: 'Tipul rețelei (facebook / instagram / twitter / linkedin / tiktok / youtube).' },
      url: { label: 'URL profil', description: 'Link-ul complet către profilul oficial.' },
      display_order: { label: 'Ordine afișare', description: 'Controlează ordinea iconițelor în footer.' },
    },

    // ───────────────── HOMEPAGE / OTHER ─────────────────
    'homepage.value-point': {
      text: { label: 'Text', description: 'Apare ca bullet în lista de puncte cheie a unui card.' },
    },

    // ───────────────── THEME ─────────────────
    'theme.brand-colors': {
      green_deep: { label: 'Verde închis principal', description: 'Folosit pentru titluri și butoane primare pe tot site-ul.' },
      green_dark: { label: 'Verde foarte închis', description: 'Folosit pentru footer și fundaluri întunecate.' },
      green_mid: { label: 'Verde mediu', description: 'Folosit pentru variații intermediare de verde.' },
      green_soft: { label: 'Verde pastel', description: 'Folosit pentru fundaluri suave și carduri.' },
      green_bright: { label: 'Verde aprins', description: 'Folosit pentru hover pe butoane și accente.' },
      lime: { label: 'Lime / accent semnătură', description: 'Culoarea de accent semnătură SENS, folosită pentru CTA-uri și evidențieri.' },
      pastel_green: { label: 'Verde foarte deschis', description: 'Folosit pentru fundaluri foarte deschise.' },
    },
    'theme.surface-colors': {
      paper: { label: 'Fundal principal', description: 'Folosit ca fundal default pentru majoritatea paginilor.' },
      cream: { label: 'Fundal alternativ', description: 'Folosit pentru carduri și secțiuni alternative.' },
      ink: { label: 'Text principal', description: 'Folosit pentru text body și titluri.' },
      ink_soft: { label: 'Text secundar', description: 'Folosit pentru meta info, descrieri, text mai puțin important.' },
    },
    'theme.accent-colors': {
      rose: { label: 'Roz', description: 'Folosit pentru chip-uri și accente speciale.' },
      error: { label: 'Roșu erori', description: 'Folosit pentru mesaje de eroare în formulare.' },
    },
    'theme.typography': {
      font_display: { label: 'Font titluri', description: 'Folosit pentru toate titlurile mari (Hero, secțiuni). Default: Oswald.' },
      font_body: { label: 'Font text body', description: 'Folosit pentru paragrafe și text curent. Default: League Spartan.' },
      font_mono: { label: 'Font monospace', description: 'Folosit pentru eyebrow, meta info, counter-uri. Default: JetBrains Mono.' },
    },
  };

  // Aplică label-uri pe content types
  for (const [uid, labels] of Object.entries(contentTypeLabels)) {
    await applyLabels(strapi, `configuration_content_types::${uid}`, labels);
  }

  // Aplică label-uri pe componente
  for (const [uid, labels] of Object.entries(componentLabels)) {
    await applyLabels(strapi, `configuration_components::${uid}`, labels);
  }

  strapi.log.info('✅ Admin field labels configured (RO)');
}

/**
 * Field label config. Use a string for label-only, or an object with both
 * `label` (short, shown in admin form) and `description` (helper text shown
 * under the input — describes WHERE this field appears on the site).
 */
type FieldLabel = string | { label: string; description?: string };

async function applyLabels(
  strapi: Core.Strapi,
  storeKey: string,
  labels: Record<string, FieldLabel>
) {
  try {
    const fullKey = `plugin_content_manager_configuration_${storeKey.replace('configuration_', '')}`;
    const row = await strapi.db.query('strapi::core-store').findOne({
      where: { key: fullKey },
    });

    if (!row) return; // Configurația nu există încă — se va crea la primul acces admin

    const config = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
    if (!config?.metadatas) return;

    let changed = false;
    for (const [field, raw] of Object.entries(labels)) {
      if (!config.metadatas[field]) continue;
      const label = typeof raw === 'string' ? raw : raw.label;
      const description = typeof raw === 'string' ? undefined : raw.description;
      if (config.metadatas[field].edit) {
        config.metadatas[field].edit.label = label;
        if (description !== undefined) {
          config.metadatas[field].edit.description = description;
        }
        changed = true;
      }
      if (config.metadatas[field].list) {
        config.metadatas[field].list.label = label;
        changed = true;
      }
    }

    if (changed) {
      await strapi.db.query('strapi::core-store').update({
        where: { id: row.id },
        data: { value: JSON.stringify(config) },
      });
    }
  } catch {
    // Silently skip — configuration will be set on next admin access
  }
}
