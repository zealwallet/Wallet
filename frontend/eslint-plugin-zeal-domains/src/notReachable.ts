// We cannot reuse not reachable from the @zeal/toolkit because this will lead to circular dependencies
export const notReachable = (_: never): never => {
    throw new Error(`should never be reached ${_}`)
}
