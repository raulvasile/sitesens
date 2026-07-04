<script lang="ts">
	import { toasts } from '$stores/toast';
	import { mutateStrapi } from '$lib/strapi';

	interface Props {
		data: {
			heading?: string;
			description?: string;
			success_message?: string;
		};
	}

	let { data }: Props = $props();

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let consent = $state(false);
	let website = $state(''); // honeypot — rămâne gol la oameni
	let loading = $state(false);
	let submitted = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!name || !email || !message) return;
		if (!consent) {
			toasts.error('Bifează acordul pentru prelucrarea datelor pentru a trimite mesajul.');
			return;
		}
		loading = true;

		try {
			await mutateStrapi('/contact-submissions', 'POST', {
				data: { name, email, subject: subject || undefined, message, consent_gdpr: consent, website },
			});
			submitted = true;
			toasts.success(data.success_message ?? 'Mesajul tău a fost trimis cu succes!');
		} catch {
			toasts.error('A apărut o eroare. Încearcă din nou.');
		} finally {
			loading = false;
		}
	}
</script>

<section class="contact-form-block">
	<div class="container contact-form-block__inner">
		{#if data.heading}
			<h2 class="contact-form-block__heading">{data.heading}</h2>
		{/if}
		{#if data.description}
			<p class="contact-form-block__desc">{data.description}</p>
		{/if}

		{#if submitted}
			<div class="contact-form-block__success">
				<span class="contact-form-block__success-icon">✓</span>
				<p>{data.success_message ?? 'Mesajul tău a fost trimis cu succes!'}</p>
			</div>
		{:else}
			<form class="contact-form-block__form" onsubmit={handleSubmit}>
				<div class="contact-form-block__row">
					<div class="contact-form-block__field">
						<label for="cf-name">Nume *</label>
						<input id="cf-name" type="text" bind:value={name} required placeholder="Numele tău" />
					</div>
					<div class="contact-form-block__field">
						<label for="cf-email">Email *</label>
						<input id="cf-email" type="email" bind:value={email} required placeholder="email@exemplu.ro" />
					</div>
				</div>
				<div class="contact-form-block__field">
					<label for="cf-subject">Subiect</label>
					<input id="cf-subject" type="text" bind:value={subject} placeholder="Despre ce este vorba?" />
				</div>
				<div class="contact-form-block__field">
					<label for="cf-message">Mesaj *</label>
					<textarea id="cf-message" bind:value={message} required rows="5" placeholder="Scrie mesajul tău aici..."></textarea>
				</div>
				<!-- Honeypot anti-spam: invizibil pentru oameni, completat de boți -->
				<div class="contact-form-block__hp" aria-hidden="true">
					<label for="cf-website">Website</label>
					<input id="cf-website" type="text" bind:value={website} tabindex="-1" autocomplete="off" />
				</div>
				<label class="contact-form-block__consent">
					<input type="checkbox" bind:checked={consent} required />
					<span>
						Sunt de acord cu prelucrarea datelor mele (nume, email) pentru a primi un răspuns la
						acest mesaj, conform <a href="/politica-confidentialitate">Politicii de confidențialitate</a>.
					</span>
				</label>
				<button type="submit" class="btn btn-primary" disabled={loading}>
					{loading ? 'Se trimite...' : 'Trimite mesajul'}
				</button>
			</form>
		{/if}
	</div>
</section>

<style>
	.contact-form-block {
		padding-block: var(--space-16);
		background-color: var(--color-bg);
	}

	.contact-form-block__inner { max-width: 640px; margin: 0 auto; }

	.contact-form-block__heading {
		font-size: var(--text-2xl);
		color: var(--color-green-dark);
		text-align: center;
		margin-bottom: var(--space-2);
	}

	.contact-form-block__desc {
		text-align: center;
		color: var(--color-text-muted);
		margin-bottom: var(--space-8);
	}

	.contact-form-block__form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.contact-form-block__row {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}

	@media (min-width: 640px) {
		.contact-form-block__row { grid-template-columns: 1fr 1fr; }
	}

	.contact-form-block__field { display: flex; flex-direction: column; gap: var(--space-1); }

	.contact-form-block__hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.contact-form-block__consent {
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		cursor: pointer;
	}
	.contact-form-block__consent input { margin-top: 3px; flex-shrink: 0; }

	.contact-form-block__field label {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
	}

	.contact-form-block__field input,
	.contact-form-block__field textarea {
		padding: 0.75rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-white);
		transition: border-color var(--transition-fast);
		resize: vertical;
	}

	.contact-form-block__field input:focus,
	.contact-form-block__field textarea:focus {
		outline: none;
		border-color: var(--color-green-dark);
	}

	.contact-form-block__success {
		text-align: center;
		padding: var(--space-10);
		background-color: var(--color-white);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-green-leaf);
	}

	.contact-form-block__success-icon {
		display: block;
		font-size: 3rem;
		color: var(--color-green-leaf);
		margin-bottom: var(--space-4);
	}

	.contact-form-block__success p {
		font-size: var(--text-lg);
		color: var(--color-green-dark);
		font-weight: 600;
	}

	/* mobile-tighten:.contact-form-block */
	@media (max-width: 767px) {
		.contact-form-block { padding-block: var(--space-10); }
	}
</style>
