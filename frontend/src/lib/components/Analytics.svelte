<script lang="ts">
	import { onMount } from 'svelte';

	const gtmId = import.meta.env.VITE_GTM_ID || '';

	onMount(() => {
		if (!gtmId || typeof window === 'undefined') return;

		// Initialize dataLayer
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

		// Load GTM script
		const script = document.createElement('script');
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
		document.head.appendChild(script);
	});
</script>
