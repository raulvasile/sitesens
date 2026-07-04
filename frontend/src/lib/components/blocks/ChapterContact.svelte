<script lang="ts">
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';

	interface SocialLink {
		platform: string;
		url: string;
	}

	interface Contact {
		name?: string;
		email?: string | null;
		phone?: string | null;
		address?: string | null;
		social_links?: SocialLink[];
	}

	interface Props {
		data: {
			kicker?: string;
			heading?: string;
			background_color?: 'paper' | 'cream' | 'green-dark';
			_contact?: Contact | null;
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'green-dark');
	const contact = $derived(data._contact ?? null);
	const socials = $derived(contact?.social_links ?? []);
	const hasAny = $derived(
		!!(contact && (contact.email || contact.phone || contact.address || socials.length))
	);
</script>

{#if hasAny}
	<section class="cc cc--{bg}">
		<div class="container">
			<header class="cc__header">
				{#if data.kicker}
					<div class="cc__kicker">— {data.kicker}</div>
				{/if}
				{#if data.heading}
					<h2 class="cc__heading">{data.heading}</h2>
				{/if}
			</header>

			<div class="cc__grid">
				{#if contact?.email}
					<a class="cc__item" href={`mailto:${contact.email}`}>
						<span class="cc__label">Email</span>
						<span class="cc__value">{contact.email}</span>
					</a>
				{/if}
				{#if contact?.phone}
					<a class="cc__item" href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
						<span class="cc__label">Telefon</span>
						<span class="cc__value">{contact.phone}</span>
					</a>
				{/if}
				{#if contact?.address}
					<div class="cc__item">
						<span class="cc__label">Adresă</span>
						<span class="cc__value">{contact.address}</span>
					</div>
				{/if}
			</div>

			{#if socials.length > 0}
				<div class="cc__socials">
					{#each socials as s (s.platform + s.url)}
						<a
							class="cc__social"
							href={s.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={s.platform}
						>
							<SocialIcon platform={s.platform} size={22} />
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	.cc {
		padding-block: var(--space-24);
	}
	.cc--paper { background-color: var(--color-paper); color: var(--color-ink); }
	.cc--cream { background-color: var(--color-cream); color: var(--color-ink); }
	.cc--green-dark { background-color: var(--color-green-dark); color: var(--color-paper); }

	.cc__header {
		margin-bottom: var(--space-10);
	}
	.cc__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.6;
		margin-bottom: var(--space-4);
	}
	.cc__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4.5vw, 4rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		margin: 0;
	}

	.cc__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--space-6);
	}

	.cc__item {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-5);
		border: 1px solid currentColor;
		text-decoration: none;
		color: inherit;
		transition: opacity var(--transition-fast);
	}
	a.cc__item:hover { opacity: 0.75; }

	.cc__label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0.6;
	}
	.cc__value {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		line-height: 1.4;
	}

	.cc__socials {
		display: flex;
		gap: var(--space-4);
		margin-top: var(--space-8);
	}
	.cc__social {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border: 1px solid currentColor;
		color: inherit;
		transition: opacity var(--transition-fast);
	}
	.cc__social:hover { opacity: 0.75; }

	@media (max-width: 767px) {
		.cc { padding-block: var(--space-10); }
	}
</style>
