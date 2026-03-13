<script lang="ts">
	import { page } from '$app/stores';
	import { currentUser } from '$stores/auth';
	import HamburgerMenu from './HamburgerMenu.svelte';

	let menuOpen = $state(false);
	let scrolled = $state(false);

	const navLinks = [
		{ href: '/stiri', label: 'Știri' },
		{ href: '/despre-noi', label: 'Despre' },
		{ href: '/evenimente', label: 'Evenimente' },
		{ href: '/contact', label: 'Contact' }
	];

	$effect(() => {
		function handleScroll() {
			scrolled = window.scrollY > 10;
		}
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function isActive(href: string) {
		return $page.url.pathname.startsWith(href);
	}
</script>

<nav class="navbar" class:scrolled>
	<div class="container navbar__inner">
		<!-- Mobile: hamburger stânga -->
		<button
			class="navbar__hamburger"
			aria-label="Deschide meniul"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = true)}
		>
			<span></span>
			<span></span>
			<span></span>
		</button>

		<!-- Logo centrat pe mobile, stânga pe desktop -->
		<a href="/" class="navbar__logo" aria-label="SENS — Acasă">
			<img src="/logo-sens.svg" alt="Partidul SENS" width="80" height="32" />
		</a>

		<!-- Desktop: linkuri navigare -->
		<ul class="navbar__links">
			{#each navLinks as link}
				<li>
					<a href={link.href} class="navbar__link" class:active={isActive(link.href)}>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Dreapta: CTA + icon user -->
		<div class="navbar__actions">
			<a href="/inscrie-te" class="btn btn-primary navbar__cta">Înscrie-te</a>
			<a
				href={$currentUser ? '/cont' : '/auth/login'}
				class="navbar__user-icon"
				aria-label={$currentUser ? 'Contul meu' : 'Autentificare'}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="8" r="4" />
					<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
				</svg>
			</a>
		</div>
	</div>
</nav>

<HamburgerMenu open={menuOpen} onClose={() => (menuOpen = false)} />

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		height: var(--navbar-height);
		background-color: var(--color-green-dark);
		transition: box-shadow var(--transition-base), backdrop-filter var(--transition-base);
	}

	.navbar.scrolled {
		backdrop-filter: blur(12px);
		background-color: rgba(0, 56, 39, 0.92);
		box-shadow: var(--shadow-md);
	}

	.navbar__inner {
		height: 100%;
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.navbar__logo img {
		height: 32px;
		width: auto;
	}

	.navbar__hamburger {
		display: flex;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--space-2);
		margin-right: auto;
	}

	.navbar__hamburger span {
		display: block;
		width: 22px;
		height: 2px;
		background-color: var(--color-white);
		border-radius: 2px;
		transition: transform var(--transition-fast);
	}

	.navbar__links {
		display: none;
		list-style: none;
		gap: var(--space-6);
	}

	.navbar__link {
		color: rgba(255, 255, 255, 0.85);
		font-size: var(--text-sm);
		font-weight: 500;
		transition: color var(--transition-fast);
	}

	.navbar__link:hover,
	.navbar__link.active {
		color: var(--color-white);
	}

	.navbar__link.active {
		border-bottom: 2px solid var(--color-green-leaf);
		padding-bottom: 2px;
	}

	.navbar__actions {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-left: auto;
	}

	.navbar__cta {
		display: none;
		font-size: var(--text-sm);
		padding: 0.5rem 1.25rem;
	}

	.navbar__user-icon {
		color: var(--color-white);
		display: flex;
		align-items: center;
		padding: var(--space-2);
		border-radius: var(--radius-full);
		transition: background-color var(--transition-fast);
	}

	.navbar__user-icon:hover {
		background-color: rgba(255, 255, 255, 0.12);
		color: var(--color-white);
	}

	@media (min-width: 768px) {
		.navbar__hamburger { display: none; }
		.navbar__links { display: flex; }
		.navbar__cta { display: inline-flex; }

		.navbar__logo {
			margin-right: var(--space-6);
		}

		.navbar__actions {
			margin-left: auto;
		}
	}
</style>
