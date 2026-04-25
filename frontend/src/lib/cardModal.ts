import { writable, derived, type Readable } from 'svelte/store';

/**
 * Detail payload for a card opened in the modal.
 * `details` follows the Strapi `blocks` rich text format.
 * `meta` is optional context shown in the modal header (kicker, image).
 */
export interface CardDetail {
	id: number;
	title: string;
	details: unknown[];
	meta?: {
		kicker?: string;
		subtitle?: string;
		image?: { url: string; alt?: string } | null;
	};
}

/** Currently open card. `null` when modal is closed. */
export const activeCard = writable<CardDetail | null>(null);

/**
 * Cards available for opening on the current page, registered by each card
 * block (CardGrid, TeamGrid, ProgramPoints) on mount, deregistered on unmount.
 * Used by CardModal to resolve `?card=<id>` deep-links to a card payload.
 */
const cardsRegistry = writable<Map<number, CardDetail>>(new Map());

export const availableCards: Readable<Map<number, CardDetail>> = derived(
	cardsRegistry,
	($r) => $r
);

export function registerCards(cards: CardDetail[]): () => void {
	cardsRegistry.update((m) => {
		const next = new Map(m);
		for (const c of cards) next.set(c.id, c);
		return next;
	});
	return () => {
		cardsRegistry.update((m) => {
			const next = new Map(m);
			for (const c of cards) next.delete(c.id);
			return next;
		});
	};
}

export function openCard(card: CardDetail): void {
	activeCard.set(card);
}

export function openCardById(id: number): boolean {
	let found: CardDetail | undefined;
	cardsRegistry.subscribe((m) => {
		found = m.get(id);
	})();
	if (found) {
		activeCard.set(found);
		return true;
	}
	return false;
}

export function closeCard(): void {
	activeCard.set(null);
}
