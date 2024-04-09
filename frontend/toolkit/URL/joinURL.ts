export const joinURL = (...args: string[]): string =>
    args.join('/').replace(/([^:]\/)\/+/g, '$1')
