import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ── Seed: configurare rol Public ──
    await setupPublicPermissions(strapi);

    // ── Seed: date demo (doar dacă nu există deja) ──
    await seedData(strapi);

    // ── Admin: etichete câmpuri în română ──
    await configureAdminLabels(strapi);
  },
};

/**
 * Configurare permisiuni publice — permite find/findOne pe content types publice.
 */
async function setupPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const publicEndpoints = [
    // Collection types
    { controller: 'api::article.article', actions: ['find', 'findOne'] },
    { controller: 'api::category.category', actions: ['find', 'findOne'] },
    { controller: 'api::tag.tag', actions: ['find', 'findOne'] },
    { controller: 'api::event.event', actions: ['find', 'findOne'] },
    { controller: 'api::team-member.team-member', actions: ['find', 'findOne'] },
    { controller: 'api::page.page', actions: ['find', 'findOne'] },
    { controller: 'api::section.section', actions: ['find', 'findOne'] },
    // Single types
    { controller: 'api::homepage.homepage', actions: ['find'] },
    { controller: 'api::contact-page.contact-page', actions: ['find'] },
    { controller: 'api::donate-page.donate-page', actions: ['find'] },
    { controller: 'api::navigation.navigation', actions: ['find'] },
    { controller: 'api::footer.footer', actions: ['find'] },
    // Newsletter — doar create (subscribe)
    { controller: 'api::newsletter-subscriber.newsletter-subscriber', actions: ['create'] },
    // Membership — doar create (înscriere)
    { controller: 'api::membership-request.membership-request', actions: ['create'] },
  ];

  for (const endpoint of publicEndpoints) {
    for (const action of endpoint.actions) {
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({
          where: {
            role: publicRole.id,
            action: `${endpoint.controller}.${action}`,
          },
        });

      if (!existing) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({
            data: {
              role: publicRole.id,
              action: `${endpoint.controller}.${action}`,
            },
          });
      }
    }
  }

  strapi.log.info('✅ Public API permissions configured');
}

/**
 * Seed date demo — ruleaza doar dacă nu sunt deja categorii create.
 */
