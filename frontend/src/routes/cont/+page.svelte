<!-- TODO: Faza 3 — Dashboard: bun venit, card digital, statistici, carduri navigare -->
<svelte:head>
	<title>Dashboard — SENS</title>
</svelte:head>

<h1>Dashboard Membru</h1>
<p class="text-muted">Bine ai venit! Contul tău SENS.</p>

<div class="dashboard-grid">
	<a href="/cont/evenimente" class="dashboard-card">
		<h3>Evenimente</h3>
		<p>Evenimentele tale înregistrate</p>
	</a>
	<a href="/cont/voluntariat" class="dashboard-card">
		<h3>Voluntariat</h3>
		<p>Ore acumulate și badge-uri</p>
	</a>
	<a href="/cont/donatii" class="dashboard-card">
		<h3>Donațiile mele</h3>
		<p>Istoricul și confirmările</p>
	</a>
	<a href="/cont/social" class="dashboard-card">
		<h3>Social Feed</h3>
		<p>Postările SENS de pe rețele sociale</p>
	</a>
	<a href="/cont/profil" class="dashboard-card">
		<h3>Profil & Card Digital</h3>
		<p>Informațiile tale + card descărcabil</p>
	</a>
</div>

<!-- TODO: Card digital de membru cu QR code -->
<!-- TODO: Statistici rapide: total donat, nr. evenimente, ore voluntariat -->

<style>
	h1 { margin-bottom: var(--space-2); }
	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-4);
		margin-top: var(--space-8);
	}
	.dashboard-card {
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-sm);
		transition: all var(--transition-fast);
		text-decoration: none;
		color: var(--color-text);
	}
	.dashboard-card:hover {
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
		border-color: var(--color-green-leaf);
	}
	.dashboard-card h3 {
		font-size: var(--text-base);
		color: var(--color-green-dark);
		margin-bottom: var(--space-2);
	}
	.dashboard-card p {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
</style>
