/**
 * A type-safe cache that stores values with keys matching a given type structure.
 * @template T - The type defining the cache's structure: keys as property names and values as corresponding types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class CacheStore<T extends Record<string, any>> {
	// Internal storage using Map to maintain key-value pairs
	private store = new Map<keyof T, T[keyof T]>();

	/**
	 * Retrieves a value from the cache by key.
	 * @template K - The specific key type (extends keyof T).
	 * @param key - The key to look up in the cache.
	 * @returns The value associated with the key, or undefined if not found.
	 * @example
	 * // Given T = { name: string, age: number }
	 * cache.get('name'); // Returns string | undefined
	 */
	get<K extends keyof T>(key: K): T[K] | undefined {
		// Type assertion is safe because we only store T[keyof T] values
		return this.store.get(key) as T[K] | undefined;
	}

	/**
	 * Retrieves a value from the cache, throwing an error if the key doesn't exist.
	 * Useful when you expect a key to always be present.
	 * @template K - The specific key type (extends keyof T).
	 * @param key - The key to look up in the cache.
	 * @returns The value associated with the key.
	 * @throws {Error} If the key is not found in the cache.
	 * @example
	 * // Given T = { name: string, age: number }
	 * cache.require('name'); // Returns string, throws if 'name' not found
	 */
	require<K extends keyof T>(key: K): T[K] {
		const value = this.store.get(key);
		if (value === undefined) {
			throw new Error(`Cache key '${String(key)}' is not initialized`);
		}
		return value as T[K];
	}

	/**
	 * Sets a value in the cache for the given key.
	 * @template K - The specific key type (extends keyof T).
	 * @param key - The key to associate with the value.
	 * @param value - The value to store (must match the type T[K]).
	 * @example
	 * // Given T = { name: string, age: number }
	 * cache.set('name', 'Alice'); // OK
	 * cache.set('age', 'thirty'); // Type error: string not assignable to number
	 */
	set<K extends keyof T>(key: K, value: T[K]): void {
		this.store.set(key, value);
	}

	/**
	 * Checks if a key exists in the cache.
	 * @template K - The specific key type (extends keyof T).
	 * @param key - The key to check.
	 * @returns True if the key exists in the cache, false otherwise.
	 * @example
	 * cache.has('name'); // Returns boolean
	 */
	has<K extends keyof T>(key: K): boolean {
		return this.store.has(key);
	}

	/**
	 * Removes a key-value pair from the cache.
	 * @template K - The specific key type (extends keyof T).
	 * @param key - The key to remove.
	 * @returns True if the key existed and was removed, false otherwise.
	 * @example
	 * cache.delete('name'); // Returns boolean
	 */
	delete<K extends keyof T>(key: K): boolean {
		return this.store.delete(key);
	}

	/**
	 * Removes all key-value pairs from the cache.
	 * @example
	 * cache.clear(); // Empties the entire cache
	 */
	clear(): void {
		this.store.clear();
	}
}
