<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
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
	const legalText = $derived(footer?.legal_text ?? 'Partidul SENS');
	const privacyText = $derived(footer?.privacy_link_text ?? 'Politica de confidențialitate');
	const privacyUrl = $derived(footer?.privacy_link_url ?? '/politica-confidentialitate');
</script>

<footer class="footer">
	<div class="container footer__inner">
		<div class="footer__brand">
			<img src={logoUrl} alt="Partidul SENS" height="40" class="footer__logo" loading="lazy" decoding="async" />
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
							<SocialIcon platform={social.platform} size={20} />
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
		background-color: var(--color-green-deep);
		color: var(--color-cream);
		position: relative;
	}

	.footer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background-color: var(--color-lime);
	}

	.footer__inner {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		padding-block: var(--space-20) var(--space-12);
	}

	@media (min-width: 768px) {
		.footer__inner {
			grid-template-columns: 2fr 1fr 1fr;
			gap: var(--space-16);
		}
	}

	.footer__logo {
		margin-bottom: var(--space-4);
		filter: brightness(0) invert(1);
	}

	.footer__tagline {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 400;
		letter-spacing: -0.01em;
		margin-bottom: var(--space-4);
		color: var(--color-cream);
		line-height: 1.15;
	}

	.footer__eu {
		font-size: var(--text-sm);
		color: rgba(245, 241, 232, 0.65);
		line-height: 1.5;
		max-width: 420px;
	}

	.footer__nav ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.footer__nav a {
		color: var(--color-cream);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		transition: color var(--transition-fast), padding-left var(--transition-fast);
	}

	.footer__nav a:hover {
		color: var(--color-lime);
		padding-left: 6px;
	}

	.footer__social-title {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--color-lime);
		margin-bottom: var(--space-4);
	}

	.footer__social-links {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.footer__social-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		color: var(--color-cream);
		border: 1.5px solid rgba(245, 241, 232, 0.4);
		transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
	}

	.footer__social-link:hover {
		color: var(--color-ink);
		background-color: var(--color-lime);
		border-color: var(--color-lime);
	}

	.footer__bottom {
		border-top: 1px solid rgba(145, 255, 0, 0.15);
	}

	.footer__bottom-inner {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
		padding-block: var(--space-5);
	}

	.footer__legal {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.08em;
		color: rgba(245, 241, 232, 0.6);
	}

	.footer__privacy {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(245, 241, 232, 0.6);
		transition: color var(--transition-fast);
	}

	.footer__privacy:hover {
		color: var(--color-lime);
	}
</style>
