<script lang="ts">
	import { mutateStrapi } from '$lib/strapi';
	import { toasts } from '$lib/stores/toast';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	let { data } = $props();

	const page = $derived(data.page);
	const labels = $derived(page?.labels ?? {});
	const validation = $derived(page?.validation ?? {});
	const consentsCfg = $derived(page?.consents ?? []);
	const steps = $derived(page?.steps?.length ? page.steps : [
		{ number: 1, label: 'Date personale' },
		{ number: 2, label: 'Motivație' },
		{ number: 3, label: 'Confirmare' },
	]);
	const success = $derived(page?.success);

	function t(key: string, fallback: string): string {
		return (labels as Record<string, string>)[key] ?? fallback;
	}
	function v(key: string, fallback: string): string {
		return (validation as Record<string, string>)[key] ?? fallback;
	}
	function getConsent(key: string) {
		return consentsCfg.find((c: { key: string }) => c.key === key);
	}

	// ── State ──
	let currentStep = $state(1);
	let loading = $state(false);
	let submitted = $state(false);

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');
	let birthDate = $state('');
	let county = $state('');
	let city = $state('');
	let address = $state('');
	let motivation = $state('');
	let interests = $state<string[]>([]);
	let consentGdpr = $state(false);
	let consentStatute = $state(false);
	let consentDataProcessing = $state(false);
	let consentNewsletter = $state(false);

	let step1Errors = $state<Record<string, string>>({});
	let step3Errors = $state<Record<string, string>>({});

	function toggleInterest(name: string) {
		if (interests.includes(name)) {
			interests = interests.filter(i => i !== name);
		} else {
			interests = [...interests, name];
		}
	}

	function validateStep1(): boolean {
		const errors: Record<string, string> = {};
		if (!firstName.trim()) errors.firstName = v('first_name_required', 'Prenumele este obligatoriu');
		if (!lastName.trim()) errors.lastName = v('last_name_required', 'Numele este obligatoriu');
		if (!email.trim()) errors.email = v('email_required', 'Email-ul este obligatoriu');
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = v('email_invalid', 'Email invalid');
		if (!phone.trim()) errors.phone = v('phone_required', 'Telefonul este obligatoriu');
		else if (!/^(\+?4)?0[0-9]{9}$/.test(phone.replace(/\s/g, ''))) errors.phone = v('phone_invalid', 'Număr de telefon invalid');
		if (!birthDate) errors.birthDate = v('birth_date_required', 'Data nașterii este obligatorie');
		if (!county) errors.county = v('county_required', 'Județul este obligatoriu');
		if (!city.trim()) errors.city = v('city_required', 'Localitatea este obligatorie');
		if (!address.trim()) errors.address = v('address_required', 'Adresa este obligatorie');
		step1Errors = errors;
		return Object.keys(errors).length === 0;
	}

	function validateStep3(): boolean {
		const errors: Record<string, string> = {};
		const msg = v('consent_required', 'Trebuie să accepți această condiție');
		if (getConsent('statute')?.required !== false && !consentStatute) errors.consentStatute = msg;
		if (getConsent('gdpr')?.required !== false && !consentGdpr) errors.consentGdpr = msg;
		if (getConsent('data_processing')?.required !== false && !consentDataProcessing) errors.consentDataProcessing = msg;
		step3Errors = errors;
		return Object.keys(errors).length === 0;
	}

	function nextStep() {
		if (currentStep === 1 && !validateStep1()) return;
		if (currentStep < 3) currentStep++;
	}
	function prevStep() {
		if (currentStep > 1) currentStep--;
	}

	async function handleSubmit() {
		if (!validateStep3()) return;

		loading = true;
		try {
			await mutateStrapi('/membership-requests', 'POST', {
				data: {
					first_name: firstName.trim(),
					last_name: lastName.trim(),
					email: email.trim().toLowerCase(),
					phone: phone.trim(),
					birth_date: birthDate,
					county,
					city: city.trim(),
					address: address.trim(),
					motivation: motivation.trim() || null,
					interests: interests.length > 0 ? interests : null,
					consent_gdpr: consentGdpr,
					consent_statute: consentStatute,
					consent_data_processing: consentDataProcessing,
					consent_newsletter: consentNewsletter,
				}
			});
			submitted = true;
			toasts.success(success?.title ?? 'Cererea de aderare a fost trimisă cu succes!');
		} catch (err: any) {
			if (err?.message?.includes('unique')) {
				toasts.error(v('duplicate_error', 'Există deja o cerere cu acest email.'));
			} else {
				toasts.error(v('generic_error', 'A apărut o eroare. Te rugăm să încerci din nou.'));
			}
		} finally {
			loading = false;
		}
	}
