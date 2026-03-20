<script lang="ts">
	import { currentUser } from '$stores/auth';
	import type { NavigationData } from '../../../routes/+layout';

	interface Props {
		open: boolean;
		onClose: () => void;
		navigation?: NavigationData;
	}

	let { open, onClose, navigation }: Props = $props();

	const menuItems = $derived(navigation?.main_menu ?? []);
	const ctaText = $derived(navigation?.cta_text ?? 'Înscrie-te');
	const ctaLink = $derived(navigation?.cta_link ?? '/inscrie-te');

	let expandedIndex = $state<number | null>(null);

	function handleLinkClick() {
		onClose();
	}

	function toggleExpand(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
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
	<div class="overlay-backdrop" role="presentation" onclick={onClose}></div>

	<!-- Menu panel -->
	<div class="hamburger-menu" role="dialog" aria-modal="true" aria-label="Meniu navigare">
		<div class="hamburger-menu__header">
			<a href="/" class="hamburger-menu__logo" onclick={handleLinkClick}>
				<img src="/logo-sens.svg" alt="SENS" height="28" />
			</a>
			<button class="hamburger-menu__close" aria-label="Închide meniul" onclick={onClose}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
		</div>

		<nav class="hamburger-menu__nav">
			<a href="/" class="hamburger-menu__link" onclick={handleLinkClick}>Acasă</a>

			{#each menuItems as item, i}
				{#if item.children?.length > 0}
					<div class="hamburger-menu__group">
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
						class="hamburger-menu__link"
						target={item.open_in_new_tab ? '_blank' : undefined}
						rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
						onclick={handleLinkClick}
					>
						{item.label}
					</a>
				{/if}
			{/each}

			<a href="/doneaza" class="hamburger-menu__link" onclick={handleLinkClick}>Donează</a>
		</nav>

		<div class="hamburger-menu__footer">
			<a href={ctaLink} class="btn btn-primary hamburger-menu__cta" onclick={handleLinkClick}>
				{ctaText}
			</a>
			<a
				href={$currentUser ? '/cont' : '/auth/login'}
				class="hamburger-menu__account"
				onclick={handleLinkClick}
			>
				{$currentUser ? `Contul meu (${$currentUser.username})` : 'Autentifică-te'}
			</a>
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
		animation: slide-in var(--transition-base) ease;
	}

	@keyframes slide-in {
		from { transform: translateX(-100%); }
		to { transform: translateX(0); }
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
		transition: background-color var(--transition-fast);
	}

	.hamburger-menu__close:hover {
		background-color: rgba(255, 255, 255, 0.1);
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
		transition: color var(--transition-fast);
	}

	.hamburger-menu__link:hover {
		color: var(--color-white);
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
		transition: color var(--transition-fast);
	}

	.hamburger-menu__group-toggle:hover {
		color: var(--color-white);
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
	}

	.hamburger-menu__sub-link {
		display: block;
		color: rgba(255, 255, 255, 0.65);
		font-size: var(--text-base);
		padding: var(--space-2) 0;
		transition: color var(--transition-fast);
	}

	.hamburger-menu__sub-link:hover {
		color: var(--color-white);
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

	.hamburger-menu__account {
		color: rgba(255, 255, 255, 0.75);
		font-size: var(--text-sm);
		transition: color var(--transition-fast);
	}

	.hamburger-menu__account:hover {
		color: var(--color-white);
	}

	.hamburger-menu__lang {
		color: rgba(255, 255, 255, 0.4);
		font-size: var(--text-xs);
	}
</style>
