<script lang="ts">
	import { mutateStrapi } from '$lib/strapi';
	import { toasts } from '$lib/stores/toast';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	// ── State ──
	let currentStep = $state(1);
	let loading = $state(false);
	let submitted = $state(false);

	// Step 1: Date personale & Adresă
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');
	let birthDate = $state('');
	let county = $state('');
	let city = $state('');
	let address = $state('');

	// Step 2: Motivație & Interese
	let motivation = $state('');
	let interests = $state<string[]>([]);

	// Step 3: Consimțământ
	let consentGdpr = $state(false);
	let consentStatute = $state(false);
	let consentDataProcessing = $state(false);
	let consentNewsletter = $state(false);

	// Validation
	let step1Errors = $state<Record<string, string>>({});
	let step3Errors = $state<Record<string, string>>({});

	const interestOptions = [
		'Mediu', 'Educație', 'Sănătate', 'Sustenabilitate',
		'Tineret', 'Digitalizare', 'Agricultură', 'Transport', 'Energie'
	];

	const counties = [
		'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
		'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași', 'Cluj',
		'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu', 'Gorj',
		'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți',
		'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj', 'Sibiu', 'Suceava',
		'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea'
	];

	const steps = [
		{ number: 1, label: 'Date personale' },
		{ number: 2, label: 'Motivație' },
		{ number: 3, label: 'Confirmare' },
	];

	function toggleInterest(interest: string) {
		if (interests.includes(interest)) {
			interests = interests.filter(i => i !== interest);
		} else {
			interests = [...interests, interest];
		}
	}

	function validateStep1(): boolean {
		const errors: Record<string, string> = {};
		if (!firstName.trim()) errors.firstName = 'Prenumele este obligatoriu';
		if (!lastName.trim()) errors.lastName = 'Numele este obligatoriu';
		if (!email.trim()) errors.email = 'Email-ul este obligatoriu';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email invalid';
		if (!phone.trim()) errors.phone = 'Telefonul este obligatoriu';
		else if (!/^(\+?4)?0[0-9]{9}$/.test(phone.replace(/\s/g, ''))) errors.phone = 'Număr de telefon invalid';
		if (!birthDate) errors.birthDate = 'Data nașterii este obligatorie';
		if (!county) errors.county = 'Județul este obligatoriu';
		if (!city.trim()) errors.city = 'Localitatea este obligatorie';
		if (!address.trim()) errors.address = 'Adresa este obligatorie';
		step1Errors = errors;
		return Object.keys(errors).length === 0;
	}

	function validateStep3(): boolean {
		const errors: Record<string, string> = {};
		if (!consentStatute) errors.consentStatute = 'Trebuie să accepți statutul partidului';
		if (!consentGdpr) errors.consentGdpr = 'Trebuie să fii de acord cu prelucrarea datelor';
		if (!consentDataProcessing) errors.consentDataProcessing = 'Trebuie să confirmi corectitudinea datelor';
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
			toasts.success('Cererea de aderare a fost trimisă cu succes!');
		} catch (err: any) {
			if (err?.message?.includes('unique')) {
				toasts.error('Există deja o cerere cu acest email.');
			} else {
				toasts.error('A apărut o eroare. Te rugăm să încerci din nou.');
			}
		} finally {
			loading = false;
		}
	}
</script>

<SeoHead
	title="Înscrie-te în SENS"
	description="Alătură-te Partidului SENS. Completează formularul de înscriere și fă parte din schimbarea verde."
/>

<div class="container page-header">
	<Breadcrumb items={[{ label: 'Înscrie-te' }]} />
	<h1>Înscrie-te în SENS</h1>
	<p class="page-subtitle">Completează formularul de mai jos pentru a iniția procesul de aderare.</p>
</div>

