export class ImperativeError extends Error {
    isImperativeError = true
    type: 'imperative_error'
    name = 'ImperativeError'
    extra: Record<string, unknown>

    constructor(message: string, extra?: Record<string, unknown>) {
        super(message)
        this.type = 'imperative_error'
        this.extra = extra || {}
    }
}
