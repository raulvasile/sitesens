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
		background-color: var(--color-orange-light);
		padding-block: var(--space-12);
	}

	.newsletter-cta__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-8);
	}

	.newsletter-cta__title {
		font-size: var(--text-2xl);
		color: var(--color-green-dark);
		margin-bottom: var(--space-2);
	}

	.newsletter-cta__desc {
		color: var(--color-text-muted);
		font-size: var(--text-base);
	}

	.newsletter-cta__form {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		min-width: 280px;
	}

	.newsletter-cta__input {
		flex: 1;
		min-width: 200px;
		padding: 0.75rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-white);
		transition: border-color var(--transition-fast);
	}

	.newsletter-cta__input:focus {
		outline: none;
		border-color: var(--color-green-dark);
	}
</style>
