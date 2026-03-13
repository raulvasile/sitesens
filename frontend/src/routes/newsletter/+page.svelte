<script lang="ts">
	import { mutateStrapi } from '$lib/strapi';
	import { toasts } from '$lib/stores/toast';

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
			toasts.success('Te-ai abonat cu succes!');
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

<svelte:head>
	<title>Newsletter — SENS</title>
	<meta name="description" content="Abonează-te la newsletterul SENS pentru ultimele știri și actualizări." />
</svelte:head>

<div class="container newsletter-page">
	<div class="newsletter-card">
		<div class="newsletter-card__header">
			<h1>Rămâi la curent cu SENS</h1>
			<p>Abonează-te la newsletter pentru știri, comunicate și actualizări din partid. Primești maxim 2 emailuri pe săptămână.</p>
		</div>

		{#if subscribed}
			<div class="success-box">
				<span class="success-icon">✓</span>
				<div>
					<h2>Mulțumim pentru abonare!</h2>
					<p>Vei primi un email de confirmare. Verifică și folderul Spam dacă nu îl găsești.</p>
				</div>
			</div>
		{:else}
			<form onsubmit={handleSubmit} class="newsletter-form">
				<div class="form-group">
					<label for="nl-name">Nume <span class="optional">(opțional)</span></label>
					<input
						id="nl-name"
						type="text"
						bind:value={name}
						placeholder="Numele tău"
					/>
				</div>
				<div class="form-group">
					<label for="nl-email">Email *</label>
					<input
						id="nl-email"
						type="email"
						bind:value={email}
						required
						placeholder="email@exemplu.ro"
					/>
				</div>
				<label class="checkbox-group">
					<input type="checkbox" bind:checked={consent} />
					<span>
						Sunt de acord cu prelucrarea datelor personale conform
						<a href="/politica-confidentialitate" target="_blank">Politicii de Confidențialitate</a>.
					</span>
				</label>
				<button type="submit" class="btn btn-primary btn-lg" disabled={sending}>
					{sending ? 'Se procesează...' : 'Abonează-te la newsletter'}
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.newsletter-page {
		padding-block: var(--space-16);
		display: flex;
		justify-content: center;
	}
	.newsletter-card {
		max-width: 520px;
		width: 100%;
	}
	.newsletter-card__header {
		margin-bottom: var(--space-8);
	}
	.newsletter-card__header h1 {
		font-size: var(--text-2xl);
		margin-bottom: var(--space-3);
	}
	@media (min-width: 768px) {
		.newsletter-card__header h1 { font-size: var(--text-3xl); }
	}
	.newsletter-card__header p {
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	.newsletter-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.form-group label {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
	}
	.optional {
		font-weight: 400;
		color: var(--color-text-muted);
	}
	.form-group input {
		padding: 0.75rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-white);
		transition: border-color var(--transition-fast);
	}
	.form-group input:focus {
		outline: none;
		border-color: var(--color-green-dark);
	}

	.checkbox-group {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		cursor: pointer;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}
	.checkbox-group input[type="checkbox"] {
		margin-top: 3px;
		flex-shrink: 0;
		accent-color: var(--color-green-dark);
	}
	.checkbox-group a {
		color: var(--color-green-dark);
		font-weight: 600;
	}

	.success-box {
		display: flex;
		gap: var(--space-4);
		align-items: flex-start;
		padding: var(--space-6);
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		border-left: 4px solid var(--color-green-leaf);
	}
	.success-icon {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		background-color: var(--color-green-leaf);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: var(--text-lg);
	}
	.success-box h2 {
		font-size: var(--text-lg);
		margin-bottom: var(--space-2);
		color: var(--color-green-dark);
	}
	.success-box p {
		color: var(--color-text-muted);
		line-height: 1.6;
	}
</style>
