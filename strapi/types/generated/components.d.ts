import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAccordion extends Struct.ComponentSchema {
  collectionName: 'components_blocks_accordions';
  info: {
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
    displayName: 'Element Acordeon';
    icon: 'list';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_grids';
  info: {
    displayName: 'Gril\u0103 Carduri';
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
    displayName: 'Element Card';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link_text: Schema.Attribute.String;
    link_url: Schema.Attribute.String;
    points: Schema.Attribute.Component<'homepage.value-point', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksContactForm extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_forms';
  info: {
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

export interface BlocksCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_banners';
  info: {
    displayName: 'Banner Ac\u021Biune';
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
    description: 'Card mic cu o info important\u0103 (ex: urm\u0103torul eveniment, anun\u021B)';
    displayName: 'Link eviden\u021Biat';
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
    displayName: 'Sec\u021Biune Hero';
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

export interface BlocksImageGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_galleries';
  info: {
    displayName: 'Galerie Imagini';
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
    displayName: 'Ultimele Articole';
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

export interface BlocksNewsletterCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_newsletter_ctas';
  info: {
    displayName: 'Abonare Newsletter';
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
    description: 'Card care afi\u0219eaz\u0103 automat urm\u0103torul eveniment viitor';
    displayName: 'Urm\u0103torul eveniment';
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

export interface BlocksProgramItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_program_items';
  info: {
    displayName: 'Punct Program';
    icon: 'seed';
  };
  attributes: {
    area: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksProgramPoints extends Struct.ComponentSchema {
  collectionName: 'components_blocks_program_points';
  info: {
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
    displayName: 'Citat';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String;
    role: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksSocialFeed extends Struct.ComponentSchema {
  collectionName: 'components_blocks_social_feeds';
  info: {
    description: 'Sec\u021Biune urm\u0103re\u0219te-ne cu link-uri c\u0103tre re\u021Bele sociale';
    displayName: 'Social Feed';
    icon: 'globe';
  };
  attributes: {
    embed_fallback_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Deschide pe {platform}'>;
    facebook_url: Schema.Attribute.String & Schema.Attribute.Private;
    instagram_url: Schema.Attribute.String & Schema.Attribute.Private;
    platforms: Schema.Attribute.Component<'social.platform', true>;
    posts_heading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }> &
      Schema.Attribute.DefaultTo<'Ultimele post\u0103ri'>;
    show_embeds: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    show_facebook: Schema.Attribute.Boolean & Schema.Attribute.Private;
    show_instagram: Schema.Attribute.Boolean & Schema.Attribute.Private;
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
    displayName: 'Spa\u021Biu';
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
    displayName: 'Element Statistic\u0103';
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
    displayName: 'Contor Statistici';
    icon: 'chartBubble';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.stat-item', true>;
  };
}

export interface BlocksTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_blocks';
  info: {
    displayName: 'Bloc Text';
    icon: 'file';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    body: Schema.Attribute.Blocks;
  };
}

export interface BlocksUpcomingEvents extends Struct.ComponentSchema {
  collectionName: 'components_blocks_upcoming_events';
  info: {
    displayName: 'Evenimente Viitoare';
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
    displayName: 'Video \u00CEncorporat';
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
    description: 'Band\u0103 full-width cu cuvinte care se deruleaz\u0103 orizontal (marquee continuu)';
    displayName: 'Carusel de cuvinte';
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
    displayName: 'Element carusel cuvinte';
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
    description: 'Cuvinte care se rotesc \u00EEntr-o pozi\u021Bie din titlu (folose\u0219te {{rotating}} \u00EEn titlu)';
    displayName: 'Rota\u021Bie cuvinte';
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
    displayName: 'Sum\u0103 presetat\u0103';
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
    displayName: 'Postare Social';
    icon: 'message';
  };
  attributes: {
    embed_text: Schema.Attribute.Text;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'twitter', 'tiktok']
    > &
      Schema.Attribute.Required;
    post_url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    displayName: 'Link Social';
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
    displayName: 'Consim\u021B\u0103m\u00E2nt';
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
    displayName: 'Configurare formular contact';
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
    displayName: 'Etichete formular aderare';
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
    displayName: 'Formular newsletter';
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
    displayName: 'Sec\u021Biune succes';
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

export interface HomepageValueCard extends Struct.ComponentSchema {
  collectionName: 'components_homepage_value_cards';
  info: {
    displayName: 'Card Valoare';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    link_text: Schema.Attribute.String;
    link_url: Schema.Attribute.String;
    points: Schema.Attribute.Component<'homepage.value-point', true>;
    short_text: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageValuePoint extends Struct.ComponentSchema {
  collectionName: 'components_homepage_value_points';
  info: {
    displayName: 'Punct Valoare';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_items';
  info: {
    displayName: 'Element Meniu';
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
    displayName: 'Sub-element Meniu';
    icon: 'arrowRight';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNewsletterSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_newsletter_sections';
  info: {
    displayName: 'Sec\u021Biune newsletter';
    icon: 'newspaper';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }> &
      Schema.Attribute.DefaultTo<'Prime\u0219te ultimele \u0219tiri \u0219i anun\u021Buri ale Partidului SENS direct \u00EEn inbox.'>;
    placeholder: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'email@exemplu.ro'>;
    submit_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Aboneaz\u0103-te'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }> &
      Schema.Attribute.DefaultTo<'Aboneaz\u0103-te la newsletter'>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
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
    displayName: 'Link Social';
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
    displayName: 'Feature social';
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
    displayName: 'Platform\u0103 social\u0103';
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.accordion': BlocksAccordion;
      'blocks.accordion-item': BlocksAccordionItem;
      'blocks.card-grid': BlocksCardGrid;
      'blocks.card-grid-item': BlocksCardGridItem;
      'blocks.contact-form': BlocksContactForm;
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.featured-link': BlocksFeaturedLink;
      'blocks.hero': BlocksHero;
      'blocks.image-gallery': BlocksImageGallery;
      'blocks.latest-articles': BlocksLatestArticles;
      'blocks.newsletter-cta': BlocksNewsletterCta;
      'blocks.next-event': BlocksNextEvent;
      'blocks.program-item': BlocksProgramItem;
      'blocks.program-points': BlocksProgramPoints;
      'blocks.quote': BlocksQuote;
      'blocks.social-feed': BlocksSocialFeed;
      'blocks.spacer': BlocksSpacer;
      'blocks.stat-item': BlocksStatItem;
      'blocks.stats-counter': BlocksStatsCounter;
      'blocks.text-block': BlocksTextBlock;
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
      'homepage.value-card': HomepageValueCard;
      'homepage.value-point': HomepageValuePoint;
      'navigation.menu-item': NavigationMenuItem;
      'navigation.menu-sub-item': NavigationMenuSubItem;
      'shared.newsletter-section': SharedNewsletterSection;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'social.feature': SocialFeature;
      'social.platform': SocialPlatform;
    }
  }
}
