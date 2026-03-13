<script lang="ts">
	import { getStrapiMediaUrl, mutateStrapi } from '$lib/strapi';
	import { toasts } from '$lib/stores/toast';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data } = $props();
	const hp = $derived(data.homepage);
	const articles = $derived(data.latestArticles);
	const events = $derived(data.upcomingEvents);

	let nlEmail = $state('');
	let nlSending = $state(false);

	async function handleNewsletter(e: SubmitEvent) {
		e.preventDefault();
		nlSending = true;
		try {
			await mutateStrapi('/newsletter-subscribers', 'POST', {
				data: {
					email: nlEmail,
					consent_date: new Date().toISOString(),
					source: 'homepage'
				}
			});
			toasts.success('Te-ai abonat cu succes la newsletter!');
			nlEmail = '';
		} catch (err: any) {
			if (err?.message?.includes('unique')) {
				toasts.info('Acest email este deja abonat.');
			} else {
				toasts.error('Eroare la abonare. Încercați din nou.');
			}
		} finally {
			nlSending = false;
		}
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('ro-RO', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
	}

	function eventBadgeClass(type: string) {
		const map: Record<string, string> = { dezbatere: 'badge-green', actiune: 'badge-orange', mars: 'badge-green', online: 'badge-muted' };
		return map[type] || 'badge-muted';
	}
</script>

<SeoHead
	title={hp?.seo?.meta_title ?? 'SENS — Sănătate · Educație · Natură · Sustenabilitate'}
	description={hp?.seo?.meta_description ?? 'Partidul SENS — O Românie verde, echitabilă și modernă.'}
	ogImage={hp?.seo?.og_image?.url}
	canonicalUrl={hp?.seo?.canonical_url}
	noIndex={hp?.seo?.no_index ?? false}
/>

<!-- ═══════ HERO ═══════ -->
<section
	class="hero"
	style={hp?.hero_image?.url ? `--hero-bg: url('${getStrapiMediaUrl(hp.hero_image.url)}')` : ''}
>
	<div class="hero__overlay"></div>
	<div class="container hero__content">
		<h1 class="hero__title">{hp?.hero_title ?? 'O Românie verde, echitabilă și modernă'}</h1>
		{#if hp?.hero_subtitle}
			<p class="hero__subtitle">{hp.hero_subtitle}</p>
		{/if}
		<div class="hero__ctas">
			<a href={hp?.hero_cta_link ?? '/inscrie-te'} class="btn btn-primary btn-lg">
				{hp?.hero_cta_text ?? 'Înscrie-te'}
			</a>
			<a href="/doneaza" class="btn btn-secondary btn-lg hero__cta-secondary">Donează</a>
		</div>
	</div>
</section>

<!-- ═══════ VALORI ═══════ -->
{#if hp?.values?.length}
	<section class="values">
		<div class="container">
			<h2 class="section-title">Valorile noastre</h2>
			<div class="values__grid">
				{#each hp.values as value}
					<article class="value-card">
						<h3 class="value-card__title">{value.title}</h3>
						<p class="value-card__short">{value.short_text}</p>
						<p class="value-card__desc">{value.description}</p>
						{#if value.points?.length}
							<ul class="value-card__points">
								{#each value.points as point}
									<li>{point.text}</li>
								{/each}
							</ul>
						{/if}
						{#if value.link_url}
							<a href={value.link_url} class="value-card__link">
								{value.link_text ?? 'Află mai mult'} →
							</a>
						{/if}
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- ═══════ DIN PROGRAMUL NOSTRU ═══════ -->
{#if hp?.program_points?.length}
	<section class="program">
		<div class="container">
			<h2 class="section-title">Din programul nostru</h2>
			<div class="program__grid">
				{#each hp.program_points as item}
					<div class="program__item">
						<span class="program__area">{item.area}</span>
						<p class="program__text">{item.text}</p>
					</div>
				{/each}
			</div>
			<div class="program__link-wrapper">
				<a href="/despre-noi" class="program__link">Vezi programul complet →</a>
			</div>
		</div>
	</section>
{/if}

<!-- ═══════ ULTIMELE ȘTIRI ═══════ -->
{#if articles.length > 0}
	<section class="latest-news">
		<div class="container">
			<div class="section-header">
				<h2 class="section-title">Ultimele știri</h2>
				<a href="/stiri" class="section-link">Toate știrile →</a>
			</div>
			<div class="news-grid">
				{#each articles as article}
					<a href="/stiri/{article.slug}" class="news-card">
						{#if article.cover_image?.url}
							<img
								src={getStrapiMediaUrl(article.cover_image.url)}
								alt={article.cover_image.alternativeText ?? article.title}
								class="news-card__img"
								loading="lazy"
							/>
						{:else}
							<div class="news-card__img news-card__img--placeholder"></div>
						{/if}
						<div class="news-card__body">
							{#if article.category}
								<span class="badge badge-green">{article.category.name}</span>
							{/if}
							<h3 class="news-card__title">{article.title}</h3>
							{#if article.excerpt}
								<p class="news-card__excerpt">{article.excerpt}</p>
							{/if}
							<time class="news-card__date">{formatDate(article.createdAt)}</time>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- ═══════ EVENIMENTE VIITOARE ═══════ -->
{#if events.length > 0}
	<section class="events-section">
		<div class="container">
			<div class="section-header">
				<h2 class="section-title">Evenimente viitoare</h2>
				<a href="/evenimente" class="section-link">Toate evenimentele →</a>
			</div>
			<div class="events-grid">
				{#each events as event}
					<a href="/evenimente/{event.slug}" class="event-card">
						<div class="event-card__date-block">
							<span class="event-card__day">{new Date(event.start_date).getDate()}</span>
							<span class="event-card__month">
								{new Date(event.start_date).toLocaleDateString('ro-RO', { month: 'short' }).toUpperCase()}
							</span>
						</div>
						<div class="event-card__body">
							<span class="badge {eventBadgeClass(event.event_type)}">
								{event.event_type}
							</span>
							<h3 class="event-card__title">{event.title}</h3>
							<p class="event-card__location">{event.location_name}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- ═══════ NEWSLETTER ═══════ -->
<section class="newsletter-section">
	<div class="container newsletter-section__inner">
		<div class="newsletter-section__text">
			<h2>{hp?.newsletter_title ?? 'Rămâi la curent cu SENS'}</h2>
			{#if hp?.newsletter_description}
				<p>{hp.newsletter_description}</p>
			{/if}
		</div>
		<form class="newsletter-section__form" onsubmit={handleNewsletter}>
			<input type="email" bind:value={nlEmail} placeholder="email@exemplu.ro" required aria-label="Email" class="newsletter-section__input" />
			<button type="submit" class="btn btn-primary" disabled={nlSending}>
				{nlSending ? 'Se abonează...' : 'Abonează-te'}
			</button>
		</form>
	</div>
</section>

<style>
	/* ── Hero ── */
	.hero {
		position: relative;
		min-height: 85vh;
		display: flex;
		align-items: center;
		background-color: var(--color-green-dark);
		background-image: var(--hero-bg);
		background-size: cover;
		background-position: center;
		padding-block: var(--space-24);
		margin-top: calc(-1 * var(--navbar-height));
		padding-top: calc(var(--navbar-height) + var(--space-16));
	}
	.hero__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(0, 56, 39, 0.88) 0%, rgba(0, 75, 36, 0.72) 100%);
	}
	.hero__content { position: relative; z-index: 1; color: var(--color-white); max-width: 720px; }
	.hero__title { font-size: var(--text-3xl); line-height: 1.12; margin-bottom: var(--space-6); }
	@media (min-width: 768px) { .hero__title { font-size: var(--text-5xl); } }
	.hero__subtitle { font-size: var(--text-lg); color: rgba(255,255,255,0.85); line-height: 1.6; margin-bottom: var(--space-8); max-width: 580px; }
	.hero__ctas { display: flex; flex-wrap: wrap; gap: var(--space-4); }
	.hero__cta-secondary { border-color: rgba(255,255,255,0.6); color: var(--color-white); }
	.hero__cta-secondary:hover { background-color: rgba(255,255,255,0.15); border-color: var(--color-white); color: var(--color-white); }

	/* ── Secțiuni comune ── */
	.section-title { font-size: var(--text-2xl); text-align: center; margin-bottom: var(--space-8); }
	@media (min-width: 768px) { .section-title { font-size: var(--text-3xl); } }
	.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-8); }
	.section-header .section-title { text-align: left; margin-bottom: 0; }
	.section-link { font-weight: 600; color: var(--color-green-dark); font-size: var(--text-sm); white-space: nowrap; }
	.section-link:hover { color: var(--color-green-leaf); }

	/* ── Valori ── */
	.values { padding-block: var(--space-16); background-color: var(--color-white); }
	.values__grid { display: grid; grid-template-columns: 1fr; gap: var(--space-6); }
	@media (min-width: 640px) { .values__grid { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 1024px) { .values__grid { grid-template-columns: repeat(4, 1fr); } }
	.value-card {
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		border-top: 4px solid var(--color-green-leaf);
		display: flex;
		flex-direction: column;
	}
	.value-card__title { font-size: var(--text-xl); color: var(--color-green-dark); margin-bottom: var(--space-2); }
	.value-card__short { font-size: var(--text-sm); color: var(--color-orange); font-weight: 600; margin-bottom: var(--space-3); }
	.value-card__desc { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; margin-bottom: var(--space-4); }
	.value-card__points {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		flex: 1;
	}
	.value-card__points li {
		font-size: var(--text-sm);
		color: var(--color-text);
		padding-left: 1.25rem;
		position: relative;
	}
	.value-card__points li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color-green-leaf);
		font-weight: 700;
	}
	.value-card__link {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-green-dark);
		margin-top: auto;
	}
	.value-card__link:hover { color: var(--color-green-leaf); }

	/* ── Program ── */
	.program { padding-block: var(--space-16); }
	.program__grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); margin-bottom: var(--space-8); }
	@media (min-width: 640px) { .program__grid { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 1024px) { .program__grid { grid-template-columns: repeat(3, 1fr); } }
	.program__item {
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		border-left: 4px solid var(--color-green-leaf);
	}
	.program__area {
		display: block;
		font-weight: 600;
		font-size: var(--text-sm);
		color: var(--color-green-dark);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-2);
	}
	.program__text { font-size: var(--text-base); color: var(--color-text-muted); line-height: 1.6; }
	.program__link-wrapper { text-align: center; }
	.program__link { font-weight: 600; color: var(--color-green-dark); }
	.program__link:hover { color: var(--color-green-leaf); }

	/* ── Știri ── */
	.latest-news { padding-block: var(--space-16); background-color: var(--color-white); }
	.news-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-6); }
	@media (min-width: 768px) { .news-grid { grid-template-columns: repeat(3, 1fr); } }
	.news-card {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-md);
		overflow: hidden;
		background-color: var(--color-bg);
		transition: box-shadow var(--transition-fast), transform var(--transition-fast);
		text-decoration: none;
		color: var(--color-text);
	}
	.news-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); color: var(--color-text); }
	.news-card__img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
	.news-card__img--placeholder { background-color: var(--color-skeleton); }
	.news-card__body { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); flex: 1; }
	.news-card__title { font-size: var(--text-base); font-weight: 600; line-height: 1.4; }
	.news-card__excerpt { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.news-card__date { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: auto; }

	/* ── Evenimente ── */
	.events-section { padding-block: var(--space-16); }
	.events-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
	@media (min-width: 768px) { .events-grid { grid-template-columns: repeat(3, 1fr); } }
	.event-card {
		display: flex;
		gap: var(--space-4);
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		padding: var(--space-4);
		border: 1px solid var(--color-border);
		transition: all var(--transition-fast);
		text-decoration: none;
		color: var(--color-text);
	}
	.event-card:hover { border-color: var(--color-green-leaf); box-shadow: var(--shadow-sm); color: var(--color-text); }
	.event-card__date-block {
		flex-shrink: 0;
		width: 56px;
		height: 56px;
		background-color: var(--color-green-dark);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--color-white);
	}
	.event-card__day { font-size: var(--text-xl); font-weight: 700; line-height: 1; }
	.event-card__month { font-size: var(--text-xs); font-weight: 500; text-transform: uppercase; }
	.event-card__body { display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
	.event-card__title { font-size: var(--text-base); font-weight: 600; line-height: 1.3; }
	.event-card__location { font-size: var(--text-xs); color: var(--color-text-muted); }

	/* ── Newsletter ── */
	.newsletter-section { background-color: var(--color-orange-light); padding-block: var(--space-12); }
	.newsletter-section__inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-8); }
	.newsletter-section h2 { font-size: var(--text-2xl); color: var(--color-green-dark); margin-bottom: var(--space-2); }
	.newsletter-section p { color: var(--color-text-muted); }
	.newsletter-section__form { display: flex; gap: var(--space-3); flex-wrap: wrap; min-width: 280px; }
	.newsletter-section__input {
		flex: 1;
		min-width: 200px;
		padding: 0.75rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-white);
	}
	.newsletter-section__input:focus { outline: none; border-color: var(--color-green-dark); }
</style>
