import { EventEmitter } from 'eventemitter3'

import { generateRandomNumber } from '@zeal/toolkit/Number'

import { RPCRequestMsg } from '@zeal/domains/Main'
import { postUserEventOnce } from '@zeal/domains/UserEvents/api/postUserEvent'

type RPCResponse =
    | {
          id?: number
          jsonrpc: '2.0'
          method: unknown
          result: unknown
      }
    | {
          id?: number
          jsonrpc: '2.0'
          method: unknown
          error: Error
      }

export type Msg = {
    type: 'rpc_request'
    request: RPCRequestMsg
    resolver: {
        resolve: (data: unknown) => void
        reject: (error: unknown) => void
    }
}

export class Provider<
    Request extends { id: any; method: unknown; params: unknown } = {
        id: any
        method: unknown
        params: unknown
    }
> extends EventEmitter {
    public _selectedAddress?: string
    public _chainId: string = '0x1'
    private _onMsg: (msg: Msg) => void

    isConnected() {
        return true
    }

    enable(...args: any[]) {
        return this.request({ method: 'eth_requestAccounts' } as any)
    }

    get networkVersion() {
        return `${parseInt(this._chainId, 16)}`
    }

    get selectedAddress() {
        return this._selectedAddress
    }

    set selectedAddress(newAddress: string | undefined) {
        if (newAddress !== this._selectedAddress) {
            this._selectedAddress = newAddress

            if (!this._selectedAddress) {
                const e = new Error('User disconnect app')
                this.emit('disconnect', e)
                this.emit('close', e)
                this.emit('accountsChanged', [])
            } else {
                this.emit('accountsChanged', [this._selectedAddress])
            }
        }
    }

    set chainId(newChainId: string) {
        if (newChainId !== this._chainId) {
            this._chainId = newChainId
            this.emitNetworkChangeEvents(this._chainId)
        }
    }

    get chainId() {
        return this._chainId
    }

    network_version() {
        return this.request({ method: 'net_version' } as any)
    }

    public emitNetworkChangeEvents(chainId: string) {
        this.emit('chainChanged', chainId)
        this.emit('networkChanged', `${parseInt(chainId, 16)}`)
    }

    constructor(onMsg: (msg: Msg) => void) {
        super()

        this.isConnected = this.isConnected.bind(this)
        this.enable = this.enable.bind(this)
        this.network_version = this.network_version.bind(this)
        this.sendAsync = this.sendAsync.bind(this)
        this.send = this.send.bind(this)
        this.request = this.request.bind(this)
        this._onMsg = onMsg

        this.emit('_initialized')
    }

    sendAsync(
        payload: Request,
        callback?: (error: Error | undefined, res: RPCResponse) => void
    ): Promise<unknown> {
        return this.request(payload)
            .then((res) => {
                callback &&
                    callback(undefined, {
                        id: payload.id,
                        jsonrpc: '2.0',
                        method: payload.method,
                        result: res,
                    })
                return res
            })
            .catch((e) => {
                callback &&
                    callback(e, {
                        id: payload.id,
                        jsonrpc: '2.0',
                        method: payload.method,
                        error: e,
                    })
                throw e
            })
    }

    // https://docs.metamask.io/guide/ethereum-provider.html#ethereum-send-deprecated
    send(
        methodOrPayload: Request | string,
        paramsOrCallback?:
            | unknown[]
            | ((error: Error | undefined, res: RPCResponse) => void)
    ) {
        if (methodOrPayload === 'eth_accounts') {
            return [this._selectedAddress]
        } else if (
            typeof methodOrPayload === 'string' &&
            (!paramsOrCallback || Array.isArray(paramsOrCallback))
        ) {
            const request = {
                method: methodOrPayload,
                params: paramsOrCallback || [],
            } as Request
            return this.sendAsync(request)
        } else if (
            typeof methodOrPayload === 'object' &&
            paramsOrCallback instanceof Function
        ) {
            return this.sendAsync(methodOrPayload, paramsOrCallback)
        } else {
            throw new Error(`un supported sync call to send ${methodOrPayload}`)
        }
    }

    request(payload: Request): Promise<unknown> {
        const rpcRequestMessage: RPCRequestMsg = {
            type: 'rpc_request',
            request: {
                id: generateRandomNumber(),
                method: payload.method,
                params: payload.params,
            },
        }

        return new Promise<unknown>((resolve, reject) => {
            this._onMsg({
                type: 'rpc_request',
                request: rpcRequestMessage,
                resolver: { resolve, reject },
            })
        }).then((resp) => {
            if (payload.method === 'eth_requestAccounts') {
                postUserEventOnce({
                    type: 'DAppConnectedEvent',
                    host: window.location.host,
                    installationId: 'content_script',
                })
            }
            return resp
        })
    }
}
