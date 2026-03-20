<!-- TODO: Faza 2 — Pagina donații cu sume predefinite, tip (unică/recurentă), CNP, plată card/transfer, conformitate CMF -->
<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead
	title="Donează"
	description="Susține Partidul SENS cu o donație. Fiecare leu contează."
/>

<div class="container page-header">
	<nav aria-label="Breadcrumb" class="breadcrumb">
		<a href="/">Acasă</a> / <span>Donează</span>
	</nav>
	<h1>Donează pentru SENS</h1>
</div>

<!-- TODO: Butoane sume: 25 / 50 / 100 (default) / 200 RON + câmp custom -->
<!-- TODO: Toggle: Donație unică / Donație lunară -->
<!-- TODO: Formular donator: Nume complet, CNP, Email -->
<!-- TODO: Metodă plată: Card (Netopia/Stripe) / Transfer bancar (afișare IBAN) -->
<!-- TODO: Secțiune "Unde merg banii tăi" -->
<!-- TODO: Disclaimer CMF + număr mandatar financiar 11240065 -->

<style>
	.page-header { padding-block: var(--space-12); }
</style>
