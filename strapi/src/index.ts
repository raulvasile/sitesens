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
  const contentTypeLabels: Record<string, Record<string, string>> = {
    'api::article.article': {
      title: 'Titlu',
      slug: 'URL (slug)',
      excerpt: 'Rezumat',
      content: 'Conținut (text, galerii, citate, video, statistici)',
      cover_image: 'Imagine copertă',
      category: 'Categorie',
      author: 'Autor',
      tags: 'Etichete',
      seo: 'SEO',
      reading_time: 'Timp de citire (min)',
      featured_stat: 'Statistică evidențiată (apare deasupra conținutului)',
    },
    'api::category.category': {
      name: 'Nume',
      slug: 'URL (slug)',
      color: 'Culoare',
      articles: 'Articole',
      parent: 'Categorie părinte',
      children: 'Subcategorii',
      description: 'Descriere',
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
      location_name: 'Locație (scurt)',
      venue: 'Loc (ex: Casa de Cultură)',
      city: 'Oraș',
      location_coords: 'Coordonate GPS',
      cover_image: 'Imagine copertă',
      max_participants: 'Număr maxim participanți',
      spots_taken: 'Locuri ocupate',
      is_featured: 'Eveniment evidențiat (featured)',
      registration_url: 'URL înregistrare (opțional)',
      registration_open: 'Înscrieri deschise',
      event_type: 'Tip eveniment',
      social_posts_description: 'Descriere secțiune „Pe rețele" (apare deasupra postărilor)',
      social_posts: 'Postări social media',
      ical_url: 'Link calendar iCal',
      seo: 'SEO',
    },
    'api::team-member.team-member': {
      name: 'Nume',
      role: 'Funcție',
      bio: 'Biografie',
      details: 'Detalii extinse (apar într-un modal când se dă click pe card)',
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
    'api::county.county': {
      name: 'Nume',
      slug: 'URL (slug)',
      order: 'Ordine',
    },
    'api::interest-area.interest-area': {
      name: 'Nume',
      slug: 'URL (slug)',
      icon: 'Iconiță (emoji)',
      description: 'Descriere',
      order: 'Ordine',
    },
    'api::inscription-page.inscription-page': {
      title: 'Titlu',
      subtitle: 'Subtitlu',
      steps: 'Pași formular',
      personal_section_heading: 'Titlu secțiune date personale',
      address_section_heading: 'Titlu secțiune adresă',
      labels: 'Etichete câmpuri',
      validation: 'Mesaje validare',
      consents: 'Consimțăminte',
      submit_text: 'Text buton trimite',
      submitting_text: 'Text buton în procesare',
      prev_step_text: 'Text buton anterior',
      next_step_text: 'Text buton următor',
      success: 'Secțiune succes',
      seo: 'SEO',
    },
    'api::newsletter-page.newsletter-page': {
      title: 'Titlu',
      description: 'Descriere',
      form: 'Configurare formular',
      benefits_heading: 'Titlu beneficii',
      benefits: 'Beneficii',
      seo: 'SEO',
    },
    'api::community-page.community-page': {
      title: 'Titlu',
      subtitle: 'Subtitlu',
      platforms: 'Platforme sociale',
      posts_heading: 'Titlu postări',
      features_heading: 'Titlu motive',
      features: 'Motive să ne urmărești',
      embed_fallback_text: 'Text fallback embed',
      seo: 'SEO',
    },
    'api::privacy-policy-page.privacy-policy-page': {
      title: 'Titlu',
      subtitle: 'Subtitlu',
      content: 'Conținut',
      cmf_text: 'Text CMF',
      last_updated: 'Ultima actualizare',
      seo: 'SEO',
    },
    'api::events-page.events-page': {
      eyebrow: 'Kicker (ex: EVENIMENTE · CALENDAR 2026)',
      title: 'Titlu',
      title_italic: 'Titlu italic (continuare)',
      lead: 'Text introducere',
      featured_label: 'Etichetă "featured"',
      featured_cta_primary: 'CTA principal featured',
      featured_cta_secondary: 'CTA secundar featured',
      location_label: 'Etichetă locație',
      interval_label: 'Etichetă interval',
      spots_template: 'Template locuri ({taken}/{max})',
      list_reserve_cta: 'CTA listă "rezervă"',
      filter_all_label: 'Etichetă filtru "toate"',
      host_section_kicker: 'Kicker secțiune filiale',
      host_section_title: 'Titlu secțiune filiale',
      host_section_body: 'Text secțiune filiale',
      host_section_cta: 'CTA secțiune filiale',
      host_section_url: 'URL CTA filiale',
      host_section_visible: 'Afișează secțiunea filiale',
      empty_state: 'Text listă goală',
      seo: 'SEO',
    },
    'api::navigation.navigation': {
      main_menu: 'Meniu principal',
      secondary_menu: 'Meniu secundar (dreapta)',
      mobile_extra_links: 'Linkuri extra mobil',
    },
    'api::contact-page.contact-page': {
      title: 'Titlu',
      subtitle: 'Subtitlu (lead sub titlu)',
      header_eyebrow: 'Eyebrow header (text mic deasupra titlului)',
      form_kicker: 'Kicker formular (text mic deasupra titlului formularului)',
      email: 'Email contact',
      address: 'Adresă sediu',
      schedule: 'Program',
      newsletter_title: 'Titlu newsletter',
      newsletter_description: 'Descriere newsletter',
      form_title: 'Titlu formular',
      info_heading: 'Titlu secțiune date contact',
      social_heading: 'Titlu secțiune rețele sociale',
      form: 'Configurare formular',
      validation: 'Mesaje validare',
      seo: 'SEO',
    },
    'api::donate-page.donate-page': {
      title: 'Titlu',
      header_eyebrow: 'Eyebrow header (mic, mono, deasupra titlului)',
      description: 'Descriere',
      amounts_kicker: 'Kicker secțiune sume (ex: „Pasul 1")',
      amounts_heading: 'Titlu secțiune sume',
      preset_amounts_json: 'Sume predefinite (legacy JSON)',
      amounts: 'Sume predefinite (recomandat)',
      custom_amount_label: 'Etichetă „altă sumă"',
      donate_button_text: 'Text buton donează',
      iban: 'IBAN',
      bank_name: 'Nume bancă',
      transfer_kicker: 'Kicker secțiune transfer (ex: „Pasul 2")',
      transfer_heading: 'Titlu secțiune transfer',
      transfer_notes: 'Note transfer (afișate sub IBAN)',
      transparency_kicker: 'Kicker secțiune transparență',
      transparency_heading: 'Titlu secțiune transparență',
      transparency: 'Elemente transparență (procentaj alocare)',
      cmf_kicker: 'Kicker mandatar financiar',
      cmf_text: 'Text mandatar CMF',
      seo: 'SEO',
    },
    'api::site-theme.site-theme': {
      brand: 'Culori Brand',
      surfaces: 'Culori Suprafețe',
      accents: 'Culori Accent & Stare',
      typography: 'Tipografie',
    },
  };

  const componentLabels: Record<string, Record<string, string>> = {
    'blocks.hero': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      title: 'Titlu (folosește {{rotating}} ca placeholder pentru cuvintele rotative)',
      subtitle: 'Subtitlu / lead',
      cta_text: 'Text buton principal',
      cta_link: 'Link buton principal',
      cta_secondary_text: 'Text buton secundar',
      cta_secondary_link: 'Link buton secundar',
      background_image: 'Imagine fundal (opțional)',
      variant: 'Variantă (default / compact)',
      rotating_words: 'Cuvinte rotative',
      featured_link: 'Link evidențiat (legacy)',
      next_event: 'Următorul eveniment (auto)',
      meta_text: 'Text meta cu dot live (ex: LIVE · MANIFEST 2026)',
      chip_text: 'Text chip foto',
      chip_visible: 'Afișează chip foto',
    },
    'blocks.hero-refined': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      background_image: 'Imagine fundal (obligatoriu — acoperă tot heroul)',
      top_meta_left: 'Meta sus stânga (ex: ADUNAREA GENERALĂ 2026 · CLUJ-NAPOCA)',
      top_meta_right: 'Meta sus dreapta (ex: N 46°46\' · E 23°35\')',
      title: 'Titlu mare (uppercase)',
      title_italic_accent: 'Accent italic verde-lime (linie nouă în titlu, ex: „educată,")',
      description: 'Descriere coloana dreaptă',
      cta_text: 'Text buton principal (ex: Înscrie-te acum)',
      cta_link: 'Link buton principal',
      cta_secondary_text: 'Text buton secundar (ex: Donează)',
      cta_secondary_link: 'Link buton secundar',
    },
    'blocks.hero-editorial': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      top_meta_left: 'Meta sus stânga (ex: NR. 07 / EDIȚIA DE PRIMĂVARĂ)',
      top_meta_center: 'Meta sus centru (ex: MANIFEST SENS · 2026)',
      top_meta_right: 'Meta sus dreapta (ex: ROMÂNIA · EUROPA · PLANETA)',
      title: 'Titlu enorm (uppercase, până la 200px)',
      title_emphasis: 'Cuvânt evidențiat cu fundal lime și rotire (ex: „construim.")',
      manifesto_kicker: 'Kicker manifest (default: „Manifest")',
      manifesto_lead: 'Lead manifest (paragraf mare)',
      cta_text: 'Text buton principal',
      cta_link: 'Link buton principal',
      cta_secondary_text: 'Text buton secundar',
      cta_secondary_link: 'Link buton secundar',
      directions_kicker: 'Kicker direcții (default: „Patru direcții")',
      directions: 'Direcții (lista numerotată sub titlu)',
      pull_quote_text: 'Text citat (coloana dreaptă)',
      pull_quote_author_name: 'Autor citat',
      pull_quote_author_meta: 'Detalii autor (ex: CLUJ · FONDATOR FILIALĂ)',
      pull_quote_author_photo: 'Fotografie autor citat',
    },
    'blocks.hero-direction': {
      code: 'Cod (ex: 01, 02)',
      name: 'Nume (ex: SĂNĂTATE)',
      body: 'Descriere scurtă (1 frază)',
    },
    'blocks.word-rotation': {
      words: 'Cuvinte (array JSON, ex: ["Sănătate", "Educație"])',
      interval_ms: 'Interval schimbare (ms)',
      highlight: 'Evidențiere culoare',
    },
    'blocks.featured-link': {
      label: 'Etichetă mică',
      title: 'Titlu',
      url: 'Link',
      icon: 'Iconiță (emoji)',
      auto_next_event: 'Auto: următorul eveniment',
    },
    'blocks.next-event': {
      label: 'Etichetă (ex: Următorul eveniment)',
      cta_text: 'Text CTA',
      icon: 'Iconiță (emoji)',
      empty_label: 'Etichetă când nu există eveniment',
      empty_url: 'URL când nu există eveniment',
      hide_when_empty: 'Ascunde cardul dacă nu există eveniment',
    },
    'blocks.word-carousel': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      items: 'Elemente',
      speed_seconds: 'Viteză (secunde pentru un ciclu complet)',
      background_color: 'Culoare fundal',
      separator: 'Separator între cuvinte',
    },
    'blocks.word-carousel-item': {
      text: 'Text',
      url: 'Link (opțional)',
      highlight: 'Evidențiat',
    },
    'form.contact-form-config': {
      name_label: 'Etichetă nume', name_placeholder: 'Placeholder nume',
      email_label: 'Etichetă email', email_placeholder: 'Placeholder email',
      subject_label: 'Etichetă subiect', subject_placeholder: 'Placeholder subiect',
      message_label: 'Etichetă mesaj', message_placeholder: 'Placeholder mesaj',
      submit_text: 'Text buton trimite', submitting_text: 'Text în procesare',
      success_title: 'Titlu succes', success_message: 'Mesaj succes',
    },
    'form.membership-labels': {
      first_name_label: 'Etichetă prenume', first_name_placeholder: 'Placeholder prenume',
      last_name_label: 'Etichetă nume', last_name_placeholder: 'Placeholder nume',
      email_label: 'Etichetă email', email_placeholder: 'Placeholder email',
      phone_label: 'Etichetă telefon', phone_placeholder: 'Placeholder telefon',
      birth_date_label: 'Etichetă data nașterii',
      county_label: 'Etichetă județ', county_placeholder: 'Placeholder județ',
      city_label: 'Etichetă localitate', city_placeholder: 'Placeholder localitate',
      address_label: 'Etichetă adresă', address_placeholder: 'Placeholder adresă',
      motivation_label: 'Etichetă motivație', motivation_placeholder: 'Placeholder motivație',
      interests_label: 'Etichetă domenii', interests_help: 'Text ajutor domenii',
    },
    'form.validation-messages': {
      required_generic: 'Mesaj generic obligatoriu',
      email_required: 'Email obligatoriu', email_invalid: 'Email invalid',
      phone_required: 'Telefon obligatoriu', phone_invalid: 'Telefon invalid',
      first_name_required: 'Prenume obligatoriu', last_name_required: 'Nume obligatoriu',
      birth_date_required: 'Dată naștere obligatorie',
      county_required: 'Județ obligatoriu', city_required: 'Localitate obligatorie',
      address_required: 'Adresă obligatorie',
      consent_required: 'Consimțământ obligatoriu',
      duplicate_error: 'Eroare duplicat', generic_error: 'Eroare generică',
    },
    'form.newsletter-form': {
      name_label: 'Etichetă nume', name_placeholder: 'Placeholder nume',
      email_label: 'Etichetă email', email_placeholder: 'Placeholder email',
      submit_text: 'Text buton', submitting_text: 'Text în procesare',
      consent_text: 'Text consimțământ',
      success_title: 'Titlu succes', success_message: 'Mesaj succes',
    },
    'form.consent-item': {
      key: 'Cheie (tip consimțământ)',
      label: 'Text consimțământ',
      required: 'Obligatoriu',
      help_text: 'Text ajutor',
    },
    'form.step': {
      number: 'Număr',
      label: 'Etichetă',
      description: 'Descriere',
    },
    'form.next-step': {
      icon: 'Iconiță (emoji)',
      text: 'Text',
    },
    'form.success-section': {
      title: 'Titlu',
      message: 'Mesaj',
      next_steps_heading: 'Titlu secțiune pași',
      next_steps: 'Pași următori',
      primary_cta_label: 'Text buton principal',
      primary_cta_url: 'Link buton principal',
      secondary_cta_label: 'Text buton secundar',
      secondary_cta_url: 'Link buton secundar',
    },
    'social.platform': {
      name: 'Nume platformă',
      handle: 'Handle',
      url: 'URL profil',
      description: 'Descriere',
      color: 'Culoare brand',
      embed_url: 'URL embed (iframe)',
      icon_svg: 'Iconiță SVG',
      follow_cta: 'Text CTA urmărește',
      order: 'Ordine',
    },
    'social.feature': {
      emoji: 'Emoji',
      title: 'Titlu',
      description: 'Descriere',
    },
    'donate.transparency-item': {
      label: 'Etichetă',
      percentage: 'Procent',
      description: 'Descriere',
    },
    'donate.preset-amount': {
      amount: 'Sumă (RON)',
      label: 'Etichetă opțională',
    },
    'blocks.text-block': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      body: 'Conținut',
      alignment: 'Aliniere',
    },
    'blocks.cta-banner': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      title: 'Titlu',
      description: 'Descriere',
      button_text: 'Text buton',
      button_link: 'Link buton',
      background_color: 'Culoare fundal',
    },
    'blocks.image-gallery': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      images: 'Imagini',
      layout: 'Aranjament',
      caption: 'Legendă',
    },
    'blocks.accordion': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      heading: 'Titlu secțiune',
      items: 'Elemente',
    },
    'blocks.accordion-item': {
      title: 'Titlu',
      content: 'Conținut',
    },
    'blocks.quote': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      text: 'Citat',
      author: 'Autor',
      role: 'Funcție',
    },
    'blocks.video-embed': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      url: 'Link video (YouTube/Vimeo)',
      caption: 'Legendă',
    },
    'blocks.stats-counter': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      items: 'Statistici',
    },
    'blocks.stat-item': {
      number: 'Număr',
      label: 'Etichetă',
    },
    'blocks.program-points': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      items: 'Puncte program',
      show_link: 'Afișează link',
      link_text: 'Text link',
      link_url: 'URL link',
    },
    'blocks.program-item': {
      area: 'Domeniu',
      text: 'Descriere',
      details: 'Detalii extinse (apar într-un modal când se dă click pe card)',
    },
    'blocks.newsletter-cta': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
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
    'homepage.value-point': {
      text: 'Text',
    },
    'event.social-post': {
      platform: 'Platformă',
      url: 'Link postare',
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
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
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
      details: 'Detalii extinse (apar într-un modal când se dă click pe card; are precedență față de link)',
    },
    'blocks.latest-articles': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      heading: 'Titlu secțiune',
      count: 'Număr articole',
      show_category: 'Afișează categoria',
      cta_text: 'Text buton',
      cta_link: 'Link buton',
    },
    'blocks.upcoming-events': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      heading: 'Titlu secțiune',
      count: 'Număr evenimente',
      cta_text: 'Text buton',
      cta_link: 'Link buton',
    },
    'blocks.contact-form': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      heading: 'Titlu',
      description: 'Descriere',
      success_message: 'Mesaj de succes',
    },
    'blocks.spacer': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      height: 'Înălțime',
    },
    'blocks.social-feed': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      title: 'Titlu',
      subtitle: 'Subtitlu',
      platforms: 'Platforme sociale',
      show_embeds: 'Afișează embed-uri (iframe)',
      posts_heading: 'Titlu secțiune postări',
      embed_fallback_text: 'Text fallback embed (folosește {platform})',
      variant: 'Variantă (full/compact)',
    },

    // ─── Componente nou create (Direction C) ───
    'blocks.page-header': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      eyebrow: 'Eyebrow (text mic deasupra titlului, stânga)',
      meta: 'Meta (text mic deasupra titlului, dreapta)',
      title: 'Titlu',
      title_italic: 'Parte italică din titlu (accent verde)',
      lead: 'Lead (paragraf scurt sub titlu)',
      continuation: 'Continuare titlu (linie nouă, opțional)',
      continuation_highlight: 'Cuvânt evidențiat lime din continuare',
      background_color: 'Culoare fundal',
    },
    'blocks.mission-band': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      kicker: 'Kicker (text mic deasupra titlului)',
      heading: 'Titlu',
      heading_italic: 'Parte italică din titlu (accent lime)',
      paragraphs: 'Paragrafe (folosește **cuvânt** pentru evidențiere lime)',
      background_color: 'Culoare fundal',
    },
    'blocks.mission-paragraph': {
      text: 'Text paragraf (marchează cuvinte cu **cuvânt**)',
    },
    'blocks.timeline': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      kicker: 'Kicker',
      heading: 'Titlu',
      heading_italic: 'Parte italică din titlu',
      items: 'Momente parcurs',
      background_color: 'Culoare fundal',
    },
    'blocks.timeline-item': {
      year: 'An (sau perioadă, ex: 2024)',
      body: 'Descriere moment',
      is_current: 'Marchează ca momentul curent (apare evidențiat)',
      current_label: 'Etichetă pentru momentul curent (default: ACUM)',
    },
    'blocks.team-grid': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      kicker: 'Kicker',
      heading: 'Titlu',
      cta_text: 'Text link (opțional)',
      cta_link: 'URL link (opțional)',
      mode: 'Cine apare: leadership (doar conducere) / team (doar non-conducere) / all (toți)',
      limit: 'Număr maxim de membri afișați',
      background_color: 'Culoare fundal',
    },
    'blocks.chapters-grid': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      kicker: 'Kicker',
      heading: 'Titlu',
      cta_text: 'Text link (opțional)',
      cta_link: 'URL link (opțional)',
      items: 'Filiale',
      background_color: 'Culoare fundal',
    },
    'blocks.chapter-item': {
      name: 'Nume oraș / filială',
      code: 'Cod (ex: FIL.01) — opțional, generat automat dacă lipsește',
      url: 'URL pagină filială (opțional)',
    },
    'blocks.romania-map': {
      anchor_id: 'ID ancoră (opțional, pentru link-uri directe ex: #valori)',
      kicker: 'Kicker',
      heading: 'Titlu',
      subheading: 'Subtitlu (descriere)',
      chapters: 'Filiale (cod ISO județ + URL filială pentru click)',
      background_color: 'Culoare fundal',
    },
    'blocks.county-chapter': {
      code: 'Cod ISO județ (ex: B pentru București, CJ pentru Cluj, TM pentru Timiș)',
      name: 'Nume filială (opțional, default folosește numele județului)',
      url: 'URL filială (unde duce click-ul pe județ)',
      open_in_new_tab: 'Deschide în tab nou (recomandat pentru link-uri externe)',
    },
    'blocks.article-stat': {
      value: 'Valoare (ex: 76%, 1.2M)',
      label: 'Etichetă scurtă',
      context: 'Paragraf de context (opțional)',
    },

    // ─── Tema site ───
    'theme.brand-colors': {
      green_deep: 'Verde închis principal (titluri, butoane)',
      green_dark: 'Verde foarte închis (footer, fundaluri)',
      green_mid: 'Verde mediu',
      green_soft: 'Verde pastel',
      green_bright: 'Verde aprins (hover butoane)',
      lime: 'Lime / accent semnătură',
      pastel_green: 'Verde foarte deschis',
    },
    'theme.surface-colors': {
      paper: 'Fundal principal site',
      cream: 'Fundal alternativ (carduri, secțiuni)',
      ink: 'Text principal (verde foarte închis)',
      ink_soft: 'Text secundar (mai deschis)',
    },
    'theme.accent-colors': {
      rose: 'Roz pentru chip-uri și accente',
      error: 'Roșu pentru erori formulare',
    },
    'theme.typography': {
      font_display: 'Font titluri (display)',
      font_body: 'Font text curent (body)',
      font_mono: 'Font monospace (eyebrow, meta)',
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
