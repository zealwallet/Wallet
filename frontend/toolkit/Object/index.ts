/**
 * Just a type safe version of keys and values
 */

export const keys = <T extends object>(obj: T): Extract<keyof T, string>[] =>
    Object.keys(obj) as any // eslint-disable-line no-restricted-syntax

export const values = <T extends object>(obj: T): ValueOf<T>[] =>
    Object.values(obj) // eslint-disable-line no-restricted-syntax

export type ValueOf<T extends object> = T[keyof T]

export const mapValues = <
    T extends object,
    Value extends ValueOf<T>,
    Key extends keyof T,
    NewValue
>(
    obj: T,
    mapper: (k: Key, v: Value) => NewValue
): Record<Key, NewValue> => {
    return Object.entries(obj).reduce((result, [key, value]) => {
        result[key as Key] = mapper(key as Key, value as Value)
        return result
    }, {} as Record<Key, NewValue>)
}
