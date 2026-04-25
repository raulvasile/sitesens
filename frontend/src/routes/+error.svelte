<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	let retrying = $state(false);

	async function retry() {
		retrying = true;
		try {
			await invalidateAll();
		} finally {
			retrying = false;
		}
	}

	type Variant = {
		title: string;
		eyebrow: string;
		quip: string;
		message: string;
	};

	const VARIANTS: Record<string, Variant> = {
		'404': {
			eyebrow: 'Pagină dispărută',
			title: 'Pagina nu a fost găsită',
			quip: 'Am căutat-o peste tot. Și tot peste tot. Nimic.',
			message: 'Linkul pe care l-ai accesat nu mai există sau s-a schimbat. Hai înapoi acasă, e mai cald.',
		},
		'503': {
			eyebrow: 'Pauză tehnică',
			title: 'Serverul a luat o pauză.',
			quip: 'Probabil bea cafea. Sau așteaptă autobuzul.',
			message: 'Serviciul revine în câteva momente. Mulțumim pentru răbdare — nu e tu, suntem noi.',
		},
		'500': {
			eyebrow: 'A picat ceva',
			title: 'Ceva nu a mers bine.',
			quip: 'Programatorii au căzut la datorie. Cafeaua se reumple.',
			message: 'A apărut o eroare neașteptată. Încearcă să reîmprospătezi pagina sau revino mai târziu.',
		},
	};

	const FALLBACK: Variant = {
		eyebrow: 'Eroare',
		title: 'A apărut o eroare.',
		quip: 'Și nici nu am reușit să dăm vina pe pisică.',
		message: 'Ceva neașteptat s-a întâmplat. Reîncearcă sau revino la pagina principală.',
	};

	const variant = $derived(VARIANTS[String($page.status)] ?? FALLBACK);
	const showRetry = $derived($page.status !== 404);
</script>

<svelte:head>
	<title>{$page.status} — {variant.title} — SENS</title>
</svelte:head>

<section class="errp">
	<div class="container errp__inner">
		<span class="errp__eyebrow">— {variant.eyebrow}</span>
		<div class="errp__code" aria-hidden="true">{$page.status}</div>
		<h1 class="errp__title">{variant.title}</h1>
		<p class="errp__quip">{variant.quip}</p>
		<p class="errp__message">{variant.message}</p>

		{#if $page.error?.message && $page.error.message !== variant.title}
			<details class="errp__details">
				<summary>Detalii tehnice</summary>
				<code>{$page.error.message}</code>
			</details>
		{/if}

		<div class="errp__actions">
			{#if showRetry}
				<button type="button" class="errp__btn errp__btn--primary" onclick={retry} disabled={retrying}>
					{retrying ? 'Se reîncearcă…' : 'Reîncearcă'}
					<span aria-hidden="true">↻</span>
				</button>
			{/if}
			<a href="/" class="errp__btn errp__btn--secondary">
				Pagina principală
				<span aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</section>

<style>
	.errp {
		background-color: var(--color-paper);
		color: var(--color-ink);
		min-height: 70dvh;
		display: flex;
		align-items: center;
		padding-block: var(--space-16);
	}

	.errp__inner {
		max-width: 720px;
		text-align: center;
	}

	.errp__eyebrow {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.65;
		margin-bottom: var(--space-6);
	}

	.errp__code {
		font-family: var(--font-display);
		font-size: clamp(7rem, 22vw, 16rem);
		font-weight: 500;
		line-height: 0.85;
		letter-spacing: -0.04em;
		color: var(--color-green-deep);
		margin-bottom: var(--space-6);
	}

	.errp__title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4.5vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 1.05;
		margin: 0 0 var(--space-4);
	}

	.errp__quip {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.125rem, 1.8vw, 1.375rem);
		color: var(--color-green-deep);
		margin: 0 0 var(--space-5);
	}

	.errp__message {
		font-family: var(--font-body);
		font-size: clamp(1rem, 1.4vw, 1.125rem);
		line-height: 1.55;
		color: var(--color-ink-soft);
		max-width: 540px;
		margin: 0 auto var(--space-8);
	}

	.errp__details {
		display: inline-block;
		text-align: left;
		margin-bottom: var(--space-8);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-ink-soft);
		opacity: 0.7;
	}
	.errp__details summary {
		cursor: pointer;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: var(--space-2) 0;
	}
	.errp__details code {
		display: block;
		margin-top: var(--space-2);
		padding: var(--space-3);
		background-color: var(--color-cream);
		border-left: 2px solid var(--color-lime);
		max-width: 540px;
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-word;
		text-transform: none;
		letter-spacing: 0;
	}

	.errp__actions {
		display: inline-flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		justify-content: center;
	}

	.errp__btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: 0.875rem 1.5rem;
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		border: 1.5px solid var(--color-ink);
		cursor: pointer;
		transition: background-color var(--transition-fast), color var(--transition-fast), gap var(--transition-fast);
	}
	.errp__btn--primary {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}
	.errp__btn--primary:hover:not(:disabled) {
		background-color: var(--color-green-deep);
		gap: var(--space-3);
	}
	.errp__btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
	.errp__btn--secondary {
		background-color: transparent;
		color: var(--color-ink);
	}
	.errp__btn--secondary:hover {
		background-color: var(--color-ink);
		color: var(--color-lime);
		gap: var(--space-3);
	}
</style>
