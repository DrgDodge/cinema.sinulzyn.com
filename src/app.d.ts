import type PocketBase from 'pocketbase';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			user: PocketBase['authStore']['record'];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};