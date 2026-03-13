import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ── Seed: configurare rol Public ──
    await setupPublicPermissions(strapi);

    // ── Seed: date demo (doar dacă nu există deja) ──
    await seedData(strapi);
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
    { controller: 'api::volunteer-action.volunteer-action', actions: ['find', 'findOne'] },
    // Single types
    { controller: 'api::homepage.homepage', actions: ['find'] },
    { controller: 'api::contact-page.contact-page', actions: ['find'] },
    { controller: 'api::donate-page.donate-page', actions: ['find'] },
    // Newsletter — doar create (subscribe)
    { controller: 'api::newsletter-subscriber.newsletter-subscriber', actions: ['create'] },
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

  // ── Homepage Single Type ──
  await strapi.documents('api::homepage.homepage').create({
    data: {
      hero_title: 'O Românie verde, echitabilă și modernă',
      hero_subtitle: 'Construim împreună un viitor bazat pe Sănătate, Educație, Natură și Sustenabilitate. Alătură-te mișcării SENS.',
      hero_cta_text: 'Înscrie-te acum',
      hero_cta_link: '/inscrie-te',
      values: [
        {
          title: 'Sănătate',
          short_text: 'Acces echitabil la sănătate',
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
          title: 'Educație',
          short_text: 'Educație pentru viitor',
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
          title: 'Natură',
          short_text: 'Protejăm mediul înconjurător',
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
          title: 'Sustenabilitate',
          short_text: 'Economie verde și circulară',
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
      program_points: [
        { area: 'Energie', text: 'Tranziție completă la energie regenerabilă și independență energetică prin solar, eolian și hidrogen verde.' },
        { area: 'Transport', text: 'Rețea națională de transport public electric și infrastructură pentru mobilitate activă în toate orașele.' },
        { area: 'Agricultură', text: 'Sprijin pentru agricultura ecologică, circuite scurte de distribuție și securitate alimentară.' },
        { area: 'Digitalizare', text: 'Guvernare transparentă prin tehnologie, servicii publice digitale accesibile tuturor cetățenilor.' },
        { area: 'Locuire', text: 'Program național de renovare energetică a clădirilor și construcții noi cu standard Nearly Zero Energy.' },
        { area: 'Tineret', text: 'Consilii locale ale tinerilor, stagii verzi garantate și programe de antreprenoriat sustenabil.' },
      ],
      newsletter_title: 'Rămâi la curent cu SENS',
      newsletter_description: 'Abonează-te la newsletter pentru comunicate, analize și invitații la evenimente.',
      seo: {
        meta_title: 'SENS — Sănătate · Educație · Natură · Sustenabilitate',
        meta_description: 'Partidul SENS — O Românie verde, echitabilă și modernă. Înscrie-te sau donează astăzi.',
      },
    } as any,
    status: 'published',
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
  await strapi.documents('api::page.page').create({
    data: {
      title: 'Despre SENS',
      slug: 'despre-noi',
      content: [
        {
          __component: 'blocks.hero',
          title: 'Despre SENS',
          subtitle: 'Sănătate · Educație · Natură · Sustenabilitate — valorile care ne definesc și ne ghidează fiecare decizie.',
        },
        {
          __component: 'blocks.text-block',
          body: [
            { type: 'heading', level: 2, children: [{ type: 'text', text: 'Misiunea noastră' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'SENS este un partid politic ecologist, progresist și pro-european. Ne-am asumat misiunea de a transforma România într-o țară în care oamenii, natura și economia prosperă împreună.' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'Suntem membri ai European Greens și ai grupului Verzi/ALE din Parlamentul European. Credem în democrație participativă, justiție socială și urgența acțiunii climatice.' }] },
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
          __component: 'blocks.cta-banner',
          title: 'Vrei să te alături?',
          description: 'Fiecare voce contează. Înscrie-te în SENS și fă parte din schimbare.',
          button_text: 'Înscrie-te acum',
          button_link: '/inscrie-te',
          background_color: 'green',
        },
      ],
      seo: {
        meta_title: 'Despre SENS — Misiune, Echipă, Program',
        meta_description: 'Despre Partidul SENS — misiune, viziune, echipă și program politic. Membri European Greens.',
      },
    } as any,
    status: 'published',
  });

  strapi.log.info('✅ Seed data created successfully');
}
