<!-- TODO: Faza 1 — Conținut GDPR/Privacy Policy (din Strapi sau static) -->
<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
</script>

<SeoHead
	title="Politica de confidențialitate"
	description="Politica de confidențialitate a Partidului SENS. Informații despre protecția datelor personale."
/>

<div class="container page-content">
	<Breadcrumb items={[{ label: 'Politica de confidențialitate' }]} />
	<h1>Politica de confidențialitate</h1>
	<p class="text-muted">Partidul SENS — CMF nr. 11240065</p>
	<!-- TODO: Conținut complet GDPR conform cerințelor ANSPDCP -->
</div>

<style>
	.page-content { padding-block: var(--space-12); max-width: 800px; }
</style>
