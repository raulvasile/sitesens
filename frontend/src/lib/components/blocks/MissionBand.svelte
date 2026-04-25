<script lang="ts">
	interface Paragraph { id?: number; text: string; }

	interface Props {
		data: {
			kicker?: string;
			heading: string;
			heading_italic?: string;
			paragraphs: Paragraph[];
			background_color?: 'green-deep' | 'green-dark' | 'ink';
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'green-deep');

	/**
	 * Highlight markdown-style **word** segments with lime accent.
	 * Plain text otherwise. No HTML allowed.
	 */
	function highlight(text: string): Array<{ kind: 'plain' | 'accent'; value: string }> {
		const parts: Array<{ kind: 'plain' | 'accent'; value: string }> = [];
		const re = /\*\*([^*]+)\*\*/g;
		let last = 0;
		let m: RegExpExecArray | null;
		while ((m = re.exec(text)) !== null) {
			if (m.index > last) parts.push({ kind: 'plain', value: text.slice(last, m.index) });
			parts.push({ kind: 'accent', value: m[1] });
			last = re.lastIndex;
		}
		if (last < text.length) parts.push({ kind: 'plain', value: text.slice(last) });
		return parts;
	}
</script>

<section class="mission mission--{bg}">
	<div class="container mission__grid">
		<div class="mission__head">
			{#if data.kicker}
				<div class="mission__kicker">— {data.kicker}</div>
			{/if}
			<h2 class="mission__heading">
				<span>{data.heading}</span>
				{#if data.heading_italic}
					<br />
					<span class="mission__heading-italic">{data.heading_italic}</span>
				{/if}
			</h2>
		</div>

		<div class="mission__body">
			{#each data.paragraphs ?? [] as p (p.id ?? p.text)}
				<p class="mission__paragraph">
					{#each highlight(p.text) as part}
						{#if part.kind === 'accent'}
							<span class="mission__accent">{part.value}</span>
						{:else}
							{part.value}
						{/if}
					{/each}
				</p>
			{/each}
		</div>
	</div>
</section>

<style>
	.mission {
		padding-block: var(--space-24);
	}
	.mission--green-deep { background-color: var(--color-green-deep); color: var(--color-cream); }
	.mission--green-dark { background-color: var(--color-green-dark); color: var(--color-cream); }
	.mission--ink { background-color: var(--color-ink); color: var(--color-cream); }

	.mission__grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: var(--space-16);
		align-items: start;
	}

	@media (max-width: 900px) {
		.mission__grid {
			grid-template-columns: 1fr;
			gap: var(--space-8);
		}
	}

	.mission__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}

	.mission__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4.5vw, 3.5rem);
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.01em;
		margin: 0;
	}
	.mission__heading-italic {
		font-style: italic;
		color: var(--color-lime);
	}

	.mission__body {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: clamp(1.125rem, 1.7vw, 1.5rem);
		line-height: 1.4;
	}

	.mission__paragraph {
		margin: 0 0 var(--space-7);
	}
	.mission__paragraph:last-child {
		margin-bottom: 0;
	}

	.mission__accent {
		color: var(--color-lime);
	}

	/* mobile-tighten:.mission */
	@media (max-width: 767px) {
		.mission { padding-block: var(--space-10); }
	}
</style>