async function seedData(strapi: Core.Strapi) {
  const existingCategories = await strapi.documents('api::category.category').findMany();
  if (existingCategories.length > 0) {
    strapi.log.info('📦 Seed data already exists, skipping');
    return;
  }

  strapi.log.info('🌱 Seeding demo data...');

  // ── Categorii ──
  const categories = await Promise.all([
    strapi.documents('api::category.category').create({
      data: { name: 'Comunicate', slug: 'comunicate', color: '#003827' },
    }),
    strapi.documents('api::category.category').create({
      data: { name: 'Analize', slug: 'analize', color: '#004B24' },
    }),
    strapi.documents('api::category.category').create({
      data: { name: 'Acțiuni', slug: 'actiuni', color: '#49BF07' },
    }),
  ]);

  // ── Taguri ──
  const tags = await Promise.all([
    strapi.documents('api::tag.tag').create({ data: { name: 'Mediu', slug: 'mediu' } }),
    strapi.documents('api::tag.tag').create({ data: { name: 'Educație', slug: 'educatie' } }),
    strapi.documents('api::tag.tag').create({ data: { name: 'Sănătate', slug: 'sanatate' } }),
    strapi.documents('api::tag.tag').create({ data: { name: 'Sustenabilitate', slug: 'sustenabilitate' } }),
    strapi.documents('api::tag.tag').create({ data: { name: 'Comunitate', slug: 'comunitate' } }),
  ]);

  // ── Team Members ──
  const teamMembers = await Promise.all([
    strapi.documents('api::team-member.team-member').create({
      data: {
        name: 'Maria Ionescu',
        role: 'Co-Președintă',
        bio: 'Activistă de mediu cu 15 ani de experiență în politici publice de sustenabilitate. Fost consilier în Ministerul Mediului.',
        display_order: 1,
        is_leadership: true,
      },
      status: 'published',
    }),
    strapi.documents('api::team-member.team-member').create({
      data: {
        name: 'Alexandru Popa',
        role: 'Co-Președinte',
        bio: 'Economist specializat în dezvoltare durabilă. Profesor universitar și autor a trei cărți despre economia verde.',
        display_order: 2,
        is_leadership: true,
      },
      status: 'published',
    }),
    strapi.documents('api::team-member.team-member').create({
      data: {
        name: 'Elena Dumitrescu',
        role: 'Vicepreședintă — Educație',
        bio: 'Profesor de biologie și fondatoare a programului „Școala Verde" implementat în peste 200 de școli din România.',
        display_order: 3,
        is_leadership: true,
      },
      status: 'published',
    }),
    strapi.documents('api::team-member.team-member').create({
      data: {
        name: 'Andrei Vasilescu',
        role: 'Vicepreședinte — Sănătate',
        bio: 'Medic specialist în sănătate publică. Coordonator al campaniei naționale pentru acces echitabil la sănătate.',
        display_order: 4,
        is_leadership: true,
      },
      status: 'published',
    }),
    strapi.documents('api::team-member.team-member').create({
      data: {
        name: 'Diana Stanciu',
        role: 'Secretar General',
        bio: 'Juristă specializată în drept european și politici de mediu. A coordonat campanii de advocacy la nivel UE.',
        display_order: 5,
        is_leadership: false,
      },
      status: 'published',
    }),
  ]);

  // ── Articole ──
  const articleData = [
    {
      title: 'SENS lansează programul „Verde Urban" pentru 10 orașe din România',
      slug: 'sens-lanseaza-verde-urban',
      excerpt: 'Partidul SENS anunță lansarea programului Verde Urban, o inițiativă ambițioasă de transformare a spațiilor publice din 10 mari orașe românești.',
      body: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Partidul SENS anunță astăzi lansarea programului „Verde Urban", o inițiativă care va transforma spațiile publice din 10 orașe românești. Programul include plantarea a 100.000 de arbori, crearea de coridoare verzi și implementarea de infrastructură de mobilitate sustenabilă.' }],
        },
        {
          type: 'heading',
          level: 2,
          children: [{ type: 'text', text: 'Obiectivele programului' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Fiecare oraș participant va beneficia de un plan personalizat de ecologizare urbană, dezvoltat în parteneriat cu comunitățile locale și experți în urbanism sustenabil. Programul prevede investiții de peste 50 de milioane de euro pe parcursul a 5 ani.' }],
        },
        {
          type: 'paragraph',
          children: [
            { type: 'text', text: '„Orașele românești au nevoie de ' },
            { type: 'text', text: 'o viziune verde ambițioasă', bold: true },
            { type: 'text', text: '. Cu Verde Urban, oferim un model concret de transformare care poate fi replicat în toată țara", a declarat Maria Ionescu, co-președinta SENS.' },
          ],
        },
      ],
      reading_time: 4,
      category: categories[0].documentId,
      author: teamMembers[0].documentId,
      tags: [tags[0].documentId, tags[3].documentId],
    },
    {
      title: 'Studiu SENS: Calitatea aerului în marile orașe s-a deteriorat cu 15%',
      slug: 'studiu-calitatea-aerului',
      excerpt: 'Un studiu realizat de experții SENS arată că indicii de calitate a aerului s-au degradat semnificativ în ultimii doi ani, în special în zonele urbane dense.',
      body: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Echipa de cercetare a SENS a publicat astăzi rezultatele unui studiu amplu privind calitatea aerului în cele mai mari 15 orașe din România. Concluziile sunt alarmante: indicii de poluare au crescut cu 15% în ultimii doi ani.' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Studiul, realizat în parteneriat cu trei universități românești, a analizat date din 45 de stații de monitorizare pe o perioadă de 24 de luni. Principalele surse de poluare identificate sunt traficul rutier, încălzirea pe bază de combustibili fosili și activitățile industriale din zonele periurbane.' }],
        },
        {
          type: 'heading',
          level: 2,
          children: [{ type: 'text', text: 'Recomandări concrete' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'SENS propune un pachet legislativ cu 12 măsuri imediate, inclusiv zone cu emisii zero în centrele orașelor, subvenții pentru înlocuirea sistemelor vechi de încălzire și extinderea rețelelor de transport public electric.' }],
        },
      ],
      reading_time: 6,
      category: categories[1].documentId,
      author: teamMembers[1].documentId,
      tags: [tags[0].documentId, tags[2].documentId],
    },
    {
      title: 'Voluntarii SENS au plantat 5.000 de arbori în Campania de Primăvară',
      slug: 'campania-plantare-primavara',
      excerpt: 'Peste 300 de voluntari SENS au participat la campania de plantare din primăvara 2026, acoperind zone deficitare din 8 județe.',
      body: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Campania de Plantare de Primăvară 2026 s-a încheiat cu un succes remarcabil: 5.000 de arbori plantați în 8 județe, cu participarea a peste 300 de voluntari din toată țara.' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Speciile plantate au fost selectate cu grijă pentru a corespunde condițiilor climatice locale: stejar, fag, plop și diverse specii de arbuști autohtoni. Fiecare arbore plantat va fi monitorizat timp de 3 ani pentru a asigura supraviețuirea și creșterea optimă.' }],
        },
        {
          type: 'heading',
          level: 2,
          children: [{ type: 'text', text: 'Impact și continuare' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Calculele noastre arată că cei 5.000 de arbori vor absorbi aproximativ 250 de tone de CO₂ anual la maturitate. Campania de toamnă este deja în planificare, cu obiectivul ambițios de 10.000 de arbori.' }],
        },
      ],
      reading_time: 3,
      category: categories[2].documentId,
      author: teamMembers[2].documentId,
      tags: [tags[0].documentId, tags[4].documentId],
    },
    {
      title: 'SENS propune reforma curriculei pentru educație ecologică în școli',
      slug: 'reforma-educatie-ecologica',
      excerpt: 'O propunere legislativă SENS cere introducerea educației ecologice ca materie obligatorie din clasa a V-a.',
      body: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Partidul SENS a depus astăzi în Parlament o propunere legislativă privind introducerea educației ecologice ca materie obligatorie în curriculum-ul școlar, începând din clasa a V-a.' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Propunerea prevede un curriculum modern care combină teoria cu practica: ore de biologie ecologică, proiecte de compost și grădini școlare, vizite la stații de reciclare și parteneriate cu ONG-uri de mediu.' }],
        },
        {
          type: 'paragraph',
          children: [
            { type: 'text', text: '„Educația ecologică nu este un lux — este o ' },
            { type: 'text', text: 'necesitate pentru supraviețuirea planetei', bold: true },
            { type: 'text', text: '", a subliniat Elena Dumitrescu, vicepreședinta SENS responsabilă de educație.' },
          ],
        },
      ],
      reading_time: 5,
      category: categories[0].documentId,
      author: teamMembers[2].documentId,
      tags: [tags[1].documentId, tags[0].documentId],
    },
    {
      title: 'Programul Național de Sănătate Preventivă: viziunea SENS',
      slug: 'program-sanatate-preventiva',
      excerpt: 'SENS prezintă viziunea sa pentru un sistem de sănătate centrat pe prevenție, cu acces universal și echitabil.',
      body: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'SENS a prezentat astăzi viziunea sa completă pentru reforma sistemului de sănătate din România, cu accent pe medicina preventivă și accesul echitabil la servicii medicale de calitate.' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Programul propune crearea a 500 de centre de prevenție la nivel comunitar, echipate cu aparatură modernă de screening și personal medical dedicat. Fiecare cetățean va avea dreptul la un check-up anual complet, gratuit.' }],
        },
        {
          type: 'heading',
          level: 2,
          children: [{ type: 'text', text: 'Finanțare și implementare' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Conform estimărilor noastre, investiția în prevenție va reduce cu 30% costurile tratamentelor pe termen lung. Programul va fi finanțat printr-o combinație de fonduri europene, contribuții din bugetul de stat și parteneriate public-private.' }],
        },
      ],
      reading_time: 7,
      category: categories[1].documentId,
      author: teamMembers[3].documentId,
      tags: [tags[2].documentId, tags[4].documentId],
    },
  ];

  for (const article of articleData) {
    const { tags: tagIds, category: categoryId, author: authorId, ...rest } = article;
    await strapi.documents('api::article.article').create({
      data: {
        ...rest,
        category: categoryId,
        author: authorId,
        tags: tagIds,
      } as any,
      status: 'published',
    });
  }

  // ── Evenimente ──
  const now = new Date();
  const inTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const inOneMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  await Promise.all([
    strapi.documents('api::event.event').create({
      data: {
        title: 'Dezbatere: Viitorul Energiei Verzi în România',
        slug: 'dezbatere-energie-verde',
        description: [
          { type: 'paragraph', children: [{ type: 'text', text: 'O dezbatere publică despre tranziția energetică a României, cu participarea experților în energie regenerabilă, reprezentanți ai mediului de afaceri și membri ai societății civile.' }] },
          { type: 'paragraph', children: [{ type: 'text', text: 'Evenimentul va explora soluții concrete pentru accelerarea tranziției la energia verde, inclusiv eolian offshore, solar și hidrogen verde.' }] },
        ],
        start_date: inTwoWeeks.toISOString(),
        end_date: new Date(inTwoWeeks.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        location_name: 'Biblioteca Centrală Universitară, București',
        max_participants: 200,
        registration_open: true,
        event_type: 'dezbatere',
      },
      status: 'published',
    }),
    strapi.documents('api::event.event').create({
      data: {
        title: 'Acțiune de Ecologizare — Parcul Herăstrău',
        slug: 'ecologizare-herastrau',
        description: [
          { type: 'paragraph', children: [{ type: 'text', text: 'Alătură-te echipei SENS pentru o zi de ecologizare în Parcul Herăstrău! Vom colecta deșeuri, vom planta flori sălbatice și vom instala noi coșuri de reciclare.' }] },
        ],
        start_date: inOneMonth.toISOString(),
        end_date: new Date(inOneMonth.getTime() + 5 * 60 * 60 * 1000).toISOString(),
        location_name: 'Parcul Herăstrău, Intrarea Charles de Gaulle',
        max_participants: 100,
        registration_open: true,
        event_type: 'actiune',
      },
      status: 'published',
    }),
    strapi.documents('api::event.event').create({
      data: {
        title: 'Webinar: Cum să reduci amprenta de carbon a casei tale',
        slug: 'webinar-amprenta-carbon',
        description: [
          { type: 'paragraph', children: [{ type: 'text', text: 'Un webinar practic despre reducerea consumului de energie acasă, alegerea materialelor sustenabile și stilul de viață eco-friendly.' }] },
        ],
        start_date: twoWeeksAgo.toISOString(),
        end_date: new Date(twoWeeksAgo.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        location_name: 'Online — Zoom',
        max_participants: 500,
        registration_open: false,
        event_type: 'online',
      },
      status: 'published',
    }),
  ]);

  // ── Homepage Single Type (Dynamic Zone) ──
  await strapi.documents('api::homepage.homepage').create({
    data: {
      content: [
        {
          __component: 'blocks.hero',
          title: 'O Românie verde, echitabilă și modernă',
          subtitle: 'Construim împreună un viitor bazat pe Sănătate, Educație, Natură și Sustenabilitate. Alătură-te mișcării SENS.',
          cta_text: 'Înscrie-te acum',
          cta_link: '/inscrie-te',
          cta_secondary_text: 'Donează',
          cta_secondary_link: '/doneaza',
        },
        {
          __component: 'blocks.card-grid',
          heading: 'Valorile noastre',
          columns: '4',
          cards: [
            {
              icon: '🏥',
              title: 'Sănătate',
              description: 'Un sistem de sănătate centrat pe prevenție, accesibil tuturor, indiferent de venit sau locație.',
              points: [
                { text: 'Centre de prevenție în fiecare comunitate' },
                { text: 'Check-up anual gratuit pentru toți cetățenii' },
                { text: 'Digitalizarea completă a sistemului medical' },
              ],
              link_text: 'Află mai mult',
              link_url: '/despre-noi#sanatate',
            },
            {
              icon: '📚',
              title: 'Educație',
              description: 'Un sistem educațional care pregătește generațiile viitoare pentru provocările climatice și tehnologice.',
              points: [
                { text: 'Educație ecologică obligatorie din clasa a V-a' },
                { text: 'Grădini și laboratoare verzi în fiecare școală' },
                { text: 'Formarea continuă a cadrelor didactice' },
              ],
              link_text: 'Află mai mult',
              link_url: '/despre-noi#educatie',
            },
            {
              icon: '🌿',
              title: 'Natură',
              description: 'Protecția naturii nu este un obiectiv secundar — este fundamentul pe care se construiește orice societate sustenabilă.',
              points: [
                { text: '1 milion de arbori plantați până în 2030' },
                { text: 'Zone cu emisii zero în centrele orașelor' },
                { text: 'Protecția ariilor naturale și a biodiversității' },
              ],
              link_text: 'Află mai mult',
              link_url: '/despre-noi#natura',
            },
            {
              icon: '♻️',
              title: 'Sustenabilitate',
              description: 'O economie care crește fără să distrugă. Tranziția verde nu este un cost, ci cea mai mare oportunitate economică a generației noastre.',
              points: [
                { text: '100% energie regenerabilă până în 2040' },
                { text: 'Economia circulară ca standard industrial' },
                { text: 'Joburi verzi și reconversie profesională' },
              ],
              link_text: 'Află mai mult',
              link_url: '/despre-noi#sustenabilitate',
            },
          ],
        },
        {
          __component: 'blocks.program-points',
          items: [
            { area: 'Energie', text: 'Tranziție completă la energie regenerabilă și independență energetică prin solar, eolian și hidrogen verde.' },
            { area: 'Transport', text: 'Rețea națională de transport public electric și infrastructură pentru mobilitate activă în toate orașele.' },
            { area: 'Agricultură', text: 'Sprijin pentru agricultura ecologică, circuite scurte de distribuție și securitate alimentară.' },
            { area: 'Digitalizare', text: 'Guvernare transparentă prin tehnologie, servicii publice digitale accesibile tuturor cetățenilor.' },
            { area: 'Locuire', text: 'Program național de renovare energetică a clădirilor și construcții noi cu standard Nearly Zero Energy.' },
            { area: 'Tineret', text: 'Consilii locale ale tinerilor, stagii verzi garantate și programe de antreprenoriat sustenabil.' },
          ],
          show_link: true,
          link_text: 'Vezi programul complet',
          link_url: '/despre-noi',
        },
        {
          __component: 'blocks.latest-articles',
          heading: 'Ultimele știri',
          count: 3,
          show_category: true,
          cta_text: 'Toate știrile',
          cta_link: '/stiri',
        },
        {
          __component: 'blocks.upcoming-events',
          heading: 'Evenimente viitoare',
          count: 3,
          cta_text: 'Toate evenimentele',
          cta_link: '/evenimente',
        },
        {
          __component: 'blocks.newsletter-cta',
          title: 'Rămâi la curent cu SENS',
          description: 'Abonează-te la newsletter pentru comunicate, analize și invitații la evenimente.',
          placeholder_text: 'email@exemplu.ro',
        },
      ],
      seo: {
        meta_title: 'SENS — Sănătate · Educație · Natură · Sustenabilitate',
        meta_description: 'Partidul SENS — O Românie verde, echitabilă și modernă. Înscrie-te sau donează astăzi.',
      },
    } as any,
    status: 'published',
  });

  // ── Navigație ──
  await strapi.documents('api::navigation.navigation').create({
    data: {
      main_menu: [
        { label: 'Știri', url: '/stiri', order: 1, open_in_new_tab: false },
        {
          label: 'Despre noi', url: '/despre-noi', order: 2, open_in_new_tab: false,
          children: [
            { label: 'Misiune', url: '/despre-noi?tab=misiune' },
            { label: 'Echipa', url: '/despre-noi?tab=echipa' },
            { label: 'Familia Europeană', url: '/despre-noi?tab=europa' },
          ],
        },
        { label: 'Evenimente', url: '/evenimente', order: 3, open_in_new_tab: false },
        { label: 'Contact', url: '/contact', order: 4, open_in_new_tab: false },
      ],
      secondary_menu: [
        { label: 'Donează', url: '/doneaza', order: 1, open_in_new_tab: false },
        { label: 'Înscrie-te', url: '/inscrie-te', order: 2, open_in_new_tab: false },
      ],
      mobile_extra_links: [
        { label: 'Donează', url: '/doneaza' },
      ],
    } as any,
  });

  // ── Footer ──
  await strapi.documents('api::footer.footer').create({
    data: {
      tagline: 'Sănătate · Educație · Natură · Sustenabilitate',
      eu_text: 'Membru al European Greens și al grupului Verzi/ALE din Parlamentul European',
      footer_links: [
        { label: 'Știri', url: '/stiri' },
        { label: 'Despre Noi', url: '/despre-noi' },
        { label: 'Evenimente', url: '/evenimente' },
        { label: 'Contact', url: '/contact' },
        { label: 'Donează', url: '/doneaza' },
      ],
      social_links: [
        { platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/cusens' },
        { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/cusens' },
        { platform: 'twitter', label: 'X / Twitter', url: 'https://twitter.com/cusens' },
        { platform: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@cusens' },
      ],
      legal_text: 'Partidul SENS · Mandatar financiar CMF nr. 11240065',
      privacy_link_text: 'Politica de confidențialitate',
      privacy_link_url: '/politica-confidentialitate',
    } as any,
  });

  // ── Contact Page Single Type ──
  await strapi.documents('api::contact-page.contact-page').create({
    data: {
      title: 'Contact',
      subtitle: 'Ai o întrebare, o propunere sau vrei să te implici? Scrie-ne!',
      email: 'contact@partidulsens.ro',
      address: 'Str. Exemplu nr. 42, Sector 1, București, 010101',
      schedule: 'Luni – Vineri: 09:00 – 18:00',
      newsletter_title: 'Nu rata nicio veste',
      newsletter_description: 'Abonează-te la newsletter-ul SENS.',
      seo: {
        meta_title: 'Contact — Partidul SENS',
        meta_description: 'Contactează Partidul SENS. Adresă, email, program de lucru.',
      },
    } as any,
    status: 'published',
  });

  // ── Donate Page Single Type ──
  await strapi.documents('api::donate-page.donate-page').create({
    data: {
      title: 'Donează pentru SENS',
      description: 'Fiecare leu contează. Donația ta ne ajută să construim o Românie verde, echitabilă și modernă.',
      preset_amounts: [25, 50, 100, 200],
      cmf_text: 'Mandatar financiar CMF nr. 11240065. Donațiile sunt reglementate de Legea 334/2006.',
      transparency_items: [
        { label: 'Campanii ecologice', percentage: 40 },
        { label: 'Comunicare și media', percentage: 25 },
        { label: 'Organizare și evenimente', percentage: 20 },
        { label: 'Administrare', percentage: 15 },
      ],
      seo: {
        meta_title: 'Donează — Partidul SENS',
        meta_description: 'Susține Partidul SENS cu o donație. Fiecare leu contează pentru o Românie verde.',
      },
    } as any,
    status: 'published',
  });

  // ── Pagini statice (Dynamic Zone) ──
  const despreNoiPage = await strapi.documents('api::page.page').create({
    data: {
      title: 'Despre SENS',
      slug: 'despre-noi',
      content: [
        {
          __component: 'blocks.hero',
          title: 'Despre SENS',
          subtitle: 'Sănătate · Educație · Natură · Sustenabilitate — valorile care ne definesc și ne ghidează fiecare decizie.',
        },
      ],
      seo: {
        meta_title: 'Despre SENS — Misiune, Echipă, Program',
        meta_description: 'Despre Partidul SENS — misiune, viziune, echipă și program politic. Membri European Greens.',
      },
    } as any,
    status: 'published',
  });

  // ── Secțiuni pentru pagina Despre Noi ──
  await strapi.documents('api::section.section').create({
    data: {
      title: 'Misiune & Viziune',
      display_order: 1,
      page: despreNoiPage.documentId,
      content: [
        {
          __component: 'blocks.text-block',
          body: [
            { type: 'heading', level: 2, children: [{ type: 'text', text: 'Misiunea noastră' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'SENS este un partid politic ecologist, progresist și pro-european. Ne-am asumat misiunea de a transforma România într-o țară în care oamenii, natura și economia prosperă împreună.' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Credem că protecția mediului, dreptatea socială și dezvoltarea economică nu sunt obiective contradictorii, ci fețele aceleiași monede. România are nevoie de politici publice care pun oamenii și natura pe primul loc.' }] },
            { type: 'heading', level: 2, children: [{ type: 'text', text: 'Viziunea SENS' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Ne imaginăm o Românie în care fiecare cetățean respiră aer curat, are acces la educație de calitate și la un sistem de sănătate centrat pe prevenție. O țară în care energia vine din surse regenerabile, agricultura este ecologică, iar comunitățile locale prosperă prin economie circulară.' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Până în 2040, România poate deveni un model european de tranziție verde — cu 100% energie regenerabilă, transport public electrificat și o economie care crește fără a distruge.' }] },
          ],
          alignment: 'left',
        },
        {
          __component: 'blocks.stats-counter',
          items: [
            { number: '5.000+', label: 'Membri activi' },
            { number: '42', label: 'Filiale locale' },
            { number: '150+', label: 'Acțiuni organizate' },
            { number: '100.000', label: 'Arbori plantați' },
          ],
        },
        {
          __component: 'blocks.program-points',
          items: [
            { area: 'Energie', text: 'Tranziție completă la energie regenerabilă și independență energetică prin solar, eolian și hidrogen verde.' },
            { area: 'Transport', text: 'Rețea națională de transport public electric și infrastructură pentru mobilitate activă în toate orașele.' },
            { area: 'Agricultură', text: 'Sprijin pentru agricultura ecologică, circuite scurte de distribuție și securitate alimentară.' },
            { area: 'Digitalizare', text: 'Guvernare transparentă prin tehnologie, servicii publice digitale accesibile tuturor cetățenilor.' },
            { area: 'Locuire', text: 'Program național de renovare energetică a clădirilor și construcții noi cu standard Nearly Zero Energy.' },
            { area: 'Tineret', text: 'Consilii locale ale tinerilor, stagii verzi garantate și programe de antreprenoriat sustenabil.' },
          ],
          show_link: false,
        },
        {
          __component: 'blocks.quote',
          text: 'Nu moștenim pământul de la părinții noștri, ci îl împrumutăm de la copiii noștri. Fiecare decizie politică pe care o luăm astăzi trebuie să treacă acest test.',
          author: 'Maria Ionescu',
          role: 'Co-Președintă SENS',
        },
      ],
    } as any,
    status: 'published',
  });

  await strapi.documents('api::section.section').create({
    data: {
      title: 'Echipa',
      display_order: 2,
      page: despreNoiPage.documentId,
      content: [
        {
          __component: 'blocks.text-block',
          body: [
            { type: 'heading', level: 2, children: [{ type: 'text', text: 'Conducerea SENS' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'SENS este condus de o echipă de profesioniști dedicați, cu experiență în mediu, educație, sănătate publică și drept european. Conducerea partidului este aleasă democratic de membrii noștri la fiecare doi ani.' }] },
          ],
          alignment: 'left',
        },
        {
          __component: 'blocks.card-grid',
          heading: '',
          columns: '2',
          cards: [
            {
              title: 'Maria Ionescu',
              description: 'Co-Președintă — Activistă de mediu cu 15 ani de experiență în politici publice de sustenabilitate. Fost consilier în Ministerul Mediului.',
              link_text: '',
              link_url: '',
            },
            {
              title: 'Alexandru Popa',
              description: 'Co-Președinte — Economist specializat în dezvoltare durabilă. Profesor universitar și autor a trei cărți despre economia verde.',
              link_text: '',
              link_url: '',
            },
            {
              title: 'Elena Dumitrescu',
              description: 'Vicepreședintă Educație — Profesor de biologie și fondatoare a programului „Școala Verde" implementat în peste 200 de școli din România.',
              link_text: '',
              link_url: '',
            },
            {
              title: 'Andrei Vasilescu',
              description: 'Vicepreședinte Sănătate — Medic specialist în sănătate publică. Coordonator al campaniei naționale pentru acces echitabil la sănătate.',
              link_text: '',
              link_url: '',
            },
          ],
        },
        {
          __component: 'blocks.text-block',
          body: [
            { type: 'heading', level: 2, children: [{ type: 'text', text: 'Echipa operațională' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Pe lângă conducere, SENS se bazează pe o echipă operațională de peste 30 de profesioniști și voluntari dedicați care coordonează campaniile, comunicarea, relațiile cu membrii și activitatea în comunitățile locale.' }] },
          ],
          alignment: 'left',
        },
        {
          __component: 'blocks.card-grid',
          heading: '',
          columns: '3',
          cards: [
            {
              title: 'Diana Stanciu',
              description: 'Secretar General — Juristă specializată în drept european și politici de mediu. A coordonat campanii de advocacy la nivel UE.',
              link_text: '',
              link_url: '',
            },
            {
              title: 'Mihai Georgescu',
              description: 'Director Comunicare — Jurnalist cu 10 ani de experiență în media independentă, specializat pe investigații de mediu.',
              link_text: '',
              link_url: '',
            },
            {
              title: 'Ana Radu',
              description: 'Director Organizare — Sociolog cu experiență în mobilizare comunitară și dezvoltarea rețelelor de voluntari.',
              link_text: '',
              link_url: '',
            },
          ],
        },
        {
          __component: 'blocks.cta-banner',
          title: 'Vrei să faci parte din echipă?',
          description: 'Căutăm oameni pasionați care vor să contribuie la o Românie mai verde și mai dreaptă.',
          button_text: 'Înscrie-te acum',
          button_link: '/inscrie-te',
          background_color: 'green',
        },
      ],
    } as any,
    status: 'published',
  });

  await strapi.documents('api::section.section').create({
    data: {
      title: 'Familia Europeană',
      display_order: 3,
      page: despreNoiPage.documentId,
      content: [
        {
          __component: 'blocks.text-block',
          body: [
            { type: 'heading', level: 2, children: [{ type: 'text', text: 'Familia noastră europeană' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'SENS nu este singur în lupta pentru o Europă verde. Suntem parte a celei mai mari familii politice ecologiste din Europa, alături de partide verzi din peste 30 de țări.' }] },
          ],
          alignment: 'left',
        },
        {
          __component: 'blocks.card-grid',
          heading: '',
          columns: '2',
          cards: [
            {
              icon: '🇪🇺',
              title: 'European Greens',
              description: 'SENS este membru al European Green Party — partidul ecologist european care reunește peste 40 de partide verzi din întreaga Europă. Împreună promovăm politici climatice ambițioase, justiție socială și democrație participativă.',
              link_text: 'europeangreens.eu',
              link_url: 'https://europeangreens.eu',
            },
            {
              icon: '🏛️',
              title: 'Grupul Verzi/ALE',
              description: 'În Parlamentul European, suntem parte a grupului Greens/European Free Alliance — una dintre cele mai influente forțe politice pentru politici climatice ambițioase, drepturile omului și transparență instituțională.',
              link_text: 'greens-efa.eu',
              link_url: 'https://greens-efa.eu',
            },
          ],
        },
        {
          __component: 'blocks.text-block',
          body: [
            { type: 'heading', level: 3, children: [{ type: 'text', text: 'Colaborări internaționale' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Participăm activ la consiliile European Greens, contribuim la elaborarea pozițiilor comune pe teme precum Green Deal-ul European, tranziția energetică justă și protecția biodiversității. Colaborăm cu partide verzi din Germania (Bündnis 90/Die Grünen), Franța (Europe Écologie Les Verts), Austria (Die Grünen) și multe altele.' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Prin această rețea europeană, aducem în România cele mai bune practici și politici publice testate în alte țări, adaptate la contextul românesc.' }] },
          ],
          alignment: 'left',
        },
        {
          __component: 'blocks.stats-counter',
          items: [
            { number: '40+', label: 'Partide membre European Greens' },
            { number: '72', label: 'Europarlamentari Verzi/ALE' },
            { number: '30+', label: 'Țări reprezentate' },
            { number: '15%', label: 'Din voturile PE' },
          ],
        },
      ],
    } as any,
    status: 'published',
  });

  strapi.log.info('✅ Seed data created successfully');
}

/**
 * Configurare etichete câmpuri în română pentru panoul admin.
 * Setează label-urile în limba română prin content-manager store.
 * API-ul rămâne în engleză, doar interfața admin devine prietenoasă.
 */
async function configureAdminLabels(strapi: Core.Strapi) {
  // Mapare: UID content type/componentă → { numeField: 'Etichetă în română' }
  const contentTypeLabels: Record<string, Record<string, string>> = {
    'api::article.article': {
      title: 'Titlu',
      slug: 'URL (slug)',
      excerpt: 'Rezumat',
      body: 'Conținut',
      cover_image: 'Imagine copertă',
      category: 'Categorie',
      author: 'Autor',
      tags: 'Etichete',
      seo: 'SEO',
      reading_time: 'Timp de citire (min)',
    },
    'api::category.category': {
      name: 'Nume',
      slug: 'URL (slug)',
      color: 'Culoare',
      articles: 'Articole',
    },
    'api::tag.tag': {
      name: 'Nume',
      slug: 'URL (slug)',
      articles: 'Articole',
    },
    'api::event.event': {
      title: 'Titlu',
      slug: 'URL (slug)',
      description: 'Descriere',
      start_date: 'Data început',
      end_date: 'Data sfârșit',
      location_name: 'Locație',
      location_coords: 'Coordonate GPS',
      cover_image: 'Imagine copertă',
      max_participants: 'Număr maxim participanți',
      registration_open: 'Înscrieri deschise',
      event_type: 'Tip eveniment',
      social_posts: 'Postări social media',
      ical_url: 'Link calendar',
      seo: 'SEO',
    },
    'api::team-member.team-member': {
      name: 'Nume',
      role: 'Funcție',
      bio: 'Biografie',
      photo: 'Fotografie',
      social_links: 'Rețele sociale',
      display_order: 'Ordine afișare',
      is_leadership: 'Conducere',
      articles: 'Articole',
    },
    'api::page.page': {
      title: 'Titlu',
      slug: 'URL (slug)',
      content: 'Conținut pagină',
      seo: 'SEO',
      sections: 'Secțiuni (tab-uri)',
    },
    'api::section.section': {
      title: 'Titlu tab',
      content: 'Conținut secțiune',
      display_order: 'Ordine afișare',
      page: 'Pagină',
    },
    'api::newsletter-subscriber.newsletter-subscriber': {
      email: 'Email',
      name: 'Nume',
      consent_date: 'Data consimțământ',
      source: 'Sursă',
      status: 'Status',
      ip_address: 'Adresă IP',
    },
    'api::membership-request.membership-request': {
      first_name: 'Prenume',
      last_name: 'Nume',
      email: 'Email',
      phone: 'Telefon',
      birth_date: 'Data nașterii',
      county: 'Județ',
      city: 'Localitate',
      address: 'Adresă',
      motivation: 'Motivație',
      interests: 'Domenii de interes',
      consent_gdpr: 'Consimțământ GDPR',
      consent_statute: 'Accept statutul',
      consent_data_processing: 'Confirmare date corecte',
      consent_newsletter: 'Abonare newsletter',
      status: 'Status cerere',
      notes: 'Note interne',
    },
    'api::homepage.homepage': {
      content: 'Conținut pagină',
      seo: 'SEO',
    },
    'api::navigation.navigation': {
      main_menu: 'Meniu principal',
      secondary_menu: 'Meniu secundar (dreapta)',
      mobile_extra_links: 'Linkuri extra mobil',
    },
    'api::contact-page.contact-page': {
      title: 'Titlu',
      subtitle: 'Subtitlu',
      email: 'Email contact',
      address: 'Adresă sediu',
      schedule: 'Program',
      newsletter_title: 'Titlu newsletter',
      newsletter_description: 'Descriere newsletter',
      seo: 'SEO',
    },
    'api::donate-page.donate-page': {
      title: 'Titlu',
      description: 'Descriere',
      preset_amounts: 'Sume predefinite',
      cmf_text: 'Text mandatar CMF',
      transparency_items: 'Elemente transparență',
      seo: 'SEO',
    },
  };

  const componentLabels: Record<string, Record<string, string>> = {
    'blocks.hero': {
      title: 'Titlu',
      subtitle: 'Subtitlu',
      cta_text: 'Text buton',
      cta_link: 'Link buton',
      cta_secondary_text: 'Text buton secundar',
      cta_secondary_link: 'Link buton secundar',
      background_image: 'Imagine fundal',
    },
    'blocks.text-block': {
      body: 'Conținut',
      alignment: 'Aliniere',
    },
    'blocks.cta-banner': {
      title: 'Titlu',
      description: 'Descriere',
      button_text: 'Text buton',
      button_link: 'Link buton',
      background_color: 'Culoare fundal',
    },
    'blocks.image-gallery': {
      images: 'Imagini',
      layout: 'Aranjament',
      caption: 'Legendă',
    },
    'blocks.accordion': {
      heading: 'Titlu secțiune',
      items: 'Elemente',
    },
    'blocks.accordion-item': {
      title: 'Titlu',
      content: 'Conținut',
    },
    'blocks.quote': {
      text: 'Citat',
      author: 'Autor',
      role: 'Funcție',
    },
    'blocks.video-embed': {
      url: 'Link video (YouTube/Vimeo)',
      caption: 'Legendă',
    },
    'blocks.stats-counter': {
      items: 'Statistici',
    },
    'blocks.stat-item': {
      number: 'Număr',
      label: 'Etichetă',
    },
    'blocks.program-points': {
      items: 'Puncte program',
      show_link: 'Afișează link',
      link_text: 'Text link',
      link_url: 'URL link',
    },
    'blocks.program-item': {
      area: 'Domeniu',
      text: 'Descriere',
    },
    'blocks.newsletter-cta': {
      title: 'Titlu',
      description: 'Descriere',
      placeholder_text: 'Text placeholder',
    },
    'shared.seo': {
      meta_title: 'Titlu SEO',
      meta_description: 'Descriere SEO',
      og_image: 'Imagine partajare',
      canonical_url: 'URL canonic',
      no_index: 'Ascunde de motoarele de căutare',
    },
    'shared.social-link': {
      platform: 'Platformă',
      url: 'Link',
    },
    'homepage.value-card': {
      title: 'Titlu',
      short_text: 'Text scurt',
      description: 'Descriere',
      points: 'Puncte cheie',
      link_text: 'Text link',
      link_url: 'URL link',
    },
    'homepage.value-point': {
      text: 'Text',
    },
    'event.social-post': {
      platform: 'Platformă',
      post_url: 'Link postare',
      embed_text: 'Text',
      media: 'Media',
    },
    'navigation.menu-item': {
      label: 'Etichetă',
      url: 'URL',
      order: 'Ordine',
      open_in_new_tab: 'Deschide în tab nou',
      children: 'Sub-elemente',
    },
    'navigation.menu-sub-item': {
      label: 'Etichetă',
      url: 'URL',
    },
    'blocks.card-grid': {
      heading: 'Titlu secțiune',
      columns: 'Coloane',
      cards: 'Carduri',
    },
    'blocks.card-grid-item': {
      icon: 'Pictogramă (emoji)',
      title: 'Titlu',
      description: 'Descriere',
      points: 'Puncte cheie',
      link_text: 'Text link',
      link_url: 'URL link',
      image: 'Imagine',
    },
    'blocks.latest-articles': {
      heading: 'Titlu secțiune',
      count: 'Număr articole',
      show_category: 'Afișează categoria',
      cta_text: 'Text buton',
      cta_link: 'Link buton',
    },
    'blocks.upcoming-events': {
      heading: 'Titlu secțiune',
      count: 'Număr evenimente',
      cta_text: 'Text buton',
      cta_link: 'Link buton',
    },
    'blocks.contact-form': {
      heading: 'Titlu',
      description: 'Descriere',
      success_message: 'Mesaj de succes',
    },
    'blocks.spacer': {
      height: 'Înălțime',
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

async function applyLabels(
  strapi: Core.Strapi,
  storeKey: string,
  labels: Record<string, string>
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
    for (const [field, label] of Object.entries(labels)) {
      if (config.metadatas[field]) {
        if (config.metadatas[field].edit) {
          config.metadatas[field].edit.label = label;
          changed = true;
        }
        if (config.metadatas[field].list) {
          config.metadatas[field].list.label = label;
          changed = true;
        }
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
