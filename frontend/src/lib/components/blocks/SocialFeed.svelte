<script lang="ts">
	interface Props {
		data: {
			title?: string;
			subtitle?: string;
			facebook_url?: string;
			instagram_url?: string;
			show_facebook?: boolean;
			show_instagram?: boolean;
			variant?: 'full' | 'compact';
			[key: string]: unknown;
		};
	}

	let { data }: Props = $props();

	const title = $derived(data.title || 'Urmărește-ne');
	const isCompact = $derived(data.variant === 'compact');

	const platforms = $derived(() => {
		const list: { name: string; handle: string; url: string; description: string; color: string; gradient?: string; icon: string }[] = [];
		if (data.show_facebook !== false && data.facebook_url) {
			list.push({
				name: 'Facebook',
				handle: 'miscarea.sens',
				url: data.facebook_url,
				description: 'Știri, comunicate și discuții.',
				color: '#1877f2',
				icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
			});
		}
		if (data.show_instagram !== false && data.instagram_url) {
			const match = data.instagram_url.match(/instagram\.com\/([^/?]+)/);
			list.push({
				name: 'Instagram',
				handle: match ? `@${match[1]}` : '@miscarea.sens',
				url: data.instagram_url,
				description: 'Imagini și povești din comunitate.',
				color: '#e1306c',
				gradient: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
				icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
			});
		}
		return list;
	});
</script>

<section class="social-feed" class:social-feed--compact={isCompact}>
	<div class="container">
		{#if title}
			<div class="social-feed__header">
				<h2>{title}</h2>
				{#if data.subtitle}
					<p>{data.subtitle}</p>
				{/if}
			</div>
		{/if}

		<div class="social-feed__cards">
			{#each platforms() as platform}
				<a
					href={platform.url}
					target="_blank"
					rel="noopener noreferrer"
					class="social-feed__card"
					style="--card-color: {platform.color}; --card-bg: {platform.gradient || platform.color}"
				>
					<div class="social-feed__card-icon">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d={platform.icon} />
						</svg>
					</div>
					<div class="social-feed__card-info">
						<strong>{platform.name}</strong>
						<span class="social-feed__card-handle">{platform.handle}</span>
						{#if !isCompact}
							<p>{platform.description}</p>
						{/if}
					</div>
					<span class="social-feed__card-cta">
						Urmărește
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M7 17L17 7M17 7H7M17 7V17" />
						</svg>
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.social-feed {
		padding: var(--space-12) 0;
	}
	.social-feed--compact {
		padding: var(--space-8) 0;
	}

	.social-feed__header {
		text-align: center;
		margin-bottom: var(--space-6);
	}
	.social-feed__header h2 {
		font-size: var(--text-2xl);
		font-weight: 800;
		color: var(--color-green-dark);
		margin-bottom: var(--space-2);
	}
	.social-feed__header p {
		color: var(--color-text-muted);
		font-size: var(--text-lg);
		max-width: 600px;
		margin: 0 auto;
	}

	.social-feed__cards {
		display: flex;
		justify-content: center;
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	.social-feed__card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-5) var(--space-6);
		background: white;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-xl);
		text-decoration: none;
		color: var(--color-text);
		transition: var(--transition-base);
		min-width: 280px;
		position: relative;
		overflow: hidden;
	}
	.social-feed__card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--card-bg);
	}
	.social-feed__card:hover {
		border-color: var(--card-color);
		transform: translateY(-3px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	}

	.social-feed__card-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-lg);
		background: var(--card-bg);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.social-feed__card-info {
		flex: 1;
	}
	.social-feed__card-info strong {
		display: block;
		font-size: var(--text-base);
	}
	.social-feed__card-handle {
		font-size: var(--text-sm);
		color: var(--card-color);
		font-weight: 600;
	}
	.social-feed__card-info p {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin: var(--space-1) 0 0;
	}

	.social-feed__card-cta {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--card-color);
		white-space: nowrap;
	}
	.social-feed__card:hover .social-feed__card-cta svg {
		transform: translate(2px, -2px);
	}
	.social-feed__card-cta svg {
		transition: var(--transition-fast);
	}

	@media (max-width: 600px) {
		.social-feed__cards {
			flex-direction: column;
		}
		.social-feed__card {
			min-width: 0;
		}
	}
</style>
