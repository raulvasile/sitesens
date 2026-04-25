<script lang="ts">
	import type { Component } from 'svelte';
	import Hero from './blocks/Hero.svelte';
	import HeroRefined from './blocks/HeroRefined.svelte';
	import HeroEditorial from './blocks/HeroEditorial.svelte';
	import TextBlock from './blocks/TextBlock.svelte';
	import CtaBanner from './blocks/CtaBanner.svelte';
	import ImageGallery from './blocks/ImageGallery.svelte';
	import Accordion from './blocks/Accordion.svelte';
	import Quote from './blocks/Quote.svelte';
	import VideoEmbed from './blocks/VideoEmbed.svelte';
	import StatsCounter from './blocks/StatsCounter.svelte';
	import ProgramPoints from './blocks/ProgramPoints.svelte';
	import NewsletterCta from './blocks/NewsletterCta.svelte';
	import CardGrid from './blocks/CardGrid.svelte';
	import LatestArticles from './blocks/LatestArticles.svelte';
	import UpcomingEvents from './blocks/UpcomingEvents.svelte';
	import ContactForm from './blocks/ContactForm.svelte';
	import Spacer from './blocks/Spacer.svelte';
	import SocialFeed from './blocks/SocialFeed.svelte';
	import WordCarousel from './blocks/WordCarousel.svelte';
	import Timeline from './blocks/Timeline.svelte';
	import MissionBand from './blocks/MissionBand.svelte';
	import ChaptersGrid from './blocks/ChaptersGrid.svelte';
	import TeamGrid from './blocks/TeamGrid.svelte';
	import PageHeader from './blocks/PageHeader.svelte';
	import RomaniaMap from './blocks/RomaniaMap.svelte';

	interface Props {
		content: Array<{ __component: string; anchor_id?: string | null; [key: string]: unknown }>;
		/** Alternate paper/cream background between consecutive blocks (homepage). */
		zebra?: boolean;
	}

	let { content = [], zebra = false }: Props = $props();

	/**
	 * Sanitize a user-supplied anchor id into a safe HTML id token.
	 * Lowercase, alphanum + dash/underscore, no leading digit, max 60 chars.
	 * Returns undefined for empty/invalid input so the wrapper omits the attribute.
	 */
	function sanitizeAnchor(raw: unknown): string | undefined {
		if (typeof raw !== 'string') return undefined;
		const cleaned = raw
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9_-]/g, '')
			.slice(0, 60)
			.replace(/^[^a-z_]+/, ''); // HTML ids can't start with digit
		return cleaned || undefined;
	}

	/**
	 * Blocks that own a strong, opinionated background (dark green, lime, etc.)
	 * — for these we let the block's own background show through and skip
	 * applying any zebra tint on the slot.
	 */
	const HAS_OWN_BG = new Set([
		'blocks.hero',
		'blocks.hero-refined',
		'blocks.hero-editorial',
		'blocks.stats-counter',
		'blocks.word-carousel',
		'blocks.newsletter-cta',
		'blocks.cta-banner',
		'blocks.mission-band',
		'blocks.chapters-grid',
		'blocks.romania-map',
	]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const componentMap: Record<string, Component<any>> = {
		'blocks.hero': Hero,
		'blocks.hero-refined': HeroRefined,
		'blocks.hero-editorial': HeroEditorial,
		'blocks.text-block': TextBlock,
		'blocks.cta-banner': CtaBanner,
		'blocks.image-gallery': ImageGallery,
		'blocks.accordion': Accordion,
		'blocks.quote': Quote,
		'blocks.video-embed': VideoEmbed,
		'blocks.stats-counter': StatsCounter,
		'blocks.program-points': ProgramPoints,
		'blocks.newsletter-cta': NewsletterCta,
		'blocks.card-grid': CardGrid,
		'blocks.latest-articles': LatestArticles,
		'blocks.upcoming-events': UpcomingEvents,
		'blocks.contact-form': ContactForm,
		'blocks.spacer': Spacer,
		'blocks.social-feed': SocialFeed,
		'blocks.word-carousel': WordCarousel,
		'blocks.timeline': Timeline,
		'blocks.mission-band': MissionBand,
		'blocks.chapters-grid': ChaptersGrid,
		'blocks.team-grid': TeamGrid,
		'blocks.page-header': PageHeader,
		'blocks.romania-map': RomaniaMap
	};
</script>

{#if zebra}
	{#each content as block, i (block.__component + JSON.stringify(block))}
		{#if componentMap[block.__component]}
			{@const BlockComponent = componentMap[block.__component]}
			{@const ownsBg = HAS_OWN_BG.has(block.__component)}
			{@const anchor = sanitizeAnchor(block.anchor_id)}
			<div
				class="dz-slot"
				class:dz-slot--cream={!ownsBg && i % 2 === 1}
				class:dz-slot--paper={!ownsBg && i % 2 === 0}
				id={anchor}
			>
				<BlockComponent data={block} />
			</div>
		{/if}
	{/each}
{:else}
	{#each content as block (block.__component + JSON.stringify(block))}
		{#if componentMap[block.__component]}
			{@const BlockComponent = componentMap[block.__component]}
			{@const anchor = sanitizeAnchor(block.anchor_id)}
			{#if anchor}
				<div id={anchor} class="dz-anchor-wrap">
					<BlockComponent data={block} />
				</div>
			{:else}
				<BlockComponent data={block} />
			{/if}
		{/if}
	{/each}
{/if}

<style>
	.dz-slot--paper {
		background-color: var(--color-paper);
	}
	.dz-slot--cream {
		background-color: var(--color-cream);
	}
	/* Neutralize the inner block's own paper background so the slot's tint
	   shows through. Blocks listed in HAS_OWN_BG keep their explicit colors. */
	.dz-slot--cream :global(> section),
	.dz-slot--paper :global(> section) {
		background-color: transparent !important;
	}
	/* Compensate for the fixed navbar so #anchor jumps don't hide content. */
	.dz-slot,
	.dz-anchor-wrap {
		scroll-margin-top: calc(var(--navbar-height, 64px) + var(--space-4, 16px));
	}
</style>
