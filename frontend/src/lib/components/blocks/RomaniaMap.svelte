<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { COUNTIES, COUNTY_BY_CODE } from '$lib/data/romania-counties';
	// Static SVG bundled at build time via Vite's ?raw query — no runtime fetch,
	// no sanitization needed (it's our own asset, not user-supplied).
	import romaniaSvg from '../../../../static/maps/romania-counties.svg?raw';

	interface CountyChapter {
		id?: number;
		code: string;
		name?: string;
		url: string;
		/** Default true (existing behaviour). When false, navigation stays in the same tab. */
		open_in_new_tab?: boolean;
	}

	function openChapterUrl(chapter: CountyChapter): void {
		if (!chapter.url) return;
		if (chapter.open_in_new_tab === false) {
			window.location.href = chapter.url;
		} else {
			window.open(chapter.url, '_blank', 'noopener');
		}
	}

	interface Props {
		data: {
			kicker?: string;
			heading: string;
			subheading?: string;
			chapters?: CountyChapter[];
			background_color?: 'paper' | 'cream';
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'paper');
	const chapters = $derived(data.chapters ?? []);

	const chapterByCode = $derived.by(() => {
		const m = new Map<string, CountyChapter>();
		for (const c of chapters) m.set(c.code.toUpperCase(), c);
		return m;
	});

	const activeCount = $derived(chapterByCode.size);

	let mapContainer: HTMLDivElement | undefined = $state(undefined);
	let zoomLayer: HTMLDivElement | undefined = $state(undefined);

	/** Code currently shown via mouse hover (desktop only). */
	let hoveredCode: string | null = $state(null);
	/** Code "stuck" via touch tap — stays open until user taps outside or another county. */
	let selectedCode: string | null = $state(null);
	let tooltipPos = $state<{ x: number; y: number } | null>(null);

	/** What we display in the tooltip. Touch selection takes precedence over hover. */
	const visibleCode = $derived(selectedCode ?? hoveredCode);
	const visibleCountyMeta = $derived(visibleCode ? COUNTY_BY_CODE.get(visibleCode) : null);
	const visibleChapter = $derived(visibleCode ? chapterByCode.get(visibleCode) : null);

	function isActive(code: string): boolean {
		return chapterByCode.has(code.toUpperCase());
	}

	// ─── Zoom + pan state ─────────────────────────────────────────
	const MIN_SCALE = 1;
	const MAX_SCALE = 4;
	const ZOOM_STEP = 1.4;

	let scale = $state(1);
	let panX = $state(0);
	let panY = $state(0);

	const transform = $derived(`translate(${panX}px, ${panY}px) scale(${scale})`);
	const canZoomIn = $derived(scale < MAX_SCALE - 0.001);
	const canZoomOut = $derived(scale > MIN_SCALE + 0.001);

	function clampPan() {
		if (!mapContainer) return;
		const rect = mapContainer.getBoundingClientRect();
		const extraX = (rect.width * (scale - 1)) / 2;
		const extraY = (rect.height * (scale - 1)) / 2;
		panX = Math.max(-extraX, Math.min(extraX, panX));
		panY = Math.max(-extraY, Math.min(extraY, panY));
	}

	function zoomIn() {
		const newScale = Math.min(MAX_SCALE, scale * ZOOM_STEP);
		if (newScale === scale) return;
		scale = newScale;
		clampPan();
	}

	function zoomOut() {
		const newScale = Math.max(MIN_SCALE, scale / ZOOM_STEP);
		if (newScale === scale) return;
		scale = newScale;
		clampPan();
	}

	function zoomReset() {
		scale = 1;
		panX = 0;
		panY = 0;
	}

	// ─── Pan + touch detection ───────────────────────────────────
	let dragging = $state(false);
	let dragStart: { x: number; y: number; panX: number; panY: number } | null = null;
	let dragMoved = false;
	/** Tracks the input modality of the most recent pointer interaction. */
	let lastPointerType: 'mouse' | 'touch' | 'pen' | null = null;

	function onPointerDown(e: PointerEvent) {
		lastPointerType = e.pointerType as 'mouse' | 'touch' | 'pen';
		if (scale <= MIN_SCALE) return; // pan disabled at base zoom
		if (!mapContainer) return;
		// Don't start a pan when the press lands on the zoom controls or the
		// tooltip — otherwise pointer capture eats the button's click event,
		// making +/-/reset buttons unusable after the first zoom.
		const target = e.target as Element | null;
		if (target?.closest('.rmap__controls') || target?.closest('.rmap__tooltip')) {
			return;
		}
		dragging = true;
		dragMoved = false;
		dragStart = { x: e.clientX, y: e.clientY, panX, panY };
		mapContainer.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || !dragStart) return;
		const dx = e.clientX - dragStart.x;
		const dy = e.clientY - dragStart.y;
		if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved = true;
		panX = dragStart.panX + dx;
		panY = dragStart.panY + dy;
		clampPan();
	}

	function onPointerUp(e: PointerEvent) {
		dragging = false;
		dragStart = null;
		if (mapContainer && mapContainer.hasPointerCapture(e.pointerId)) {
			mapContainer.releasePointerCapture(e.pointerId);
		}
	}

	/** Dismiss touch selection when user taps outside any active county. */
	function onContainerClick(e: MouseEvent) {
		const target = e.target as Element | null;
		// If the click bubbled from one of our active county paths, leave selection alone.
		if (target?.closest('path[data-county].is-active')) return;
		// If the click came from inside the tooltip (e.g., the link itself), leave it.
		if (target?.closest('.rmap__tooltip')) return;
		selectedCode = null;
	}

	// ─── SVG interactivity ────────────────────────────────────────
	$effect(() => {
		if (!mapContainer) return;
		const root = mapContainer.querySelector('svg');
		if (!root) return;

		root.setAttribute('width', '100%');
		root.setAttribute('height', '100%');
		root.setAttribute('preserveAspectRatio', 'xMidYMid meet');

		const paths = root.querySelectorAll<SVGPathElement>('path[data-county]');
		const labels = root.querySelectorAll<SVGTextElement>('text[data-label-for]');
		const cleanups: Array<() => void> = [];

		for (const label of labels) {
			const code = (label.getAttribute('data-label-for') ?? '').toUpperCase();
			label.classList.toggle('label-active', isActive(code));
		}

		for (const el of paths) {
			const code = (el.getAttribute('data-county') ?? '').toUpperCase();
			const active = isActive(code);
			el.classList.toggle('is-active', active);
			el.classList.toggle('is-inactive', !active);

			if (!active) continue;

			const chapter = chapterByCode.get(code)!;
			const onEnter = (e: MouseEvent) => {
				if (lastPointerType === 'touch') return; // ignore synthetic mouseenter on touch
				hoveredCode = code;
				updateTooltipFromMouse(e);
			};
			const onMove = (e: MouseEvent) => {
				if (lastPointerType === 'touch') return;
				updateTooltipFromMouse(e);
			};
			const onLeave = () => {
				if (lastPointerType === 'touch') return;
				hoveredCode = null;
				if (!selectedCode) tooltipPos = null;
			};
			const onClick = (e: MouseEvent) => {
				// Suppress click after a pan drag.
				if (dragMoved) {
					e.preventDefault();
					return;
				}
				if (lastPointerType === 'touch') {
					// First tap on a touch device → open tooltip with link;
					// the user navigates via the in-tooltip "Du-te la filiala →" link.
					e.preventDefault();
					if (selectedCode === code) {
						// Tapping the same county again navigates immediately.
						openChapterUrl(chapter);
						return;
					}
					selectedCode = code;
					updateTooltipFromCounty(el);
					return;
				}
				// Mouse / keyboard: navigate immediately.
				openChapterUrl(chapter);
			};
			const onKey = (e: KeyboardEvent) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					openChapterUrl(chapter);
				}
			};
			const meta = COUNTY_BY_CODE.get(code);
			el.setAttribute('role', 'link');
			el.setAttribute('tabindex', '0');
			el.setAttribute(
				'aria-label',
				`Filială ${chapter.name ?? meta?.name ?? code} — du-te la pagina filialei`
			);
			el.addEventListener('mouseenter', onEnter);
			el.addEventListener('mousemove', onMove);
			el.addEventListener('mouseleave', onLeave);
			el.addEventListener('focus', () => (hoveredCode = code));
			el.addEventListener('blur', () => (hoveredCode = null));
			el.addEventListener('click', onClick);
			el.addEventListener('keydown', onKey);

			cleanups.push(() => {
				el.removeEventListener('mouseenter', onEnter);
				el.removeEventListener('mousemove', onMove);
				el.removeEventListener('mouseleave', onLeave);
				el.removeEventListener('click', onClick);
				el.removeEventListener('keydown', onKey as EventListener);
			});
		}

		return () => {
			for (const fn of cleanups) fn();
		};
	});

	// Toggle a `label-hover` class on the label whose county is currently
	// hovered or touch-selected, so its fill switches to dark (cream-on-lime
	// is invisible otherwise).
	$effect(() => {
		if (!mapContainer) return;
		const root = mapContainer.querySelector('svg');
		if (!root) return;
		const active = visibleCode;
		const labels = root.querySelectorAll<SVGTextElement>('text[data-label-for]');
		for (const label of labels) {
			const code = (label.getAttribute('data-label-for') ?? '').toUpperCase();
			label.classList.toggle('label-hover', !!active && code === active);
		}
	});

	function updateTooltipFromMouse(e: MouseEvent) {
		if (!mapContainer) return;
		const rect = mapContainer.getBoundingClientRect();
		tooltipPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	/** Position tooltip at the visual center of a county's bounding box. */
	function updateTooltipFromCounty(el: SVGPathElement) {
		if (!mapContainer) return;
		const containerRect = mapContainer.getBoundingClientRect();
		const elRect = el.getBoundingClientRect();
		tooltipPos = {
			x: elRect.left + elRect.width / 2 - containerRect.left,
			y: elRect.top - containerRect.top,
		};
	}

	onMount(() => {
		if (!browser) return;
		const onResize = () => clampPan();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});
</script>

<section class="rmap rmap--{bg}">
	<div class="container">
		<header class="rmap__header">
			{#if data.kicker}
				<div class="rmap__kicker">— {data.kicker}</div>
			{/if}
			<h2 class="rmap__heading">{data.heading}</h2>
			{#if data.subheading}
				<p class="rmap__subheading">{data.subheading}</p>
			{/if}
			<div class="rmap__legend" aria-hidden="true">
				<div class="rmap__legend-items">
					<span class="rmap__legend-item">
						<span class="rmap__swatch rmap__swatch--active"></span>
						Filială activă
					</span>
					<span class="rmap__legend-item">
						<span class="rmap__swatch rmap__swatch--inactive"></span>
						În pregătire
					</span>
				</div>
				<span class="rmap__legend-count">{activeCount} / {COUNTIES.length} județe</span>
			</div>
		</header>

		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="rmap__container"
			class:rmap__container--dragging={dragging}
			class:rmap__container--zoomed={scale > MIN_SCALE}
			bind:this={mapContainer}
			aria-label="Hartă România cu filialele SENS"
			role="region"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
			onclick={onContainerClick}
		>
			<div class="rmap__zoom-layer" bind:this={zoomLayer} style="transform: {transform};">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html romaniaSvg}
			</div>

			<div class="rmap__controls" aria-label="Controale zoom">
				<button
					type="button"
					class="rmap__zoom-btn"
					onclick={zoomIn}
					disabled={!canZoomIn}
					aria-label="Mărește harta"
				>+</button>
				<button
					type="button"
					class="rmap__zoom-btn"
					onclick={zoomOut}
					disabled={!canZoomOut}
					aria-label="Micșorează harta"
				>−</button>
				<button
					type="button"
					class="rmap__zoom-btn rmap__zoom-btn--reset"
					onclick={zoomReset}
					disabled={scale === 1 && panX === 0 && panY === 0}
					aria-label="Resetează zoom"
				>⟲</button>
			</div>

			{#if tooltipPos && visibleCountyMeta && visibleChapter}
				{@const inNewTab = visibleChapter.open_in_new_tab !== false}
				<div
					class="rmap__tooltip"
					style="left: {tooltipPos.x}px; top: {tooltipPos.y}px;"
					role="tooltip"
				>
					<span class="rmap__tooltip-name">{visibleChapter.name ?? visibleCountyMeta.name}</span>
					<a
						href={visibleChapter.url}
						target={inNewTab ? '_blank' : undefined}
						rel={inNewTab ? 'noopener noreferrer' : undefined}
						class="rmap__tooltip-cta"
					>Du-te la filiala →</a>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.rmap--paper { background-color: var(--color-paper); color: var(--color-ink); }
	.rmap--cream { background-color: var(--color-cream); color: var(--color-ink); }

	.rmap__header {
		margin-bottom: var(--space-12);
	}
	.rmap__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}
	.rmap__heading {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 5vw, 4.5rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
		margin: 0 0 var(--space-4);
	}
	.rmap__subheading {
		font-size: clamp(1rem, 1.4vw, 1.125rem);
		opacity: 0.75;
		line-height: 1.5;
		margin: 0 0 var(--space-5);
	}

	.rmap__legend {
		display: flex;
		gap: var(--space-5);
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0.7;
	}
	.rmap__legend-items {
		display: flex;
		gap: var(--space-5);
		flex-wrap: wrap;
		align-items: center;
	}
	.rmap__legend-item {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}
	.rmap__swatch {
		width: 14px;
		height: 14px;
		border: 1px solid var(--color-ink);
		display: inline-block;
	}
	.rmap__swatch--active { background-color: var(--color-green-deep); }
	.rmap__swatch--inactive { background-color: #d6d6d6; }
	.rmap__legend-count {
		opacity: 0.6;
		text-align: right;
		flex-shrink: 0;
	}

	.rmap__container {
		position: relative;
		width: 100%;
		max-width: 980px;
		margin-inline: auto;
		aspect-ratio: 700 / 460;
		background-color: var(--color-cream);
		border: 1px solid rgba(12, 81, 24, 0.15);
		overflow: hidden;
		touch-action: none;
	}
	.rmap--cream .rmap__container {
		background-color: var(--color-paper);
	}

	@media (min-width: 1100px) {
		.rmap__container { max-width: 1200px; }
	}
	@media (min-width: 1400px) {
		.rmap__container { max-width: 1320px; }
	}

	.rmap__container--zoomed { cursor: grab; }
	.rmap__container--dragging { cursor: grabbing; }

	.rmap__zoom-layer {
		position: absolute;
		inset: 0;
		transform-origin: 50% 50%;
		transition: transform 240ms cubic-bezier(0.2, 0.7, 0.3, 1);
		will-change: transform;
	}
	.rmap__container--dragging .rmap__zoom-layer { transition: none; }

	.rmap__zoom-layer :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}
	.rmap__zoom-layer :global(path[data-county]) {
		stroke: var(--color-ink);
		stroke-width: 0.5;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
		transition: fill var(--transition-fast), stroke-width var(--transition-fast);
	}
	.rmap__zoom-layer :global(path[data-county].is-inactive) {
		fill: #d6d6d6;
		cursor: default;
		pointer-events: none;
	}
	.rmap__zoom-layer :global(path[data-county].is-active) {
		fill: var(--color-green-deep);
		cursor: pointer;
	}
	.rmap__zoom-layer :global(path[data-county].is-active:hover),
	.rmap__zoom-layer :global(path[data-county].is-active:focus-visible) {
		fill: var(--color-lime);
		stroke-width: 1.5;
		outline: none;
	}

	.rmap__zoom-layer :global(text[data-label-for]) {
		font-family: var(--font-mono);
		font-size: 9px;
		font-weight: 500;
		text-anchor: middle;
		pointer-events: none;
		user-select: none;
		fill: rgba(10, 31, 16, 0.55);
	}
	.rmap__zoom-layer :global(text[data-label-for].label-active) {
		fill: var(--color-cream);
	}

	/* When the underlying county is hovered/selected its fill switches to
	   lime — flip the label to dark ink so it stays legible. */
	.rmap__zoom-layer :global(text[data-label-for].label-hover) {
		fill: var(--color-ink);
	}

	.rmap__controls {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		display: flex;
		flex-direction: column;
		gap: 4px;
		z-index: 3;
	}
	.rmap__zoom-btn {
		width: 36px;
		height: 36px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-paper);
		color: var(--color-ink);
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
		line-height: 1;
		cursor: pointer;
		padding: 0;
		transition: background-color var(--transition-fast), color var(--transition-fast), transform 80ms;
	}
	.rmap__zoom-btn--reset { font-size: 0.9375rem; }
	.rmap__zoom-btn:hover:not(:disabled) {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}
	.rmap__zoom-btn:active:not(:disabled) { transform: scale(0.94); }
	.rmap__zoom-btn:disabled { opacity: 0.35; cursor: not-allowed; }

	/* Tooltip — appears above hovered/selected county. The CTA inside is a
	   real <a>, so it remains tappable on touch even though the wrapper is
	   pointer-events: none for the rest. */
	.rmap__tooltip {
		position: absolute;
		transform: translate(-50%, calc(-100% - 12px));
		background-color: var(--color-ink);
		color: var(--color-cream);
		padding: var(--space-2) var(--space-3);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		line-height: 1.2;
		z-index: 4;
		display: flex;
		flex-direction: column;
		gap: 4px;
		white-space: nowrap;
		max-width: 240px;
		pointer-events: auto;
	}
	.rmap__tooltip::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 100%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: var(--color-ink);
	}
	.rmap__tooltip-name {
		font-family: var(--font-display);
		font-weight: 500;
	}
	.rmap__tooltip-cta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-lime);
		text-decoration: none;
		padding: 4px 0;
		border-bottom: 1px solid transparent;
		transition: border-color var(--transition-fast);
	}
	.rmap__tooltip-cta:hover,
	.rmap__tooltip-cta:focus-visible {
		border-bottom-color: var(--color-lime);
		outline: none;
	}
</style>
