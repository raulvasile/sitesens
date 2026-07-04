<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data } = $props();
	const status = $derived(data.status);
	const slug = $derived(data.slug);
</script>

<SeoHead title="Confirmare semnătură — SENS" noIndex={true} />

<section class="confirm">
	<div class="container confirm__inner">
		{#if status === 'ok'}
			<div class="confirm__icon" aria-hidden="true">✓</div>
			<h1 class="confirm__title">Semnătură confirmată!</h1>
			<p class="confirm__text">Mulțumim! Semnătura ta a fost confirmată și contorizată. Vocea ta contează.</p>
		{:else if status === 'already'}
			<div class="confirm__icon" aria-hidden="true">✓</div>
			<h1 class="confirm__title">Deja confirmată</h1>
			<p class="confirm__text">Această semnătură era deja confirmată. Mulțumim pentru susținere!</p>
		{:else if status === 'missing'}
			<h1 class="confirm__title">Link incomplet</h1>
			<p class="confirm__text">Linkul de confirmare este incomplet. Verifică emailul și apasă pe butonul de confirmare.</p>
		{:else}
			<h1 class="confirm__title">Link invalid sau expirat</h1>
			<p class="confirm__text">Nu am putut confirma semnătura. Linkul poate fi expirat sau deja folosit.</p>
		{/if}

		<a href="/petitii/{slug}" class="confirm__cta">Înapoi la petiție</a>
	</div>
</section>

<style>
	.confirm { padding-block: var(--page-header-pt) var(--space-24); }
	.confirm__inner { max-width: 560px; text-align: center; }
	.confirm__icon {
		font-size: 3rem;
		color: var(--color-green-deep);
		margin-bottom: var(--space-4);
	}
	.confirm__title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--color-ink);
		margin: 0 0 var(--space-4);
	}
	.confirm__text {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--color-ink-soft);
		margin: 0 0 var(--space-8);
	}
	.confirm__cta {
		display: inline-block;
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background-color: var(--color-green-deep);
		color: var(--color-paper);
		padding: var(--space-4) var(--space-8);
		text-decoration: none;
		transition: background-color var(--transition-fast);
	}
	.confirm__cta:hover { background-color: var(--color-ink); }
</style>
