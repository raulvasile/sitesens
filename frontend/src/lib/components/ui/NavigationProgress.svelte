<script lang="ts">
	import { navigating } from '$app/stores';
</script>

{#if $navigating}
	<div class="nav-progress" role="progressbar" aria-label="Se încarcă pagina...">
		<div class="nav-progress__bar"></div>
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
		background: linear-gradient(90deg, var(--color-green-leaf), var(--color-orange));
		animation: nav-progress 2s ease-in-out infinite;
		transform-origin: left;
	}

	@keyframes nav-progress {
		0% { transform: scaleX(0) translateX(0); }
		50% { transform: scaleX(0.6) translateX(30%); }
		100% { transform: scaleX(0.1) translateX(900%); }
	}
</style>
