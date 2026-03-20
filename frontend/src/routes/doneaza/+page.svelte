<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const dp = $derived(data.donatePage);

	const presetAmounts = $derived(dp?.preset_amounts ?? [25, 50, 100, 200]);
	const transparencyItems = $derived(dp?.transparency_items ?? []);

	let selectedAmount = $state(100);
	let customAmount = $state('');
	let isCustom = $state(false);
	let copied = $state(false);

	const IBAN = 'RO49 AAAA 1B31 0075 9384 0000';

	function selectPreset(amount: number) {
		selectedAmount = amount;
		isCustom = false;
		customAmount = '';
	}

	function activateCustom() {
		isCustom = true;
		selectedAmount = 0;
	}

	const displayAmount = $derived(isCustom ? (Number(customAmount) || 0) : selectedAmount);

	async function copyIBAN() {
		try {
			await navigator.clipboard.writeText(IBAN.replace(/\s/g, ''));
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		} catch {
			// fallback
			const el = document.createElement('textarea');
			el.value = IBAN.replace(/\s/g, '');
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		}
	}
</script>

<SeoHead
	title={dp?.seo?.meta_title ?? 'Donează — SENS'}
	description={dp?.seo?.meta_description ?? 'Susține Partidul SENS cu o donație. Fiecare leu contează.'}
	ogImage={dp?.seo?.og_image?.url}
	canonicalUrl={dp?.seo?.canonical_url}
	noIndex={dp?.seo?.no_index ?? false}
/>

