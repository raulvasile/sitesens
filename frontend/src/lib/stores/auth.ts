import { writable } from 'svelte/store';

export interface StrapiUser {
	id: number;
	username: string;
	email: string;
	confirmed: boolean;
	blocked: boolean;
	role?: {
		id: number;
		name: string;
		type: string;
	};
	memberProfile?: {
		membership_type: 'simpatizant' | 'membru' | 'moderator';
		card_number: string;
		filial: string;
		joined_date: string;
		status: 'pending' | 'active' | 'suspended';
	};
}

export const currentUser = writable<StrapiUser | null>(null);
export const authToken = writable<string | null>(null);

export function isAuthenticated(user: StrapiUser | null): boolean {
	return user !== null;
}

export function isMember(user: StrapiUser | null): boolean {
	return user?.memberProfile?.membership_type === 'membru' &&
		user?.memberProfile?.status === 'active';
}
