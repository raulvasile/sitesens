<script lang="ts">
	const footerLinks = [
		{ href: '/stiri', label: 'Știri' },
		{ href: '/despre-noi', label: 'Despre Noi' },
		{ href: '/evenimente', label: 'Evenimente' },
		{ href: '/contact', label: 'Contact' },
		{ href: '/doneaza', label: 'Donează' }
	];

	const socialLinks = [
		{ href: 'https://facebook.com/cusens', label: 'Facebook', icon: 'fb' },
		{ href: 'https://instagram.com/cusens', label: 'Instagram', icon: 'ig' },
		{ href: 'https://twitter.com/cusens', label: 'X / Twitter', icon: 'x' },
		{ href: 'https://tiktok.com/@cusens', label: 'TikTok', icon: 'tt' }
	];
</script>

<footer class="footer">
	<div class="container footer__inner">
		<div class="footer__brand">
			<img src="/logo-sens-white.svg" alt="Partidul SENS" width="100" height="40" class="footer__logo" />
			<p class="footer__tagline">Sănătate · Educație · Natură · Sustenabilitate</p>
			<p class="footer__eu">
				Membru al
				<strong>European Greens</strong>
				și al grupului
				<strong>Verzi/ALE</strong>
				din Parlamentul European
			</p>
		</div>

		<nav class="footer__nav" aria-label="Navigare footer">
			<ul>
				{#each footerLinks as link}
					<li><a href={link.href}>{link.label}</a></li>
				{/each}
			</ul>
		</nav>

		<div class="footer__social">
			<p class="footer__social-title">Urmărește-ne</p>
			<div class="footer__social-links">
				{#each socialLinks as social}
					<a
						href={social.href}
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
	</div>

	<div class="footer__bottom">
		<div class="container footer__bottom-inner">
			<p class="footer__legal">
				© {new Date().getFullYear()} Partidul SENS · Mandatar financiar CMF nr.
				<strong>11240065</strong>
			</p>
			<a href="/politica-confidentialitate" class="footer__privacy">Politica de confidențialitate</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--color-green-dark);
		color: rgba(255, 255, 255, 0.8);
		margin-top: var(--space-24);
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

	.footer__eu strong {
		color: var(--color-green-leaf);
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
		color: var(--color-green-leaf);
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

	.footer__legal strong {
		color: rgba(255, 255, 255, 0.7);
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