<div class="container page-header">
	<Breadcrumb items={[{ label: 'Donează' }]} />
	<h1>{dp?.title ?? 'Donează pentru SENS'}</h1>
	{#if dp?.description}
		<p class="page-subtitle">{dp.description}</p>
	{/if}
</div>

<div class="container donate-layout">
	<!-- ═══════ STÂNGA: Sumă + IBAN ═══════ -->
	<div class="donate-main">
		<!-- Sume predefinite -->
		<section class="amount-section">
			<h2>Alege suma donației</h2>
			<div class="amount-grid">
				{#each presetAmounts as amount}
					<button
						class="amount-btn"
						class:active={!isCustom && selectedAmount === amount}
						onclick={() => selectPreset(amount)}
					>
						{amount} RON
					</button>
				{/each}
				<button
					class="amount-btn amount-btn--custom"
					class:active={isCustom}
					onclick={activateCustom}
				>
					Altă sumă
				</button>
			</div>

			{#if isCustom}
				<div class="custom-amount">
					<label for="custom-amount-input" class="sr-only">Sumă personalizată</label>
					<div class="custom-amount__wrapper">
						<input
							id="custom-amount-input"
							type="number"
							min="1"
							placeholder="Introdu suma"
							bind:value={customAmount}
							class="custom-amount__input"
						/>
						<span class="custom-amount__currency">RON</span>
					</div>
				</div>
			{/if}

			{#if displayAmount > 0}
				<p class="amount-summary">
					Donezi <strong>{displayAmount} RON</strong> prin transfer bancar
				</p>
			{/if}
		</section>

		<!-- IBAN -->
		<section class="iban-section">
			<h2>Transfer bancar</h2>
			<div class="iban-card">
				<div class="iban-card__header">
					<span class="iban-card__label">IBAN Partidul SENS</span>
				</div>
				<div class="iban-card__body">
					<code class="iban-card__code">{IBAN}</code>
					<button class="iban-card__copy" onclick={copyIBAN} aria-label="Copiază IBAN">
						{#if copied}
							<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
							Copiat!
						{:else}
							<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
								<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
							</svg>
							Copiază
						{/if}
					</button>
				</div>
				<p class="iban-card__note">
					Menționează <strong>„Donație SENS"</strong> în detaliile transferului.
				</p>
			</div>
		</section>
	</div>

	<!-- ═══════ DREAPTA: Transparență + CMF ═══════ -->
	<aside class="donate-sidebar">
		{#if transparencyItems.length > 0}
			<section class="transparency-section">
				<h2>Unde merg banii tăi</h2>
				<div class="transparency-list">
					{#each transparencyItems as item}
						<div class="transparency-item">
							<div class="transparency-item__header">
								<span class="transparency-item__label">{item.label}</span>
								<span class="transparency-item__pct">{item.percentage}%</span>
							</div>
							<div class="transparency-item__bar">
								<div
									class="transparency-item__fill"
									style="width: {item.percentage}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

	</aside>
</div>

<style>
	.page-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-muted);
		margin-top: var(--space-2);
		max-width: 600px;
	}

	/* ── Layout ── */
	.donate-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10, 2.5rem);
		padding-block: var(--space-10, 2.5rem);
	}
	@media (min-width: 768px) {
		.donate-layout {
			grid-template-columns: 1fr 360px;
			align-items: start;
		}
	}

	/* ── Amount section ── */
	.amount-section h2,
	.iban-section h2,
	.transparency-section h2 {
		font-size: var(--text-xl);
		color: var(--color-green-dark);
		margin-bottom: var(--space-4);
	}

	.amount-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}
	@media (min-width: 480px) {
		.amount-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.amount-btn {
		padding: var(--space-4) var(--space-3);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-white);
		font-family: var(--font-body);
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.amount-btn:hover {
		border-color: var(--color-brand-vibrant);
		color: var(--color-green-dark);
	}
	.amount-btn.active {
		border-color: var(--color-brand-vibrant);
		background: var(--color-orange-light);
		color: var(--color-green-dark);
	}
	.amount-btn--custom {
		font-size: var(--text-base);
		font-weight: 600;
	}

	.custom-amount {
		margin-top: var(--space-4);
	}
	.custom-amount__wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}
	.custom-amount__input {
		width: 100%;
		padding: 0.75rem 4rem 0.75rem 1rem;
		border: 2px solid var(--color-brand-vibrant);
		border-radius: var(--radius-md);
		font-family: var(--font-body);
		font-size: var(--text-lg);
		font-weight: 600;
		background: var(--color-white);
		outline: none;
	}
	.custom-amount__input:focus {
		border-color: var(--color-green-dark);
	}
	.custom-amount__currency {
		position: absolute;
		right: 1rem;
		color: var(--color-text-muted);
		font-weight: 600;
		pointer-events: none;
	}
	/* Hide number input arrows */
	.custom-amount__input::-webkit-inner-spin-button,
	.custom-amount__input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.custom-amount__input[type='number'] {
		-moz-appearance: textfield;
	}

	.amount-summary {
		margin-top: var(--space-4);
		padding: var(--space-3) var(--space-4);
		background: var(--color-bg);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
	.amount-summary strong {
		color: var(--color-green-dark);
	}

	/* ── IBAN section ── */
	.iban-section {
		margin-top: var(--space-8);
	}
	.iban-card {
		background: var(--color-bg);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
	.iban-card__header {
		padding: var(--space-3) var(--space-4);
		background: var(--color-green-dark);
		color: var(--color-white);
	}
	.iban-card__label {
		font-size: var(--text-sm);
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.iban-card__body {
		padding: var(--space-4);
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
	.iban-card__code {
		font-size: var(--text-lg);
		font-weight: 700;
		letter-spacing: 0.05em;
		color: var(--color-green-dark);
		flex: 1;
		min-width: 200px;
	}
	.iban-card__copy {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-white);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all var(--transition-fast);
		white-space: nowrap;
	}
	.iban-card__copy:hover {
		border-color: var(--color-brand-vibrant);
		color: var(--color-green-dark);
	}
	.iban-card__note {
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--color-border);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	/* ── Transparency sidebar ── */
	.donate-sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.transparency-section {
		background: var(--color-bg);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}
	.transparency-section h2 {
		margin-bottom: var(--space-6);
	}
	.transparency-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.transparency-item__header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: var(--space-2);
	}
	.transparency-item__label {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
	}
	.transparency-item__pct {
		font-size: var(--text-sm);
		font-weight: 700;
		color: var(--color-green-dark);
	}
	.transparency-item__bar {
		height: 8px;
		background: var(--color-border);
		border-radius: var(--radius-full);
		overflow: hidden;
	}
	.transparency-item__fill {
		height: 100%;
		border-radius: var(--radius-full);
		background: linear-gradient(90deg, var(--color-green-dark), var(--color-brand-vibrant));
		transition: width var(--transition-slow);
	}

	/* ── Utilities ── */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
