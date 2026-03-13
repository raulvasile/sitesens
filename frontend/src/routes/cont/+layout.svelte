<!-- Guard autentificare — redirect la /auth/login dacă nu e autentificat -->
<!-- TODO: Faza 3 — implementare guard real cu check JWT -->
<script lang="ts">
	import { currentUser } from '$stores/auth';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';

	interface Props { children: Snippet; }
	let { children }: Props = $props();

	$effect(() => {
		// TODO: Faza 3 — decomentează guard-ul când auth e implementat
		// if (!$currentUser) goto('/auth/login?return=/cont');
	});
</script>

<div class="dashboard-layout">
	<nav class="dashboard-nav">
		<div class="container dashboard-nav__inner">
			<a href="/cont" class="dashboard-nav__link">Dashboard</a>
			<a href="/cont/profil" class="dashboard-nav__link">Profil</a>
			<a href="/cont/evenimente" class="dashboard-nav__link">Evenimente</a>
			<a href="/cont/voluntariat" class="dashboard-nav__link">Voluntariat</a>
			<a href="/cont/donatii" class="dashboard-nav__link">Donații</a>
			<a href="/cont/social" class="dashboard-nav__link">Social Feed</a>
		</div>
	</nav>
	<div class="container dashboard-content">
		{@render children()}
	</div>
</div>

<style>
	.dashboard-nav {
		background-color: var(--color-white);
		border-bottom: 1px solid var(--color-border);
		overflow-x: auto;
	}

	.dashboard-nav__inner {
		display: flex;
		gap: var(--space-2);
		padding-block: var(--space-3);
	}

	.dashboard-nav__link {
		white-space: nowrap;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-muted);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.dashboard-nav__link:hover {
		color: var(--color-green-dark);
		background-color: var(--color-bg);
	}

	.dashboard-content { padding-block: var(--space-8); }
</style>
