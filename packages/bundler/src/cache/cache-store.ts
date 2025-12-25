/**
 * A type-safe, generic cache store that enforces structural integrity based on a provided interface.
 * * * This class provides a wrapper around the native `Map` API, ensuring that keys and values
 * are strictly typed according to the shape of {@link T}.
 * * @template T - An object-like type where keys represent the cache keys and values represent
 * the corresponding data types.
 * * @example
 * ```ts
 * interface AppCache {
 * port: number;
 * isReady: boolean;
 * config: { debug: boolean };
 * }
 * * const cache = new CacheStore<AppCache>();
 * cache.set('port', 3000); // Type-safe
 * // cache.set('port', '3000'); // Static type error
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class CacheStore<T extends Record<string, any>> {
	/**
	 * Internal storage mechanism.
	 * @internal
	 */
	private store = new Map<keyof T, T[keyof T]>();

	/**
	 * Retrieves a value from the cache associated with the specified key.
	 * * @template K - A specific property key within type {@link T}.
	 * @param key - The identifier to look up.
	 * @returns The stored value of type `T[K]`, or `undefined` if the key does not exist.
	 * * @remarks
	 * If you require a guarantee that the value exists (and want to avoid manual `undefined` checks),
	 * consider using {@link require} instead.
	 */
	get<K extends keyof T>(key: K): T[K] | undefined {
		return this.store.get(key) as T[K] | undefined;
	}

	/**
	 * Retrieves a value from the cache, throwing a runtime error if the key is missing.
	 * * * Use this method when a key is expected to be initialized during a bootstrap phase
	 * and its absence indicates a critical logic error.
	 * * @template K - A specific property key within type {@link T}.
	 * @param key - The identifier to look up.
	 * @returns The strictly-typed value associated with the key.
	 * * @throws {Error} If the key has not been set in the store.
	 */
	require<K extends keyof T>(key: K): T[K] {
		const value = this.store.get(key);
		if (value === undefined) {
			throw new Error(
				`[CacheStore]: Accessing uninitialized key '${String(key)}'. Ensure it is set before calling require().`
			);
		}
		return value as T[K];
	}

	/**
	 * Inserts or updates a value in the cache.
	 * * @template K - A specific property key within type {@link T}.
	 * @param key - The identifier to associate the value with.
	 * @param value - The data to store, matching the type defined in {@link T} for this key.
	 */
	set<K extends keyof T>(key: K, value: T[K]): void {
		this.store.set(key, value);
	}

	/**
	 * Determines whether a specific key exists in the store.
	 * * @param key - The identifier to check.
	 * @returns `true` if the key is present; otherwise `false`.
	 */
	has<K extends keyof T>(key: K): boolean {
		return this.store.has(key);
	}

	/**
	 * Removes the specified key and its associated value from the cache.
	 * * @param key - The identifier to remove.
	 * @returns `true` if an element in the CacheStore existed and has been removed,
	 * or `false` if the element does not exist.
	 */
	delete<K extends keyof T>(key: K): boolean {
		return this.store.delete(key);
	}

	/**
	 * Clears all entries from the cache store, resetting it to an empty state.
	 */
	clear(): void {
		this.store.clear();
	}
}
