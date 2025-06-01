export function sortObjectByKeys<T extends Record<string, any>>(obj: T): T {
    const sortedEntries = Object.entries(obj).sort(([a], [b]) => a.localeCompare(b));
    return Object.fromEntries(sortedEntries) as T;
}

export function objectToQueryString(obj: Record<string, any>, prefix = ""): string {
    const pairs: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
        const encodedKey = prefix ? `${prefix}[${encodeURIComponent(key)}]` : encodeURIComponent(key);

        if (value === null || value === undefined) continue;

        if (typeof value === "object" && !Array.isArray(value)) {
            pairs.push(objectToQueryString(value, encodedKey));
        } else if (Array.isArray(value)) {
            for (const item of value) {
                if (item !== null && item !== undefined) {
                    pairs.push(`${encodedKey}[]=${encodeURIComponent(item)}`);
                }
            }
        } else {
            pairs.push(`${encodedKey}=${encodeURIComponent(value)}`);
        }
    }

    return pairs.join("&").replace(/%20/g, "+");
}
