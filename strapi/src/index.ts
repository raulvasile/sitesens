import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ── Seed: configurare rol Public ──
    await setupPublicPermissions(strapi);

    // ── Seed: date demo (doar dacă nu există deja) ──
    await seedData(strapi);

    // ── Top-up: evenimente noi (idempotent — adaugă doar cele lipsă) ──
    await topUpEvents(strapi);

    // ── Top-up: județe (idempotent) ──
    await topUpCounties(strapi);

    // ── Top-up: domenii de interes (idempotent) ──
    await topUpInterestAreas(strapi);

    // ── Top-up: pagini single type (idempotent — populate dacă sunt goale) ──
    await topUpInscriptionPage(strapi);
    await topUpNewsletterPage(strapi);
    await topUpCommunityPage(strapi);
    await topUpPrivacyPolicyPage(strapi);
    await topUpEventsPage(strapi);

    // ── Migration: populează blocks.social-feed cu platforms dacă lipsesc ──
    await migrateSocialFeedPlatforms(strapi);

    // ── Migration: activează auto_next_event + meta_text pe Hero din homepage ──
    await migrateHeroFeaturedLink(strapi);

    // ── Migration: schimbă background_color 'green' → 'lime' pe word-carousel ──
    await migrateWordCarouselBackground(strapi);

    // ── Migration: tab Echipa din /despre-noi — card-grid static → TeamGrid ──
    await migrateAboutTeamSection(strapi);

    // ── Migration: article.body (blocks) → article.content (dynamic zone) ──
    await migrateArticleBodyToContent(strapi);

    // ── Migration: rebrand partidulsens.ro → cusens.eu pentru câmpurile defaults ──
    await migrateContactRebrand(strapi);

    // ── Admin: etichete câmpuri în română ──
    await configureAdminLabels(strapi);
  },
};

/**
 * Top-up idempotent pentru evenimente noi. Verifică fiecare slug înainte de a crea,
 * astfel încât restart-urile ulterioare ale Strapi adaugă doar evenimentele lipsă.
 */
