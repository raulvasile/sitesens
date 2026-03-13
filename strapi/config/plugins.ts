import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  // Upload — local dev, Cloudflare R2 în producție
  upload: {
    config: {
      sizeLimit: 10 * 1024 * 1024, // 10MB
    },
  },

  // Email — placeholder, se configurează cu Brevo SMTP în prod
  email: {
    config: {
      provider: 'sendmail',
      providerOptions: {},
      settings: {
        defaultFrom: 'noreply@partidulsens.ro',
        defaultReplyTo: 'contact@partidulsens.ro',
      },
    },
  },

  // Users & Permissions — configurări default bune
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      register: {
        allowedFields: ['username', 'email', 'password'],
      },
    },
  },
});

export default config;
