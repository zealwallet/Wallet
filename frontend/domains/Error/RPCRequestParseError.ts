export class RPCRequestParseError extends Error {
    isRPCRequestParseError = true
    type: 'rpc_request_parse_error'
    name: string = 'RPCRequestParseError'
    reason: unknown
    rpcMethod: unknown

    constructor({
        reason,
        rpcMethod,
    }: {
        reason: unknown
        rpcMethod: unknown
    }) {
        super()
        this.reason = reason

        this.rpcMethod = rpcMethod

        this.type = 'rpc_request_parse_error'
    }
}
