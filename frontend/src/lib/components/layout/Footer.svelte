<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import type { FooterData, NavigationData } from '../../../routes/+layout';

	interface Props {
		footer?: FooterData | null;
		navigation?: NavigationData | null;
	}

	let { footer = null, navigation = null }: Props = $props();

	// Logo: prefer footer logo, fallback to header logo, then static
	const logoUrl = $derived(
		footer?.logo?.url
			? getStrapiMediaUrl(footer.logo.url)
			: navigation?.logo?.url
				? getStrapiMediaUrl(navigation.logo.url)
				: '/logo.png'
	);

	const tagline = $derived(footer?.tagline ?? 'Sănătate · Educație · Natură · Sustenabilitate');
	const euText = $derived(footer?.eu_text ?? '');
	const footerLinks = $derived(footer?.footer_links ?? []);
	const socialLinks = $derived(footer?.social_links ?? []);
	const legalText = $derived(footer?.legal_text ?? 'Partidul SENS · Mandatar financiar CMF nr. 11240065');
	const privacyText = $derived(footer?.privacy_link_text ?? 'Politica de confidențialitate');
	const privacyUrl = $derived(footer?.privacy_link_url ?? '/politica-confidentialitate');
</script>

<footer class="footer">
	<div class="container footer__inner">
		<div class="footer__brand">
			<img src={logoUrl} alt="Partidul SENS" height="40" class="footer__logo" />
			<p class="footer__tagline">{tagline}</p>
			{#if euText}
				<p class="footer__eu">{euText}</p>
			{/if}
		</div>

		{#if footerLinks.length > 0}
			<nav class="footer__nav" aria-label="Navigare footer">
				<ul>
					{#each footerLinks as link}
						<li><a href={link.url}>{link.label}</a></li>
					{/each}
				</ul>
			</nav>
		{/if}

		{#if socialLinks.length > 0}
			<div class="footer__social">
				<p class="footer__social-title">Urmărește-ne</p>
				<div class="footer__social-links">
					{#each socialLinks as social}
						<a
							href={social.url}
							aria-label={social.label}
							target="_blank"
							rel="noopener noreferrer"
							class="footer__social-link"
						>
							{social.label}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="footer__bottom">
		<div class="container footer__bottom-inner">
			<p class="footer__legal">
				&copy; {new Date().getFullYear()} {legalText}
			</p>
			<a href={privacyUrl} class="footer__privacy">{privacyText}</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--color-green-dark);
		color: rgba(255, 255, 255, 0.8);
	}

	.footer__inner {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		padding-block: var(--space-12);
	}

	@media (min-width: 768px) {
		.footer__inner {
			grid-template-columns: 2fr 1fr 1fr;
			gap: var(--space-12);
		}
	}

	.footer__logo {
		margin-bottom: var(--space-3);
	}

	.footer__tagline {
		font-size: var(--text-sm);
		margin-bottom: var(--space-3);
		color: rgba(255, 255, 255, 0.6);
	}

	.footer__eu {
		font-size: var(--text-xs);
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.6;
	}

	.footer__nav ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.footer__nav a {
		color: rgba(255, 255, 255, 0.7);
		font-size: var(--text-sm);
		transition: color var(--transition-fast);
	}

	.footer__nav a:hover {
		color: var(--color-white);
	}

	.footer__social-title {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: var(--space-3);
	}

	.footer__social-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.footer__social-link {
		color: rgba(255, 255, 255, 0.7);
		font-size: var(--text-sm);
		transition: color var(--transition-fast);
	}

	.footer__social-link:hover {
		color: var(--color-brand-vibrant);
	}

	.footer__bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.footer__bottom-inner {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
		padding-block: var(--space-4);
	}

	.footer__legal {
		font-size: var(--text-xs);
		color: rgba(255, 255, 255, 0.5);
	}

	.footer__privacy {
		font-size: var(--text-xs);
		color: rgba(255, 255, 255, 0.5);
		transition: color var(--transition-fast);
	}

	.footer__privacy:hover {
		color: var(--color-white);
	}
</style>
