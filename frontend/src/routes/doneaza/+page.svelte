<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const dp = $derived(data.donatePage);

	// Prefer new `amounts` component array, fallback to `preset_amounts_json`, then legacy `preset_amounts`, then defaults
	const presetAmounts = $derived.by<number[]>(() => {
		if (dp?.amounts?.length) return dp.amounts.map((a) => a.amount);
		if (dp?.preset_amounts_json?.length) return dp.preset_amounts_json;
		if (dp?.preset_amounts?.length) return dp.preset_amounts;
		return [25, 50, 100, 200];
	});
	// Prefer new `transparency` component array, fallback to legacy `transparency_items`
	const transparencyItems = $derived(dp?.transparency ?? dp?.transparency_items ?? []);

	let selectedAmount = $state(100);
	let customAmount = $state('');
	let isCustom = $state(false);
	let copied = $state(false);

	const IBAN = $derived(dp?.iban ?? 'RO49 AAAA 1B31 0075 9384 0000');

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
	<Breadcrumb items={[{ label: dp?.title ?? 'Donează' }]} />
	{#if dp?.header_eyebrow}
		<div class="page-header__bar">
			<span class="page-header__eyebrow">— {dp.header_eyebrow}</span>
		</div>
	{/if}
	<h1 class="page-header__title">{dp?.title ?? 'Donează pentru SENS'}</h1>
	{#if dp?.description}
		<p class="page-header__lead">{dp.description}</p>
	{/if}
</div>

<div class="container donate-layout">
	<!-- ═══════ STÂNGA: Sumă + IBAN ═══════ -->
	<div class="donate-main">
		<!-- Sume predefinite -->
		<section class="donate-section">
			<div class="donate-section__head">
				{#if dp?.amounts_kicker}
					<span class="donate-section__kicker">— {dp.amounts_kicker}</span>
				{/if}
				<h2 class="donate-section__title">{dp?.amounts_heading ?? 'Alege suma donației'}</h2>
			</div>
			<div class="amount-grid">
				{#each presetAmounts as amount}
					<button
						class="amount-btn"
						class:active={!isCustom && selectedAmount === amount}
						onclick={() => selectPreset(amount)}
					>
						<span class="amount-btn__num">{amount}</span>
						<span class="amount-btn__cur">RON</span>
					</button>
				{/each}
				<button
					class="amount-btn amount-btn--custom"
					class:active={isCustom}
					onclick={activateCustom}
				>
					{dp?.custom_amount_label ?? 'Altă sumă'}
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
		<section class="donate-section">
			<div class="donate-section__head">
				{#if dp?.transfer_kicker}
					<span class="donate-section__kicker">— {dp.transfer_kicker}</span>
				{/if}
				<h2 class="donate-section__title">{dp?.transfer_heading ?? 'Transfer bancar'}</h2>
			</div>
			<div class="iban-card">
				<div class="iban-card__header">
					<span class="iban-card__label">IBAN · {dp?.bank_name ?? 'Partidul SENS'}</span>
				</div>
				<div class="iban-card__body">
					<code class="iban-card__code">{IBAN}</code>
					<button class="iban-card__copy" onclick={copyIBAN} aria-label="Copiază IBAN">
						{#if copied}
							<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
							Copiat
						{:else}
							<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
								<rect x="9" y="9" width="13" height="13"></rect>
								<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
							</svg>
							Copiază
						{/if}
					</button>
				</div>
				{#if dp?.transfer_notes}
					<p class="iban-card__note">{dp.transfer_notes}</p>
				{/if}
			</div>
		</section>

		{#if dp?.cmf_text}
			<section class="cmf-section">
				{#if dp?.cmf_kicker}
					<span class="cmf-section__kicker">— {dp.cmf_kicker}</span>
				{/if}
				<p class="cmf-section__text">{dp.cmf_text}</p>
			</section>
		{/if}
	</div>

	<!-- ═══════ DREAPTA: Transparență ═══════ -->
	<aside class="donate-sidebar">
		{#if transparencyItems.length > 0}
			<section class="transparency-section">
				<div class="donate-section__head">
					{#if dp?.transparency_kicker}
						<span class="donate-section__kicker donate-section__kicker--light">— {dp.transparency_kicker}</span>
					{/if}
					<h2 class="transparency-section__title">{dp?.transparency_heading ?? 'Unde merg banii tăi'}</h2>
				</div>
				<div class="transparency-list">
					{#each transparencyItems as item, i}
						{@const idx = String(i + 1).padStart(2, '0')}
						<div class="transparency-item">
							<div class="transparency-item__header">
								<span class="transparency-item__idx">{idx}</span>
								<span class="transparency-item__label">{item.label}</span>
								<span class="transparency-item__pct">{item.percentage}%</span>
							</div>
							<div class="transparency-item__bar">
								<div
									class="transparency-item__fill"
									style="width: {item.percentage}%"
								></div>
							</div>
							{#if item.description}
								<p class="transparency-item__desc">{item.description}</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</aside>
</div>

<style>
	/* ── Page header (Direction C) ── */
	.page-header {
		padding-top: var(--page-header-pt);
		padding-bottom: var(--page-header-pb);
	}
	.page-header__bar {
		margin-top: var(--space-6);
		margin-bottom: var(--space-3);
	}
	.page-header__eyebrow {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.page-header__title {
		font-family: var(--font-display);
		font-size: var(--page-title-size);
		font-weight: var(--page-title-weight);
		letter-spacing: var(--page-title-letter-spacing);
		line-height: var(--page-title-line-height);
		text-transform: uppercase;
		color: var(--color-ink);
		margin: 0 0 var(--space-4);
	}
	.page-header__lead {
		font-family: var(--font-body);
		font-size: clamp(1rem, 1.6vw, 1.25rem);
		line-height: 1.5;
		color: var(--color-ink-soft);
		max-width: 60ch;
	}

	/* ── Layout ── */
	.donate-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		padding-block: var(--space-8) var(--space-16);
	}
	@media (min-width: 1024px) {
		.donate-layout {
			grid-template-columns: 1fr 380px;
			gap: var(--space-12);
			align-items: start;
		}
	}

	.donate-main {
		display: flex;
		flex-direction: column;
		gap: var(--space-12);
	}

	/* ── Section heads ── */
	.donate-section__head {
		margin-bottom: var(--space-6);
		border-top: 2px solid var(--color-ink);
		padding-top: var(--space-4);
	}
	.donate-section__kicker {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		margin-bottom: var(--space-2);
	}
	.donate-section__kicker--light {
		color: var(--color-cream);
		opacity: 0.7;
	}
	.donate-section__title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin: 0;
	}

	/* ── Amount grid ── */
	.amount-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2px;
		background-color: var(--color-ink);
		border: 2px solid var(--color-ink);
	}
	@media (min-width: 480px) {
		.amount-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.amount-btn {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-2);
		padding: var(--space-5) var(--space-4);
		min-height: 110px;
		background: var(--color-paper);
		border: none;
		font-family: var(--font-display);
		font-weight: 500;
		color: var(--color-ink);
		text-transform: uppercase;
		letter-spacing: -0.01em;
		cursor: pointer;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}
	.amount-btn__num {
		font-size: 2.25rem;
		line-height: 0.9;
	}
	.amount-btn__cur {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.18em;
		opacity: 0.7;
	}
	@media (hover: hover) {
		.amount-btn:hover {
			background: var(--color-cream);
		}
	}
	.amount-btn.active {
		background: var(--color-lime);
		color: var(--color-ink);
	}
	.amount-btn.active .amount-btn__cur {
		opacity: 1;
	}
	.amount-btn--custom {
		font-size: 0.875rem;
		letter-spacing: 0.06em;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	/* ── Custom amount ── */
	.custom-amount {
		margin-top: var(--space-4);
	}
	.custom-amount__wrapper {
		position: relative;
		display: flex;
		align-items: center;
		border: 2px solid var(--color-ink);
		background: var(--color-paper);
	}
	.custom-amount__input {
		width: 100%;
		padding: var(--space-4) 4rem var(--space-4) var(--space-4);
		border: none;
		background: transparent;
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-ink);
		outline: none;
	}
	.custom-amount__currency {
		position: absolute;
		right: var(--space-4);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.18em;
		color: var(--color-ink-soft);
		text-transform: uppercase;
		pointer-events: none;
	}
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
		background: var(--color-cream);
		border-left: 3px solid var(--color-lime);
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		letter-spacing: 0.04em;
		color: var(--color-ink-soft);
	}
	.amount-summary strong {
		color: var(--color-ink);
		font-weight: 600;
	}

	/* ── IBAN card ── */
	.iban-card {
		border: 2px solid var(--color-ink);
		background: var(--color-paper);
	}
	.iban-card__header {
		padding: var(--space-3) var(--space-4);
		background: var(--color-ink);
		color: var(--color-cream);
	}
	.iban-card__label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}
	.iban-card__body {
		padding: var(--space-5) var(--space-4);
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
	.iban-card__code {
		font-family: var(--font-mono);
		font-size: clamp(0.95rem, 1.6vw, 1.125rem);
		font-weight: 500;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		flex: 1;
		min-width: 200px;
		word-break: break-all;
	}
	.iban-card__copy {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: 2px solid var(--color-ink);
		background: var(--color-paper);
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink);
		cursor: pointer;
		transition: background-color var(--transition-fast), color var(--transition-fast);
		white-space: nowrap;
	}
	@media (hover: hover) {
		.iban-card__copy:hover {
			background: var(--color-lime);
		}
	}
	.iban-card__note {
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid rgba(12, 81, 24, 0.15);
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--color-ink-soft);
	}

	/* ── CMF section ── */
	.cmf-section {
		padding: var(--space-5);
		background: var(--color-cream);
		border-left: 3px solid var(--color-ink);
	}
	.cmf-section__kicker {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		margin-bottom: var(--space-2);
	}
	.cmf-section__text {
		font-family: var(--font-body);
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-ink);
		margin: 0;
	}

	/* ── Transparency sidebar ── */
	.transparency-section {
		background: var(--color-green-deep);
		color: var(--color-cream);
		padding: var(--space-6);
		position: sticky;
		top: calc(var(--navbar-height) + var(--space-4));
	}
	.transparency-section .donate-section__head {
		border-top-color: var(--color-cream);
	}
	.transparency-section__title {
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-cream);
		margin: 0;
	}
	.transparency-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}
	.transparency-item__header {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--space-3);
		align-items: baseline;
		margin-bottom: var(--space-2);
	}
	.transparency-item__idx {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		color: var(--color-cream);
		opacity: 0.6;
	}
	.transparency-item__label {
		font-family: var(--font-display);
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-cream);
	}
	.transparency-item__pct {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-lime);
	}
	.transparency-item__bar {
		height: 4px;
		background: rgba(252, 246, 232, 0.15);
		overflow: hidden;
	}
	.transparency-item__fill {
		height: 100%;
		background: var(--color-lime);
		transition: width var(--transition-slow);
	}
	.transparency-item__desc {
		margin-top: var(--space-2);
		font-family: var(--font-body);
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--color-cream);
		opacity: 0.75;
	}

	/* ── Mobile compaction ── */
	@media (max-width: 767px) {
		.page-header { padding-top: var(--space-6); padding-bottom: var(--space-4); }
		.donate-layout { padding-block: var(--space-6) var(--space-10); gap: var(--space-8); }
		.donate-main { gap: var(--space-8); }
		.transparency-section { position: static; padding: var(--space-5); }
		.amount-btn { min-height: 90px; padding: var(--space-4) var(--space-3); }
		.amount-btn__num { font-size: 1.75rem; }
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
