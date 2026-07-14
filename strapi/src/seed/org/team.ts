import type { Core } from '@strapi/strapi';
import { seedCollection } from '../helpers';

/**
 * Echipa / conducerea SENS (Team Grid). Idempotent pe `name`. Ordonat pe ierarhie:
 * Președinte → Vicepreședinți → Secretar General → Membri CN.
 *
 * Roluri (confirmat 2026-07-04): funcțiile de board explicite; restul = „Membru CN"
 * (detaliul de comisie rămâne în bio). Forma „Membru"/„Membră" urmează cum se descrie
 * fiecare în propria bio (NU ghicit după nume):
 *   - „Membră CN": Roxana, Ana, Livia, Oana-Alexandra (bio cu forme feminine).
 *   - „Membru CN": Attila, Cristian, Cosmin-Vasile, Tudor (bio masculin / context).
 *   - ⚠️ Oana Verzeș: fără bio → am pus „Membru CN"; confirmă forma dorită.
 *
 * `photo` se încarcă separat din CMS (owner). `articles` se leagă din CMS.
 */
const TEAM: Array<Record<string, unknown>> = [
  {
    name: 'Andrei Macsut',
    role: 'Președinte',
    bio: 'Andrei este un cercetător, activist și scriitor român, specializat în anti-corupție și guvernare transparentă. Doctor în Științe Politice la Central European University, cu studii la Universitatea din București și University College London, colaborează cu instituții de cercetare pe teme legate de corupție și transparență publică.',
    is_leadership: true,
    display_order: 0,
    social_links: [],
  },
  {
    name: 'Petruț Dociu',
    role: 'Vicepreședinte',
    bio: 'Petruț Dociu este psiholog specializat în psiho-oncologie, implicat activ în susținerea sănătății mintale și în sprijinul persoanelor care traversează experiențe medicale dificile. Activitatea sa îmbină intervenția terapeutică cu comunicarea publică, fiind implicat în proiecte de informare, educație și conștientizare pe teme de sănătate și politici sociale. De asemenea, este coordonator al Comisiei de Sănătate în cadrul partidului SENS, contribuind la dezvoltarea și promovarea inițiativelor din domeniul sănătății la nivel public și legislativ.',
    is_leadership: true,
    display_order: 1,
    social_links: [{ platform: 'facebook', url: 'https://www.facebook.com/dociu.petrut' }],
  },
  {
    name: 'Florina-Raluca Presadă',
    role: 'Vicepreședinte',
    is_leadership: true,
    display_order: 2,
    social_links: [],
  },
  {
    name: 'Ciprian Dobre',
    role: 'Secretar General',
    bio: 'Ciprian este Secretar general al SENS, student la Științe politice și un tânăr de 21 de ani implicat activ în viața publică. Este pasionat de mobilitate și transporturi. Consideră că transportul public este esențial pentru accesul la servicii publice: educație, sănătate și alte nevoi de bază. Susține accesibilitatea la servicii de transport în fiecare colț al țării. De-a lungul timpului, s-a ocupat de inițiative în cadrul Comisiei de transporturi și apoi de partea de secretariat: coordonare administrativă, documente și proceduri, și comunicare internă, gestionând activitatea curentă a partidului. A fost implicat în reprezentarea elevilor, voluntariat în ONG-uri, petiții și alte inițiative de implicare civică. A învățat că progresul apare prin implicare și comunități.',
    is_leadership: true,
    display_order: 3,
    social_links: [],
  },
  {
    name: 'Roxana Păduraru',
    role: 'Membră CN',
    bio: 'Roxana este politologă de profesie, cu experiență în evaluarea de politici și programe și în atragerea de fonduri europene. Este certificată ca profesionistă în activitatea de lobby și a luptat de-a lungul timpului pentru drepturile omului și pentru protecția mediului. A fost candidată SENS la alegerile parlamentare din 2024 și a coordonat activitatea departamentului de HR și a Comisiei de Muncă ale partidului. În prezent este membră în Consiliul Național. Roxana este practicantă de arte marțiale, dar iubirea pe care nu o va uita niciodată este cea pentru baschet.',
    is_leadership: true,
    display_order: 4,
    social_links: [
      { platform: 'facebook', url: 'https://www.facebook.com/share/1DvBb7Ja3V/' },
      { platform: 'instagram', url: 'https://www.instagram.com/roxrocks28' },
    ],
  },
  {
    name: 'Ana Galbenu',
    role: 'Membră CN',
    bio: 'Ana Galbenu este absolventă a Academiei de Studii Economice din București și expertă în politici publice europene, cu experiență în Parlamentul European. Activitatea sa se concentrează pe domenii precum mediul, agricultura și sănătatea publică. Colaborează constant cu organizații civice, experți și actori instituționali pentru a monitoriza dosarele legislative europene și pentru a transforma procesele complexe în soluții clare și aplicabile.',
    is_leadership: true,
    display_order: 5,
    social_links: [],
  },
  {
    name: 'Attila Marton',
    role: 'Membru CN',
    bio: 'Attila Marton este cercetător și activist civic. Coordonează o echipă de monitorizare a biodiversității la Universitatea din Debrecen și este cadru didactic asociat la Universitatea Sapientia din Cluj-Napoca. Este fondatorul unei organizații civice maghiare care promovează colaborarea interetnică, dialogul social, drepturile minorităților și ale grupurilor vulnerabile, precum și protecția naturii. Pe lângă conservarea biodiversității și managementul ariilor protejate, este interesat și de dezvoltarea strategiilor organizaționale și construcția de comunități bazate pe valori. Coordonează Comisia de Mediu și a candidat din partea SENS la alegerile parlamentare din 2024 în circumscripția Cluj.',
    is_leadership: true,
    display_order: 6,
    social_links: [{ platform: 'facebook', url: 'https://www.facebook.com/martonattila2010' }],
  },
  {
    name: 'Livia Ilișanu',
    role: 'Membră CN',
    bio: 'Livia Ilișanu a candidat în 2024 la Camera Deputaților din partea SENS ca persoană openly queer și este membră a Consiliului Național al partidului din 2025. A terminat Facultatea de Litere din Iași și este în prezent project manager în domeniul IT. Se consideră o feministă radicală de stânga care ține mult la intersecționalitate, solidaritate și implicare personală pentru a schimba ce nu funcționează. La nevoie, este mereu gata de protest și oricând prezentă pentru organizare locală, încercând pe cât posibil să sprijine comunitatea din Iași. De asemenea, ca orice stângistă Gen Z din ziua de azi, organizează ocazional un book club.',
    is_leadership: true,
    display_order: 7,
    social_links: [
      { platform: 'instagram', url: 'https://www.instagram.com/livlavidaloca31' },
      { platform: 'facebook', url: 'https://www.facebook.com/share/1R3vPeKG98' },
    ],
  },
  {
    name: 'Oana-Alexandra Chirilă',
    role: 'Membră CN',
    bio: 'Oana-Alexandra Chirilă este Doctor în Filologie și bursieră Fulbright și Erasmus+. De peste cinci ani, activitatea profesională a Oanei se concentrează pe accesibilizarea instituțiilor de cultură și atragerea tinerilor spre profesiile culturale, având numeroase training-uri în această direcție. Oana trăiește în Baia Mare, Maramureș, iar timpul liber îi este acaparat de doi pisoi. În cadrul SENS, Oana-Alexandra Chirilă este și coordonatoarea Comisiei de Politici Publice în Cultură.',
    is_leadership: true,
    display_order: 8,
    social_links: [],
  },
  {
    name: 'Cristian Preoteasa Maier',
    role: 'Membru CN',
    bio: 'E din Baia Mare. A făcut științe politice. Ține cu West Ham - atât.',
    is_leadership: true,
    display_order: 9,
    // ⚠️ linkul dat de owner e un permalink către o poză FB, nu profil — de înlocuit cu profilul real.
    social_links: [
      { platform: 'facebook', url: 'https://www.facebook.com/photo/?fbid=25452171377705131&set=a.204948132854137' },
    ],
  },
  {
    name: 'Oana Verzeș',
    role: 'Membru CN', // ⚠️ fără bio — confirmă „Membru"/„Membră"
    is_leadership: true,
    display_order: 10,
    social_links: [],
  },
  {
    name: 'Cosmin-Vasile Stoenoiu',
    role: 'Membru CN',
    is_leadership: true,
    display_order: 11,
    social_links: [],
  },
  {
    name: 'Tudor Dan Ancuța',
    role: 'Membru CN',
    bio: 'Tudor Dan Ancuța este jurist, absolvent al Facultății de Drept a Freie Universität Berlin, bursier DAAD, fellow al Departamentului de Stat SUA, analist de politici publice și consilier parlamentar în Bundestag, parlamentul federal al Germaniei. De-a lungul carierei sale a colaborat atât cu Partidul Liberal Democrat (FDP), cât și cu Uniunea Creștin-Democrată (CDU), precum și cu fundațiile politice germane Konrad-Adenauer-Stiftung (KAS), Friedrich-Ebert-Stiftung (FES) și Friedrich-Naumann-Stiftung für die Freiheit (FNF). De peste zece ani este expert în relațiile româno-germane, contribuind la consolidarea acestora prin activitatea sa profesională, prin intervențiile din mass-media și prin participarea la dezbaterea publică din România și Germania. Din mai 2025 este membru al Consiliului Național al SENS și coordonează Comisia pentru Politică Externă și Apărare. În 2024 a deschis lista SENS pentru Camera Deputaților în Circumscripția Diaspora.',
    is_leadership: true,
    display_order: 12,
    social_links: [
      { platform: 'facebook', url: 'https://www.facebook.com/tudordanancuta' },
      { platform: 'instagram', url: 'https://www.instagram.com/ancuta_tudor_dan/' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/tudor-dan-ancuta-294b3968/' },
    ],
  },
];

export async function seedTeam(strapi: Core.Strapi) {
  await seedCollection(strapi, 'api::team-member.team-member', TEAM, 'name', 'Echipă');
}
