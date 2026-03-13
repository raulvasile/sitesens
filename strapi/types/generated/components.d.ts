import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAccordion extends Struct.ComponentSchema {
  collectionName: 'components_blocks_accordions';
  info: {
    displayName: 'Accordion';
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
    displayName: 'Accordion Item';
    icon: 'list';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_banners';
  info: {
    displayName: 'CTA Banner';
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
    displayName: 'Hero';
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
  };
}

export interface BlocksImageGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_galleries';
  info: {
    displayName: 'Image Gallery';
    icon: 'picture';
  };
  attributes: {
    caption: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true>;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel']> &
      Schema.Attribute.DefaultTo<'grid'>;
  };
}

export interface BlocksNewsletterCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_newsletter_ctas';
  info: {
    displayName: 'Newsletter CTA';
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
    displayName: 'Program Item';
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
    displayName: 'Program Points';
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
    displayName: 'Quote';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String;
    role: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksStatItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_stat_items';
  info: {
    displayName: 'Stat Item';
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
    displayName: 'Stats Counter';
    icon: 'chartBubble';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.stat-item', true>;
  };
}

export interface BlocksTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_blocks';
  info: {
    displayName: 'Text Block';
    icon: 'file';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    body: Schema.Attribute.Blocks;
  };
}

export interface BlocksVideoEmbed extends Struct.ComponentSchema {
  collectionName: 'components_blocks_video_embeds';
  info: {
    displayName: 'Video Embed';
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
    displayName: 'Social Post';
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

export interface HomepageValueCard extends Struct.ComponentSchema {
  collectionName: 'components_homepage_value_cards';
  info: {
    displayName: 'Value Card';
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
    displayName: 'Value Point';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
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
    displayName: 'Social Link';
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
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.hero': BlocksHero;
      'blocks.image-gallery': BlocksImageGallery;
      'blocks.newsletter-cta': BlocksNewsletterCta;
      'blocks.program-item': BlocksProgramItem;
      'blocks.program-points': BlocksProgramPoints;
      'blocks.quote': BlocksQuote;
      'blocks.stat-item': BlocksStatItem;
      'blocks.stats-counter': BlocksStatsCounter;
      'blocks.text-block': BlocksTextBlock;
      'blocks.video-embed': BlocksVideoEmbed;
      'event.social-post': EventSocialPost;
      'homepage.value-card': HomepageValueCard;
      'homepage.value-point': HomepageValuePoint;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
    }
  }
}
