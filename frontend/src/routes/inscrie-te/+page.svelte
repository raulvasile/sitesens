<!-- TODO: Faza 2 — Formular multi-step (5 pași): Date personale, Adresă, Motivație, Consimțământ, Confirmare -->
<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead
	title="Înscrie-te în SENS"
	description="Alătură-te Partidului SENS. Completează formularul de înscriere."
/>

<div class="container page-header">
	<nav aria-label="Breadcrumb" class="breadcrumb">
		<a href="/">Acasă</a> / <span>Înscrie-te</span>
	</nav>
	<h1>Înscrie-te în SENS</h1>
	<p class="text-muted">Completează formularul de mai jos pentru a iniția procesul de aderare.</p>
</div>

<!-- TODO: Progress stepper (5 pași) -->
<!-- TODO: Step 1: Prenume, Nume, Email, Telefon, Data nașterii -->
<!-- TODO: Step 2: Județ, Localitate, Adresă completă -->
<!-- TODO: Step 3: Textarea motivație + checkboxuri interese -->
<!-- TODO: Step 4: Consimțăminte GDPR (3 obligatorii + 1 opțional) -->
<!-- TODO: Step 5: Confirmare + pași următori -->

<style>
	.page-header { padding-block: var(--space-12); }
	.page-header p { margin-top: var(--space-3); }
</style>
