export const randomize = <T>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5)
