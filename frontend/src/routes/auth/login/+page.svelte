<!-- TODO: Faza 3 — Formular login: email+parolă + OAuth Google/Facebook + Magic Link -->
<svelte:head>
	<title>Autentificare — SENS</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<img src="/logo-sens.svg" alt="SENS" class="auth-logo" width="80" height="32" />
		<h1 class="auth-title">Bine ai revenit</h1>
		<p class="text-muted auth-subtitle">Conectează-te la contul tău SENS</p>

		<!-- TODO: Form: email, parolă, forgot password link -->
		<!-- TODO: Separator "sau" -->
		<!-- TODO: Butoane OAuth: Google, Facebook -->
		<!-- TODO: Link "Nu ai cont? Înscrie-te" -->

		<p class="auth-placeholder text-muted">Autentificarea va fi implementată în Faza 3.</p>
		<a href="/" class="btn btn-secondary">Înapoi la pagina principală</a>
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