async function topUpEvents(strapi: Core.Strapi) {
  const now = new Date();
  const daysFromNow = (d: number, hour = 18) => {
    const date = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
    date.setHours(hour, 0, 0, 0);
    return date;
  };

  const newEvents = [
    {
      slug: 'intalnire-buget-participativ',
      data: {
        title: 'Întâlnire Comunitară: Bugetul Participativ',
        slug: 'intalnire-buget-participativ',
        description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Ce proiecte locale ar trebui să finanțăm? Vino să discutăm și să votăm împreună prioritățile comunității.' }] }],
        start_date: daysFromNow(5, 19).toISOString(),
        end_date: daysFromNow(5, 21).toISOString(),
        location_name: 'Casa Civică, Cluj-Napoca',
        max_participants: 80,
        registration_open: true,
        event_type: 'dezbatere',
      },
    },
    {
      slug: 'mars-clima-bucuresti',
      data: {
        title: 'Marș pentru Clima: București, Piața Victoriei',
        slug: 'mars-clima-bucuresti',
        description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Organizăm un marș pașnic pentru politici climatice mai ambițioase. Aducem familia, prietenii și mesajele pe pancarte!' }] }],
        start_date: daysFromNow(10, 17).toISOString(),
        end_date: daysFromNow(10, 20).toISOString(),
        location_name: 'Piața Victoriei, București',
        max_participants: 5000,
        registration_open: true,
        event_type: 'mars',
      },
    },
    {
      slug: 'workshop-tineri-candidati',
      data: {
        title: 'Workshop: Cum să candidezi ca tânăr independent',
        slug: 'workshop-tineri-candidati',
        description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Sesiune practică pentru tineri sub 30 de ani care vor să intre în politica locală. Aspecte legale, strategie, campanie și bugetare.' }] }],
        start_date: daysFromNow(21, 11).toISOString(),
        end_date: daysFromNow(21, 15).toISOString(),
        location_name: 'Hub Timișoara, Str. Mercy',
        max_participants: 40,
        registration_open: true,
        event_type: 'actiune',
      },
    },
    {
      slug: 'dezbatere-educatie-ecologica',
      data: {
        title: 'Dezbatere online: Educația Ecologică în Școli',
        slug: 'dezbatere-educatie-ecologica',
        description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Cum integrăm educația ecologică în curriculum? Invităm profesori, elevi, părinți și experți în educație.' }] }],
        start_date: daysFromNow(45, 18).toISOString(),
        end_date: daysFromNow(45, 20).toISOString(),
        location_name: 'Online — YouTube Live',
        max_participants: 1000,
        registration_open: true,
        event_type: 'online',
      },
    },
    {
      slug: 'plantare-nationala-arbori',
      data: {
        title: 'Plantare Națională: 10.000 de Arbori într-o Zi',
        slug: 'plantare-nationala-arbori',
        description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Acțiune coordonată în 15 orașe. Înscrie-te în orașul tău — puieții și uneltele sunt asigurate. Aduce mănuși și apă!' }] }],
        start_date: daysFromNow(60, 9).toISOString(),
        end_date: daysFromNow(60, 15).toISOString(),
        location_name: 'Multi-oraș (15 locații)',
        max_participants: 3000,
        registration_open: true,
        event_type: 'actiune',
      },
    },
  ];

  let added = 0;
  for (const event of newEvents) {
    const existing = await strapi.documents('api::event.event').findMany({
      filters: { slug: event.slug },
      limit: 1,
    });
    if (existing.length === 0) {
      await strapi.documents('api::event.event').create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: event.data as any,
        status: 'published',
      });
      added++;
    }
  }

  if (added > 0) {
    strapi.log.info(`📅 Evenimente noi adăugate: ${added}`);
  }
}

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
    { controller: 'api::county.county', actions: ['find', 'findOne'] },
    { controller: 'api::interest-area.interest-area', actions: ['find', 'findOne'] },
    // Single types
    { controller: 'api::homepage.homepage', actions: ['find'] },
    { controller: 'api::contact-page.contact-page', actions: ['find'] },
    { controller: 'api::donate-page.donate-page', actions: ['find'] },
    { controller: 'api::navigation.navigation', actions: ['find'] },
    { controller: 'api::footer.footer', actions: ['find'] },
    { controller: 'api::inscription-page.inscription-page', actions: ['find'] },
    { controller: 'api::newsletter-page.newsletter-page', actions: ['find'] },
    { controller: 'api::community-page.community-page', actions: ['find'] },
    { controller: 'api::privacy-policy-page.privacy-policy-page', actions: ['find'] },
    { controller: 'api::events-page.events-page', actions: ['find'] },
    { controller: 'api::site-theme.site-theme', actions: ['find'] },
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
    // Evenimentele viitoare suplimentare sunt gestionate de topUpEvents (idempotent).
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
              icon: 'heart',
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
              icon: 'book',
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
              icon: 'leaf',
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
              icon: 'globe',
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
          __component: 'blocks.social-feed',
          title: 'Urmărește-ne',
          subtitle: 'Fii la curent cu activitatea noastră pe rețelele sociale.',
          show_embeds: false,
          variant: 'compact',
          platforms: [
            { name: 'Facebook', handle: 'miscarea.sens', url: 'https://www.facebook.com/miscarea.sens', description: 'Știri, comunicate și discuții.', color: '#1877f2', follow_cta: 'Urmărește', order: 1 },
            { name: 'Instagram', handle: '@miscarea.sens', url: 'https://www.instagram.com/miscarea.sens/', description: 'Imagini și povești din comunitate.', color: '#E1306C', follow_cta: 'Urmărește', order: 2 },
            { name: 'TikTok', handle: '@miscarea.sens', url: 'https://www.tiktok.com/@miscarea.sens', description: 'Conținut video scurt despre valorile noastre.', color: '#000000', follow_cta: 'Urmărește', order: 3 },
          ],
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
        { label: 'Comunitate', url: '/comunitate', order: 4, open_in_new_tab: false },
        { label: 'Contact', url: '/contact', order: 5, open_in_new_tab: false },
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
        { platform: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/miscarea.sens' },
        { platform: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/miscarea.sens/' },
        { platform: 'twitter', label: 'X / Twitter', url: 'https://twitter.com/miscarea_sens' },
        { platform: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@miscarea.sens' },
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
      email: 'contact@cusens.eu',
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
              icon: 'globe',
              title: 'European Greens',
              description: 'SENS este membru al European Green Party — partidul ecologist european care reunește peste 40 de partide verzi din întreaga Europă. Împreună promovăm politici climatice ambițioase, justiție socială și democrație participativă.',
              link_text: 'europeangreens.eu',
              link_url: 'https://europeangreens.eu',
            },
            {
              icon: 'landmark',
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
      required_generic: { label: 'Mesaj generic obligatoriu', description: 'Folosit când un câmp obligatoriu e gol.' },
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

/**
 * Top-up 42 județe (idempotent — doar cele lipsă).
 */
async function topUpCounties(strapi: Core.Strapi) {
  const counties = [
    'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
    'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
    'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
    'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
    'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
    'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea',
  ];

  let added = 0;
  for (let i = 0; i < counties.length; i++) {
    const name = counties[i];
    const existing = await strapi.documents('api::county.county' as any).findMany({
      filters: { name },
      limit: 1,
    });
    if (existing.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await strapi.documents('api::county.county' as any).create({
        data: { name, order: i } as any,
      });
      added++;
    }
  }

  if (added > 0) {
    strapi.log.info(`🗺️  Județe adăugate: ${added}/${counties.length}`);
  }
}

/**
 * Top-up domenii de interes (idempotent).
 */
async function topUpInterestAreas(strapi: Core.Strapi) {
  const areas = [
    { name: 'Mediu', icon: '🌱', description: 'Protecția naturii, biodiversitate, arii protejate.' },
    { name: 'Educație', icon: '📚', description: 'Reforma educațională, acces și calitate.' },
    { name: 'Sănătate', icon: '❤️', description: 'Sistem de sănătate centrat pe prevenție.' },
    { name: 'Sustenabilitate', icon: '♻️', description: 'Tranziție verde, economie circulară.' },
    { name: 'Tineret', icon: '🌟', description: 'Politici pentru generația tânără.' },
    { name: 'Digitalizare', icon: '💻', description: 'Guvernare digitală, servicii moderne.' },
    { name: 'Agricultură', icon: '🌾', description: 'Agricultură ecologică, securitate alimentară.' },
    { name: 'Transport', icon: '🚊', description: 'Transport public verde, mobilitate activă.' },
    { name: 'Energie', icon: '⚡', description: 'Energie regenerabilă, independență energetică.' },
  ];

  let added = 0;
  for (let i = 0; i < areas.length; i++) {
    const a = areas[i];
    const existing = await strapi.documents('api::interest-area.interest-area' as any).findMany({
      filters: { name: a.name },
      limit: 1,
    });
    if (existing.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await strapi.documents('api::interest-area.interest-area' as any).create({
        data: { ...a, order: i } as any,
      });
      added++;
    }
  }

  if (added > 0) {
    strapi.log.info(`🎯 Domenii de interes adăugate: ${added}/${areas.length}`);
  }
}

/**
 * Top-up inscription page (idempotent — populate doar dacă e goală).
 */
async function topUpInscriptionPage(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::inscription-page.inscription-page' as any).findFirst();
  if (existing?.title) return;

  const data = {
    title: 'Înscrie-te în SENS',
    subtitle: 'Completează formularul de mai jos pentru a iniția procesul de aderare.',
    personal_section_heading: 'Informații personale',
    address_section_heading: 'Adresă',
    submit_text: 'Trimite cererea',
    submitting_text: 'Se trimite...',
    prev_step_text: 'Pasul anterior',
    next_step_text: 'Pasul următor',
    steps: [
      { number: 1, label: 'Date personale' },
      { number: 2, label: 'Motivație' },
      { number: 3, label: 'Confirmare' },
    ],
    labels: {
      first_name_label: 'Prenume', first_name_placeholder: 'Prenumele tău',
      last_name_label: 'Nume', last_name_placeholder: 'Numele tău',
      email_label: 'Email', email_placeholder: 'email@exemplu.ro',
      phone_label: 'Telefon', phone_placeholder: '07xx xxx xxx',
      birth_date_label: 'Data nașterii',
      county_label: 'Județ', county_placeholder: 'Alege județul',
      city_label: 'Localitate', city_placeholder: 'Orașul sau comuna',
      address_label: 'Adresa completă', address_placeholder: 'Strada, număr, bloc, scara, apartament',
      motivation_label: 'Motivație (opțional)', motivation_placeholder: 'De ce vrei să te alături mișcării SENS?',
      interests_label: 'Domenii de interes',
      interests_help: 'Alege domeniile în care vrei să te implici. Poți selecta mai multe.',
    },
    validation: {
      required_generic: 'Acest câmp este obligatoriu',
      email_required: 'Email-ul este obligatoriu',
      email_invalid: 'Email invalid',
      phone_required: 'Telefonul este obligatoriu',
      phone_invalid: 'Număr de telefon invalid',
      first_name_required: 'Prenumele este obligatoriu',
      last_name_required: 'Numele este obligatoriu',
      birth_date_required: 'Data nașterii este obligatorie',
      county_required: 'Județul este obligatoriu',
      city_required: 'Localitatea este obligatorie',
      address_required: 'Adresa este obligatorie',
      consent_required: 'Trebuie să accepți această condiție pentru a continua',
      duplicate_error: 'Există deja o cerere cu acest email',
      generic_error: 'A apărut o eroare. Încearcă din nou în câteva momente.',
    },
    consents: [
      { key: 'gdpr', label: 'Sunt de acord cu prelucrarea datelor personale conform Politicii de Confidențialitate.', required: true },
      { key: 'statute', label: 'Am citit și accept Statutul Partidului SENS.', required: true },
      { key: 'data_processing', label: 'Confirm că datele furnizate sunt corecte și complete.', required: true },
      { key: 'newsletter', label: 'Doresc să primesc newsletter-ul SENS pe email.', required: false },
    ],
    success: {
      title: 'Cererea ta a fost trimisă!',
      message: 'Mulțumim pentru interesul tău de a face parte din SENS. Echipa noastră va analiza cererea și te va contacta în cel mai scurt timp.',
      next_steps_heading: 'Pașii următori:',
      next_steps: [
        { icon: '📧', text: 'Vei primi un email de confirmare în câteva minute.' },
        { icon: '📞', text: 'Un coordonator local te va contacta în 3-5 zile lucrătoare.' },
        { icon: '🤝', text: 'Te vei alătura echipei din județul tău pentru prima întâlnire.' },
      ],
      primary_cta_label: 'Înapoi la pagina principală',
      primary_cta_url: '/',
      secondary_cta_label: 'Află mai multe despre SENS',
      secondary_cta_url: '/despre-noi',
    },
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await strapi.documents('api::inscription-page.inscription-page' as any).create({
      data: data as any,
      status: 'published',
    });
    strapi.log.info('📝 Inscription page seeded');
  } catch (err) {
    strapi.log.warn(`Inscription page seed failed: ${err}`);
  }
}

/**
 * Top-up newsletter page.
 */
async function topUpNewsletterPage(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::newsletter-page.newsletter-page' as any).findFirst();
  if (existing?.title) return;

  const data = {
    title: 'Rămâi la curent cu SENS',
    description: 'Abonează-te la newsletter pentru știri, comunicate și actualizări din partid. Primești maxim 2 emailuri pe săptămână.',
    form: {
      name_label: 'Nume (opțional)',
      name_placeholder: 'Numele tău',
      email_label: 'Email',
      email_placeholder: 'email@exemplu.ro',
      submit_text: 'Abonează-te la newsletter',
      submitting_text: 'Se abonează...',
      consent_text: 'Sunt de acord cu prelucrarea datelor personale conform Politicii de Confidențialitate.',
      success_title: 'Mulțumim pentru abonare!',
      success_message: 'Vei primi un email de confirmare. Verifică și folderul Spam dacă nu îl găsești.',
    },
    benefits_heading: 'Ce vei primi',
    benefits: [
      { emoji: '📢', title: 'Comunicate oficiale', description: 'Primele știri și anunțuri direct de la echipa SENS.' },
      { emoji: '📊', title: 'Analize și rapoarte', description: 'Studii aprofundate despre politicile noastre.' },
      { emoji: '🎟️', title: 'Invitații la evenimente', description: 'Acces prioritar la dezbateri, întâlniri și acțiuni.' },
    ],
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await strapi.documents('api::newsletter-page.newsletter-page' as any).create({
      data: data as any,
      status: 'published',
    });
    strapi.log.info('📧 Newsletter page seeded');
  } catch (err) {
    strapi.log.warn(`Newsletter page seed failed: ${err}`);
  }
}

/**
 * Top-up community page.
 */
async function topUpCommunityPage(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::community-page.community-page' as any).findFirst();
  if (existing?.title) return;

  const data = {
    title: 'Comunitate',
    subtitle: 'Urmărește-ne pe rețelele sociale și fii la curent cu activitatea noastră.',
    posts_heading: 'Ultimele postări',
    features_heading: 'De ce să ne urmărești?',
    embed_fallback_text: 'Deschide pe {platform}',
    platforms: [
      {
        name: 'Facebook', handle: 'miscarea.sens',
        url: 'https://www.facebook.com/miscarea.sens',
        description: 'Știri, comunicate și discuții cu comunitatea noastră.',
        color: '#1877f2',
        embed_url: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmiscarea.sens',
        follow_cta: 'Urmărește', order: 1,
      },
      {
        name: 'Instagram', handle: '@miscarea.sens',
        url: 'https://www.instagram.com/miscarea.sens/',
        description: 'Imagini din activitățile noastre, povești și momente din comunitate.',
        color: '#E1306C',
        embed_url: 'https://www.instagram.com/miscarea.sens/embed',
        follow_cta: 'Urmărește', order: 2,
      },
      {
        name: 'TikTok', handle: '@miscarea.sens',
        url: 'https://www.tiktok.com/@miscarea.sens',
        description: 'Conținut video scurt despre valorile și acțiunile noastre.',
        color: '#000000',
        follow_cta: 'Urmărește', order: 3,
      },
    ],
    features: [
      { emoji: '📢', title: 'Comunicate și poziții', description: 'Primele știri și reacții oficiale la evenimente din actualitate.' },
      { emoji: '📸', title: 'Din teren', description: 'Imagini și povești din acțiunile noastre la nivel național.' },
      { emoji: '💬', title: 'Conversație', description: 'Răspundem la întrebări și inițiem discuții despre schimbare.' },
    ],
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await strapi.documents('api::community-page.community-page' as any).create({
      data: data as any,
      status: 'published',
    });
    strapi.log.info('🌐 Community page seeded');
  } catch (err) {
    strapi.log.warn(`Community page seed failed: ${err}`);
  }
}

/**
 * Top-up privacy policy page.
 */
async function topUpPrivacyPolicyPage(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::privacy-policy-page.privacy-policy-page' as any).findFirst();
  if (existing?.title) return;

  const data = {
    title: 'Politica de Confidențialitate',
    subtitle: 'Cum protejăm datele tale personale',
    content: [
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'Operator de date' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Partidul SENS (CMF nr. 11240065) este operatorul datelor tale personale, colectate prin intermediul acestui site.' }] },
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'Date colectate' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Colectăm datele pe care ni le furnizezi direct prin formularele de pe site (nume, email, telefon, date demografice) și date tehnice anonime (adresa IP, user agent).' }] },
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'Scopul prelucrării' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Folosim datele pentru: procesarea cererilor de aderare, trimiterea newsletter-ului (dacă ai consimțit), comunicare cu tine, statistici anonime.' }] },
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'Drepturile tale' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Ai dreptul de acces, rectificare, ștergere, portabilitate și opoziție la prelucrare. Pentru a exercita aceste drepturi, contactează-ne la contact@cusens.eu.' }] },
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'Cookies' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Site-ul folosește cookies strict necesare și, cu consimțământul tău, cookies de analiză (Google Analytics). Poți refuza cookies non-esențiale.' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Ultima actualizare: ' + new Date().toLocaleDateString('ro-RO') }] },
    ],
    cmf_text: 'Partidul SENS — CMF nr. 11240065',
    last_updated: new Date().toISOString().split('T')[0],
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await strapi.documents('api::privacy-policy-page.privacy-policy-page' as any).create({
      data: data as any,
      status: 'published',
    });
    strapi.log.info('🔒 Privacy policy page seeded');
  } catch (err) {
    strapi.log.warn(`Privacy policy seed failed: ${err}`);
  }
}

