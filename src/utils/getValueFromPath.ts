// src/utils/getValueFromPath.ts

/**
 * Safely retrieves a nested value from an object using dot notation.
 * 
 * @param obj - The object to retrieve the value from.
 * @param path - Dot-delimited string representing the path to the property.
 * @returns The value at the specified path, or undefined if it doesn't exist.
 */
export function getValueFromPath(
    obj: Record<string, any>,
    path: string
): any {
    return path
        .split('.')
        .reduce((acc, part) => (acc !== undefined ? acc[part] : undefined), obj);
}
