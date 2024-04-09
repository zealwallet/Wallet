export const delay = (delayMs: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, delayMs))

export const withDelay =
    <P extends unknown[], R>(fn: (...args: P) => Promise<R>, delayMs: number) =>
    (...args: P): Promise<R> =>
        Promise.all([delay(delayMs), fn(...args)]).then(([_, b]) => b)