/**
 * Migration: populează blocks.social-feed din homepage cu `platforms` dacă lipsesc
 * (pentru homepage-uri seedate în versiunea veche a schemei).
 */
async function migrateSocialFeedPlatforms(strapi: Core.Strapi) {
  try {
    const homepage = await strapi.documents('api::homepage.homepage').findFirst({
      populate: { content: { populate: '*' } as any } as any,
    });
    if (!homepage || !Array.isArray((homepage as any).content)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (homepage as any).content as any[];
    const defaultPlatforms = [
      { name: 'Facebook', handle: 'miscarea.sens', url: 'https://www.facebook.com/miscarea.sens', description: 'Știri, comunicate și discuții.', color: '#1877f2', follow_cta: 'Urmărește', order: 1 },
      { name: 'Instagram', handle: '@miscarea.sens', url: 'https://www.instagram.com/miscarea.sens/', description: 'Imagini și povești din comunitate.', color: '#E1306C', follow_cta: 'Urmărește', order: 2 },
      { name: 'TikTok', handle: '@miscarea.sens', url: 'https://www.tiktok.com/@miscarea.sens', description: 'Conținut video scurt despre valorile noastre.', color: '#000000', follow_cta: 'Urmărește', order: 3 },
    ];

    let needsUpdate = false;
    const newContent = content.map((block) => {
      if (block?.__component === 'blocks.social-feed') {
        if (!Array.isArray(block.platforms) || block.platforms.length === 0) {
          needsUpdate = true;
          return { ...block, platforms: defaultPlatforms };
        }
      }
      return block;
    });

    if (needsUpdate) {
      await strapi.documents('api::homepage.homepage').update({
        documentId: (homepage as any).documentId,
        data: { content: newContent } as any,
        status: 'published',
      });
      strapi.log.info('🔁 SocialFeed platforms populated in homepage');
    }
  } catch (err) {
    strapi.log.warn(`SocialFeed migration failed: ${err}`);
  }
}

/**
 * Migration: populează Hero meta_text + activează featured_link cu auto_next_event
 * pentru homepage-uri existente (fallback pentru schema nouă).
 */
async function migrateHeroFeaturedLink(strapi: Core.Strapi) {
  try {
    const homepage = await strapi.documents('api::homepage.homepage').findFirst({
      populate: { content: { populate: '*' } as any } as any,
    });
    if (!homepage || !Array.isArray((homepage as any).content)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (homepage as any).content as any[];

    let needsUpdate = false;
    const newContent = content.map((block) => {
      if (block?.__component === 'blocks.hero') {
        const updates: Record<string, unknown> = {};
        if (!block.meta_text) {
          updates.meta_text = 'Live · manifest 2026';
        }
        if (!block.next_event) {
          updates.next_event = {
            label: 'Următorul eveniment',
            cta_text: 'Rezervă loc',
            icon: '📅',
            empty_label: 'Vezi toate evenimentele',
            empty_url: '/evenimente',
            hide_when_empty: false,
          };
        }
        if (Object.keys(updates).length > 0) {
          needsUpdate = true;
          return { ...block, ...updates };
        }
      }
      return block;
    });

    if (needsUpdate) {
      await strapi.documents('api::homepage.homepage').update({
        documentId: (homepage as any).documentId,
        data: { content: newContent } as any,
        status: 'published',
      });
      strapi.log.info('🎯 Hero featured_link + meta_text populated in homepage');
    }
  } catch (err) {
    strapi.log.warn(`Hero featured_link migration failed: ${err}`);
  }
}

/**
 * Migration: schimbă word-carousel background_color 'green' → 'lime' (noua paletă Direction C).
 * One-shot: după prima rulare, background rămâne 'lime' și nu e schimbat înapoi dacă user-ul îl modifică.
 */
async function migrateWordCarouselBackground(strapi: Core.Strapi) {
  try {
    const homepage = await strapi.documents('api::homepage.homepage').findFirst({
      populate: { content: { populate: '*' } as any } as any,
    });
    if (!homepage || !Array.isArray((homepage as any).content)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (homepage as any).content as any[];

    let needsUpdate = false;
    const newContent = content.map((block) => {
      if (block?.__component === 'blocks.word-carousel' && block.background_color === 'green') {
        needsUpdate = true;
        return { ...block, background_color: 'lime' };
      }
      return block;
    });

    if (needsUpdate) {
      await strapi.documents('api::homepage.homepage').update({
        documentId: (homepage as any).documentId,
        data: { content: newContent } as any,
        status: 'published',
      });
      strapi.log.info('🎨 WordCarousel background migrated to lime');
    }
  } catch (err) {
    strapi.log.warn(`WordCarousel migration failed: ${err}`);
  }
}

/**
 * Migration: pe /despre-noi → tab "Echipa", înlocuiește cele 2 card-grid-uri
 * statice (care duplică datele din colecția team-member) cu 2 blocuri TeamGrid
 * care fetch-uiesc dinamic. Sursa unică de adevăr devine colecția Echipă.
 *
 * 1. Creează team-members lipsă (Mihai Georgescu, Ana Radu — existau doar în
 *    cardurile statice, nu și în colecție).
 * 2. Înlocuiește card-grid-urile cu TeamGrid (mode: leadership / team).
 *
 * Idempotent: skip dacă secțiunea nu mai conține card-grid-uri.
 */
async function migrateAboutTeamSection(strapi: Core.Strapi) {
  const missingMembers = [
    {
      name: 'Mihai Georgescu',
      role: 'Director Comunicare',
      bio: 'Jurnalist cu 10 ani de experiență în media independentă, specializat pe investigații de mediu.',
      display_order: 6,
      is_leadership: false,
    },
    {
      name: 'Ana Radu',
      role: 'Director Organizare',
      bio: 'Sociolog cu experiență în mobilizare comunitară și dezvoltarea rețelelor de voluntari.',
      display_order: 7,
      is_leadership: false,
    },
  ];

  try {
    // ── 1. Creează membrii lipsă (idempotent) ──
    for (const data of missingMembers) {
      const existing = await strapi.documents('api::team-member.team-member').findMany({
        filters: { name: { $eq: data.name } } as any,
      });
      if (existing.length > 0) continue;
      await strapi.documents('api::team-member.team-member').create({
        data: data as any,
        status: 'published',
      });
      strapi.log.info(`👥 Created team-member: ${data.name}`);
    }

    // ── 2. Găsește secțiunea Echipa din /despre-noi ──
    const pages = await strapi.documents('api::page.page').findMany({
      filters: { slug: { $eq: 'despre-noi' } } as any,
      populate: { sections: { populate: { content: { populate: '*' } } } as any } as any,
    });
    const page = pages[0] as any;
    if (!page) return;
    const echipa = (page.sections as any[] | undefined)?.find((s: any) => s.title === 'Echipa');
    if (!echipa) return;

    const oldContent = (echipa.content || []) as any[];
    const cardGridCount = oldContent.filter((c) => c.__component === 'blocks.card-grid').length;
    if (cardGridCount === 0) return; // already migrated

    // ── 3. Reconstruiește content: keep text-blocks/cta-banner, replace card-grids ──
    const stripId = (c: any) => {
      const { id, ...rest } = c;
      return rest;
    };

    const newContent: any[] = [];
    let cardGridIndex = 0;
    for (const block of oldContent) {
      if (block.__component === 'blocks.card-grid') {
        cardGridIndex++;
        newContent.push({
          __component: 'blocks.team-grid',
          kicker: cardGridIndex === 1 ? 'Conducere' : 'Echipa operațională',
          heading: cardGridIndex === 1 ? 'Conducerea SENS' : 'Directori și coordonatori',
          mode: cardGridIndex === 1 ? 'leadership' : 'team',
          limit: 12,
          background_color: 'paper',
        });
      } else {
        newContent.push(stripId(block));
      }
    }

    await strapi.documents('api::section.section').update({
      documentId: echipa.documentId,
      data: { content: newContent } as any,
      status: 'published',
    });
    strapi.log.info(
      `👥 About → Echipa: replaced ${cardGridIndex} static card-grid(s) with TeamGrid blocks (single source of truth: team-member collection)`
    );
  } catch (err) {
    strapi.log.warn(`About team section migration failed: ${err}`);
  }
}

/**
 * Migration: înlocuiește email-ul vechi (contact@partidulsens.ro) cu cel nou
 * (contact@cusens.eu) doar dacă utilizatorul nu l-a personalizat. Idempotentă.
 */
async function migrateContactRebrand(strapi: Core.Strapi) {
  const OLD_EMAIL = 'contact@partidulsens.ro';
  const NEW_EMAIL = 'contact@cusens.eu';
  try {
    const cp = (await strapi.documents('api::contact-page.contact-page' as any).findFirst()) as any;
    if (!cp) return;
    const patch: Record<string, unknown> = {};
    if (cp.email === OLD_EMAIL) patch.email = NEW_EMAIL;
    // form_kicker stays defaulted because it labels a section ("Mesaj direct").
    // header_eyebrow is intentionally NOT backfilled — empty by default; editors opt in.
    if (!cp.form_kicker) patch.form_kicker = 'Mesaj direct';
    if (Object.keys(patch).length === 0) return;

    await strapi.documents('api::contact-page.contact-page' as any).update({
      documentId: cp.documentId,
      data: patch as any,
      status: 'published',
    });
    if (patch.email) strapi.log.info(`✉️  Contact email rebranded: ${OLD_EMAIL} → ${NEW_EMAIL}`);
    if (patch.form_kicker) strapi.log.info('✉️  Contact form_kicker backfilled');
  } catch (err) {
    strapi.log.warn(`Contact rebrand migration failed: ${err}`);
  }
}

/**
 * Migration: pentru articolele care au `body` (rich text legacy, deja scos
 * din schemă dar coloana mai există în DB) dar nu au `content` (dynamic zone
 * nou), copiază body-ul într-un `blocks.text-block` la începutul lui `content`.
 *
 * Folosește un query raw pe DB pentru `body` pentru că field-ul nu mai e în
 * schemă; documents().findMany nu mai returnează coloana. Idempotent — sare
 * peste articolele care au deja content populat sau body gol.
 */
async function migrateArticleBodyToContent(strapi: Core.Strapi) {
  try {
    // Raw read of the legacy `body` column (Strapi blocks-format JSON).
    // The column may not exist on fresh installs — guard with a try/catch.
    let rows: Array<{ document_id: string; body: unknown }>;
    try {
      rows = (await strapi.db.connection
        .from('articles')
        .select('document_id', 'body')
        .whereNotNull('body')) as Array<{ document_id: string; body: unknown }>;
    } catch {
      return; // column doesn't exist (fresh DB) — nothing to migrate
    }

    let migrated = 0;
    for (const row of rows) {
      // body in Postgres jsonb comes back parsed; in SQLite it's a string.
      let body: unknown = row.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { continue; }
      }
      if (!Array.isArray(body) || body.length === 0) continue;

      const article = await strapi.documents('api::article.article').findFirst({
        filters: { documentId: { $eq: row.document_id } } as any,
        populate: { content: true } as any,
      });
      if (!article) continue;
      const hasContent = Array.isArray((article as any).content) && (article as any).content.length > 0;
      if (hasContent) continue;

      await strapi.documents('api::article.article').update({
        documentId: row.document_id,
        data: {
          content: [
            { __component: 'blocks.text-block', body, alignment: 'left' },
          ],
        } as any,
        status: 'published',
      });
      migrated++;
    }
    if (migrated > 0) {
      strapi.log.info(`📝 Migrated ${migrated} article(s): body → content (text-block)`);
    }
  } catch (err) {
    strapi.log.warn(`Article body→content migration failed: ${err}`);
  }
}

/**
 * Top-up events page (idempotent — populate dacă e goală).
 */
async function topUpEventsPage(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::events-page.events-page' as any).findFirst();
  if ((existing as any)?.title) return;

  const data = {
    eyebrow: 'EVENIMENTE · CALENDAR 2026',
    title: 'Ne vedem',
    title_italic: 'pe teren.',
    lead: 'Dezbateri, marșuri, workshop-uri, întâlniri de filială. Politica se face în oameni, nu în comunicate de presă.',
    featured_label: 'FEATURED',
    featured_cta_primary: 'Rezervă loc',
    featured_cta_secondary: '+ Adaugă în calendar',
    location_label: 'Locație',
    interval_label: 'Interval',
    spots_template: '{taken} / {max} locuri',
    list_reserve_cta: 'Rezervă',
    filter_all_label: 'Toate',
    host_section_kicker: 'Filiale',
    host_section_title: 'Vrei să organizezi un eveniment în orașul tău?',
    host_section_body: 'Filialele locale primesc sprijin logistic și financiar pentru dezbateri, workshop-uri și acțiuni publice.',
    host_section_cta: 'Trimite propunerea',
    host_section_url: '/contact',
    host_section_visible: true,
    empty_state: 'Nu sunt evenimente programate momentan.',
  };

  try {
    await strapi.documents('api::events-page.events-page' as any).create({
      data: data as any,
      status: 'published',
    });
    strapi.log.info('📅 Events page seeded');
  } catch (err) {
    strapi.log.warn(`Events page seed failed: ${err}`);
  }
}
