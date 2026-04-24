<script lang="ts">
	import { navigating } from '$app/stores';

	// Delay mic înainte de a afișa overlay-ul — evită flash-ul la navigări instant (< 150ms)
	let showOverlay = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if ($navigating) {
			timeoutId = setTimeout(() => {
				showOverlay = true;
			}, 150);
		} else {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = null;
			showOverlay = false;
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});
</script>

{#if $navigating}
	<div class="nav-progress" role="progressbar" aria-label="Se încarcă pagina...">
		<div class="nav-progress__bar"></div>
	</div>
{/if}

{#if showOverlay}
	<div class="nav-overlay" role="status" aria-live="polite" aria-busy="true">
		<div class="nav-overlay__inner">
			<img
				src="/logo.png"
				alt="SENS"
				class="nav-overlay__logo"
				width="140"
				height="56"
			/>
			<div class="nav-overlay__dots" aria-hidden="true">
				<span></span>
				<span></span>
				<span></span>
			</div>
			<span class="sr-only">Se încarcă pagina</span>
		</div>
	</div>
{/if}

<style>
	.nav-progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		height: 3px;
		overflow: hidden;
	}

	.nav-progress__bar {
		height: 100%;
		background: linear-gradient(90deg, var(--color-lime), var(--color-green-bright));
		animation: nav-progress 2s ease-in-out infinite;
		transform-origin: left;
	}

	@keyframes nav-progress {
		0% { transform: scaleX(0) translateX(0); }
		50% { transform: scaleX(0.6) translateX(30%); }
		100% { transform: scaleX(0.1) translateX(900%); }
	}

	/* ── Loading overlay ── */
	.nav-overlay {
		position: fixed;
		inset: 0;
		z-index: 9998;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-green-deep);
		animation: nav-overlay-fade-in 0.25s ease-out forwards;
	}

	.nav-overlay__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
	}

	.nav-overlay__logo {
		height: auto;
		max-width: 140px;
		animation: nav-overlay-logo 1.4s ease-in-out infinite;
		filter: brightness(0) invert(1); /* fallback to white if logo is dark */
	}

	.nav-overlay__dots {
		display: inline-flex;
		gap: 10px;
	}

	.nav-overlay__dots span {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: var(--color-lime);
		animation: nav-overlay-dot 1.2s ease-in-out infinite both;
	}

	.nav-overlay__dots span:nth-child(1) { animation-delay: 0s; }
	.nav-overlay__dots span:nth-child(2) { animation-delay: 0.15s; }
	.nav-overlay__dots span:nth-child(3) { animation-delay: 0.3s; }

	@keyframes nav-overlay-fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes nav-overlay-logo {
		0%, 100% {
			transform: scale(1);
			opacity: 0.85;
		}
		50% {
			transform: scale(1.05);
			opacity: 1;
		}
	}

	@keyframes nav-overlay-dot {
		0%, 80%, 100% {
			transform: scale(0.5);
			opacity: 0.4;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-overlay__logo,
		.nav-overlay__dots span {
			animation: none;
		}
		.nav-overlay {
			animation: none;
			opacity: 1;
		}
	}
</style>
