<script lang="ts">
	import { mutateStrapi } from '$lib/strapi';
	import { toasts } from '$lib/stores/toast';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const cp = $derived(data.contactPage);
	/** Single source of truth for social links — comes from Strapi Footer. */
	const socialLinks = $derived(data.footer?.social_links ?? []);

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
	<Breadcrumb items={[{ label: cp.title }]} />
	{#if cp.header_eyebrow}
		<div class="page-header__bar">
			<span class="page-header__eyebrow">— {cp.header_eyebrow}</span>
		</div>
	{/if}
	<h1 class="page-header__title">{cp.title}</h1>
	{#if cp.subtitle}
		<p class="page-header__lead">{cp.subtitle}</p>
	{/if}
</div>

<div class="container contact-layout">
	<!-- ═══════ FORMULAR ═══════ -->
	<section class="contact-form-section">
		<div class="contact-form-section__head">
			{#if cp.form_kicker}
				<span class="contact-form-section__kicker">— {cp.form_kicker}</span>
			{/if}
			<h2 class="contact-form-section__title">{cp.form_title ?? 'Trimite-ne un mesaj'}</h2>
		</div>

		{#if sent}
			<div class="success-message">
				<span class="success-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</span>
				<p>{cp.form?.success_message ?? `Clientul de email a fost deschis. Dacă nu s-a deschis automat, ne poți contacta direct la`} <a href="mailto:{cp.email}">{cp.email}</a>.</p>
			</div>
		{:else}
			<form onsubmit={handleContactSubmit} class="contact-form">
				<div class="form-row">
					<div class="form-group">
						<label for="contact-name">{cp.form?.name_label ?? 'Nume'} *</label>
						<input
							id="contact-name"
							type="text"
							bind:value={formName}
							required
							placeholder={cp.form?.name_placeholder ?? 'Numele tău'}
						/>
					</div>
					<div class="form-group">
						<label for="contact-email">{cp.form?.email_label ?? 'Email'} *</label>
						<input
							id="contact-email"
							type="email"
							bind:value={formEmail}
							required
							placeholder={cp.form?.email_placeholder ?? 'email@exemplu.ro'}
						/>
					</div>
				</div>
				<div class="form-group">
					<label for="contact-subject">{cp.form?.subject_label ?? 'Subiect'}</label>
					<input
						id="contact-subject"
						type="text"
						bind:value={formSubject}
						placeholder={cp.form?.subject_placeholder ?? 'Despre ce vrei să discuți?'}
					/>
				</div>
				<div class="form-group">
					<label for="contact-message">{cp.form?.message_label ?? 'Mesaj'} *</label>
					<textarea
						id="contact-message"
						bind:value={formMessage}
						required
						rows="6"
						placeholder={cp.form?.message_placeholder ?? 'Scrie-ne mesajul tău...'}
					></textarea>
				</div>
				<button type="submit" class="btn-submit" disabled={sending}>
					{sending ? (cp.form?.submitting_text ?? 'Se trimite...') : (cp.form?.submit_text ?? 'Trimite mesajul')}
					<span aria-hidden="true">→</span>
				</button>
			</form>
		{/if}
	</section>

	<!-- ═══════ DATE CONTACT ═══════ -->
	<aside class="contact-info">
		<div class="info-card">
			<span class="info-card__kicker">— {cp.info_heading ?? 'Date de contact'}</span>

			<div class="info-row">
				<span class="info-row__label">Email</span>
				<a class="info-row__link" href="mailto:{cp.email}">{cp.email}</a>
			</div>

			{#if cp.address}
				<div class="info-row">
					<span class="info-row__label">Adresă sediu</span>
					<p class="info-row__text">{cp.address}</p>
				</div>
			{/if}

			{#if cp.schedule}
				<div class="info-row">
					<span class="info-row__label">Program</span>
					<p class="info-row__text">{cp.schedule}</p>
				</div>
			{/if}
		</div>

		{#if socialLinks.length > 0}
			<div class="social-card">
				<span class="social-card__kicker">— {cp.social_heading ?? 'Urmărește-ne'}</span>
				<div class="social-card__icons">
					{#each socialLinks as link}
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={link.label}
							class="social-card__btn"
						>
							<SocialIcon platform={link.platform} size={20} />
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</aside>
</div>

<!-- ═══════ NEWSLETTER ═══════ -->
<section class="newsletter-contact">
	<div class="container newsletter-contact__inner">
		<div class="newsletter-contact__text">
			<span class="newsletter-contact__kicker">— Newsletter</span>
			<h2 class="newsletter-contact__title">{cp.newsletter_title ?? 'Abonează-te la newsletter'}</h2>
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
			<button type="submit" class="newsletter-contact__btn" disabled={nlSending}>
				{nlSending ? 'Se abonează...' : 'Abonează-te'}
				<span aria-hidden="true">→</span>
			</button>
		</form>
	</div>
</section>

<style>
	/* ── Page header (Direction C) ── */
	.page-header {
		padding-top: var(--space-10);
		padding-bottom: var(--space-4);
	}
	.page-header__bar {
		margin-top: var(--space-8);
	}
	.page-header__eyebrow {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.55;
	}
	.page-header__title {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 7vw, 5.5rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
		color: var(--color-ink);
		margin: var(--space-4) 0 0;
	}
	.page-header__lead {
		font-family: var(--font-body);
		font-size: clamp(1.0625rem, 1.5vw, 1.25rem);
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: var(--space-6) 0 0;
		max-width: 640px;
	}

	/* ── Layout ── */
	.contact-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-12);
		padding-block: var(--space-16) var(--space-20);
		align-items: start;
	}
	@media (min-width: 900px) {
		.contact-layout {
			grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr);
			gap: var(--space-16);
		}
	}

	/* ── Form section ── */
	.contact-form-section__head {
		margin-bottom: var(--space-8);
	}
	.contact-form-section__kicker {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.6;
		margin-bottom: var(--space-3);
	}
	.contact-form-section__title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 1;
		color: var(--color-ink);
		margin: 0;
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
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
		gap: var(--space-2);
	}
	.form-group label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.form-group input,
	.form-group textarea {
		padding: 0.875rem 1rem;
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-paper);
		color: var(--color-ink);
		transition: background-color var(--transition-fast);
	}
	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		background-color: var(--color-cream);
	}
	.form-group textarea {
		resize: vertical;
		min-height: 140px;
	}

	.btn-submit {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		padding: 0.9375rem 1.75rem;
		background-color: var(--color-ink);
		color: var(--color-lime);
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color var(--transition-fast), color var(--transition-fast), gap var(--transition-fast);
	}
	.btn-submit:hover:not(:disabled) {
		background-color: var(--color-green-deep);
		gap: var(--space-4);
	}
	.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

	.success-message {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		padding: var(--space-6);
		background-color: var(--color-lime);
		border: 1.5px solid var(--color-ink);
	}
	.success-icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		background-color: var(--color-ink);
		color: var(--color-lime);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.success-message p {
		color: var(--color-ink);
		line-height: 1.5;
		margin: 0;
	}
	.success-message a {
		color: var(--color-green-deep);
		font-weight: 600;
		text-decoration: underline;
	}

	/* ── Sidebar: info + social ── */
	.contact-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.info-card {
		background-color: var(--color-cream);
		border: 1.5px solid var(--color-ink);
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}
	.info-card__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.6;
	}
	.info-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}
	.info-row:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}
	.info-row__label {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.6;
	}
	.info-row__link,
	.info-row__text {
		font-family: var(--font-display);
		font-size: 1.0625rem;
		color: var(--color-ink);
		line-height: 1.4;
		margin: 0;
		text-decoration: none;
		word-break: break-word;
	}
	.info-row__link:hover {
		color: var(--color-green-deep);
		border-bottom: 1.5px solid var(--color-lime);
	}

	.social-card {
		background-color: var(--color-green-deep);
		color: var(--color-cream);
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}
	.social-card__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.6;
	}
	.social-card__icons {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
	.social-card__btn {
		width: 40px;
		height: 40px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		color: var(--color-cream);
		border: 1.5px solid var(--color-cream);
		text-decoration: none;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}
	.social-card__btn:hover {
		background-color: var(--color-lime);
		color: var(--color-ink);
		border-color: var(--color-lime);
	}

	/* ── Newsletter section ── */
	.newsletter-contact {
		background-color: var(--color-lime);
		padding-block: var(--space-16);
		border-block: 2px solid var(--color-ink);
	}
	.newsletter-contact__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-8);
	}
	.newsletter-contact__kicker {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink);
		opacity: 0.65;
		margin-bottom: var(--space-3);
	}
	.newsletter-contact__title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.75rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		color: var(--color-ink);
		margin: 0 0 var(--space-2);
		line-height: 1;
	}
	.newsletter-contact p {
		color: var(--color-ink);
		opacity: 0.8;
		margin: 0;
	}
	.newsletter-contact__form {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
		min-width: 280px;
		flex: 1 1 320px;
	}
	.newsletter-contact__input {
		flex: 1;
		min-width: 200px;
		padding: 0.875rem 1rem;
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-cream);
		color: var(--color-ink);
	}
	.newsletter-contact__input:focus {
		outline: none;
		background-color: var(--color-paper);
	}
	.newsletter-contact__btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: 0.875rem 1.5rem;
		background-color: var(--color-ink);
		color: var(--color-lime);
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color var(--transition-fast), gap var(--transition-fast);
	}
	.newsletter-contact__btn:hover:not(:disabled) {
		background-color: var(--color-green-deep);
		gap: var(--space-3);
	}
	.newsletter-contact__btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
