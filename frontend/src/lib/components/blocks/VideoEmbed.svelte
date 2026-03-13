<script lang="ts">
	interface Props { data: { url: string; caption?: string }; }
	let { data }: Props = $props();

	function getEmbedUrl(url: string): string {
		// YouTube
		const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
		if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
		// Vimeo
		const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
		if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
		return url;
	}
</script>

<section class="video-block">
	<div class="container">
		<div class="video-wrapper">
			<iframe
				src={getEmbedUrl(data.url)}
				title={data.caption ?? 'Video'}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
		{#if data.caption}
			<p class="video-caption">{data.caption}</p>
		{/if}
	</div>
</section>

<style>
	.video-block { padding-block: var(--space-12); }
	.video-wrapper {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		border-radius: var(--radius-md);
	}
	.video-wrapper iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.video-caption {
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-3);
	}
</style>
