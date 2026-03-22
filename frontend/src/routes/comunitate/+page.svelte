<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	const platforms = [
		{
			name: 'Facebook',
			handle: 'miscarea.sens',
			url: 'https://www.facebook.com/miscarea.sens',
			description: 'Știri, comunicate și discuții cu comunitatea noastră.',
			color: '#1877f2',
			icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
		},
		{
			name: 'Instagram',
			handle: '@miscarea.sens',
			url: 'https://www.instagram.com/miscarea.sens/',
			description: 'Imagini din activitățile noastre, povești și momente din comunitate.',
			color: '#e1306c',
			gradient: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
			icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
		},
		{
			name: 'TikTok',
			handle: '@miscarea.sens',
			url: 'https://www.tiktok.com/@miscarea.sens',
			description: 'Conținut video scurt despre valorile și acțiunile noastre.',
			color: '#000000',
			icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
		},
	];
</script>

<SeoHead
	title="Comunitate"
	description="Urmărește activitatea SENS pe rețelele sociale. Alătură-te comunității noastre pe Facebook și Instagram."
/>

<div class="container page-header">
	<Breadcrumb items={[{ label: 'Comunitate' }]} />
	<h1>Comunitate</h1>
	<p class="page-subtitle">Urmărește-ne pe rețelele sociale și fii la curent cu activitatea noastră.</p>
</div>

<div class="container social-page">
	<div class="social-cards">
		{#each platforms as platform}
			<a
				href={platform.url}
				target="_blank"
				rel="noopener noreferrer"
				class="social-card"
				style="--card-color: {platform.color}; --card-bg: {platform.gradient || platform.color}"
			>
				<div class="social-card__icon-wrap">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d={platform.icon} />
					</svg>
				</div>
				<div class="social-card__info">
					<h2>{platform.name}</h2>
					<span class="social-card__handle">{platform.handle}</span>
					<p>{platform.description}</p>
				</div>
				<span class="social-card__cta">
					Urmărește
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M7 17L17 7M17 7H7M17 7V17" />
					</svg>
				</span>
			</a>
		{/each}
	</div>

	<section class="social-feeds">
		<h2>Ultimele postări</h2>
		<div class="social-feeds__grid">
			<div class="social-feeds__column">
				<h3>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2" aria-hidden="true">
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
					</svg>
					Facebook
				</h3>
				<div class="social-feeds__embed">
					<iframe
						src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmiscarea.sens&tabs=timeline&width=500&height=700&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
						width="500"
						height="700"
						style="border:none;overflow:hidden"
						scrolling="no"
						frameborder="0"
						allowfullscreen={true}
						allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
						title="Pagina Facebook Mișcarea SENS"
						loading="lazy"
					></iframe>
					<p class="social-feeds__fallback">
						Nu se încarcă? <a href="https://www.facebook.com/miscarea.sens" target="_blank" rel="noopener noreferrer">Deschide pe Facebook</a>
					</p>
				</div>
			</div>
			<div class="social-feeds__column">
				<h3>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="#e1306c" aria-hidden="true">
						<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
					</svg>
					Instagram
				</h3>
				<div class="social-feeds__embed">
					<iframe
						src="https://www.instagram.com/miscarea.sens/embed"
						width="500"
						height="700"
						style="border:none;overflow:hidden"
						scrolling="no"
						frameborder="0"
						title="Profilul Instagram Mișcarea SENS"
						loading="lazy"
					></iframe>
					<p class="social-feeds__fallback">
						Nu se încarcă? <a href="https://www.instagram.com/miscarea.sens/" target="_blank" rel="noopener noreferrer">Deschide pe Instagram</a>
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="social-why">
		<h2>De ce să ne urmărești?</h2>
		<div class="social-why__grid">
			<div class="social-why__item">
				<span class="social-why__emoji">📢</span>
				<h3>Comunicate și poziții</h3>
				<p>Află primul despre acțiunile și pozițiile SENS pe temele care contează.</p>
			</div>
			<div class="social-why__item">
				<span class="social-why__emoji">📸</span>
				<h3>Din teren</h3>
				<p>Imagini și povești din activitățile noastre de voluntariat și campanii.</p>
			</div>
			<div class="social-why__item">
				<span class="social-why__emoji">💬</span>
				<h3>Conversație</h3>
				<p>Pune întrebări, propune idei și discută cu echipa și comunitatea SENS.</p>
			</div>
		</div>
	</section>
</div>

<style>
	.page-header {
		padding-top: var(--space-8);
		padding-bottom: var(--space-4);
	}
	.page-header h1 {
		font-size: var(--text-3xl);
		font-weight: 800;
		color: var(--color-green-dark);
		margin: var(--space-2) 0 var(--space-1);
	}
	.page-subtitle {
		color: var(--color-text-muted);
		font-size: var(--text-lg);
		max-width: 600px;
	}

	.social-page {
		padding-bottom: var(--space-16);
	}

	/* Cards grid */
	.social-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-12);
	}

	.social-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-6);
		background: white;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-xl);
		text-decoration: none;
		color: var(--color-text);
		transition: var(--transition-base);
		position: relative;
		overflow: hidden;
	}
	.social-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--card-bg);
	}
	.social-card:hover {
		border-color: var(--card-color);
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
	}

	.social-card__icon-wrap {
		width: 56px;
		height: 56px;
		border-radius: var(--radius-lg);
		background: var(--card-bg);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.social-card__info h2 {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
	}
	.social-card__handle {
		font-size: var(--text-sm);
		color: var(--card-color);
		font-weight: 600;
	}
	.social-card__info p {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin: var(--space-2) 0 0;
		line-height: 1.5;
	}

	.social-card__cta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--card-color);
		margin-top: auto;
	}
	.social-card:hover .social-card__cta svg {
		transform: translate(2px, -2px);
	}
	.social-card__cta svg {
		transition: var(--transition-fast);
	}

	/* Feeds section */
	.social-feeds {
		margin-bottom: var(--space-12);
	}
	.social-feeds > h2 {
		font-size: var(--text-2xl);
		font-weight: 800;
		color: var(--color-green-dark);
		text-align: center;
		margin-bottom: var(--space-6);
	}
	.social-feeds__grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-6);
	}
	.social-feeds__column h3 {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: 700;
		margin-bottom: var(--space-3);
	}
	.social-feeds__embed {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.social-feeds__embed iframe {
		max-width: 100%;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		background: white;
	}
	.social-feeds__fallback {
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
	.social-feeds__fallback a {
		color: var(--color-green-dark);
		font-weight: 600;
	}

	/* Why section */
	.social-why {
		padding: var(--space-10) var(--space-6);
		background: var(--color-bg);
		border-radius: var(--radius-xl);
	}
	.social-why h2 {
		font-size: var(--text-2xl);
		font-weight: 800;
		color: var(--color-green-dark);
		text-align: center;
		margin-bottom: var(--space-8);
	}
	.social-why__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--space-6);
	}
	.social-why__item {
		text-align: center;
	}
	.social-why__emoji {
		font-size: 2rem;
		display: block;
		margin-bottom: var(--space-2);
	}
	.social-why__item h3 {
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-1);
	}
	.social-why__item p {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.social-feeds__grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.social-cards {
			grid-template-columns: 1fr;
		}
		.social-feeds__embed iframe {
			width: 100% !important;
			max-width: 100%;
		}
	}
</style>