{#if submitted}
	<!-- ═══════ SUCCESS ═══════ -->
	<div class="container signup-success">
		<div class="success-card">
			<div class="success-icon-big">✓</div>
			<h2>Cererea ta a fost trimisă!</h2>
			<p>Mulțumim pentru interesul tău de a face parte din SENS. Echipa noastră va analiza cererea și te va contacta în cel mai scurt timp.</p>
			<div class="success-steps">
				<h3>Pașii următori:</h3>
				<ol>
					<li>Vei primi un email de confirmare la adresa <strong>{email}</strong></li>
					<li>Echipa noastră va verifica cererea ta</li>
					<li>Vei fi contactat pentru finalizarea procesului de aderare</li>
				</ol>
			</div>
			<div class="success-actions">
				<a href="/" class="btn btn-primary">Înapoi la pagina principală</a>
				<a href="/despre-noi" class="btn btn-outline">Află mai multe despre SENS</a>
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
				<h2>Date personale & Adresă</h2>
				<p class="step-description">Informațiile tale de bază și adresa de domiciliu.</p>

				<div class="form-section">
					<h3>Informații personale</h3>
					<div class="form-row">
						<div class="form-group" class:has-error={step1Errors.firstName}>
							<label for="first-name">Prenume *</label>
							<input id="first-name" type="text" bind:value={firstName} placeholder="Prenumele tău" required />
							{#if step1Errors.firstName}<span class="form-error">{step1Errors.firstName}</span>{/if}
						</div>
						<div class="form-group" class:has-error={step1Errors.lastName}>
							<label for="last-name">Nume *</label>
							<input id="last-name" type="text" bind:value={lastName} placeholder="Numele tău" required />
							{#if step1Errors.lastName}<span class="form-error">{step1Errors.lastName}</span>{/if}
						</div>
					</div>
					<div class="form-row">
						<div class="form-group" class:has-error={step1Errors.email}>
							<label for="signup-email">Email *</label>
							<input id="signup-email" type="email" bind:value={email} placeholder="email@exemplu.ro" required />
							{#if step1Errors.email}<span class="form-error">{step1Errors.email}</span>{/if}
						</div>
						<div class="form-group" class:has-error={step1Errors.phone}>
							<label for="phone">Telefon *</label>
							<input id="phone" type="tel" bind:value={phone} placeholder="07xx xxx xxx" required />
							{#if step1Errors.phone}<span class="form-error">{step1Errors.phone}</span>{/if}
						</div>
					</div>
					<div class="form-row form-row--single">
						<div class="form-group" class:has-error={step1Errors.birthDate}>
							<label for="birth-date">Data nașterii *</label>
							<input id="birth-date" type="date" bind:value={birthDate} required />
							{#if step1Errors.birthDate}<span class="form-error">{step1Errors.birthDate}</span>{/if}
						</div>
					</div>
				</div>

				<div class="form-section">
					<h3>Adresă</h3>
					<div class="form-row">
						<div class="form-group" class:has-error={step1Errors.county}>
							<label for="county">Județ *</label>
							<select id="county" bind:value={county} required>
								<option value="">Selectează județul</option>
								{#each counties as c}
									<option value={c}>{c}</option>
								{/each}
							</select>
							{#if step1Errors.county}<span class="form-error">{step1Errors.county}</span>{/if}
						</div>
						<div class="form-group" class:has-error={step1Errors.city}>
							<label for="city">Localitate *</label>
							<input id="city" type="text" bind:value={city} placeholder="Orașul sau comuna" required />
							{#if step1Errors.city}<span class="form-error">{step1Errors.city}</span>{/if}
						</div>
					</div>
					<div class="form-group" class:has-error={step1Errors.address}>
						<label for="address">Adresa completă *</label>
						<input id="address" type="text" bind:value={address} placeholder="Strada, număr, bloc, scara, apartament" required />
						{#if step1Errors.address}<span class="form-error">{step1Errors.address}</span>{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- ═══════ STEP 2 ═══════ -->
		{#if currentStep === 2}
			<div class="step-content">
				<h2>Motivație & Interese</h2>
				<p class="step-description">Spune-ne de ce vrei să te alături SENS și ce domenii te interesează. (opțional)</p>

				<div class="form-section">
					<div class="form-group">
						<label for="motivation">De ce vrei să te alături SENS?</label>
						<textarea
							id="motivation"
							bind:value={motivation}
							placeholder="Spune-ne ce te motivează să te implici în politica verde..."
							rows="5"
							maxlength="1000"
						></textarea>
						<span class="char-count">{motivation.length} / 1000</span>
					</div>
				</div>

				<div class="form-section">
					<h3>Domenii de interes</h3>
					<p class="section-hint">Selectează domeniile care te interesează cel mai mult.</p>
					<div class="interest-grid">
						{#each interestOptions as interest}
							<button
								type="button"
								class="interest-chip"
								class:interest-chip--active={interests.includes(interest)}
								onclick={() => toggleInterest(interest)}
							>
								{interest}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- ═══════ STEP 3 ═══════ -->
		{#if currentStep === 3}
			<div class="step-content">
				<h2>Confirmare & Consimțământ</h2>
				<p class="step-description">Verifică informațiile și confirmă acordul tău.</p>

				<!-- Rezumat date -->
				<div class="form-section">
					<h3>Rezumatul cererii tale</h3>
					<div class="summary-grid">
						<div class="summary-item">
							<span class="summary-label">Nume complet</span>
							<span class="summary-value">{firstName} {lastName}</span>
						</div>
						<div class="summary-item">
							<span class="summary-label">Email</span>
							<span class="summary-value">{email}</span>
						</div>
						<div class="summary-item">
							<span class="summary-label">Telefon</span>
							<span class="summary-value">{phone}</span>
						</div>
						<div class="summary-item">
							<span class="summary-label">Data nașterii</span>
							<span class="summary-value">{birthDate}</span>
						</div>
						<div class="summary-item">
							<span class="summary-label">Adresă</span>
							<span class="summary-value">{address}, {city}, {county}</span>
						</div>
						{#if interests.length > 0}
							<div class="summary-item">
								<span class="summary-label">Interese</span>
								<span class="summary-value">{interests.join(', ')}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Consimțăminte -->
				<div class="form-section">
					<h3>Consimțăminte obligatorii</h3>
					<div class="consent-list">
						<label class="consent-item" class:has-error={step3Errors.consentStatute}>
							<input type="checkbox" bind:checked={consentStatute} />
							<span>Declar că am citit și accept <a href="/despre-noi" target="_blank">statutul Partidului SENS</a> *</span>
						</label>
						{#if step3Errors.consentStatute}<span class="form-error consent-error">{step3Errors.consentStatute}</span>{/if}

						<label class="consent-item" class:has-error={step3Errors.consentGdpr}>
							<input type="checkbox" bind:checked={consentGdpr} />
							<span>Sunt de acord cu prelucrarea datelor mele personale conform <a href="/politica-confidentialitate" target="_blank">Politicii de Confidențialitate</a> *</span>
						</label>
						{#if step3Errors.consentGdpr}<span class="form-error consent-error">{step3Errors.consentGdpr}</span>{/if}

						<label class="consent-item" class:has-error={step3Errors.consentDataProcessing}>
							<input type="checkbox" bind:checked={consentDataProcessing} />
							<span>Confirm că informațiile furnizate sunt corecte și complete *</span>
						</label>
						{#if step3Errors.consentDataProcessing}<span class="form-error consent-error">{step3Errors.consentDataProcessing}</span>{/if}
					</div>
				</div>

				<div class="form-section">
					<h3>Opțional</h3>
					<label class="consent-item">
						<input type="checkbox" bind:checked={consentNewsletter} />
						<span>Doresc să primesc newsletter-ul SENS cu noutăți și invitații la evenimente</span>
					</label>
				</div>
			</div>
		{/if}

		<!-- ═══════ NAVIGATION ═══════ -->
		<div class="form-nav">
			{#if currentStep > 1}
				<button type="button" class="btn btn-outline" onclick={prevStep}>
					← Înapoi
				</button>
			{:else}
				<div></div>
			{/if}

			{#if currentStep < 3}
				<button type="button" class="btn btn-primary" onclick={nextStep}>
					Continuă →
				</button>
			{:else}
				<button
					type="button"
					class="btn btn-primary"
					disabled={loading}
					onclick={handleSubmit}
				>
					{loading ? 'Se trimite...' : 'Trimite cererea de aderare'}
				</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* ── Page header ── */
	.page-header { padding-block: var(--space-12) var(--space-6); }
	.page-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-muted);
		margin-top: var(--space-2);
	}

	/* ── Stepper ── */
	.stepper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		padding: var(--space-6) 0 var(--space-8);
		max-width: 500px;
		margin: 0 auto;
	}

	.stepper__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		flex-shrink: 0;
	}

	.stepper__circle {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-full);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: var(--text-sm);
		border: 2px solid var(--color-border);
		color: var(--color-text-muted);
		background-color: var(--color-white);
		transition: all var(--transition-fast);
	}

	.stepper__item--active .stepper__circle {
		background-color: var(--color-green-dark);
		border-color: var(--color-green-dark);
		color: var(--color-white);
	}

	.stepper__item--done .stepper__circle {
		background-color: var(--color-green-leaf);
		border-color: var(--color-green-leaf);
		color: var(--color-white);
	}

	.stepper__label {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-weight: 500;
		white-space: nowrap;
	}

	.stepper__item--active .stepper__label {
		color: var(--color-green-dark);
		font-weight: 600;
	}

	.stepper__item--done .stepper__label {
		color: var(--color-green-leaf);
	}

	.stepper__line {
		flex: 1;
		height: 2px;
		background-color: var(--color-border);
		margin: 0 var(--space-2);
		margin-bottom: var(--space-6);
		transition: background-color var(--transition-fast);
	}

	.stepper__line--done {
		background-color: var(--color-green-leaf);
	}

	/* ── Form container ── */
	.signup-form-container {
		max-width: 720px;
		margin: 0 auto;
		padding-bottom: var(--space-16);
	}

	.step-content {
		animation: step-in 0.3s ease;
	}

	@keyframes step-in {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.step-content h2 {
		font-size: var(--text-2xl);
		color: var(--color-green-dark);
		margin-bottom: var(--space-2);
	}

	.step-description {
		color: var(--color-text-muted);
		margin-bottom: var(--space-8);
	}

	/* ── Form sections ── */
	.form-section {
		margin-bottom: var(--space-8);
	}

	.form-section h3 {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-2);
		border-bottom: 1px solid var(--color-border);
	}

	.section-hint {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-top: calc(-1 * var(--space-2));
		margin-bottom: var(--space-4);
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	@media (min-width: 640px) {
		.form-row { grid-template-columns: 1fr 1fr; }
		.form-row--single { grid-template-columns: 1fr; max-width: 50%; }
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
	.form-group textarea,
	.form-group select {
		padding: 0.75rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-body);
		font-size: var(--text-base);
		background-color: var(--color-white);
		transition: border-color var(--transition-fast);
	}

	.form-group input:focus,
	.form-group textarea:focus,
	.form-group select:focus {
		outline: none;
		border-color: var(--color-green-dark);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 120px;
	}

	.form-group select {
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.75rem center;
		background-repeat: no-repeat;
		background-size: 1.25em;
		padding-right: 2.5rem;
	}

	/* ── Validation ── */
	.has-error input,
	.has-error textarea,
	.has-error select {
		border-color: #dc2626;
	}

	.form-error {
		font-size: var(--text-xs);
		color: #dc2626;
		margin-top: var(--space-1);
	}

	.consent-error {
		margin-left: calc(20px + var(--space-3));
		margin-bottom: var(--space-2);
		display: block;
	}

	/* ── Character count ── */
	.char-count {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-align: right;
		margin-top: var(--space-1);
	}

	/* ── Interest chips ── */
	.interest-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.interest-chip {
		padding: var(--space-2) var(--space-4);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-full);
		background: var(--color-white);
		font-size: var(--text-sm);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-fast);
		font-family: var(--font-body);
		color: var(--color-text);
	}

	.interest-chip:hover {
		border-color: var(--color-green-dark);
		color: var(--color-green-dark);
	}

	.interest-chip--active {
		background-color: var(--color-green-dark);
		border-color: var(--color-green-dark);
		color: var(--color-white);
	}

	.interest-chip--active:hover {
		background-color: var(--color-green-leaf);
		border-color: var(--color-green-leaf);
		color: var(--color-white);
	}

	/* ── Summary ── */
	.summary-grid {
		display: grid;
		gap: var(--space-3);
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		padding: var(--space-5);
	}

	.summary-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	@media (min-width: 640px) {
		.summary-item {
			flex-direction: row;
			gap: var(--space-4);
		}
	}

	.summary-label {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		font-weight: 500;
		min-width: 120px;
		flex-shrink: 0;
	}

	.summary-value {
		font-size: var(--text-sm);
		color: var(--color-text);
	}

	/* ── Consent ── */
	.consent-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.consent-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3) 0;
		cursor: pointer;
		font-size: var(--text-sm);
		line-height: 1.5;
		color: var(--color-text);
	}

	.consent-item input[type='checkbox'] {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		margin-top: 1px;
		accent-color: var(--color-green-dark);
		cursor: pointer;
	}

	.consent-item a {
		color: var(--color-green-dark);
		font-weight: 600;
		text-decoration: underline;
	}

	/* ── Form navigation ── */
	.form-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--space-8);
		border-top: 1px solid var(--color-border);
		margin-top: var(--space-4);
	}

	/* ── Success page ── */
	.signup-success {
		padding-block: var(--space-10) var(--space-16);
		max-width: 640px;
		margin: 0 auto;
	}

	.success-card {
		text-align: center;
		padding: var(--space-10);
		background-color: var(--color-bg);
		border-radius: var(--radius-lg);
	}

	.success-icon-big {
		width: 64px;
		height: 64px;
		background-color: var(--color-green-leaf);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-2xl);
		font-weight: 700;
		margin: 0 auto var(--space-6);
	}

	.success-card h2 {
		font-size: var(--text-2xl);
		color: var(--color-green-dark);
		margin-bottom: var(--space-4);
	}

	.success-card > p {
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: var(--space-8);
	}

	.success-steps {
		text-align: left;
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		margin-bottom: var(--space-8);
	}

	.success-steps h3 {
		font-size: var(--text-base);
		font-weight: 600;
		margin-bottom: var(--space-4);
		color: var(--color-green-dark);
	}

	.success-steps ol {
		list-style: decimal;
		padding-left: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.success-steps li {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.success-actions {
		display: flex;
		gap: var(--space-4);
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
