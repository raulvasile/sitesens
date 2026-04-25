import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAccordion extends Struct.ComponentSchema {
  collectionName: 'components_blocks_accordions';
  info: {
    description: 'List\u0103 de \u00EEntreb\u0103ri frecvente sau sec\u021Biuni expandabile.';
    displayName: 'Acordeon';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'blocks.accordion-item', true>;
  };
}

export interface BlocksAccordionItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_accordion_items';
  info: {
    description: 'Un r\u00E2nd din acordeon (\u00EEntrebare + r\u0103spuns).';
    displayName: 'Element acordeon';
    icon: 'list';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksArticleStat extends Struct.ComponentSchema {
  collectionName: 'components_blocks_article_stats';
  info: {
    description: 'Bloc eviden\u021Biat \u00EEn pagina de \u0219tire cu un num\u0103r/procent + etichet\u0103 scurt\u0103 + paragraf de context.';
    displayName: 'Statistic\u0103 articol';
    icon: 'chartCircle';
  };
  attributes: {
    context: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
  };
}

export interface BlocksCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_grids';
  info: {
    description: 'Gril\u0103 cu 2-4 coloane. Fiecare card are titlu, descriere, list\u0103 op\u021Bional\u0103 \u0219i link.';
    displayName: 'Gril\u0103 de carduri';
    icon: 'apps';
  };
  attributes: {
    cards: Schema.Attribute.Component<'blocks.card-grid-item', true>;
    columns: Schema.Attribute.Enumeration<['2', '3', '4']> &
      Schema.Attribute.DefaultTo<'3'>;
    heading: Schema.Attribute.String;
  };
}

export interface BlocksCardGridItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_grid_items';
  info: {
    description: 'Card individual din Grila de carduri.';
    displayName: 'Card';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text;
    details: Schema.Attribute.Blocks;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link_text: Schema.Attribute.String;
    link_url: Schema.Attribute.String;
    points: Schema.Attribute.Component<'homepage.value-point', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksChapterItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_chapter_items';
  info: {
    description: 'Un ora\u0219/filial\u0103 cu cod op\u021Bional \u0219i URL. Folosit \u00EEn Gril\u0103 Filiale.';
    displayName: 'Filial\u0103';
    icon: 'pin';
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface BlocksChaptersGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_chapters_grids';
  info: {
    description: 'Gril\u0103 ora\u0219e / filiale active pe fundal verde \u00EEnchis (stil Direction C).';
    displayName: 'Gril\u0103 Filiale';
    icon: 'globe';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<
      ['green-dark', 'green-deep', 'ink']
    > &
      Schema.Attribute.DefaultTo<'green-dark'>;
    cta_link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    cta_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    items: Schema.Attribute.Component<'blocks.chapter-item', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Filiale active'>;
  };
}

export interface BlocksContactForm extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_forms';
  info: {
    description: 'Formular de contact integrat \u00EEntr-o pagin\u0103.';
    displayName: 'Formular Contact';
    icon: 'envelop';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Contacteaz\u0103-ne'>;
    success_message: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Mesajul t\u0103u a fost trimis cu succes!'>;
  };
}

