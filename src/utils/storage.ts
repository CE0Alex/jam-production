/**
 * Enhanced localStorage utility with error handling and expiration support
 */

interface StorageOptions {
  expires?: number; // Time in milliseconds until expiration
}

interface StorageItem<T> {
  value: T;
  expires?: number; // Timestamp when the item expires
}

/**
 * Set an item in localStorage with optional expiration
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  options: StorageOptions = {},
): boolean {
  try {
    const item: StorageItem<T> = { value };

    // Add expiration if specified
    if (options.expires) {
      item.expires = Date.now() + options.expires;
    }

    localStorage.setItem(key, JSON.stringify(item));

    // Dispatch storage event for cross-tab communication
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(item),
        storageArea: localStorage,
      }),
    );

    return true;
  } catch (error) {
    console.error(`Error setting localStorage item '${key}':`, error);
    return false;
  }
}

/**
 * Get an item from localStorage, respecting expiration
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item: StorageItem<T> = JSON.parse(itemStr);

    // Check if item has expired
    if (item.expires && Date.now() > item.expires) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error(`Error getting localStorage item '${key}':`, error);
    return null;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item '${key}':`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
