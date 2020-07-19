declare module "svelte" {
	type Unsubscribe = () => void;

	export function getContext<T>(key: any): T | undefined;
	export function setContext<T>(key: any, value: T): void;
	export function onMount(callback: () => Unsubscribe | void): void;
}

declare module "svelte/store" {
	type Next<T> = (value: T) => void;
	type Unsubscribe = () => void;
	type Start<T> = (set: Next<T>) => Unsubscribe | void;

	interface ReadableStore<T> {
		subscribe(subscription: Next<T>): Unsubscribe;
	}

	export function readable<T>(initial: T, start: Start<T>): ReadableStore<T>;
}
