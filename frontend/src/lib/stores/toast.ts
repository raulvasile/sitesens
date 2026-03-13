import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

const { subscribe, update } = writable<Toast[]>([]);

function addToast(message: string, type: ToastType, duration = 4000) {
	const id = crypto.randomUUID();
	update((toasts) => [...toasts, { id, message, type, duration }]);

	if (duration > 0) {
		setTimeout(() => removeToast(id), duration);
	}
}

function removeToast(id: string) {
	update((toasts) => toasts.filter((t) => t.id !== id));
}

export const toasts = {
	subscribe,
	success: (message: string, duration?: number) => addToast(message, 'success', duration),
	error: (message: string, duration?: number) => addToast(message, 'error', duration),
	info: (message: string, duration?: number) => addToast(message, 'info', duration),
	warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
	remove: removeToast
};
