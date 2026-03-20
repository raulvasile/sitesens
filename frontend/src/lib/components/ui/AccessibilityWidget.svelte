<script lang="ts">
	let open = $state(false);
	let fontSize = $state(100);
	let highContrast = $state(false);
	let reduceMotion = $state(false);

	$effect(() => {
		const root = document.documentElement;
		root.style.fontSize = `${fontSize}%`;
		root.classList.toggle('high-contrast', highContrast);
		root.classList.toggle('reduce-motion', reduceMotion);
	});

	function resetAll() {
		fontSize = 100;
		highContrast = false;
		reduceMotion = false;
	}
</script>

<div class="a11y-widget">
	<button
		class="a11y-widget__toggle"
		aria-label="Opțiuni accesibilitate"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="12" cy="4.5" r="2.5" />
			<path d="M12 7v5m0 0l-3 5m3-5l3 5" />
			<path d="M7 10h10" />
		</svg>
	</button>

	{#if open}
		<div class="a11y-panel" role="dialog" aria-label="Setări accesibilitate">
			<div class="a11y-panel__header">
				<h3>Accesibilitate</h3>
				<button onclick={() => (open = false)} aria-label="Închide">×</button>
			</div>

			<div class="a11y-panel__section">
				<p class="a11y-panel__label">Dimensiune text</p>
				<div class="a11y-panel__font-controls">
					<button onclick={() => (fontSize = Math.max(80, fontSize - 10))} aria-label="Micșorează textul">A-</button>
					<span>{fontSize}%</span>
					<button onclick={() => (fontSize = Math.min(150, fontSize + 10))} aria-label="Mărește textul">A+</button>
				</div>
			</div>

			<label class="a11y-panel__option">
				<input type="checkbox" bind:checked={highContrast} />
				<span>Contrast ridicat</span>
			</label>

			<label class="a11y-panel__option">
				<input type="checkbox" bind:checked={reduceMotion} />
				<span>Dezactivează animațiile</span>
			</label>

			<button class="a11y-panel__reset" onclick={resetAll}>Resetează</button>
		</div>
	{/if}
</div>

<style>
	.a11y-widget {
		position: fixed;
		bottom: var(--space-6);
		left: var(--space-4);
		z-index: 90;
	}

	.a11y-widget__toggle {
		width: 52px;
		height: 52px;
		border-radius: var(--radius-full);
		background-color: #1565C0;
		color: var(--color-white);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-fast);
	}

	.a11y-widget__toggle:hover {
		background-color: #0D47A1;
	}

	.a11y-panel {
		position: absolute;
		bottom: calc(100% + var(--space-3));
		left: 0;
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		padding: var(--space-4);
		width: 240px;
		border: 1px solid var(--color-border);
	}

	.a11y-panel__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.a11y-panel__header h3 {
		font-size: var(--text-base);
		font-weight: 600;
	}

	.a11y-panel__header button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: var(--text-xl);
		color: var(--color-text-muted);
		line-height: 1;
	}

	.a11y-panel__section {
		margin-bottom: var(--space-3);
	}

	.a11y-panel__label {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin-bottom: var(--space-2);
	}

	.a11y-panel__font-controls {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.a11y-panel__font-controls button {
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-3);
		cursor: pointer;
		font-weight: 600;
		font-size: var(--text-sm);
		transition: background-color var(--transition-fast);
	}

	.a11y-panel__font-controls button:hover {
		background-color: var(--color-border);
	}

	.a11y-panel__font-controls span {
		font-size: var(--text-sm);
		font-weight: 500;
		min-width: 40px;
		text-align: center;
	}

	.a11y-panel__option {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) 0;
		cursor: pointer;
		font-size: var(--text-sm);
		border-bottom: 1px solid var(--color-border);
	}

	.a11y-panel__option:last-of-type {
		border-bottom: none;
	}

	.a11y-panel__reset {
		margin-top: var(--space-4);
		width: 100%;
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-3);
		cursor: pointer;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		transition: all var(--transition-fast);
	}

	.a11y-panel__reset:hover {
		border-color: #1565C0;
		color: #1565C0;
	}

	:global(.high-contrast) {
		filter: contrast(1.5);
	}

	:global(.reduce-motion) * {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
</style>
