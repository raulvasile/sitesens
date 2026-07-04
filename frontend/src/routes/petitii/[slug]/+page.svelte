<script lang="ts">
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const petition = $derived(data.petition);
	const count = $derived(data.signatureCount ?? 0);
	const target = $derived(petition?.signature_target ?? 0);
	const closed = $derived(petition?.petition_status === 'closed');
	const hasContent = $derived((petition?.content?.length ?? 0) > 0);

	const pct = $derived(target > 0 ? Math.min(100, Math.round((count / target) * 100)) : null);

	type FormMessage = { type: 'success' | 'error'; text: string };

	const { form, errors, enhance, submitting, message } = superForm<
		typeof data.form.data,
		FormMessage
	>(data.form, {
		resetForm: true
	});

	const submitted = $derived($message?.text === 'verifica-email');
	const serverError = $derived($message?.type === 'error' ? $message.text : null);
</script>

<SeoHead
	title={petition?.seo?.meta_title ?? `${petition?.title} — Petiții SENS`}
	description={petition?.seo?.meta_description ?? petition?.summary ?? undefined}
	ogImage={petition?.seo?.og_image?.url ?? petition?.cover_image?.url}
	canonicalUrl={petition?.seo?.canonical_url}
	noIndex={petition?.seo?.no_index ?? false}
/>

