<script lang="ts">
	/**
	 * Image with diagonal-stripe placeholder (Direction C aesthetic) and lazy loading.
	 * Use `priority` for above-the-fold images (logos, hero) — they will load eagerly
	 * with high fetch priority.
	 */
	interface Props {
		src: string;
		alt: string;
		width?: number | string;
		height?: number | string;
		aspectRatio?: string;
		sizes?: string;
		priority?: boolean;
		objectFit?: 'cover' | 'contain';
		class?: string;
	}

	let {
		src,
		alt,
		width,
		height,
		aspectRatio,
		sizes,
		priority = false,
		objectFit = 'cover',
		class: className = '',
	}: Props = $props();

	let loaded = $state(false);
	let errored = $state(false);

	const wrapperStyle = $derived(aspectRatio ? `aspect-ratio: ${aspectRatio}` : undefined);
</script>

<div
	class="img-wrap {className}"
	class:img-wrap--loaded={loaded}
	class:img-wrap--errored={errored}
	style={wrapperStyle}
>
	<img
		{src}
		{alt}
		width={width as any}
		height={height as any}
		{sizes}
		loading={priority ? 'eager' : 'lazy'}
		decoding={priority ? 'sync' : 'async'}
		fetchpriority={priority ? 'high' : 'auto'}
		style={`object-fit: ${objectFit}`}
		onload={() => (loaded = true)}
		onerror={() => (errored = true)}
	/>
</div>

<style>
	.img-wrap {
		position: relative;
		overflow: hidden;
		display: block;
		background-color: var(--color-cream);
		background-image: repeating-linear-gradient(
			135deg,
			rgba(12, 81, 24, 0.08) 0,
			rgba(12, 81, 24, 0.08) 1px,
			transparent 1px,
			transparent 12px
		);
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 320ms ease-out;
	}

	.img-wrap--loaded img {
		opacity: 1;
	}

	.img-wrap--errored img {
		display: none;
	}
</style>
