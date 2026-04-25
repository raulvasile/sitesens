<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
		title?: string;
		size?: 'small' | 'large';
		children: Snippet;
	}

	let { open, onClose, title, size = 'small', children }: Props = $props();

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
		class="modal modal--{size}"
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
		background-color: rgba(10, 31, 16, 0.55);
		backdrop-filter: blur(4px);
		z-index: 300;
	}

	.modal {
		position: fixed;
		z-index: 301;
		background-color: var(--color-paper);
		color: var(--color-ink);
		border: 1.5px solid var(--color-ink);
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
			max-width: 560px;
			width: calc(100% - var(--space-8));
			bottom: auto;
			top: 50%;
			left: 50%;
			right: auto;
			transform: translate(-50%, -50%);
			animation: modal-fade-in var(--transition-base) ease;
		}

		.modal--large {
			max-width: 900px;
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
		gap: var(--space-4);
		padding: var(--space-5) var(--space-6);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
		position: sticky;
		top: 0;
		background-color: var(--color-paper);
		z-index: 1;
	}

	.modal__title {
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 2.4vw, 1.75rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 1.15;
		color: var(--color-ink);
		margin: 0;
	}

	.modal__close {
		background: transparent;
		border: 1.5px solid var(--color-ink);
		cursor: pointer;
		color: var(--color-ink);
		padding: var(--space-2);
		flex-shrink: 0;
		transition: all var(--transition-fast);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.modal__close:hover {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}

	.modal__body {
		padding: var(--space-6);
	}
</style>
