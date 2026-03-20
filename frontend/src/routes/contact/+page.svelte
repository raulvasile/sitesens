<script lang="ts">
	import { mutateStrapi } from '$lib/strapi';
	import { toasts } from '$lib/stores/toast';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const cp = $derived(data.contactPage);

	let formName = $state('');
	let formEmail = $state('');
	let formSubject = $state('');
	let formMessage = $state('');
	let sending = $state(false);
	let sent = $state(false);

	let nlEmail = $state('');
	let nlSending = $state(false);

	async function handleContactSubmit(e: SubmitEvent) {
		e.preventDefault();
		sending = true;
		try {
			// Send as email via mailto fallback — Strapi doesn't have a contact-message type yet
			// For now, open mailto: link with pre-filled data
			const subject = encodeURIComponent(formSubject || 'Mesaj de pe site');
			const body = encodeURIComponent(
				`Nume: ${formName}\nEmail: ${formEmail}\n\n${formMessage}`
			);
			window.open(`mailto:${cp.email}?subject=${subject}&body=${body}`, '_self');
			sent = true;
			toasts.success('Clientul de email a fost deschis cu mesajul pre-completat.');
		} catch {
			toasts.error('A apărut o eroare. Încercați din nou.');
		} finally {
			sending = false;
		}
	}

	async function handleNewsletter(e: SubmitEvent) {
		e.preventDefault();
		nlSending = true;
		try {
			await mutateStrapi('/newsletter-subscribers', 'POST', {
				data: {
					email: nlEmail,
					consent_date: new Date().toISOString(),
					source: 'contact-page'
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
</script>

<SeoHead
	title={cp?.seo?.meta_title ?? 'Contact — SENS'}
	description={cp?.seo?.meta_description ?? 'Contactează Partidul SENS sau abonează-te la newsletter.'}
	ogImage={cp?.seo?.og_image?.url}
	canonicalUrl={cp?.seo?.canonical_url}
	noIndex={cp?.seo?.no_index ?? false}
/>

<div class="container page-header">
	<Breadcrumb items={[{ label: 'Contact' }]} />
	<h1>{cp.title}</h1>
	{#if cp.subtitle}
		<p class="page-subtitle">{cp.subtitle}</p>
	{/if}
</div>

<div class="container contact-layout">
	<!-- ═══════ FORMULAR ═══════ -->
	<section class="contact-form-section">
		<h2>Trimite-ne un mesaj</h2>
		{#if sent}
			<div class="success-message">
				<span class="success-icon">✓</span>
				<p>Clientul de email a fost deschis. Dacă nu s-a deschis automat, ne poți contacta direct la <a href="mailto:{cp.email}">{cp.email}</a>.</p>
			</div>
		{:else}
			<form onsubmit={handleContactSubmit} class="contact-form">
				<div class="form-row">
					<div class="form-group">
						<label for="contact-name">Nume *</label>
						<input
							id="contact-name"
							type="text"
							bind:value={formName}
							required
							placeholder="Numele tău"
						/>
					</div>
					<div class="form-group">
						<label for="contact-email">Email *</label>
						<input
							id="contact-email"
							type="email"
							bind:value={formEmail}
							required
							placeholder="email@exemplu.ro"
						/>
					</div>
				</div>
				<div class="form-group">
					<label for="contact-subject">Subiect</label>
					<input
						id="contact-subject"
						type="text"
						bind:value={formSubject}
						placeholder="Despre ce vrei să discuți?"
					/>
				</div>
				<div class="form-group">
					<label for="contact-message">Mesaj *</label>
					<textarea
						id="contact-message"
						bind:value={formMessage}
						required
						rows="6"
						placeholder="Scrie-ne mesajul tău..."
					></textarea>
				</div>
				<button type="submit" class="btn btn-primary" disabled={sending}>
					{sending ? 'Se trimite...' : 'Trimite mesajul'}
				</button>
			</form>
		{/if}
	</section>

	<!-- ═══════ DATE CONTACT ═══════ -->
	<aside class="contact-info">
		<h2>Date de contact</h2>
		<div class="info-card">
			<div class="info-item">
				<span class="info-icon">📧</span>
				<div>
					<strong>Email</strong>
					<a href="mailto:{cp.email}">{cp.email}</a>
				</div>
			</div>
			{#if cp.address}
				<div class="info-item">
					<span class="info-icon">📍</span>
					<div>
						<strong>Adresă sediu</strong>
						<p>{cp.address}</p>
					</div>
				</div>
			{/if}
			{#if cp.schedule}
				<div class="info-item">
					<span class="info-icon">🕒</span>
					<div>
						<strong>Program</strong>
						<p>{cp.schedule}</p>
					</div>
				</div>
			{/if}
		</div>

		<div class="social-links-box">
			<h3>Urmărește-ne</h3>
			<div class="social-icons">
				<a href="https://facebook.com/partidulsens" target="_blank" rel="noopener" aria-label="Facebook">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
				</a>
				<a href="https://instagram.com/partidulsens" target="_blank" rel="noopener" aria-label="Instagram">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
				</a>
				<a href="https://twitter.com/partidulsens" target="_blank" rel="noopener" aria-label="X (Twitter)">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
				</a>
			</div>
		</div>
	</aside>
</div>

<!-- ═══════ NEWSLETTER ═══════ -->
<section class="newsletter-contact">
	<div class="container newsletter-contact__inner">
		<div class="newsletter-contact__text">
			<h2>{cp.newsletter_title ?? 'Abonează-te la newsletter'}</h2>
			{#if cp.newsletter_description}
				<p>{cp.newsletter_description}</p>
			{:else}
				<p>Primește ultimele știri și anunțuri ale Partidului SENS direct în inbox.</p>
			{/if}
		</div>
		<form onsubmit={handleNewsletter} class="newsletter-contact__form">
			<input
				type="email"
				bind:value={nlEmail}
				placeholder="email@exemplu.ro"
				required
				aria-label="Email pentru newsletter"
				class="newsletter-contact__input"
			/>
			<button type="submit" class="btn btn-primary" disabled={nlSending}>
				{nlSending ? 'Se abonează...' : 'Abonează-te'}
			</button>
		</form>
	</div>
</section>

<style>
	.page-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-muted);
		margin-top: var(--space-2);
	}

	/* ── Layout ── */
	.contact-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		padding-block: var(--space-10);
	}
	@media (min-width: 768px) {
		.contact-layout {
			grid-template-columns: 1fr 360px;
		}
	}

	/* ── Form section ── */
	.contact-form-section h2 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-6);
		color: var(--color-green-dark);
	}
	.contact-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.form-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}
	@media (min-width: 640px) {
		.form-row { grid-template-columns: 1fr 1fr; }
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
	.form-group input,
	.form-group textarea {
		padding: 0.75rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-white);
		transition: border-color var(--transition-fast);
	}
	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--color-green-dark);
	}
	.form-group textarea {
		resize: vertical;
		min-height: 120px;
	}

	.success-message {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		padding: var(--space-6);
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		border-left: 4px solid var(--color-green-leaf);
	}
	.success-icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		background-color: var(--color-green-leaf);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
	}
	.success-message p {
		color: var(--color-text-muted);
		line-height: 1.6;
	}
	.success-message a {
		color: var(--color-green-dark);
		font-weight: 600;
	}

	/* ── Contact info sidebar ── */
	.contact-info h2 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-6);
		color: var(--color-green-dark);
	}
	.info-card {
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		margin-bottom: var(--space-6);
	}
	.info-item {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
	}
	.info-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		margin-top: 2px;
	}
	.info-item strong {
		display: block;
		font-size: var(--text-sm);
		color: var(--color-text);
		margin-bottom: var(--space-1);
	}
	.info-item a,
	.info-item p {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}
	.info-item a:hover {
		color: var(--color-green-dark);
	}

	.social-links-box {
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		padding: var(--space-6);
	}
	.social-links-box h3 {
		font-size: var(--text-base);
		margin-bottom: var(--space-4);
		color: var(--color-green-dark);
	}
	.social-icons {
		display: flex;
		gap: var(--space-4);
	}
	.social-icons a {
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
	}
	.social-icons a:hover {
		color: var(--color-green-dark);
	}

	/* ── Newsletter section ── */
	.newsletter-contact {
		background-color: var(--color-orange-light);
		padding-block: var(--space-12);
	}
	.newsletter-contact__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-8);
	}
	.newsletter-contact h2 {
		font-size: var(--text-2xl);
		color: var(--color-green-dark);
		margin-bottom: var(--space-2);
	}
	.newsletter-contact p {
		color: var(--color-text-muted);
	}
	.newsletter-contact__form {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		min-width: 280px;
	}
	.newsletter-contact__input {
		flex: 1;
		min-width: 200px;
		padding: 0.75rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-white);
	}
	.newsletter-contact__input:focus {
		outline: none;
		border-color: var(--color-green-dark);
	}
</style>
