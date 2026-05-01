<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import { getFileExt, getFileKind, formatFileSize, type StrapiFile } from '$lib/files';

	interface FileItem {
		title?: string;
		description?: string;
		file: StrapiFile;
	}
	interface Props {
		data: {
			anchor_id?: string;
			kicker?: string;
			heading: string;
			subheading?: string;
			files?: FileItem[];
			background_color?: 'paper' | 'cream';
		};
	}

	let { data }: Props = $props();
	const bg = $derived(data.background_color ?? 'paper');
	const items = $derived((data.files ?? []).filter((f) => f?.file?.url));
</script>

<section class="fl fl--{bg}" id={data.anchor_id || undefined}>
	<div class="container">
		<header class="fl__head">
			{#if data.kicker}<div class="fl__kicker">— {data.kicker}</div>{/if}
			<h2 class="fl__heading">{data.heading}</h2>
			{#if data.subheading}<p class="fl__sub">{data.subheading}</p>{/if}
		</header>

		{#if items.length === 0}
			<p class="fl__empty">Niciun fișier încă.</p>
		{:else}
			<ul class="fl__list">
				{#each items as item}
					{@const f = item.file}
					{@const kind = getFileKind(f)}
					{@const ext = getFileExt(f)}
					<li>
						<a
							class="fl__item fl__item--{kind}"
							href={getStrapiMediaUrl(f.url)}
							download={f.name}
							target="_blank"
							rel="noopener noreferrer"
						>
							<span class="fl__icon" aria-hidden="true">
								{#if kind === 'pdf'}
									<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
										<polyline points="14 2 14 8 20 8"/>
										<text x="7" y="17" font-family="monospace" font-size="5" fill="currentColor" stroke="none" font-weight="bold">PDF</text>
									</svg>
								{:else if kind === 'doc'}
									<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
										<polyline points="14 2 14 8 20 8"/>
										<line x1="8" y1="13" x2="16" y2="13"/>
										<line x1="8" y1="17" x2="16" y2="17"/>
										<line x1="8" y1="9" x2="11" y2="9"/>
									</svg>
								{:else if kind === 'sheet'}
									<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
										<polyline points="14 2 14 8 20 8"/>
										<line x1="8" y1="12" x2="16" y2="12"/>
										<line x1="8" y1="16" x2="16" y2="16"/>
										<line x1="12" y1="12" x2="12" y2="20"/>
									</svg>
								{:else}
									<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
										<polyline points="14 2 14 8 20 8"/>
									</svg>
								{/if}
							</span>
							<span class="fl__body">
								<span class="fl__title">{item.title ?? f.name}</span>
								{#if item.description}
									<span class="fl__desc">{item.description}</span>
								{/if}
								<span class="fl__meta">
									<span class="fl__ext">{ext}</span>
									{#if f.size}<span>· {formatFileSize(f.size)}</span>{/if}
								</span>
							</span>
							<span class="fl__action" aria-hidden="true">
								<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
									<polyline points="7 10 12 15 17 10"/>
									<line x1="12" y1="15" x2="12" y2="3"/>
								</svg>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.fl { padding-block: var(--space-12); }
	@media (min-width: 768px) { .fl { padding-block: var(--space-16); } }
	.fl--paper { background-color: var(--color-paper); }
	.fl--cream { background-color: var(--color-cream); }

	.fl__head { margin-bottom: var(--space-8); }
	.fl__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
		margin-bottom: var(--space-2);
	}
	.fl__heading {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 3rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin: 0;
	}
	.fl__sub {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: var(--space-3) 0 0;
		max-width: 60ch;
	}

	.fl__empty {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-ink-soft);
		opacity: 0.7;
		padding: var(--space-6) 0;
	}

	.fl__list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 2px solid var(--color-ink);
	}

	.fl__item {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--space-4);
		align-items: center;
		padding: var(--space-4) var(--space-3);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: var(--color-ink);
		transition: background-color var(--transition-fast), padding-left var(--transition-fast);
	}
	@media (hover: hover) {
		.fl__item:hover {
			background-color: var(--color-cream);
			padding-left: var(--space-5);
		}
		.fl--cream .fl__item:hover { background-color: var(--color-paper); }
		.fl__item:hover .fl__action { color: var(--color-green-deep); transform: translateX(2px); }
	}

	.fl__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--color-cream);
		color: var(--color-ink);
		flex-shrink: 0;
	}
	.fl--cream .fl__icon { background: var(--color-paper); }
	.fl__item--pdf .fl__icon { color: #c0392b; }
	.fl__item--doc .fl__icon { color: #2563eb; }
	.fl__item--sheet .fl__icon { color: #047857; }

	.fl__body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.fl__title {
		font-family: var(--font-display);
		font-size: 1.0625rem;
		font-weight: 500;
		line-height: 1.2;
		color: var(--color-ink);
	}
	.fl__desc {
		font-family: var(--font-body);
		font-size: 0.875rem;
		line-height: 1.4;
		color: var(--color-ink-soft);
	}
	.fl__meta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.75;
		margin-top: 2px;
		display: inline-flex;
		gap: 6px;
	}
	.fl__ext {
		display: inline-flex;
		padding: 1px 6px;
		background: var(--color-ink);
		color: var(--color-lime);
		font-weight: 500;
	}

	.fl__action {
		color: var(--color-ink-soft);
		opacity: 0.6;
		transition: color var(--transition-fast), transform var(--transition-fast);
	}

	@media (max-width: 480px) {
		.fl__item { grid-template-columns: auto 1fr; padding: var(--space-3); }
		.fl__action { display: none; }
		.fl__icon { width: 36px; height: 36px; }
	}
</style>
