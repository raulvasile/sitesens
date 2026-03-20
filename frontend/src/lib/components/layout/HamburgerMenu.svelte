<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import type { NavigationData } from '../../../routes/+layout';

	interface Props {
		open: boolean;
		onClose: () => void;
		navigation?: NavigationData;
	}

	let { open, onClose, navigation }: Props = $props();

	const menuItems = $derived(navigation?.main_menu ?? []);
	const secondaryMenu = $derived(navigation?.secondary_menu ?? []);
	const extraLinks = $derived(navigation?.mobile_extra_links ?? []);
	const logoUrl = $derived(navigation?.logo?.url ? getStrapiMediaUrl(navigation.logo.url) : '/logo.png');

	let expandedIndex = $state<number | null>(null);
	let animatingOut = $state(false);

	function handleLinkClick() {
		closeMenu();
	}

	function closeMenu() {
		animatingOut = true;
		setTimeout(() => {
			animatingOut = false;
			onClose();
		}, 280);
	}

	function toggleExpand(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			expandedIndex = null;
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="overlay-backdrop"
		class:overlay-backdrop--out={animatingOut}
		role="presentation"
		onclick={closeMenu}
	></div>

	<!-- Menu panel -->
	<div
		class="hamburger-menu"
		class:hamburger-menu--out={animatingOut}
		role="dialog"
		aria-modal="true"
		aria-label="Meniu navigare"
	>
		<div class="hamburger-menu__header">
			<a href="/" class="hamburger-menu__logo" onclick={handleLinkClick}>
				<img src={logoUrl} alt="SENS" height="28" />
			</a>
			<button class="hamburger-menu__close" aria-label="Închide meniul" onclick={closeMenu}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
		</div>

		<nav class="hamburger-menu__nav">
			<a href="/" class="hamburger-menu__link stagger-item" style="--stagger: 0" onclick={handleLinkClick}>
				Acasă
			</a>

			{#each menuItems as item, i}
				{#if item.children?.length > 0}
					<div class="hamburger-menu__group stagger-item" style="--stagger: {i + 1}">
						<button
							class="hamburger-menu__group-toggle"
							aria-expanded={expandedIndex === i}
							onclick={() => toggleExpand(i)}
						>
							{item.label}
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class:rotated={expandedIndex === i}
							>
								<path d="M6 9l6 6 6-6" />
							</svg>
						</button>
						{#if expandedIndex === i}
							<ul class="hamburger-menu__sub">
								<li>
									<a href={item.url} class="hamburger-menu__sub-link" onclick={handleLinkClick}>
										{item.label}
									</a>
								</li>
								{#each item.children as child}
									<li>
										<a href={child.url} class="hamburger-menu__sub-link" onclick={handleLinkClick}>
											{child.label}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{:else}
					<a
						href={item.url}
						class="hamburger-menu__link stagger-item"
						style="--stagger: {i + 1}"
						target={item.open_in_new_tab ? '_blank' : undefined}
						rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
						onclick={handleLinkClick}
					>
						{item.label}
					</a>
				{/if}
			{/each}

			<!-- Extra links din CMS (mobile_extra_links) -->
			{#each extraLinks as link, i}
				<a
					href={link.url}
					class="hamburger-menu__link stagger-item"
					style="--stagger: {menuItems.length + 1 + i}"
					onclick={handleLinkClick}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="hamburger-menu__footer stagger-item" style="--stagger: {menuItems.length + extraLinks.length + 2}">
			{#each secondaryMenu as item, i}
				{#if i === secondaryMenu.length - 1}
					<a
						href={item.url}
						class="btn btn-primary hamburger-menu__cta"
						target={item.open_in_new_tab ? '_blank' : undefined}
						rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
						onclick={handleLinkClick}
					>
						{item.label}
					</a>
				{:else}
					<a
						href={item.url}
						class="hamburger-menu__secondary-link"
						target={item.open_in_new_tab ? '_blank' : undefined}
						rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
						onclick={handleLinkClick}
					>
						{item.label}
					</a>
				{/if}
			{/each}
			<span class="hamburger-menu__lang">RO / EN (în curând)</span>
		</div>
	</div>
{/if}

<style>
	.overlay-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 200;
		animation: fade-in 0.3s ease;
	}

	.overlay-backdrop--out {
		animation: fade-out 0.28s ease forwards;
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes fade-out {
		from { opacity: 1; }
		to { opacity: 0; }
	}

	.hamburger-menu {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: min(360px, 100vw);
		background-color: var(--color-green-dark);
		z-index: 201;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hamburger-menu--out {
		animation: slide-out 0.28s cubic-bezier(0.7, 0, 0.84, 0) forwards;
	}

	@keyframes slide-in {
		from { transform: translateX(-100%); }
		to { transform: translateX(0); }
	}

	@keyframes slide-out {
		from { transform: translateX(0); }
		to { transform: translateX(-100%); }
	}

	/* Staggered item animations */
	.stagger-item {
		animation: item-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) backwards;
		animation-delay: calc(0.08s + var(--stagger, 0) * 0.04s);
	}

	@keyframes item-in {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.hamburger-menu__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4) var(--space-6);
		height: var(--navbar-height);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.hamburger-menu__close {
		background: none;
		border: none;
		color: var(--color-white);
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--radius-md);
		transition: background-color var(--transition-fast), transform var(--transition-fast);
	}

	.hamburger-menu__close:hover {
		background-color: rgba(255, 255, 255, 0.1);
		transform: rotate(90deg);
	}

	.hamburger-menu__nav {
		flex: 1;
		padding: var(--space-4) var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.hamburger-menu__link {
		display: block;
		color: rgba(255, 255, 255, 0.85);
		font-size: var(--text-lg);
		font-weight: 500;
		padding: var(--space-3) 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		transition: color var(--transition-fast), padding-left var(--transition-fast);
	}

	.hamburger-menu__link:hover {
		color: var(--color-white);
		padding-left: var(--space-2);
	}

	.hamburger-menu__group-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: none;
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.85);
		font-size: var(--text-lg);
		font-weight: 500;
		padding: var(--space-3) 0;
		cursor: pointer;
		text-align: left;
		transition: color var(--transition-fast), padding-left var(--transition-fast);
	}

	.hamburger-menu__group-toggle:hover {
		color: var(--color-white);
		padding-left: var(--space-2);
	}

	.hamburger-menu__group-toggle svg {
		transition: transform var(--transition-fast);
	}

	.hamburger-menu__group-toggle svg.rotated {
		transform: rotate(180deg);
	}

	.hamburger-menu__sub {
		list-style: none;
		padding-left: var(--space-4);
		padding-bottom: var(--space-2);
		animation: sub-expand 0.25s ease;
	}

	@keyframes sub-expand {
		from {
			opacity: 0;
			max-height: 0;
		}
		to {
			opacity: 1;
			max-height: 300px;
		}
	}

	.hamburger-menu__sub-link {
		display: block;
		color: rgba(255, 255, 255, 0.65);
		font-size: var(--text-base);
		padding: var(--space-2) 0;
		transition: color var(--transition-fast), padding-left var(--transition-fast);
	}

	.hamburger-menu__sub-link:hover {
		color: var(--color-white);
		padding-left: var(--space-2);
	}

	.hamburger-menu__footer {
		padding: var(--space-6);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		align-items: flex-start;
	}

	.hamburger-menu__cta {
		width: 100%;
		justify-content: center;
	}

	.hamburger-menu__secondary-link {
		color: rgba(255, 255, 255, 0.75);
		font-size: var(--text-sm);
		font-weight: 500;
		transition: color var(--transition-fast);
	}

	.hamburger-menu__secondary-link:hover {
		color: var(--color-white);
	}

	.hamburger-menu__lang {
		color: rgba(255, 255, 255, 0.4);
		font-size: var(--text-xs);
	}
</style>
