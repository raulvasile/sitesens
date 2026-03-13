<script lang="ts">
	import { toasts } from '$stores/toast';
</script>

<div class="toast-container" aria-live="polite" aria-atomic="false">
	{#each $toasts as toast (toast.id)}
		<div class="toast toast--{toast.type}" role="alert">
			<span class="toast__icon" aria-hidden="true">
				{#if toast.type === 'success'}✓{:else if toast.type === 'error'}✕{:else if toast.type === 'warning'}⚠{:else}ℹ{/if}
			</span>
			<p class="toast__message">{toast.message}</p>
			<button
				class="toast__close"
				aria-label="Închide notificarea"
				onclick={() => toasts.remove(toast.id)}
			>×</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: var(--space-6);
		right: var(--space-4);
		z-index: 500;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		max-width: 360px;
		width: calc(100vw - var(--space-8));
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		padding: var(--space-4);
		border-left: 4px solid;
		animation: toast-in var(--transition-base) ease;
	}

	@keyframes toast-in {
		from { transform: translateX(120%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}

	.toast--success { border-color: var(--color-green-leaf); }
	.toast--error { border-color: var(--color-error); }
	.toast--warning { border-color: var(--color-orange); }
	.toast--info { border-color: var(--color-green-mid); }

	.toast__icon {
		font-size: var(--text-base);
		font-weight: 700;
		flex-shrink: 0;
	}

	.toast--success .toast__icon { color: var(--color-green-leaf); }
	.toast--error .toast__icon { color: var(--color-error); }
	.toast--warning .toast__icon { color: var(--color-orange); }
	.toast--info .toast__icon { color: var(--color-green-mid); }

	.toast__message {
		flex: 1;
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	.toast__close {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		font-size: var(--text-lg);
		line-height: 1;
		flex-shrink: 0;
		padding: 0;
		transition: color var(--transition-fast);
	}

	.toast__close:hover { color: var(--color-text); }
</style>