export interface BlocksCountyChapter extends Struct.ComponentSchema {
  collectionName: 'components_blocks_county_chapters';
  info: {
    description: 'Filiala asociat\u0103 unui jude\u021B. Folosit\u0103 \u00EEn Hart\u0103 Rom\u00E2nia pentru navigare. Codul trebuie s\u0103 corespund\u0103 codului ISO 3166-2:RO al jude\u021Bului (ex: CJ, TM, B, IS).';
    displayName: 'Filial\u0103 pe jude\u021B';
    icon: 'pin';
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface BlocksCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_banners';
  info: {
    description: 'Band\u0103 cu titlu, descriere \u0219i buton \u2014 \u00EEndemn la ac\u021Biune.';
    displayName: 'Band\u0103 CTA';
    icon: 'cursor';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<
      ['green', 'orange', 'white']
    > &
      Schema.Attribute.DefaultTo<'orange'>;
    button_link: Schema.Attribute.String & Schema.Attribute.Required;
    button_text: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksFeaturedLink extends Struct.ComponentSchema {
  collectionName: 'components_blocks_featured_links';
  info: {
    description: 'Link mare eviden\u021Biat \u00EEn Hero (ex: anun\u021B urm\u0103torul eveniment). Sub-component\u0103 Hero.';
    displayName: 'Link eviden\u021Biat (Hero)';
    icon: 'link';
  };
  attributes: {
    auto_next_event: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    description: "Hero principal (Direction C \u2014 paper, fotografie dreapta). Pentru alte stiluri folose\u0219te 'Hero \u2014 Refined' (foto full-bg) sau 'Hero \u2014 Manifesto' (titlu enorm editorial).";
    displayName: 'Hero';
    icon: 'landscape';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    chip_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    chip_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    cta_link: Schema.Attribute.String;
    cta_secondary_link: Schema.Attribute.String;
    cta_secondary_text: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
    featured_link: Schema.Attribute.Component<'blocks.featured-link', false>;
    meta_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    next_event: Schema.Attribute.Component<'blocks.next-event', false>;
    rotating_words: Schema.Attribute.Component<'blocks.word-rotation', false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['default', 'compact']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface BlocksHeroDirection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_directions';
  info: {
    description: 'Un punct din lista de 4 direc\u021Bii afi\u0219at\u0103 \u00EEn Hero varianta Editorial (cod + nume + descriere scurt\u0103).';
    displayName: 'Direc\u021Bie Hero (Editorial)';
    icon: 'list';
  };
  attributes: {
    body: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface BlocksHeroEditorial extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_editorials';
  info: {
    description: 'Hero editorial cu titlu enorm tipografic, f\u0103r\u0103 fotografie. Sub titlu: lead+CTA, list\u0103 numerotat\u0103 cu direc\u021Bii \u0219i citat tilted. Inspirat din Direction B (Manifesto / Editorial).';
    displayName: 'Hero \u2014 Manifesto';
    icon: 'feather';
  };
  attributes: {
    cta_link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    cta_secondary_link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    cta_secondary_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    cta_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    directions: Schema.Attribute.Component<'blocks.hero-direction', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    directions_kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Patru direc\u021Bii'>;
    manifesto_kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Manifest'>;
    manifesto_lead: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    pull_quote_author_meta: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    pull_quote_author_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    pull_quote_author_photo: Schema.Attribute.Media<'images'>;
    pull_quote_text: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    title_emphasis: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    top_meta_center: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    top_meta_left: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    top_meta_right: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface BlocksHeroRefined extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_refineds';
  info: {
    description: 'Hero cu fotografie pe tot ecranul, text alb, accent verde-lime. Titlu mare \u00EEn st\u00E2nga, descriere \u0219i butoane \u00EEn dreapta. Inspirat din Direction A (Refined & Confident).';
    displayName: 'Hero \u2014 Refined';
    icon: 'picture';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    cta_link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    cta_secondary_link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    cta_secondary_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    cta_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    title_italic_accent: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    top_meta_left: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    top_meta_right: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface BlocksImageGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_galleries';
  info: {
    description: 'Galerie cu mai multe imagini.';
    displayName: 'Galerie de imagini';
    icon: 'picture';
  };
  attributes: {
    caption: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true>;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel']> &
      Schema.Attribute.DefaultTo<'grid'>;
  };
}

export interface BlocksLatestArticles extends Struct.ComponentSchema {
  collectionName: 'components_blocks_latest_articles';
  info: {
    description: 'List\u0103 auto-populat\u0103 cu cele mai recente articole din /stiri.';
    displayName: 'Ultimele articole';
    icon: 'file';
  };
  attributes: {
    count: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    cta_link: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/stiri'>;
    cta_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Toate \u0219tirile'>;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Ultimele \u0219tiri'>;
    show_category: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface BlocksMissionBand extends Struct.ComponentSchema {
  collectionName: 'components_blocks_mission_bands';
  info: {
    description: 'Band\u0103 cu fundal verde: kicker mono + titlu cu accent italic + paragrafe (cuvintele \u00EEntre ** devin lime).';
    displayName: 'Band\u0103 Misiune';
    icon: 'compass';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<
      ['green-deep', 'green-dark', 'ink']
    > &
      Schema.Attribute.DefaultTo<'green-deep'>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    heading_italic: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Misiune'>;
    paragraphs: Schema.Attribute.Component<'blocks.mission-paragraph', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksMissionParagraph extends Struct.ComponentSchema {
  collectionName: 'components_blocks_mission_paragraphs';
  info: {
    description: 'Un paragraf din Band\u0103 Misiune. Marcheaz\u0103 cuvinte cu **cuvant** pentru eviden\u021Biere lime.';
    displayName: 'Paragraf misiune';
    icon: 'quote';
  };
  attributes: {
    text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
  };
}

export interface BlocksNewsletterCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_newsletter_ctas';
  info: {
    description: 'Bloc cu formular abonare la newsletter (\u00EEnregistreaz\u0103 \u00EEn Abona\u021Bi Newsletter).';
    displayName: 'CTA Newsletter';
    icon: 'envelop';
  };
  attributes: {
    description: Schema.Attribute.Text;
    placeholder_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'email@exemplu.ro'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksNextEvent extends Struct.ComponentSchema {
  collectionName: 'components_blocks_next_events';
  info: {
    description: 'Sub-component\u0103 Hero care afi\u0219eaz\u0103 automat urm\u0103torul eveniment viitor.';
    displayName: 'Urm\u0103torul eveniment (Hero)';
    icon: 'calendar-check';
  };
  attributes: {
    cta_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }> &
      Schema.Attribute.DefaultTo<'Rezerv\u0103 loc'>;
    empty_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Vezi toate evenimentele'>;
    empty_url: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'/evenimente'>;
    hide_when_empty: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }> &
      Schema.Attribute.DefaultTo<'\uD83D\uDCC5'>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Urm\u0103torul eveniment'>;
  };
}

export interface BlocksPageHeader extends Struct.ComponentSchema {
  collectionName: 'components_blocks_page_headers';
  info: {
    description: 'Antet pentru pagini interioare (Direction C): eyebrow mono + meta dreapta + titlu mare cu accent italic + lead, plus continuare op\u021Bional\u0103 cu eviden\u021Biere lime.';
    displayName: 'Antet Pagin\u0103';
    icon: 'header';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<['paper', 'cream']> &
      Schema.Attribute.DefaultTo<'paper'>;
    continuation: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    continuation_highlight: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    lead: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    meta: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    title_italic: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface BlocksProgramItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_program_items';
  info: {
    description: 'Un punct din Programul partidului. Folosit \u00EEn Puncte Program.';
    displayName: 'Element program';
    icon: 'seed';
  };
  attributes: {
    area: Schema.Attribute.String & Schema.Attribute.Required;
    details: Schema.Attribute.Blocks;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksProgramPoints extends Struct.ComponentSchema {
  collectionName: 'components_blocks_program_points';
  info: {
    description: 'List\u0103 de puncte din programul partidului, cu titlu pentru \u00EEntreaga sec\u021Biune.';
    displayName: 'Puncte Program';
    icon: 'seed';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.program-item', true>;
    link_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Vezi programul complet'>;
    link_url: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/despre-noi'>;
    show_link: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface BlocksQuote extends Struct.ComponentSchema {
  collectionName: 'components_blocks_quotes';
  info: {
    description: 'Bloc cu un citat mare \u0219i autor op\u021Bional.';
    displayName: 'Citat';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String;
    role: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksRomaniaMap extends Struct.ComponentSchema {
  collectionName: 'components_blocks_romania_maps';
  info: {
    description: 'Hart\u0103 interactiv\u0103 cu cele 42 jude\u021Be. Jude\u021Bele cu filial\u0103 setat\u0103 mai jos devin clickable \u0219i se coloreaz\u0103 verde; celelalte r\u0103m\u00E2n gri. Click pe un jude\u021B activ deschide URL-ul filialei.';
    displayName: 'Hart\u0103 Rom\u00E2nia';
    icon: 'globe';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<['paper', 'cream']> &
      Schema.Attribute.DefaultTo<'paper'>;
    chapters: Schema.Attribute.Component<'blocks.county-chapter', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Pe harta Rom\u00E2niei.'>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Filiale'>;
    subheading: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
  };
}

export interface BlocksSocialFeed extends Struct.ComponentSchema {
  collectionName: 'components_blocks_social_feeds';
  info: {
    description: 'Feed cu post\u0103ri sau linkuri din social media.';
    displayName: 'Feed Social';
    icon: 'globe';
  };
  attributes: {
    embed_fallback_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Deschide pe {platform}'>;
    platforms: Schema.Attribute.Component<'social.platform', true>;
    posts_heading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }> &
      Schema.Attribute.DefaultTo<'Ultimele post\u0103ri'>;
    show_embeds: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Urm\u0103re\u0219te-ne'>;
    variant: Schema.Attribute.Enumeration<['full', 'compact']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface BlocksSpacer extends Struct.ComponentSchema {
  collectionName: 'components_blocks_spacers';
  info: {
    description: 'Spa\u021Biu vertical configurabil \u00EEntre blocuri.';
    displayName: 'Spa\u021Biator';
    icon: 'arrowDown';
  };
  attributes: {
    height: Schema.Attribute.Enumeration<['sm', 'md', 'lg', 'xl']> &
      Schema.Attribute.DefaultTo<'md'>;
  };
}

export interface BlocksStatItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_stat_items';
  info: {
    description: 'O statistic\u0103 (num\u0103r + etichet\u0103). Folosit \u00EEn Counter Statistici.';
    displayName: 'Element statistic\u0103';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    number: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksStatsCounter extends Struct.ComponentSchema {
  collectionName: 'components_blocks_stats_counters';
  info: {
    description: 'Band\u0103 cu mai multe statistici (num\u0103r mare + etichet\u0103).';
    displayName: 'Counter Statistici';
    icon: 'chartBubble';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.stat-item', true>;
  };
}

export interface BlocksTeamGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_team_grids';
  info: {
    description: 'Gril\u0103 auto-populat\u0103 cu membri din colec\u021Bia Echip\u0103 (filtru leadership op\u021Bional).';
    displayName: 'Gril\u0103 Echip\u0103';
    icon: 'user';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<['paper', 'cream']> &
      Schema.Attribute.DefaultTo<'paper'>;
    cta_link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    cta_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Conducere'>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 24;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    mode: Schema.Attribute.Enumeration<['leadership', 'team', 'all']> &
      Schema.Attribute.DefaultTo<'leadership'>;
  };
}

export interface BlocksTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_blocks';
  info: {
    description: 'Con\u021Binut text formatat (rich text) cu paragrafe, heading-uri, list\u0103, citat.';
    displayName: 'Bloc Text';
    icon: 'file';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    body: Schema.Attribute.Blocks;
  };
}

export interface BlocksTimeline extends Struct.ComponentSchema {
  collectionName: 'components_blocks_timelines';
  info: {
    description: 'List\u0103 cronologic\u0103 vertical\u0103 \u2014 parcursul organiza\u021Biei sau alt timeline.';
    displayName: 'Parcurs (Timeline)';
    icon: 'history';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<
      ['cream', 'paper', 'green-deep', 'green-dark']
    > &
      Schema.Attribute.DefaultTo<'cream'>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'\u0218ase ani,'>;
    heading_italic: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'f\u0103r\u0103 pauze.'>;
    items: Schema.Attribute.Component<'blocks.timeline-item', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Parcursul nostru'>;
  };
}

export interface BlocksTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_timeline_items';
  info: {
    description: 'Un moment din Parcurs (an + descriere). Marcheaz\u0103 ultimul cu is_current pentru eviden\u021Biere.';
    displayName: 'Element parcurs';
    icon: 'calendar';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    current_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30;
      }> &
      Schema.Attribute.DefaultTo<'ACUM'>;
    is_current: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    year: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
  };
}

export interface BlocksUpcomingEvents extends Struct.ComponentSchema {
  collectionName: 'components_blocks_upcoming_events';
  info: {
    description: 'List\u0103 auto-populat\u0103 cu urm\u0103toarele evenimente din /evenimente.';
    displayName: 'Evenimente viitoare';
    icon: 'calendar';
  };
  attributes: {
    count: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    cta_link: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/evenimente'>;
    cta_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Toate evenimentele'>;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Evenimente viitoare'>;
  };
}

export interface BlocksVideoEmbed extends Struct.ComponentSchema {
  collectionName: 'components_blocks_video_embeds';
  info: {
    description: '\u00CEnglobare video YouTube / Vimeo prin URL.';
    displayName: 'Embed video';
    icon: 'play';
  };
  attributes: {
    caption: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksWordCarousel extends Struct.ComponentSchema {
  collectionName: 'components_blocks_word_carousels';
  info: {
    description: 'Carusel orizontal cu cuvinte mari care se rotesc (efect ticker).';
    displayName: 'Carusel cuvinte';
    icon: 'arrowRight';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<
      ['green', 'dark', 'white', 'lime']
    > &
      Schema.Attribute.DefaultTo<'green'>;
    items: Schema.Attribute.Component<'blocks.word-carousel-item', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 2;
        },
        number
      >;
    separator: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4;
      }> &
      Schema.Attribute.DefaultTo<'\u2022'>;
    speed_seconds: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 120;
          min: 10;
        },
        number
      > &
      Schema.Attribute.DefaultTo<30>;
  };
}

export interface BlocksWordCarouselItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_word_carousel_items';
  info: {
    description: 'Un cuv\u00E2nt din Carusel cuvinte.';
    displayName: 'Cuv\u00E2nt carusel';
    icon: 'cursor';
  };
  attributes: {
    highlight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    url: Schema.Attribute.String;
  };
}

export interface BlocksWordRotation extends Struct.ComponentSchema {
  collectionName: 'components_blocks_word_rotations';
  info: {
    description: 'Sub-component\u0103 Hero \u2014 cuvinte care se schimb\u0103 automat \u00EEn titlu (folose\u0219te placeholder-ul {{rotating}}).';
    displayName: 'Cuvinte rotative (Hero)';
    icon: 'refresh';
  };
  attributes: {
    highlight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    interval_ms: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10000;
          min: 800;
        },
        number
      > &
      Schema.Attribute.DefaultTo<2500>;
    words: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface DonatePresetAmount extends Struct.ComponentSchema {
  collectionName: 'components_donate_preset_amounts';
  info: {
    description: 'Una dintre sumele preset (ex: 10, 25, 50 RON) afi\u0219ate pe pagina de dona\u021Bii.';
    displayName: 'Sum\u0103 predefinit\u0103';
    icon: 'coins';
  };
  attributes: {
    amount: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
  };
}

export interface DonateTransparencyItem extends Struct.ComponentSchema {
  collectionName: 'components_donate_transparency_items';
  info: {
    description: 'O linie \u00EEn sec\u021Biunea de transparen\u021B\u0103 financiar\u0103 (etichet\u0103 + valoare).';
    displayName: 'Element transparen\u021B\u0103';
    icon: 'chart-pie';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    percentage: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
  };
}

export interface EventSocialPost extends Struct.ComponentSchema {
  collectionName: 'components_event_social_posts';
  info: {
    description: 'Link c\u0103tre o postare social media legat\u0103 de un eveniment trecut (Facebook, Instagram etc.). Apare ca un card cu link \u00EEn pagina evenimentului.';
    displayName: 'Postare social (Eveniment)';
    icon: 'message';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'linkedin']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    description: 'Link c\u0103tre un cont social media afi\u0219at \u00EEn footer (cu etichet\u0103 vizibil\u0103).';
    displayName: 'Link Social (Footer)';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    platform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'instagram',
        'twitter',
        'tiktok',
        'youtube',
        'linkedin',
        'threads',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FormConsentItem extends Struct.ComponentSchema {
  collectionName: 'components_form_consent_items';
  info: {
    description: 'Un checkbox de consim\u021B\u0103m\u00E2nt cu text (ex: GDPR, statut).';
    displayName: 'Element consim\u021B\u0103m\u00E2nt';
    icon: 'check-square';
  };
  attributes: {
    help_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    key: Schema.Attribute.Enumeration<
      ['gdpr', 'statute', 'data_processing', 'newsletter']
    > &
      Schema.Attribute.Required;
    label: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface FormContactFormConfig extends Struct.ComponentSchema {
  collectionName: 'components_form_contact_form_configs';
  info: {
    description: 'Etichete, placeholders \u0219i mesaje pentru formularul de contact.';
    displayName: 'Configurare formular Contact';
    icon: 'envelope';
  };
  attributes: {
    email_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Email'>;
    email_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'email@exemplu.ro'>;
    message_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Mesaj'>;
    message_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Scrie-ne mesajul t\u0103u...'>;
    name_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Nume'>;
    name_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Numele t\u0103u'>;
    subject_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Subiect'>;
    subject_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Despre ce vrei s\u0103 discu\u021Bi?'>;
    submit_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Trimite mesajul'>;
    submitting_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Se trimite...'>;
    success_message: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'Mul\u021Bumim pentru mesajul t\u0103u. Revenim la tine c\u00E2t de cur\u00E2nd.'>;
    success_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Mesaj trimis!'>;
  };
}

export interface FormMembershipLabels extends Struct.ComponentSchema {
  collectionName: 'components_form_membership_labels';
  info: {
    description: 'Toate etichetele \u0219i texte pentru pa\u0219ii formularului de aderare.';
    displayName: 'Etichete formular \u00CEnscriere';
    icon: 'user-plus';
  };
  attributes: {
    address_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Adresa complet\u0103'>;
    address_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Strada, num\u0103r, bloc, scara, apartament'>;
    birth_date_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Data na\u0219terii'>;
    city_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Localitate'>;
    city_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Ora\u0219ul sau comuna'>;
    county_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Jude\u021B'>;
    county_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Alege jude\u021Bul'>;
    email_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Email'>;
    email_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'email@exemplu.ro'>;
    first_name_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Prenume'>;
    first_name_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Prenumele t\u0103u'>;
    interests_help: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'Alege domeniile \u00EEn care vrei s\u0103 te implici. Po\u021Bi selecta mai multe.'>;
    interests_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Domenii de interes'>;
    last_name_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Nume'>;
    last_name_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Numele t\u0103u'>;
    motivation_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Motiva\u021Bie (op\u021Bional)'>;
    motivation_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'De ce vrei s\u0103 te al\u0103turi mi\u0219c\u0103rii SENS?'>;
    phone_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Telefon'>;
    phone_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'07xx xxx xxx'>;
  };
}

export interface FormNewsletterForm extends Struct.ComponentSchema {
  collectionName: 'components_form_newsletter_forms';
  info: {
    description: 'Etichete \u0219i mesaje pentru formularul de abonare la newsletter.';
    displayName: 'Configurare formular Newsletter';
    icon: 'envelope';
  };
  attributes: {
    consent_text: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<'Sunt de acord cu prelucrarea datelor personale conform Politicii de Confiden\u021Bialitate.'>;
    email_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Email'>;
    email_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'email@exemplu.ro'>;
    name_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Nume (op\u021Bional)'>;
    name_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Numele t\u0103u'>;
    submit_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Aboneaz\u0103-te'>;
    submitting_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Se aboneaz\u0103...'>;
    success_message: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'Vei primi un email de confirmare. Verific\u0103 \u0219i folderul Spam dac\u0103 nu \u00EEl g\u0103se\u0219ti.'>;
    success_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Mul\u021Bumim pentru abonare!'>;
  };
}

export interface FormNextStep extends Struct.ComponentSchema {
  collectionName: 'components_form_next_steps';
  info: {
    description: 'Card cu pasul urm\u0103tor dup\u0103 trimiterea unui formular (titlu + descriere + link).';
    displayName: 'Pas urm\u0103tor';
    icon: 'arrow-right';
  };
  attributes: {
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface FormStep extends Struct.ComponentSchema {
  collectionName: 'components_form_steps';
  info: {
    description: 'Un pas din formularul multi-step de \u00EEnscriere (titlu + descriere).';
    displayName: 'Pas formular';
    icon: 'list-ol';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    number: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface FormSuccessSection extends Struct.ComponentSchema {
  collectionName: 'components_form_success_sections';
  info: {
    description: 'Mesaj afi\u0219at dup\u0103 trimiterea cu succes a unui formular.';
    displayName: 'Sec\u021Biune Succes';
    icon: 'check-circle';
  };
  attributes: {
    message: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    next_steps: Schema.Attribute.Component<'form.next-step', true>;
    next_steps_heading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Pa\u0219ii urm\u0103tori:'>;
    primary_cta_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    primary_cta_url: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    secondary_cta_label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    secondary_cta_url: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }> &
      Schema.Attribute.DefaultTo<'Cererea ta a fost trimis\u0103!'>;
  };
}

export interface FormValidationMessages extends Struct.ComponentSchema {
  collectionName: 'components_form_validation_messages';
  info: {
    description: 'Texte pentru erori comune de validare (c\u00E2mp obligatoriu, email invalid etc.).';
    displayName: 'Mesaje validare';
    icon: 'exclamation-triangle';
  };
  attributes: {
    address_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Adresa este obligatorie'>;
    birth_date_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Data na\u0219terii este obligatorie'>;
    city_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Localitatea este obligatorie'>;
    consent_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Trebuie s\u0103 accep\u021Bi aceast\u0103 condi\u021Bie pentru a continua'>;
    county_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Jude\u021Bul este obligatoriu'>;
    duplicate_error: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Exist\u0103 deja o cerere cu acest email'>;
    email_invalid: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Email invalid'>;
    email_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Email-ul este obligatoriu'>;
    first_name_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Prenumele este obligatoriu'>;
    generic_error: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'A ap\u0103rut o eroare. \u00CEncearc\u0103 din nou \u00EEn c\u00E2teva momente.'>;
    last_name_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Numele este obligatoriu'>;
    phone_invalid: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Num\u0103r de telefon invalid'>;
    phone_required: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Telefonul este obligatoriu'>;
    required_generic: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Acest c\u00E2mp este obligatoriu'>;
  };
}

export interface HomepageValuePoint extends Struct.ComponentSchema {
  collectionName: 'components_homepage_value_points';
  info: {
    description: 'Un sub-punct din cardurile de valori sau din carduri program.';
    displayName: 'Punct valoare';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_items';
  info: {
    description: 'Element de nivel 1 din meniul de navigare. Poate avea sub-elemente.';
    displayName: 'Element meniu';
    icon: 'layer';
  };
  attributes: {
    children: Schema.Attribute.Component<'navigation.menu-sub-item', true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    open_in_new_tab: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationMenuSubItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_sub_items';
  info: {
    description: 'Element de nivel 2 (dropdown) dintr-un Element meniu.';
    displayName: 'Sub-element meniu';
    icon: 'arrowRight';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Meta tags pentru SEO: titlu, descriere, imagine OG, URL canonic, no-index.';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonical_url: Schema.Attribute.String;
    meta_description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    meta_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    no_index: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    og_image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Link c\u0103tre un cont social media al unui membru echip\u0103.';
    displayName: 'Link Social (Membru echip\u0103)';
    icon: 'link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'twitter', 'tiktok', 'linkedin', 'youtube']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SocialFeature extends Struct.ComponentSchema {
  collectionName: 'components_social_features';
  info: {
    description: 'Sub-component\u0103 Feed Social: o caracteristic\u0103 afi\u0219at\u0103 pentru o platform\u0103.';
    displayName: 'Func\u021Bie Feed Social';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    emoji: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface SocialPlatform extends Struct.ComponentSchema {
  collectionName: 'components_social_platforms';
  info: {
    description: 'Sub-component\u0103 Feed Social: o platform\u0103 afi\u0219at\u0103 \u00EEn feed (Facebook, Instagram etc.).';
    displayName: 'Platform\u0103 Feed Social';
    icon: 'share-alt';
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#0C5118'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    embed_url: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    follow_cta: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Urm\u0103re\u0219te'>;
    handle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    icon_svg: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface ThemeAccentColors extends Struct.ComponentSchema {
  collectionName: 'components_theme_accent_colors';
  info: {
    description: 'Culori secundare pentru accente \u0219i st\u0103ri (erori, avertismente).';
    displayName: 'Culori Accent & Stare';
    icon: 'alien';
  };
  attributes: {
    error: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#dc2626'>;
    rose: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#EB9AAA'>;
  };
}

export interface ThemeBrandColors extends Struct.ComponentSchema {
  collectionName: 'components_theme_brand_colors';
  info: {
    description: 'Paleta principal\u0103 de verzi a brandului SENS. Aceste culori dau identitatea vizual\u0103 \u2014 modific\u0103rile afecteaz\u0103 tot site-ul.';
    displayName: 'Culori Brand';
    icon: 'paint';
  };
  attributes: {
    green_bright: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#6FD025'>;
    green_dark: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#103229'>;
    green_deep: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#0C5118'>;
    green_mid: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#00BF63'>;
    green_soft: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#5AB782'>;
    lime: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#91FF00'>;
    pastel_green: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#CCFFCC'>;
  };
}

export interface ThemeSurfaceColors extends Struct.ComponentSchema {
  collectionName: 'components_theme_surface_colors';
  info: {
    description: 'Culorile pentru fundaluri \u0219i suprafe\u021Be \u2014 paper (fundal principal), cream (carduri/sec\u021Biuni alternate), ink (text \u00EEnchis).';
    displayName: 'Culori Suprafe\u021Be';
    icon: 'stack';
  };
  attributes: {
    cream: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#F5F1E8'>;
    ink: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#0A1F10'>;
    ink_soft: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#2A3B30'>;
    paper: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#FAF7F0'>;
  };
}

export interface ThemeTypography extends Struct.ComponentSchema {
  collectionName: 'components_theme_typography';
  info: {
    description: 'Familii de fonturi folosite \u00EEn site. Acestea sunt nume CSS (font-family) \u2014 fonturile efective trebuie s\u0103 fie \u00EEnc\u0103rcate din Google Fonts \u00EEn app.html.';
    displayName: 'Tipografie';
    icon: 'typhon';
  };
  attributes: {
    font_body: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<"'League Spartan', 'Inter', system-ui, sans-serif">;
    font_display: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<"'Oswald', 'Arial Narrow', sans-serif">;
    font_mono: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<"'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace">;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.accordion': BlocksAccordion;
      'blocks.accordion-item': BlocksAccordionItem;
      'blocks.article-stat': BlocksArticleStat;
      'blocks.card-grid': BlocksCardGrid;
      'blocks.card-grid-item': BlocksCardGridItem;
      'blocks.chapter-item': BlocksChapterItem;
      'blocks.chapters-grid': BlocksChaptersGrid;
      'blocks.contact-form': BlocksContactForm;
      'blocks.county-chapter': BlocksCountyChapter;
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.featured-link': BlocksFeaturedLink;
      'blocks.hero': BlocksHero;
      'blocks.hero-direction': BlocksHeroDirection;
      'blocks.hero-editorial': BlocksHeroEditorial;
      'blocks.hero-refined': BlocksHeroRefined;
      'blocks.image-gallery': BlocksImageGallery;
      'blocks.latest-articles': BlocksLatestArticles;
      'blocks.mission-band': BlocksMissionBand;
      'blocks.mission-paragraph': BlocksMissionParagraph;
      'blocks.newsletter-cta': BlocksNewsletterCta;
      'blocks.next-event': BlocksNextEvent;
      'blocks.page-header': BlocksPageHeader;
      'blocks.program-item': BlocksProgramItem;
      'blocks.program-points': BlocksProgramPoints;
      'blocks.quote': BlocksQuote;
      'blocks.romania-map': BlocksRomaniaMap;
      'blocks.social-feed': BlocksSocialFeed;
      'blocks.spacer': BlocksSpacer;
      'blocks.stat-item': BlocksStatItem;
      'blocks.stats-counter': BlocksStatsCounter;
      'blocks.team-grid': BlocksTeamGrid;
      'blocks.text-block': BlocksTextBlock;
      'blocks.timeline': BlocksTimeline;
      'blocks.timeline-item': BlocksTimelineItem;
      'blocks.upcoming-events': BlocksUpcomingEvents;
      'blocks.video-embed': BlocksVideoEmbed;
      'blocks.word-carousel': BlocksWordCarousel;
      'blocks.word-carousel-item': BlocksWordCarouselItem;
      'blocks.word-rotation': BlocksWordRotation;
      'donate.preset-amount': DonatePresetAmount;
      'donate.transparency-item': DonateTransparencyItem;
      'event.social-post': EventSocialPost;
      'footer.social-link': FooterSocialLink;
      'form.consent-item': FormConsentItem;
      'form.contact-form-config': FormContactFormConfig;
      'form.membership-labels': FormMembershipLabels;
      'form.newsletter-form': FormNewsletterForm;
      'form.next-step': FormNextStep;
      'form.step': FormStep;
      'form.success-section': FormSuccessSection;
      'form.validation-messages': FormValidationMessages;
      'homepage.value-point': HomepageValuePoint;
      'navigation.menu-item': NavigationMenuItem;
      'navigation.menu-sub-item': NavigationMenuSubItem;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'social.feature': SocialFeature;
      'social.platform': SocialPlatform;
      'theme.accent-colors': ThemeAccentColors;
      'theme.brand-colors': ThemeBrandColors;
      'theme.surface-colors': ThemeSurfaceColors;
      'theme.typography': ThemeTypography;
    }
  }
}
