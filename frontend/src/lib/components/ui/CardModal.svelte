<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Modal from './Modal.svelte';
	import TextBlock from '$lib/components/blocks/TextBlock.svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';
	import { activeCard, availableCards, openCard, closeCard } from '$lib/cardModal';

	const URL_PARAM = 'card';

	/**
	 * Sync URL with the active card via `history.replaceState` — this avoids
	 * triggering a SvelteKit navigation (which would invalidate page data and
	 * unmount/remount blocks, clearing the cards registry mid-action).
	 */
	function syncUrlWithCardId(id: number | null): void {
		if (!browser) return;
		const url = new URL(window.location.href);
		const current = url.searchParams.get(URL_PARAM);
		const next = id === null ? null : String(id);
		if (current === next) return;
		if (next === null) url.searchParams.delete(URL_PARAM);
		else url.searchParams.set(URL_PARAM, next);
		window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
	}

	function handleClose(): void {
		closeCard();
	}

	// Push ?card=<id> when a card opens, clear it when it closes.
	$effect(() => {
		syncUrlWithCardId($activeCard?.id ?? null);
	});

	// Allow browser Back/Forward to close the modal when ?card= is removed.
	function handlePopState(): void {
		const idStr = new URL(window.location.href).searchParams.get(URL_PARAM);
		if (!idStr) {
			closeCard();
			return;
		}
		const id = Number(idStr);
		if (!Number.isFinite(id)) return;
		const found = availableCardsGet(id);
		if (found) openCard(found);
	}

	function availableCardsGet(id: number) {
		let map: Map<number, import('$lib/cardModal').CardDetail> = new Map();
		availableCards.subscribe((m) => (map = m))();
		return map.get(id);
	}

	onMount(() => {
		// Initial deep-link resolution on page load.
		const idStr = new URL(window.location.href).searchParams.get(URL_PARAM);
		if (idStr) {
			const id = Number(idStr);
			if (Number.isFinite(id)) {
				// Defer so blocks have time to register on first paint.
				queueMicrotask(() => {
					const found = availableCardsGet(id);
					if (found) openCard(found);
				});
			}
		}
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	});

	const meta = $derived($activeCard?.meta);
	const headerImage = $derived(meta?.image?.url ? getStrapiMediaUrl(meta.image.url) : null);
</script>

<Modal
	open={!!$activeCard}
	onClose={handleClose}
	size="large"
	title={$activeCard?.title}
>
	{#if $activeCard}
		{#if headerImage}
			<figure class="card-modal__figure">
				<img
					src={headerImage}
					alt={meta?.image?.alt ?? $activeCard.title}
					loading="eager"
					decoding="async"
				/>
			</figure>
		{/if}

		{#if meta?.kicker || meta?.subtitle}
			<header class="card-modal__meta">
				{#if meta?.kicker}<div class="card-modal__kicker">— {meta.kicker}</div>{/if}
				{#if meta?.subtitle}<div class="card-modal__subtitle">{meta.subtitle}</div>{/if}
			</header>
		{/if}

		<div class="card-modal__body">
			<TextBlock data={{ body: $activeCard.details, alignment: 'left' }} />
		</div>
	{/if}
</Modal>

<style>
	.card-modal__figure {
		margin: 0 0 var(--space-6);
		border: 1px solid rgba(12, 81, 24, 0.15);
		background-color: var(--color-cream);
	}
	.card-modal__figure img {
		display: block;
		width: 100%;
		max-height: 360px;
		object-fit: cover;
	}

	.card-modal__meta {
		margin-bottom: var(--space-5);
	}
	.card-modal__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.65;
		margin-bottom: var(--space-2);
	}
	.card-modal__subtitle {
		font-family: var(--font-display);
		font-size: clamp(1rem, 1.4vw, 1.125rem);
		color: var(--color-ink-soft);
		font-weight: 400;
		line-height: 1.4;
	}

	/* TextBlock has its own container/padding tuned for full-page sections.
	   Inside the modal we want it edge-to-edge. */
	.card-modal__body :global(.text-block) {
		padding: 0;
		background: transparent;
	}
	.card-modal__body :global(.text-block .container) {
		padding: 0;
		max-width: none;
	}
	.card-modal__body :global(.prose) {
		max-width: none;
	}
</style>
