export * as local from './localStorage'
export * as session from './sessionStorage'
export * as secure from './secureStorage'

export const serialize = (storage: object | string | number): string =>
    JSON.stringify(storage, (_, value) => {
        switch (true) {
            case typeof value === 'bigint':
                return value.toString()
            case value instanceof Map:
                return Object.fromEntries(value)
            default:
                return value
        }
    })
