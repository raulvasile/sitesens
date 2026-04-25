import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// Bind to 0.0.0.0 so the dev server is reachable from other devices on the
		// same Wi-Fi (phone, tablet). Vite prints the LAN URL in the console.
		host: true,
	},
});
