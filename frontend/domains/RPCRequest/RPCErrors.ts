// https://eips.ethereum.org/EIPS/eip-1193#errors
export type ProviderRPCError =
    | UnsupportedRPCMethod
    | UnauthorizedPRCRequest
    | UserRejectedRequest
    | NotSupportedNetwork

export type UnsupportedRPCMethod = {
    message: 'Not supported rpc method'
    code: 4200
}

export const unsupportedRPCMethod = (): UnsupportedRPCMethod => ({
    message: 'Not supported rpc method',
    code: 4200,
})

export type UnauthorizedPRCRequest = {
    code: 4100
    message: 'Un authorized'
}

export const unauthorizedPRCRequest = (): UnauthorizedPRCRequest => ({
    code: 4100,
    message: 'Un authorized',
})

export type UserRejectedRequest = {
    code: 4001
    message: 'User Rejected Request'
}

export const userRejectedRequest = (): UserRejectedRequest => ({
    code: 4001,
    message: 'User Rejected Request',
})

// https://docs.metamask.io/guide/rpc-api.html#unrestricted-methods
export type NotSupportedNetwork = {
    code: 4902
    message: 'Not supported network'
}

export const notSupportedNetwork = (): NotSupportedNetwork => ({
    code: 4902,
    message: 'Not supported network',
})
