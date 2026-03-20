<!-- TODO: Faza 3 — Înregistrare cont simpatizant simplu (email + parolă) -->
<svelte:head>
	<title>Creare cont — SENS</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<img src="/logo.png" alt="SENS" class="auth-logo" height="32" />
		<h1 class="auth-title">Creează cont</h1>
		<p class="text-muted auth-subtitle">Înregistrează-te ca simpatizant SENS</p>

		<!-- TODO: Form: email, parolă, confirmare parolă -->
		<!-- TODO: Sau OAuth Google/Facebook -->
		<!-- TODO: Notă: pentru a deveni Membru, completează formularul /inscrie-te -->

		<p class="auth-placeholder text-muted">Înregistrarea va fi implementată în Faza 3.</p>
		<a href="/auth/login" class="btn btn-secondary">Am deja cont</a>
	</div>
</div>

<style>
	.auth-page {
		min-height: calc(100dvh - var(--navbar-height));
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-8) var(--space-4);
	}

	.auth-card {
		background-color: var(--color-white);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		padding: var(--space-8);
		width: 100%;
		max-width: 400px;
		text-align: center;
	}

	.auth-logo { margin: 0 auto var(--space-6); }
	.auth-title { font-size: var(--text-2xl); margin-bottom: var(--space-2); }
	.auth-subtitle { margin-bottom: var(--space-6); }
	.auth-placeholder { margin-block: var(--space-6); font-size: var(--text-sm); }
</style>
