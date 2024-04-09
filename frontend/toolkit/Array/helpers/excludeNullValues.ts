export const excludeNullValues = <T>(item: T | null): item is T => item !== null
