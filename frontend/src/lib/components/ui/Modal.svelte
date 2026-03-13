<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
		title?: string;
		children: Snippet;
	}

	let { open, onClose, title, children }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="modal-backdrop" role="presentation" onclick={onClose}></div>
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-label={title}
	>
		<div class="modal__header">
			{#if title}<h2 class="modal__title">{title}</h2>{/if}
			<button class="modal__close" aria-label="Închide" onclick={onClose}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
		</div>
		<div class="modal__body">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		z-index: 300;
	}

	.modal {
		position: fixed;
		z-index: 301;
		background-color: var(--color-white);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		box-shadow: var(--shadow-lg);
		max-height: 90dvh;
		overflow-y: auto;
		width: 100%;
		bottom: 0;
		left: 0;
		right: 0;
		animation: modal-slide-up var(--transition-base) ease;
	}

	@keyframes modal-slide-up {
		from { transform: translateY(100%); }
		to { transform: translateY(0); }
	}

	@media (min-width: 640px) {
		.modal {
			border-radius: var(--radius-lg);
			max-width: 560px;
			width: calc(100% - var(--space-8));
			bottom: auto;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			animation: modal-fade-in var(--transition-base) ease;
		}

		@keyframes modal-fade-in {
			from { opacity: 0; transform: translate(-50%, -48%); }
			to { opacity: 1; transform: translate(-50%, -50%); }
		}
	}

	.modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-6);
		border-bottom: 1px solid var(--color-border);
	}

	.modal__title {
		font-size: var(--text-xl);
		font-weight: 700;
	}

	.modal__close {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		padding: var(--space-2);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.modal__close:hover {
		background-color: var(--color-border);
		color: var(--color-text);
	}

	.modal__body {
		padding: var(--space-6);
	}
</style>
