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

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Sec\u021Biune Hero';
    icon: 'landscape';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    cta_link: Schema.Attribute.String;
    cta_secondary_link: Schema.Attribute.String;
    cta_secondary_text: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.accordion': BlocksAccordion;
      'blocks.accordion-item': BlocksAccordionItem;
      'blocks.card-grid': BlocksCardGrid;
      'blocks.card-grid-item': BlocksCardGridItem;
      'blocks.contact-form': BlocksContactForm;
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.hero': BlocksHero;
      'blocks.image-gallery': BlocksImageGallery;
      'blocks.latest-articles': BlocksLatestArticles;
      'blocks.newsletter-cta': BlocksNewsletterCta;
      'blocks.program-item': BlocksProgramItem;
      'blocks.program-points': BlocksProgramPoints;
      'blocks.quote': BlocksQuote;
      'blocks.spacer': BlocksSpacer;
      'blocks.stat-item': BlocksStatItem;
      'blocks.stats-counter': BlocksStatsCounter;
      'blocks.text-block': BlocksTextBlock;
      'blocks.upcoming-events': BlocksUpcomingEvents;
      'blocks.video-embed': BlocksVideoEmbed;
      'event.social-post': EventSocialPost;
      'footer.social-link': FooterSocialLink;
      'homepage.value-card': HomepageValueCard;
      'homepage.value-point': HomepageValuePoint;
      'navigation.menu-item': NavigationMenuItem;
      'navigation.menu-sub-item': NavigationMenuSubItem;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
    }
  }
}
