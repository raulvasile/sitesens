<script lang="ts">
	import DynamicZone from '$components/DynamicZone.svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data } = $props();
	const pageData = $derived(data.page);
	const team = $derived(data.teamMembers);
	const leadership = $derived(team.filter((m: any) => m.is_leadership));
	const others = $derived(team.filter((m: any) => !m.is_leadership));

	let activeTab = $state('misiune');
	const tabs = [
		{ id: 'misiune', label: 'Misiune & Viziune' },
		{ id: 'echipa', label: 'Echipa' },
		{ id: 'europa', label: 'Familia Europeană' },
	];
</script>

<SeoHead
	title={pageData?.seo?.meta_title ?? 'Despre SENS — Sănătate · Educație · Natură · Sustenabilitate'}
	description={pageData?.seo?.meta_description ?? 'Despre Partidul SENS — misiune, viziune, echipă și program politic.'}
	ogImage={pageData?.seo?.og_image?.url}
	canonicalUrl={pageData?.seo?.canonical_url}
	noIndex={pageData?.seo?.no_index ?? false}
/>

<div class="container despre-page">
	<nav aria-label="Breadcrumb" class="breadcrumb">
		<a href="/">Acasă</a> <span>/</span> <span>Despre Noi</span>
	</nav>

	<!-- Tab navigation -->
	<div class="tab-nav" role="tablist">
		{#each tabs as tab}
			<button
				class="tab-nav__btn"
				class:active={activeTab === tab.id}
				onclick={() => (activeTab = tab.id)}
				role="tab"
				aria-selected={activeTab === tab.id}
			>{tab.label}</button>
		{/each}
	</div>

	<!-- Tab: Misiune -->
	{#if activeTab === 'misiune'}
		{#if pageData?.content?.length}
			<DynamicZone content={pageData.content} />
		{:else}
			<section class="tab-content">
				<h1>Despre SENS</h1>
				<p class="text-muted">Conținut în curs de actualizare din Strapi.</p>
			</section>
		{/if}
	{/if}

	<!-- Tab: Echipa -->
	{#if activeTab === 'echipa'}
		<section class="tab-content">
			<h2>Conducerea SENS</h2>
			<div class="team-grid team-grid--leadership">
				{#each leadership as member}
					<div class="team-card team-card--leadership">
						{#if member.photo?.url}
							<img src={getStrapiMediaUrl(member.photo.url)} alt={member.name} class="team-card__photo" />
						{:else}
							<div class="team-card__photo team-card__photo--placeholder">
								<span>{member.name.split(' ').map((n: string) => n[0]).join('')}</span>
							</div>
						{/if}
						<h3 class="team-card__name">{member.name}</h3>
						<p class="team-card__role">{member.role}</p>
						{#if member.bio}
							<p class="team-card__bio">{member.bio}</p>
						{/if}
						{#if member.social_links?.length}
							<div class="team-card__social">
								{#each member.social_links as link}
									<a href={link.url} target="_blank" rel="noopener noreferrer" class="team-card__social-link">
										{link.platform}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>

			{#if others.length > 0}
				<h2 class="team-section-title">Echipa</h2>
				<div class="team-grid">
					{#each others as member}
						<div class="team-card">
							{#if member.photo?.url}
								<img src={getStrapiMediaUrl(member.photo.url)} alt={member.name} class="team-card__photo team-card__photo--sm" />
							{:else}
								<div class="team-card__photo team-card__photo--sm team-card__photo--placeholder">
									<span>{member.name.split(' ').map((n: string) => n[0]).join('')}</span>
								</div>
							{/if}
							<h3 class="team-card__name">{member.name}</h3>
							<p class="team-card__role">{member.role}</p>
							{#if member.bio}
								<p class="team-card__bio">{member.bio}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- Tab: Familia Europeană -->
	{#if activeTab === 'europa'}
		<section class="tab-content europa-section">
			<h2>Familia noastră europeană</h2>
			<div class="europa-grid">
				<div class="europa-card">
					<h3>European Greens</h3>
					<p>SENS este membru al European Green Party — partidul ecologist european care reunește peste 40 de partide verzi din întreaga Europă.</p>
					<a href="https://europeangreens.eu" target="_blank" rel="noopener noreferrer" class="europa-link">europeangreens.eu →</a>
				</div>
				<div class="europa-card">
					<h3>Grupul Verzi/ALE</h3>
					<p>În Parlamentul European, suntem parte a grupului Greens/European Free Alliance — una dintre cele mai influente forțe politice pentru politici climatice ambițioase.</p>
					<a href="https://greens-efa.eu" target="_blank" rel="noopener noreferrer" class="europa-link">greens-efa.eu →</a>
				</div>
			</div>
		</section>
	{/if}
</div>

<style>
	.despre-page { padding-block: var(--space-8); }
	.breadcrumb { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-6); display: flex; gap: var(--space-2); }
	.breadcrumb a { color: var(--color-text-muted); }
	.breadcrumb a:hover { color: var(--color-green-dark); }

	.tab-nav { display: flex; gap: var(--space-1); border-bottom: 2px solid var(--color-border); margin-bottom: var(--space-8); overflow-x: auto; }
	.tab-nav__btn {
		padding: var(--space-3) var(--space-4);
		border: none; background: none; cursor: pointer;
		font-family: var(--font-body); font-size: var(--text-sm); font-weight: 500;
		color: var(--color-text-muted); white-space: nowrap;
		border-bottom: 3px solid transparent; margin-bottom: -2px;
		transition: all var(--transition-fast);
	}
	.tab-nav__btn:hover { color: var(--color-green-dark); }
	.tab-nav__btn.active { color: var(--color-green-dark); border-bottom-color: var(--color-green-leaf); }

	.tab-content { padding-bottom: var(--space-8); }

	/* Team Grid */
	.team-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-6); margin-bottom: var(--space-8); }
	@media (min-width: 640px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 1024px) { .team-grid--leadership { grid-template-columns: repeat(2, 1fr); } .team-grid { grid-template-columns: repeat(3, 1fr); } }

	.team-section-title { font-size: var(--text-2xl); margin-bottom: var(--space-6); }

	.team-card {
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		text-align: center;
	}
	.team-card--leadership { border-top: 4px solid var(--color-green-leaf); }
	.team-card__photo {
		width: 96px; height: 96px; border-radius: var(--radius-full);
		object-fit: cover; margin: 0 auto var(--space-4);
	}
	.team-card__photo--sm { width: 72px; height: 72px; }
	.team-card__photo--placeholder {
		background-color: var(--color-green-dark);
		display: flex; align-items: center; justify-content: center;
		color: var(--color-white); font-weight: 700; font-size: var(--text-xl);
	}
	.team-card__name { font-size: var(--text-lg); margin-bottom: var(--space-1); }
	.team-card__role { font-size: var(--text-sm); color: var(--color-orange); font-weight: 600; margin-bottom: var(--space-3); }
	.team-card__bio { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; }
	.team-card__social { display: flex; justify-content: center; gap: var(--space-3); margin-top: var(--space-3); }
	.team-card__social-link { font-size: var(--text-xs); color: var(--color-green-dark); text-transform: capitalize; }

	/* Europa */
	.europa-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-6); }
	@media (min-width: 768px) { .europa-grid { grid-template-columns: repeat(2, 1fr); } }
	.europa-section h2 { font-size: var(--text-2xl); margin-bottom: var(--space-6); }
	.europa-card {
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-left: 4px solid var(--color-green-leaf);
	}
	.europa-card h3 { font-size: var(--text-lg); color: var(--color-green-dark); margin-bottom: var(--space-3); }
	.europa-card p { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; margin-bottom: var(--space-4); }
	.europa-link { font-size: var(--text-sm); font-weight: 600; color: var(--color-green-dark); }
	.europa-link:hover { color: var(--color-green-leaf); }
</style>
