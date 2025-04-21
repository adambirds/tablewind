// src/utils/getValueFromPath.ts

/**
 * Safely retrieves a nested value from an object using dot notation.
 *
 * @param obj - The object to retrieve the value from.
 * @param path - Dot-delimited string representing the path to the property.
 * @returns The value at the specified path, or undefined if it doesn't exist.
 */
export function getValueFromPath<T = unknown>(
    obj: unknown,
    path: string
  ): T | undefined {
    if (typeof obj !== 'object' || obj === null) return undefined;
  
    return path
      .split('.')
      .reduce((acc: unknown, part: string) => {
        if (typeof acc === 'object' && acc !== null && part in acc) {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, obj) as T | undefined;
  }
  