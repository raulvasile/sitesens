<script lang="ts">
	import { mutateStrapi } from '$lib/strapi';
	import { toasts } from '$stores/toast';

	interface Props {
		data: {
			title: string;
			description?: string;
			placeholder_text?: string;
		};
	}

	let { data }: Props = $props();
	let email = $state('');
	let loading = $state(false);

	async function subscribe(e: SubmitEvent) {
		e.preventDefault();
		if (!email) return;
		loading = true;
		try {
			await mutateStrapi('/newsletter-subscribers', 'POST', {
				data: {
					email,
					consent_date: new Date().toISOString(),
					source: 'newsletter-cta'
				}
			});
			toasts.success('Te-ai abonat cu succes! Verifică-ți emailul.');
			email = '';
		} catch (err: any) {
			if (err?.message?.includes('unique')) {
				toasts.info('Acest email este deja abonat.');
			} else {
				toasts.error('A apărut o eroare. Încearcă din nou.');
			}
		} finally {
			loading = false;
		}
	}
</script>

<section class="newsletter-cta">
	<div class="container newsletter-cta__inner">
		<div class="newsletter-cta__text">
			<h2 class="newsletter-cta__title">{data.title}</h2>
			{#if data.description}
				<p class="newsletter-cta__desc">{data.description}</p>
			{/if}
		</div>
		<form class="newsletter-cta__form" onsubmit={subscribe}>
			<input
				type="email"
				bind:value={email}
				placeholder={data.placeholder_text ?? 'email@exemplu.ro'}
				required
				aria-label="Adresa ta de email"
				class="newsletter-cta__input"
			/>
			<button type="submit" class="btn btn-primary" disabled={loading}>
				{loading ? 'Se procesează...' : 'Abonează-te'}
			</button>
		</form>
	</div>
</section>

<style>
	.newsletter-cta {
		background-color: var(--color-lime);
		padding-block: var(--space-12);
		position: relative;
		border-block: 2px solid var(--color-ink);
	}

	.newsletter-cta__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-10);
	}

	.newsletter-cta__title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin-bottom: var(--space-2);
	}

	.newsletter-cta__desc {
		color: var(--color-ink);
		font-size: var(--text-base);
		opacity: 0.8;
		max-width: 420px;
	}

	.newsletter-cta__form {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
		min-width: 280px;
		flex: 1;
		max-width: 480px;
	}

	.newsletter-cta__input {
		flex: 1;
		min-width: 200px;
		padding: 0.875rem 1rem;
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-cream);
		color: var(--color-ink);
		transition: background-color var(--transition-fast);
	}

	.newsletter-cta__input:focus {
		outline: none;
		background-color: var(--color-paper);
	}

	.newsletter-cta__input::placeholder {
		color: rgba(10, 31, 16, 0.5);
	}

	.newsletter-cta :global(.btn-primary) {
		background-color: var(--color-ink);
		color: var(--color-lime);
		border-color: var(--color-ink);
	}

	.newsletter-cta :global(.btn-primary:hover) {
		background-color: var(--color-green-deep);
		color: var(--color-lime);
		border-color: var(--color-green-deep);
	}
</style>
