<script lang="ts">
	import { mutateStrapi } from '$lib/strapi';
	import { toasts } from '$lib/stores/toast';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data } = $props();
	const page = $derived(data.page);
	const form = $derived(page?.form ?? {});

	let name = $state('');
	let email = $state('');
	let consent = $state(false);
	let sending = $state(false);
	let subscribed = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!consent) {
			toasts.error('Trebuie să accepți prelucrarea datelor pentru a te abona.');
			return;
		}
		sending = true;
		try {
			await mutateStrapi('/newsletter-subscribers', 'POST', {
				data: {
					email,
					name: name || undefined,
					consent_date: new Date().toISOString(),
					source: 'newsletter-page'
				}
			});
			subscribed = true;
			toasts.success(form.success_title ?? 'Te-ai abonat cu succes!');
		} catch (err: any) {
			if (err?.message?.includes('unique')) {
				toasts.info('Acest email este deja abonat la newsletter.');
			} else {
				toasts.error('A apărut o eroare. Încercați din nou.');
			}
		} finally {
			sending = false;
		}
	}
</script>

<SeoHead
	title={page?.seo?.meta_title ?? page?.title ?? 'Newsletter'}
	description={page?.seo?.meta_description ?? page?.description ?? 'Abonează-te la newsletterul SENS.'}
/>

<div class="container newsletter-page">
	<div class="newsletter-card">
		<div class="newsletter-card__header">
			<h1>{page?.title ?? 'Rămâi la curent cu SENS'}</h1>
			{#if page?.description}
				<p>{page.description}</p>
			{/if}
		</div>

		{#if subscribed}
			<div class="success-box">
				<span class="success-icon">✓</span>
				<div>
					<h2>{form.success_title ?? 'Mulțumim pentru abonare!'}</h2>
					<p>{form.success_message ?? 'Vei primi un email de confirmare.'}</p>
				</div>
			</div>
		{:else}
			<form onsubmit={handleSubmit} class="newsletter-form">
				<div class="form-group">
					<label for="nl-name">{form.name_label ?? 'Nume (opțional)'}</label>
					<input
						id="nl-name"
						type="text"
						bind:value={name}
						placeholder={form.name_placeholder ?? 'Numele tău'}
					/>
				</div>
				<div class="form-group">
					<label for="nl-email">{form.email_label ?? 'Email'} *</label>
					<input
						id="nl-email"
						type="email"
						bind:value={email}
						required
						placeholder={form.email_placeholder ?? 'email@exemplu.ro'}
					/>
				</div>
				<label class="checkbox-group">
					<input type="checkbox" bind:checked={consent} />
					<span>{form.consent_text ?? 'Sunt de acord cu prelucrarea datelor personale conform Politicii de Confidențialitate.'}</span>
				</label>
				<button type="submit" class="btn btn-primary btn-lg" disabled={sending}>
					{sending ? (form.submitting_text ?? 'Se procesează...') : (form.submit_text ?? 'Abonează-te la newsletter')}
				</button>
			</form>
		{/if}

		{#if page?.benefits?.length}
			<div class="benefits">
				<h2>{page.benefits_heading ?? 'Ce vei primi'}</h2>
				<div class="benefits-grid">
					{#each page.benefits as b}
						<div class="benefit">
							{#if b.emoji}<span class="benefit__emoji">{b.emoji}</span>{/if}
							<h3>{b.title}</h3>
							<p>{b.description}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.newsletter-page {
		padding-block: var(--space-16);
	}
	.newsletter-card {
		max-width: 640px;
		width: 100%;
		margin: 0 auto;
	}
	.newsletter-card__header {
		margin-bottom: var(--space-8);
	}
	.newsletter-card__header h1 {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.015em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin-bottom: var(--space-4);
	}
	.newsletter-card__header p {
		font-family: var(--font-body);
		color: var(--color-ink-soft);
		line-height: 1.5;
	}

	.newsletter-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.form-group label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.form-group input {
		padding: 0.875rem 1rem;
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-paper);
		color: var(--color-ink);
	}
	.form-group input:focus {
		outline: none;
		background-color: var(--color-cream);
	}

	.checkbox-group {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		cursor: pointer;
		font-size: 0.9375rem;
		color: var(--color-ink);
		line-height: 1.5;
	}
	.checkbox-group input[type="checkbox"] {
		margin-top: 3px;
		flex-shrink: 0;
		accent-color: var(--color-lime);
	}
	.checkbox-group a {
		color: var(--color-green-deep);
		text-decoration: underline;
	}

	.success-box {
		display: flex;
		gap: var(--space-4);
		align-items: flex-start;
		padding: var(--space-6);
		background-color: var(--color-lime);
		border: 1.5px solid var(--color-ink);
	}
	.success-icon {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		background-color: var(--color-ink);
		color: var(--color-lime);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: var(--text-lg);
	}
	.success-box h2 {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		text-transform: uppercase;
		margin-bottom: var(--space-2);
		color: var(--color-ink);
	}
	.success-box p {
		color: var(--color-ink);
		line-height: 1.5;
	}

	.benefits {
		margin-top: var(--space-16);
		padding-top: var(--space-10);
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}
	.benefits h2 {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		font-weight: 500;
		text-transform: uppercase;
		margin-bottom: var(--space-6);
		color: var(--color-ink);
	}
	.benefits-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}
	@media (min-width: 640px) {
		.benefits-grid { grid-template-columns: repeat(3, 1fr); }
	}
	.benefit { padding: var(--space-4) 0; }
	.benefit__emoji {
		display: block;
		font-size: 1.75rem;
		margin-bottom: var(--space-2);
	}
	.benefit h3 {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 500;
		text-transform: uppercase;
		margin-bottom: var(--space-2);
		color: var(--color-ink);
	}
	.benefit p {
		font-size: 0.9375rem;
		color: var(--color-ink-soft);
		line-height: 1.5;
	}
</style>
