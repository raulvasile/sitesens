import type { Core } from '@strapi/strapi';

/**
 * Generează pathname-ul frontend pentru un document Strapi.
 */
function getPreviewPathname(
  uid: string,
  document: { slug?: string }
): string | null {
  const { slug } = document;

  switch (uid) {
    // Single types
    case 'api::homepage.homepage':
      return '/';
    case 'api::contact-page.contact-page':
      return '/contact';
    case 'api::donate-page.donate-page':
      return '/doneaza';

    // Collection types
    case 'api::article.article':
      return slug ? `/stiri/${slug}` : '/stiri';
    case 'api::event.event':
      return slug ? `/evenimente/${slug}` : '/evenimente';
    case 'api::page.page':
      return slug ? `/${slug}` : null;

    default:
      return null;
  }
}

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL', 'http://localhost:5173')],
      async handler(uid, { documentId, locale, status }) {
        const document = await strapi.documents(uid as any).findOne({ documentId });
        if (!document) return null;

        const pathname = getPreviewPathname(uid, document);
        if (!pathname) return null;

        const params = new URLSearchParams({
          secret: env('PREVIEW_SECRET', ''),
          status,
        });

        return `${env('CLIENT_URL', 'http://localhost:5173')}${pathname}?${params}`;
      },
    },
  },
});

export default config;