</script>

<SeoHead
	title={page?.seo?.meta_title ?? page?.title ?? 'Înscrie-te în SENS'}
	description={page?.seo?.meta_description ?? page?.subtitle ?? 'Alătură-te Partidului SENS. Completează formularul de înscriere.'}
/>

<div class="container page-header">
	<Breadcrumb items={[{ label: page?.title ?? 'Înscrie-te' }]} />
	<h1>{page?.title ?? 'Înscrie-te în SENS'}</h1>
	{#if page?.subtitle}
		<p class="page-subtitle">{page.subtitle}</p>
	{/if}
</div>

{#if submitted && success}
	<div class="container signup-success">
		<div class="success-card">
			<div class="success-icon-big">✓</div>
			<h2>{success.title ?? 'Cererea ta a fost trimisă!'}</h2>
			<p>{success.message ?? ''}</p>
			{#if success.next_steps?.length}
				<div class="success-steps">
					<h3>{success.next_steps_heading ?? 'Pașii următori:'}</h3>
					<ol>
						{#each success.next_steps as ns}
							<li>
								{#if ns.icon}<span class="success-step-icon">{ns.icon}</span>{/if}
								{ns.text}
							</li>
						{/each}
					</ol>
				</div>
			{/if}
			<div class="success-actions">
				{#if success.primary_cta_label && success.primary_cta_url}
					<a href={success.primary_cta_url} class="btn btn-primary">{success.primary_cta_label}</a>
				{/if}
				{#if success.secondary_cta_label && success.secondary_cta_url}
					<a href={success.secondary_cta_url} class="btn btn-outline-ink">{success.secondary_cta_label}</a>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<!-- ═══════ STEPPER ═══════ -->
	<div class="container">
		<div class="stepper">
			{#each steps as step, i}
				<div class="stepper__item" class:stepper__item--active={currentStep === step.number} class:stepper__item--done={currentStep > step.number}>
					<div class="stepper__circle">
						{#if currentStep > step.number}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
								<path d="M20 6L9 17l-5-5" />
							</svg>
						{:else}
							{step.number}
						{/if}
					</div>
					<span class="stepper__label">{step.label}</span>
				</div>
				{#if i < steps.length - 1}
					<div class="stepper__line" class:stepper__line--done={currentStep > step.number}></div>
				{/if}
			{/each}
		</div>
	</div>

	<div class="container signup-form-container">
		<!-- ═══════ STEP 1 ═══════ -->
		{#if currentStep === 1}
			<div class="step-content">
				<h2>{steps[0]?.label ?? 'Date personale'}</h2>

				<div class="form-section">
					<h3>{page?.personal_section_heading ?? 'Informații personale'}</h3>
					<div class="form-row">
						<div class="form-group" class:has-error={step1Errors.firstName}>
							<label for="first-name">{t('first_name_label', 'Prenume')} *</label>
							<input id="first-name" type="text" bind:value={firstName} placeholder={t('first_name_placeholder', 'Prenumele tău')} required />
							{#if step1Errors.firstName}<span class="form-error">{step1Errors.firstName}</span>{/if}
						</div>
						<div class="form-group" class:has-error={step1Errors.lastName}>
							<label for="last-name">{t('last_name_label', 'Nume')} *</label>
							<input id="last-name" type="text" bind:value={lastName} placeholder={t('last_name_placeholder', 'Numele tău')} required />
							{#if step1Errors.lastName}<span class="form-error">{step1Errors.lastName}</span>{/if}
						</div>
					</div>
					<div class="form-row">
						<div class="form-group" class:has-error={step1Errors.email}>
							<label for="signup-email">{t('email_label', 'Email')} *</label>
							<input id="signup-email" type="email" bind:value={email} placeholder={t('email_placeholder', 'email@exemplu.ro')} required />
							{#if step1Errors.email}<span class="form-error">{step1Errors.email}</span>{/if}
						</div>
						<div class="form-group" class:has-error={step1Errors.phone}>
							<label for="phone">{t('phone_label', 'Telefon')} *</label>
							<input id="phone" type="tel" bind:value={phone} placeholder={t('phone_placeholder', '07xx xxx xxx')} required />
							{#if step1Errors.phone}<span class="form-error">{step1Errors.phone}</span>{/if}
						</div>
					</div>
					<div class="form-row form-row--single">
						<div class="form-group" class:has-error={step1Errors.birthDate}>
							<label for="birth-date">{t('birth_date_label', 'Data nașterii')} *</label>
							<input id="birth-date" type="date" bind:value={birthDate} required />
							{#if step1Errors.birthDate}<span class="form-error">{step1Errors.birthDate}</span>{/if}
						</div>
					</div>
				</div>

				<div class="form-section">
					<h3>{page?.address_section_heading ?? 'Adresă'}</h3>
					<div class="form-row">
						<div class="form-group" class:has-error={step1Errors.county}>
							<label for="county">{t('county_label', 'Județ')} *</label>
							<select id="county" bind:value={county} required>
								<option value="">{t('county_placeholder', 'Alege județul')}</option>
								{#each data.counties as c}
									<option value={c.name}>{c.name}</option>
								{/each}
							</select>
							{#if step1Errors.county}<span class="form-error">{step1Errors.county}</span>{/if}
						</div>
						<div class="form-group" class:has-error={step1Errors.city}>
							<label for="city">{t('city_label', 'Localitate')} *</label>
							<input id="city" type="text" bind:value={city} placeholder={t('city_placeholder', 'Orașul sau comuna')} required />
							{#if step1Errors.city}<span class="form-error">{step1Errors.city}</span>{/if}
						</div>
					</div>
					<div class="form-group" class:has-error={step1Errors.address}>
						<label for="address">{t('address_label', 'Adresa completă')} *</label>
						<input id="address" type="text" bind:value={address} placeholder={t('address_placeholder', 'Strada, număr, bloc, scara, apartament')} required />
						{#if step1Errors.address}<span class="form-error">{step1Errors.address}</span>{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- ═══════ STEP 2 ═══════ -->
		{#if currentStep === 2}
			<div class="step-content">
				<h2>{steps[1]?.label ?? 'Motivație'}</h2>

				<div class="form-section">
					<div class="form-group">
						<label for="motivation">{t('motivation_label', 'De ce vrei să te alături SENS?')}</label>
						<textarea
							id="motivation"
							bind:value={motivation}
							placeholder={t('motivation_placeholder', 'Spune-ne ce te motivează...')}
							rows="5"
							maxlength="1000"
						></textarea>
						<span class="char-count">{motivation.length} / 1000</span>
					</div>
				</div>

				<div class="form-section">
					<h3>{t('interests_label', 'Domenii de interes')}</h3>
					{#if t('interests_help', '')}
						<p class="section-hint">{t('interests_help', 'Selectează domeniile care te interesează cel mai mult.')}</p>
					{/if}
					<div class="interest-grid">
						{#each data.interests as area}
							<button
								type="button"
								class="interest-chip"
								class:interest-chip--active={interests.includes(area.name)}
								onclick={() => toggleInterest(area.name)}
							>
								{#if area.icon}<span class="interest-chip-icon">{area.icon}</span>{/if}
								{area.name}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- ═══════ STEP 3 ═══════ -->
		{#if currentStep === 3}
			<div class="step-content">
				<h2>{steps[2]?.label ?? 'Confirmare'}</h2>

				<div class="form-section">
					<h3>Rezumat</h3>
					<div class="summary-grid">
						<div class="summary-item">
							<span class="summary-label">{t('first_name_label', 'Prenume')} {t('last_name_label', 'Nume')}</span>
							<span class="summary-value">{firstName} {lastName}</span>
						</div>
						<div class="summary-item">
							<span class="summary-label">{t('email_label', 'Email')}</span>
							<span class="summary-value">{email}</span>
						</div>
						<div class="summary-item">
							<span class="summary-label">{t('phone_label', 'Telefon')}</span>
							<span class="summary-value">{phone}</span>
						</div>
						<div class="summary-item">
							<span class="summary-label">{t('birth_date_label', 'Data nașterii')}</span>
							<span class="summary-value">{birthDate}</span>
						</div>
						<div class="summary-item">
							<span class="summary-label">{t('address_label', 'Adresă')}</span>
							<span class="summary-value">{address}, {city}, {county}</span>
						</div>
						{#if interests.length > 0}
							<div class="summary-item">
								<span class="summary-label">{t('interests_label', 'Interese')}</span>
								<span class="summary-value">{interests.join(', ')}</span>
							</div>
						{/if}
					</div>
				</div>

				<div class="form-section">
					<h3>Consimțăminte</h3>
					<div class="consent-list">
						{#if getConsent('statute')}
							<label class="consent-item" class:has-error={step3Errors.consentStatute}>
								<input type="checkbox" bind:checked={consentStatute} />
								<span>{getConsent('statute')?.label ?? ''}{getConsent('statute')?.required !== false ? ' *' : ''}</span>
							</label>
							{#if getConsent('statute')?.help_text}<span class="consent-help">{getConsent('statute')?.help_text}</span>{/if}
							{#if step3Errors.consentStatute}<span class="form-error consent-error">{step3Errors.consentStatute}</span>{/if}
						{/if}

						{#if getConsent('gdpr')}
							<label class="consent-item" class:has-error={step3Errors.consentGdpr}>
								<input type="checkbox" bind:checked={consentGdpr} />
								<span>{getConsent('gdpr')?.label ?? ''}{getConsent('gdpr')?.required !== false ? ' *' : ''}</span>
							</label>
							{#if getConsent('gdpr')?.help_text}<span class="consent-help">{getConsent('gdpr')?.help_text}</span>{/if}
							{#if step3Errors.consentGdpr}<span class="form-error consent-error">{step3Errors.consentGdpr}</span>{/if}
						{/if}

						{#if getConsent('data_processing')}
							<label class="consent-item" class:has-error={step3Errors.consentDataProcessing}>
								<input type="checkbox" bind:checked={consentDataProcessing} />
								<span>{getConsent('data_processing')?.label ?? ''}{getConsent('data_processing')?.required !== false ? ' *' : ''}</span>
							</label>
							{#if getConsent('data_processing')?.help_text}<span class="consent-help">{getConsent('data_processing')?.help_text}</span>{/if}
							{#if step3Errors.consentDataProcessing}<span class="form-error consent-error">{step3Errors.consentDataProcessing}</span>{/if}
						{/if}

						{#if getConsent('newsletter')}
							<label class="consent-item">
								<input type="checkbox" bind:checked={consentNewsletter} />
								<span>{getConsent('newsletter')?.label ?? ''}</span>
							</label>
							{#if getConsent('newsletter')?.help_text}<span class="consent-help">{getConsent('newsletter')?.help_text}</span>{/if}
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- ═══════ NAVIGATION ═══════ -->
		<div class="form-nav">
			{#if currentStep > 1}
				<button type="button" class="btn btn-outline-ink" onclick={prevStep}>
					← {page?.prev_step_text ?? 'Pasul anterior'}
				</button>
			{:else}
				<div></div>
			{/if}

			{#if currentStep < 3}
				<button type="button" class="btn btn-primary" onclick={nextStep}>
					{page?.next_step_text ?? 'Pasul următor'} →
				</button>
			{:else}
				<button type="button" class="btn btn-primary" disabled={loading} onclick={handleSubmit}>
					{loading ? (page?.submitting_text ?? 'Se trimite...') : (page?.submit_text ?? 'Trimite cererea')}
				</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* ── Page header ── */
	.page-header { padding-block: var(--page-header-pt) var(--page-header-pb); }
	.page-subtitle {
		font-size: var(--text-lg);
		color: var(--color-ink-soft);
		margin-top: var(--space-4);
		max-width: 600px;
	}
	.page-header h1 {
		font-family: var(--font-display);
		font-size: var(--page-title-size);
		font-weight: var(--page-title-weight);
		letter-spacing: var(--page-title-letter-spacing);
		line-height: var(--page-title-line-height);
		text-transform: uppercase;
		color: var(--color-ink);
		margin-top: var(--space-5);
	}

	/* ── Stepper ── */
	.stepper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		margin-bottom: var(--space-12);
		/* Single row, never wraps — even on small screens */
		flex-wrap: nowrap;
	}
	.stepper__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
		flex-shrink: 1;
	}
	.stepper__circle {
		width: 40px;
		height: 40px;
		border: 1.5px solid var(--color-ink);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-weight: 500;
		font-size: var(--text-base);
		color: var(--color-ink);
		background-color: var(--color-paper);
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}
	.stepper__item--active .stepper__circle {
		background-color: var(--color-lime);
		color: var(--color-ink);
	}
	.stepper__item--done .stepper__circle {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}
	.stepper__label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
	.stepper__item--active .stepper__label { color: var(--color-ink); font-weight: 500; }
	.stepper__line {
		width: 40px;
		height: 1.5px;
		background-color: var(--color-ink);
		opacity: 0.2;
		flex-shrink: 1;
		min-width: 12px;
	}
	.stepper__line--done { opacity: 1; }

	/* Mobile: shrink everything so 3 steps + 2 lines fit on one row */
	@media (max-width: 480px) {
		.stepper {
			gap: var(--space-2);
			margin-bottom: var(--space-8);
		}
		.stepper__circle {
			width: 32px;
			height: 32px;
			font-size: 0.875rem;
		}
		.stepper__label {
			font-size: 0.5625rem;
			letter-spacing: 0.08em;
		}
		.stepper__line { width: auto; flex: 1 1 16px; }
	}

	/* ── Form ── */
	.signup-form-container { padding-bottom: var(--space-16); }
	.step-content h2 {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		margin-bottom: var(--space-8);
		color: var(--color-ink);
	}
	.form-section {
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-8);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}
	.form-section h3 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
		text-transform: uppercase;
		margin-bottom: var(--space-4);
		color: var(--color-ink);
	}
	.section-hint {
		font-size: 0.9375rem;
		color: var(--color-ink-soft);
		margin-bottom: var(--space-4);
	}
	.form-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}
	@media (min-width: 640px) {
		.form-row:not(.form-row--single) { grid-template-columns: 1fr 1fr; }
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
	.form-group select,
	.form-group textarea {
		padding: 0.875rem 1rem;
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-paper);
		color: var(--color-ink);
	}
	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		background-color: var(--color-cream);
	}
	.form-error {
		color: var(--color-error);
		font-size: 0.75rem;
		font-family: var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-top: 2px;
	}
	.has-error input, .has-error select, .has-error textarea { border-color: var(--color-error); }
	.char-count {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-ink-soft);
		align-self: flex-end;
	}

	/* ── Interest chips ── */
	.interest-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
	.interest-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0.5rem 1rem;
		border: 1.5px solid var(--color-ink);
		background: transparent;
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.interest-chip:hover { background-color: var(--color-cream); }
	.interest-chip--active {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}

	/* ── Summary ── */
	.summary-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-3);
		padding: var(--space-5);
		background-color: var(--color-cream);
	}
	@media (min-width: 640px) {
		.summary-grid { grid-template-columns: 1fr 1fr; }
	}
	.summary-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.summary-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.summary-value {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-ink);
	}

	/* ── Consent list ── */
	.consent-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.consent-item {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		font-size: 0.9375rem;
		line-height: 1.5;
		cursor: pointer;
	}
	.consent-item input[type="checkbox"] {
		margin-top: 4px;
		flex-shrink: 0;
		width: 18px;
		height: 18px;
		accent-color: var(--color-lime);
	}
	.consent-item a { color: var(--color-green-deep); text-decoration: underline; text-underline-offset: 3px; }
	.consent-error { margin-left: 32px; }
	.consent-help {
		display: block;
		margin: var(--space-1) 0 var(--space-3) 32px;
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
		opacity: 0.85;
	}

	/* ── Navigation ── */
	.form-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--space-6);
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}

	/* ── Success ── */
	.signup-success {
		padding-block: var(--space-12);
	}
	.success-card {
		max-width: 700px;
		margin: 0 auto;
		padding: var(--space-10) var(--space-8);
		background-color: var(--color-cream);
		border: 1.5px solid var(--color-ink);
		text-align: center;
	}
	.success-icon-big {
		width: 64px;
		height: 64px;
		margin: 0 auto var(--space-6);
		background-color: var(--color-lime);
		color: var(--color-ink);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: 700;
	}
	.success-card h2 {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		margin-bottom: var(--space-4);
		color: var(--color-ink);
	}
	.success-card p {
		font-size: var(--text-lg);
		color: var(--color-ink-soft);
		line-height: 1.5;
		margin-bottom: var(--space-6);
	}
	.success-steps {
		text-align: left;
		background-color: var(--color-paper);
		padding: var(--space-5) var(--space-6);
		margin-bottom: var(--space-8);
		border: 1px solid rgba(12, 81, 24, 0.15);
	}
	.success-steps h3 {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin-bottom: var(--space-3);
	}
	.success-steps ol {
		list-style: none;
		counter-reset: step;
		padding: 0;
	}
	.success-steps li {
		counter-increment: step;
		padding: var(--space-2) 0;
		padding-left: var(--space-8);
		position: relative;
		font-size: 0.9375rem;
		line-height: 1.5;
	}
	.success-steps li::before {
		content: counter(step);
		position: absolute;
		left: 0;
		top: var(--space-2);
		width: 24px;
		height: 24px;
		background-color: var(--color-ink);
		color: var(--color-lime);
		font-family: var(--font-display);
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.success-step-icon { margin-right: 4px; }
	.success-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
