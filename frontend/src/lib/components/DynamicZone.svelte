<script lang="ts">
	import type { Component } from 'svelte';
	import Hero from './blocks/Hero.svelte';
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

	interface Props {
		content: Array<{ __component: string; [key: string]: unknown }>;
	}

	let { content = [] }: Props = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const componentMap: Record<string, Component<any>> = {
		'blocks.hero': Hero,
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
		'blocks.social-feed': SocialFeed
	};
</script>

{#each content as block (block.__component + JSON.stringify(block))}
	{#if componentMap[block.__component]}
		{@const BlockComponent = componentMap[block.__component]}
		<BlockComponent data={block} />
	{:else}
		<!-- Block type "{block.__component}" not implemented yet -->
	{/if}
{/each}