<section class="pd">
	<div class="container pd__head">
		<Breadcrumb items={[{ label: 'Petiții', href: '/petitii' }, { label: petition?.title ?? '' }]} />
		<div class="pd__badge-row">
			{#if closed}
				<span class="pd__badge pd__badge--closed">Închisă</span>
			{:else}
				<span class="pd__badge pd__badge--open">Activă</span>
			{/if}
		</div>
		<h1 class="pd__title">{petition?.title}</h1>
		{#if petition?.summary}
			<p class="pd__summary">{petition.summary}</p>
		{/if}
	</div>

	{#if petition?.cover_image?.url}
		<div class="container">
			<img src={getStrapiMediaUrl(petition.cover_image.url)} alt={petition.cover_image.alternativeText ?? petition.title} class="pd__cover" decoding="async" />
		</div>
	{/if}
</section>

{#if hasContent}
	<DynamicZone content={petition?.content ?? []} zebra={false} />
{/if}

<section class="pd-sign">
	<div class="container pd-sign__inner">
		<!-- Contor + bară progres -->
		<aside class="pd-sign__stats">
			<div class="pd-sign__count">{count.toLocaleString('ro-RO')}</div>
			<div class="pd-sign__count-label">
				{#if target > 0}semnături din {target.toLocaleString('ro-RO')}{:else}semnături{/if}
			</div>
			{#if pct !== null}
				<div class="pd-sign__progress"><div class="pd-sign__progress-bar" style="width: {pct}%"></div></div>
				<div class="pd-sign__pct">{pct}%</div>
			{/if}
		</aside>

		<!-- Formular -->
		<div class="pd-sign__form-wrap">
			{#if closed}
				<div class="pd-sign__notice">Această petiție este închisă pentru semnături. Mulțumim tuturor celor care au semnat!</div>
			{:else if submitted}
				<div class="pd-sign__notice pd-sign__notice--success">
					<h2>Aproape gata! Verifică-ți emailul.</h2>
					<p>Ți-am trimis un email cu un link de confirmare. Semnătura ta devine validă după ce confirmi adresa.</p>
				</div>
			{:else}
				<h2 class="pd-sign__form-title">Semnează petiția</h2>
				{#if serverError}
					<div class="pd-sign__error" role="alert">{serverError}</div>
				{/if}
				<form method="POST" action="?/sign" use:enhance class="pd-sign__form">
					<div class="pd-sign__row">
						<div class="pd-sign__field">
							<label for="first_name">Prenume *</label>
							<input id="first_name" name="first_name" type="text" bind:value={$form.first_name} aria-invalid={$errors.first_name ? 'true' : undefined} required />
							{#if $errors.first_name}<span class="pd-sign__err">{$errors.first_name}</span>{/if}
						</div>
						<div class="pd-sign__field">
							<label for="last_name">Nume *</label>
							<input id="last_name" name="last_name" type="text" bind:value={$form.last_name} aria-invalid={$errors.last_name ? 'true' : undefined} required />
							{#if $errors.last_name}<span class="pd-sign__err">{$errors.last_name}</span>{/if}
						</div>
					</div>

					<div class="pd-sign__field">
						<label for="email">Email *</label>
						<input id="email" name="email" type="email" bind:value={$form.email} aria-invalid={$errors.email ? 'true' : undefined} required />
						{#if $errors.email}<span class="pd-sign__err">{$errors.email}</span>{/if}
					</div>

					<div class="pd-sign__row">
						<div class="pd-sign__field">
							<label for="county">Județ</label>
							<input id="county" name="county" type="text" bind:value={$form.county} />
						</div>
						<div class="pd-sign__field">
							<label for="city">Localitate</label>
							<input id="city" name="city" type="text" bind:value={$form.city} />
						</div>
					</div>

					<div class="pd-sign__field">
						<label for="comment">Comentariu (opțional)</label>
						<textarea id="comment" name="comment" rows="3" maxlength="500" bind:value={$form.comment}></textarea>
					</div>

					<!-- Honeypot: ascuns vizual + de screen-readere, completat doar de boți -->
					<div class="pd-sign__hp" aria-hidden="true">
						<label for="website">Website</label>
						<input id="website" name="website" type="text" tabindex="-1" autocomplete="off" bind:value={$form.website} />
					</div>

					<label class="pd-sign__consent">
						<input type="checkbox" name="consent_gdpr" bind:checked={$form.consent_gdpr} required />
						<span>
							{petition?.consent_text ??
								'Sunt de acord cu prelucrarea datelor mele personale în scopul înregistrării și verificării acestei semnături, conform Politicii de confidențialitate.'}
						</span>
					</label>
					{#if $errors.consent_gdpr}<span class="pd-sign__err">{$errors.consent_gdpr}</span>{/if}

					<p class="pd-sign__gdpr-note">
						Datele tale (nume, email, localitate) sunt folosite exclusiv pentru a valida semnătura și
						nu se afișează public. Vezi <a href="/politica-confidentialitate">Politica de confidențialitate</a>.
						Vei primi un email de confirmare — semnătura devine validă doar după ce dai click pe linkul din el.
					</p>

					<button type="submit" class="pd-sign__submit" disabled={$submitting}>
						{$submitting ? 'Se trimite…' : 'Semnează petiția'}
					</button>
				</form>
			{/if}
		</div>
	</div>
</section>

<style>
	.pd__head { padding-top: var(--page-header-pt); padding-bottom: var(--space-6); max-width: 760px; }
	.pd__badge-row { margin-top: var(--space-6); }
	.pd__badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 10px;
	}
	.pd__badge--open { background-color: var(--color-green-deep); color: var(--color-paper); }
	.pd__badge--closed { background-color: #d6d6d6; color: var(--color-ink); }
	.pd__title {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 5.5vw, 4.5rem);
		line-height: 1.02;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: var(--space-4) 0 var(--space-5);
	}
	.pd__summary {
		font-family: var(--font-body);
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--color-ink-soft);
		margin: 0;
	}
	.pd__cover { width: 100%; max-height: 460px; object-fit: cover; display: block; margin-top: var(--space-6); }

	.pd-sign { padding-block: var(--space-16) var(--space-24); background-color: var(--color-cream); }
	.pd-sign__inner {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: var(--space-10);
		align-items: start;
	}
	@media (max-width: 800px) { .pd-sign__inner { grid-template-columns: 1fr; gap: var(--space-8); } }

	.pd-sign__stats {
		position: sticky;
		top: calc(var(--navbar-height, 64px) + var(--space-6));
		background-color: var(--color-paper);
		border: 1px solid rgba(12, 81, 24, 0.15);
		padding: var(--space-6);
	}
	@media (max-width: 800px) { .pd-sign__stats { position: static; } }
	.pd-sign__count {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		font-weight: 500;
		line-height: 1;
		color: var(--color-green-deep);
	}
	.pd-sign__count-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-ink-soft);
		margin-top: var(--space-2);
	}
	.pd-sign__progress { height: 10px; background-color: rgba(12, 81, 24, 0.12); overflow: hidden; margin-top: var(--space-5); }
	.pd-sign__progress-bar { height: 100%; background-color: var(--color-green-deep); }
	.pd-sign__pct { font-family: var(--font-mono); font-size: 0.6875rem; color: var(--color-ink-soft); margin-top: var(--space-2); }

	.pd-sign__form-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 var(--space-6);
	}
	.pd-sign__row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
	@media (max-width: 480px) { .pd-sign__row { grid-template-columns: 1fr; } }
	.pd-sign__field { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }
	.pd-sign__field label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.pd-sign__field input,
	.pd-sign__field textarea {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: var(--space-3);
		border: 1px solid rgba(12, 81, 24, 0.25);
		background-color: var(--color-paper);
		color: var(--color-ink);
	}
	.pd-sign__field input[aria-invalid='true'] { border-color: var(--color-error, #c0392b); }
	.pd-sign__err { font-family: var(--font-mono); font-size: 0.6875rem; color: var(--color-error, #c0392b); }

	.pd-sign__hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.pd-sign__consent {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		font-family: var(--font-body);
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: var(--space-4) 0 var(--space-2);
		cursor: pointer;
	}
	.pd-sign__consent input { margin-top: 3px; flex-shrink: 0; }

	.pd-sign__gdpr-note {
		font-family: var(--font-body);
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		opacity: 0.85;
		margin: var(--space-3) 0 var(--space-6);
	}
	.pd-sign__gdpr-note a { color: var(--color-green-deep); }

	.pd-sign__submit {
		font-family: var(--font-display);
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background-color: var(--color-green-deep);
		color: var(--color-paper);
		border: none;
		padding: var(--space-4) var(--space-10);
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}
	.pd-sign__submit:hover:not(:disabled) { background-color: var(--color-ink); }
	.pd-sign__submit:disabled { opacity: 0.6; cursor: not-allowed; }

	.pd-sign__notice {
		background-color: var(--color-paper);
		border: 1px solid rgba(12, 81, 24, 0.15);
		padding: var(--space-8);
		font-family: var(--font-body);
		color: var(--color-ink-soft);
		line-height: 1.6;
	}
	.pd-sign__notice--success { border-color: var(--color-green-deep); }
	.pd-sign__notice h2 {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 var(--space-3);
	}
	.pd-sign__error {
		background-color: rgba(192, 57, 43, 0.08);
		border: 1px solid var(--color-error, #c0392b);
		color: var(--color-error, #c0392b);
		font-family: var(--font-body);
		font-size: 0.875rem;
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-4);
	}
</style>
