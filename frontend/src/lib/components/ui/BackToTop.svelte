<script lang="ts">
	let visible = $state(false);

	$effect(() => {
		function handleScroll() {
			visible = window.scrollY > 600;
		}
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button
	type="button"
	class="back-to-top"
	class:back-to-top--visible={visible}
	aria-label="Înapoi sus"
	onclick={scrollToTop}
>
	<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
		<polyline points="18 15 12 9 6 15"></polyline>
	</svg>
</button>

<style>
	.back-to-top {
		position: fixed;
		/* Match .a11y-widget bottom level so the two FABs sit on the same line. */
		bottom: var(--space-6);
		right: var(--space-4);
		display: none;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		border-radius: var(--radius-full);
		background: var(--color-ink);
		color: var(--color-lime);
		border: none;
		cursor: pointer;
		opacity: 0;
		transform: translateY(8px);
		transition: opacity var(--transition-base), transform var(--transition-base), background-color var(--transition-fast);
		z-index: 90;
		pointer-events: none;
		box-shadow: var(--shadow-md);
	}

	@media (max-width: 767px) {
		.back-to-top { display: inline-flex; }
	}

	.back-to-top--visible {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.back-to-top:active {
		background: var(--color-lime);
		color: var(--color-ink);
	}
</style>
