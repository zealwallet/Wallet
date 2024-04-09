export const notReachable = (_: never): never => {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(_))
    throw new Error(`should never be reached ${_}`)
}
