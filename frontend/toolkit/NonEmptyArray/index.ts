export type NonEmptyArray<T> = [T, ...T[]]

export const isNonEmptyArray = <T>(
    array: Array<T>
): array is NonEmptyArray<T> => array.length > 0
