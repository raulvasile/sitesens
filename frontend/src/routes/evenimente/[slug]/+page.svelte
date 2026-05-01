<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import { sanitizeHtml } from '$lib/sanitize';
	import { renderStrapiBlocks } from '$lib/strapiBlocks';
	import { dayParts, formatTime, formatDateLong } from '$lib/dates';
	import { eventTypeLabel } from '$lib/events';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const event = $derived(data.event);
	const isPast = $derived(data.isPast);
	const related = $derived(data.relatedEvents);

	function shareUrl(platform: string) {
		const url = typeof window !== 'undefined' ? window.location.href : '';
		const title = event.title;
		const map: Record<string, string> = {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
			email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
		};
		return map[platform] ?? '#';
	}

	function generateICalUrl(ev: typeof event) {
		const start = new Date(ev.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		const end = ev.end_date
			? new Date(ev.end_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
			: start;
		const params = new URLSearchParams({
			action: 'TEMPLATE',
			text: ev.title,
			dates: `${start}/${end}`,
			location: [ev.venue, ev.city].filter(Boolean).join(', ') || ev.location_name || '',
			details: 'Eveniment Partidul SENS',
		});
		return `https://calendar.google.com/calendar/render?${params.toString()}`;
	}

	/** Extract first paragraph as a lead, plain text. */
	function extractLead(blocks: unknown): string {
		if (!Array.isArray(blocks)) return '';
		const first = blocks.find((b: any) => b?.type === 'paragraph') as any;
		if (!first?.children) return '';
		return (first.children as any[])
			.map((c: any) => (typeof c?.text === 'string' ? c.text : ''))
			.join('')
			.trim();
	}

	const lead = $derived(extractLead(event.description));

	const dp = $derived(dayParts(event.start_date));
	const spotsLeft = $derived(
		event.max_participants && event.spots_taken !== null && event.spots_taken !== undefined
			? Math.max(event.max_participants - event.spots_taken, 0)
			: null
	);
</script>

<SeoHead
	title={event.seo?.meta_title ?? event.title}
	description={event.seo?.meta_description ?? lead ?? `${event.title} — eveniment Partidul SENS`}
	ogImage={event.cover_image?.url}
	type="article"
/>

<article class="event-page">
	<div class="event-shell">
		<!-- Breadcrumb: Acasă > Evenimente > [Titlu] -->
		<Breadcrumb items={[
			{ label: 'Evenimente', href: '/evenimente' },
			{ label: event.title }
		]} />

		<!-- Chips row (categorie + status; data e în band-ul de mai jos) -->
		<div class="event-chips">
			<a href="/evenimente?type={event.event_type}" class="chip chip--filled">{eventTypeLabel(event.event_type)}</a>
			{#if event.is_featured}
				<span class="chip chip--outline">Recomandat</span>
			{/if}
			{#if isPast}
				<span class="chip chip--outline chip--muted">Încheiat</span>
			{:else if !event.registration_open}
				<span class="chip chip--outline chip--muted">Înscrieri închise</span>
			{/if}
			{#if event.city}
				<span class="chip-meta">{event.city.toUpperCase()}</span>
			{/if}
		</div>

		<!-- Title -->
		<h1 class="event-title">{event.title}</h1>

		<!-- Lead from first paragraph -->
		{#if lead}
			<p class="event-lead">{lead}</p>
		{/if}

		<!-- Date + place band (canonical date display) -->
		<aside class="event-band">
			<div class="event-band__date">
				<span class="event-band__day">{dp.day}</span>
				<span class="event-band__month">{dp.month}<br /><span class="event-band__year">{dp.year}</span></span>
			</div>

			<div class="event-band__details">
				<div class="event-band__row">
					<div class="event-band__label">Interval</div>
					<div class="event-band__value">
						{formatTime(event.start_date)}{#if event.end_date} – {formatTime(event.end_date)}{/if}
					</div>
				</div>
				{#if event.venue || event.city || event.location_name}
					<div class="event-band__row">
						<div class="event-band__label">Locație</div>
						<div class="event-band__value">
							{event.venue ?? event.location_name}
							{#if event.city}<br /><span class="event-band__sub">{event.city}</span>{/if}
						</div>
					</div>
				{/if}
				{#if event.max_participants}
					<div class="event-band__row">
						<div class="event-band__label">Capacitate</div>
						<div class="event-band__value">
							{event.max_participants} locuri
							{#if spotsLeft !== null}
								<br /><span class="event-band__accent">{spotsLeft} libere</span>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</aside>

		<!-- Cover image -->
		{#if event.cover_image?.url}
			<figure class="event-figure">
				<Image
					src={getStrapiMediaUrl(event.cover_image.url)}
					alt={event.cover_image.alternativeText ?? event.title}
					aspectRatio="16/9"
					priority={true}
					class="event-figure__img"
				/>
				{#if event.cover_image.caption || event.cover_image.alternativeText}
					<figcaption class="event-figure__caption">
						{event.cover_image.caption ?? event.cover_image.alternativeText}
					</figcaption>
				{/if}
			</figure>
		{/if}

		<!-- Body -->
		{#if event.description}
			<div class="event-body">
				{@html sanitizeHtml(renderStrapiBlocks(event.description))}
			</div>
		{/if}

		<!-- CTA bar -->
		{#if !isPast}
			<aside class="event-cta">
				<div class="event-cta__copy">
					<div class="event-cta__kicker">— Participă</div>
					<div class="event-cta__title">{formatDateLong(event.start_date)}</div>
				</div>
				<div class="event-cta__actions">
					{#if event.registration_open}
						<a
							href={event.registration_url ?? `/inscrie-te?event=${event.slug}`}
							class="btn-primary"
							target={event.registration_url ? '_blank' : undefined}
							rel={event.registration_url ? 'noopener noreferrer' : undefined}
						>
							Rezervă loc →
						</a>
					{:else}
						<span class="btn-disabled">Înscrieri închise</span>
					{/if}
					<a href={generateICalUrl(event)} target="_blank" rel="noopener noreferrer" class="btn-outline">
						+ Adaugă în calendar
					</a>
				</div>
			</aside>
		{/if}

		<!-- Social posts (past events) -->
		{#if event.social_posts?.length}
			<section class="social-posts">
				<div class="social-posts__head">— Pe rețele</div>
				{#if event.social_posts_description}
					<p class="social-posts__desc">{event.social_posts_description}</p>
				{/if}
				<div class="social-posts__grid">
					{#each event.social_posts as post}
						<a href={post.url} target="_blank" rel="noopener noreferrer" class="social-posts__item">
							<span class="social-posts__platform">{post.platform.toUpperCase()}</span>
							<span class="social-posts__arrow">↗</span>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Share row -->
		<aside class="share-bar" aria-label="Distribuie evenimentul">
			<span class="share-bar__label">Distribuie ↗</span>
			<div class="share-bar__buttons">
				<a href={shareUrl('facebook')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe Facebook">
					<SocialIcon platform="facebook" size={18} />
				</a>
				<a href={shareUrl('twitter')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe X">
					<SocialIcon platform="x" size={18} />
				</a>
				<a href={shareUrl('linkedin')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe LinkedIn">
					<SocialIcon platform="linkedin" size={18} />
				</a>
				<a href={shareUrl('whatsapp')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe WhatsApp">
					<SocialIcon platform="whatsapp" size={18} />
				</a>
				<a href={shareUrl('email')} class="share-btn" aria-label="Share pe email">
					<SocialIcon platform="email" size={18} />
				</a>
			</div>
		</aside>
	</div>

	<!-- Related events -->
	{#if related.length > 0}
		<section class="related-section">
			<div class="container">
				<h2 class="related-section__title">Alte evenimente</h2>
				<div class="related-grid">
					{#each related as ev}
						{@const rdp = dayParts(ev.start_date)}
						<article class="related-card">
							<div class="related-card__date">
								<span class="related-card__day">{rdp.day}</span>
								<span class="related-card__month">{rdp.month}</span>
							</div>
							<div class="related-card__body">
								<div class="related-card__meta">
									<span class="chip chip--outline">{eventTypeLabel(ev.event_type)}</span>
									{#if ev.city}<span class="related-card__city">{ev.city.toUpperCase()}</span>{/if}
								</div>
								<h3 class="related-card__title">
									<a href="/evenimente/{ev.slug}">{ev.title}</a>
								</h3>
								<a href="/evenimente/{ev.slug}" class="related-card__link">Detalii →</a>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</article>

<style>
	.event-page {
		background-color: var(--color-paper);
		padding-bottom: var(--space-16);
	}

	.event-shell {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-12) var(--space-6) var(--space-16);
	}

	/* Chips */
	.event-chips {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-bottom: var(--space-6);
	}

	.chip {
		display: inline-flex;
		align-items: center;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 5px 12px;
		line-height: 1.4;
		text-decoration: none;
		border: 1.5px solid transparent;
		transition: all var(--transition-fast);
	}
	.chip--filled {
		background-color: var(--color-green-deep);
		color: var(--color-lime);
		text-decoration: none;
	}
	a.chip--filled:hover {
		background-color: var(--color-ink);
	}
	.chip--outline {
		background-color: transparent;
		color: var(--color-ink);
		border-color: rgba(12, 81, 24, 0.4);
	}
	.chip--muted { opacity: 0.6; }

	.chip-meta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.65;
		margin-left: auto;
	}

	/* Title */
	.event-title {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 6vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 var(--space-6);
	}

	/* Lead */
	.event-lead {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 1.7vw, 1.375rem);
		line-height: 1.5;
		font-weight: 400;
		color: var(--color-ink-soft);
		margin: 0 0 var(--space-10);
		max-width: 760px;
	}

	/* Date + place band */
	.event-band {
		display: grid;
		grid-template-columns: minmax(160px, 220px) 1fr;
		gap: var(--space-12);
		padding: var(--space-8) 0;
		margin: var(--space-2) 0 var(--space-10);
		border-top: 2px solid var(--color-ink);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
		align-items: center;
	}
	.event-band__date {
		display: flex;
		/* Top-align so the month sits at the cap-height of the day number,
		   not on its baseline. */
		align-items: flex-start;
		gap: var(--space-3);
		color: var(--color-green-deep);
	}
	.event-band__day {
		font-family: var(--font-display);
		font-size: clamp(4.5rem, 11vw, 7.5rem);
		/* line-height: 1 lets the month align with the actual top edge of the
		   digits (no extra leading slack). */
		line-height: 1;
		font-weight: 500;
		letter-spacing: -0.03em;
	}
	.event-band__month {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink);
		line-height: 1.2;
		/* Pulls the small text up to align with the cap-height of the digits.
		   The number's font is ~88% cap-height; this offset works visually
		   across the clamp() range. */
		padding-top: 0.45em;
	}
	.event-band__year {
		opacity: 0.55;
	}
	.event-band__details {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: var(--space-6);
	}
	.event-band__label {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.6;
		margin-bottom: var(--space-2);
	}
	.event-band__value {
		font-family: var(--font-display);
		font-size: 1.0625rem;
		color: var(--color-ink);
		line-height: 1.35;
	}
	.event-band__sub {
		font-size: 0.875rem;
		color: var(--color-ink-soft);
	}
	.event-band__accent {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-green-deep);
	}
	@media (max-width: 720px) {
		/* Mobile: stack date row → interval → locație clean & vertical. */
		.event-band {
			grid-template-columns: 1fr;
			gap: var(--space-5);
			padding: var(--space-6) 0;
			margin: var(--space-2) 0 var(--space-8);
		}
		.event-band__date {
			align-items: flex-start;
			gap: var(--space-2);
		}
		.event-band__day {
			font-size: 3.5rem;
			line-height: 1;
		}
		.event-band__month {
			font-size: 0.75rem;
			line-height: 1.3;
			padding-top: 0.4em;
		}
		.event-band__details {
			display: flex;
			flex-direction: column;
			gap: var(--space-4);
		}
		.event-band__row {
			display: grid;
			grid-template-columns: 90px 1fr;
			gap: var(--space-3);
			align-items: baseline;
			padding-top: var(--space-3);
			border-top: 1px solid rgba(12, 81, 24, 0.12);
		}
		.event-band__label {
			margin-bottom: 0;
		}
		.event-band__value {
			font-size: 0.9375rem;
		}
	}

	/* Figure */
	.event-figure {
		margin: 0 0 var(--space-12);
	}
	:global(.event-figure__img) {
		width: 100%;
		max-height: 520px;
		border: 1px solid rgba(12, 81, 24, 0.15);
	}
	.event-figure__caption {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
		margin-top: var(--space-3);
	}

	/* Body */
	.event-body {
		max-width: 720px;
		margin-bottom: var(--space-12);
	}
	.event-body :global(p) {
		font-size: 1.125rem;
		line-height: 1.7;
		margin-bottom: var(--space-6);
	}
	.event-body :global(h2),
	.event-body :global(h3) {
		font-family: var(--font-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		margin-top: var(--space-10);
		margin-bottom: var(--space-4);
	}
	.event-body :global(h2) { font-size: clamp(1.75rem, 3vw, 2.25rem); line-height: 1.1; }
	.event-body :global(h3) { font-size: clamp(1.375rem, 2.2vw, 1.75rem); line-height: 1.15; }
	.event-body :global(ul),
	.event-body :global(ol) {
		font-size: 1.125rem;
		line-height: 1.7;
		padding-left: 1.5rem;
		margin-bottom: var(--space-6);
	}
	.event-body :global(li) { margin-bottom: var(--space-3); }
	.event-body :global(blockquote) {
		border-left: 3px solid var(--color-lime);
		padding-left: var(--space-4);
		margin: var(--space-6) 0;
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: 1.5;
		color: var(--color-ink);
	}

	/* CTA bar */
	.event-cta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-6);
		padding: var(--space-8);
		background-color: var(--color-green-deep);
		color: var(--color-cream);
		margin: var(--space-4) 0 var(--space-10);
		flex-wrap: wrap;
	}
	.event-cta__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.6;
		margin-bottom: var(--space-3);
	}
	.event-cta__title {
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 2.4vw, 1.75rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}
	.event-cta__actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
	.btn-primary,
	.btn-outline,
	.btn-disabled {
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 12px 22px;
		text-decoration: none;
		border: 1.5px solid transparent;
		transition: all var(--transition-fast);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}
	.btn-primary {
		background-color: var(--color-lime);
		color: var(--color-ink);
	}
	.btn-primary:hover { background-color: var(--color-green-bright); }
	.btn-outline {
		background-color: transparent;
		color: var(--color-cream);
		border-color: var(--color-cream);
	}
	.btn-outline:hover {
		background-color: var(--color-cream);
		color: var(--color-green-deep);
	}
	.btn-disabled {
		background-color: transparent;
		color: rgba(245, 241, 232, 0.5);
		border-color: rgba(245, 241, 232, 0.25);
		cursor: not-allowed;
	}

	/* Social posts */
	.social-posts {
		margin: var(--space-12) 0;
		padding: var(--space-8) 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}
	.social-posts__head {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.55;
		margin-bottom: var(--space-3);
	}
	.social-posts__desc {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color-ink);
		margin: 0 0 var(--space-5);
		max-width: 60ch;
	}
	.social-posts__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
	}
	.social-posts__item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4) var(--space-5);
		background-color: var(--color-cream);
		border: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: var(--color-ink);
		transition: all var(--transition-fast);
	}
	.social-posts__item:hover {
		background-color: var(--color-ink);
		color: var(--color-lime);
		border-color: var(--color-ink);
	}
	.social-posts__platform {
		font-family: var(--font-display);
		font-size: 0.8125rem;
		letter-spacing: 0.1em;
		font-weight: 500;
	}

	/* Share */
	.share-bar {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-6) 0 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}
	.share-bar__label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
	}
	.share-bar__buttons {
		display: flex;
		gap: var(--space-2);
	}
	.share-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border: 1.5px solid var(--color-ink);
		background-color: transparent;
		color: var(--color-ink);
		text-decoration: none;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}
	.share-btn:hover {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}

	/* Related */
	.related-section {
		padding-block: var(--space-16);
		background-color: var(--color-cream);
		border-top: 1px solid rgba(12, 81, 24, 0.15);
		margin-top: var(--space-16);
	}
	.related-section__title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		margin-bottom: var(--space-8);
		color: var(--color-ink);
	}
	.related-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}
	@media (min-width: 768px) {
		.related-grid { grid-template-columns: repeat(3, 1fr); }
	}
	.related-card {
		background-color: var(--color-paper);
		border: 1px solid rgba(12, 81, 24, 0.12);
		padding: var(--space-6);
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-5);
		align-items: start;
	}
	.related-card__date {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 56px;
	}
	.related-card__day {
		font-family: var(--font-display);
		font-size: 2.5rem;
		line-height: 1;
		font-weight: 500;
		color: var(--color-green-deep);
	}
	.related-card__month {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		margin-top: var(--space-1);
	}
	.related-card__body {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.related-card__meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
	.related-card__city {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.14em;
		color: var(--color-ink-soft);
		opacity: 0.6;
	}
	.related-card__title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: 1.15;
		font-weight: 500;
		margin: 0;
	}
	.related-card__title a {
		color: var(--color-ink);
		text-decoration: none;
	}
	.related-card__title a:hover { color: var(--color-green-deep); }
	.related-card__link {
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink);
		text-decoration: none;
		margin-top: auto;
		transition: color var(--transition-fast);
	}
	.related-card__link:hover { color: var(--color-green-deep); }
</style>
