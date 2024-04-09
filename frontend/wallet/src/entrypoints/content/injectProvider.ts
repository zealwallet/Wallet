import { notReachable } from '@zeal/toolkit'

import { ProviderToZwidget } from '@zeal/domains/Main'
import { parseZwidgetToProvider } from '@zeal/domains/Main/parsers/parseZwidgetContentMsgs'
import { postUserEventOnce } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Provider } from './Provider'

type Params = {
    sendMsgTo: Window
    insertProviderInto: Window
}

declare global {
    interface Window {
        ethereum?: Provider
    }
}

type State = {
    currentProvider: Provider
    alternativeProvider?: Provider
}

type ZwidgetState =
    | { type: 'waiting_for_zwidget'; requestBuffer: ProviderToZwidget[] }
    | { type: 'zwidget_initialised' }

const EIP6963ProviderInfo = {
    uuid: 'ee00e916-4c02-11ee-be56-0242ac120002',
    name: 'Zeal',
    icon: `data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2732%27%20height%3D%2732%27%20viewBox%3D%270%200%2032%2032%27%3E%3Crect%20width%3D%2732%27%20height%3D%2732%27%20rx%3D%2710.3333%27%20fill%3D%27%2300FFFF%27%2F%3E%3Cpath%20d%3D%27M7.44031%2024.5598H24.5597V16.8561H10.8642C8.97323%2016.8561%207.44031%2018.389%207.44031%2020.28V24.5598Z%27%20fill%3D%27%230B1821%27%2F%3E%3Cpath%20d%3D%27M24.5597%207.44043H7.44031V15.1442H21.1358C23.0268%2015.1442%2024.5597%2013.6112%2024.5597%2011.7203V7.44043Z%27%20fill%3D%27%230B1821%27%2F%3E%3C%2Fsvg%3E`,
    rdns: 'app.zeal',
}

type Resolver = {
    resolve: (payload: unknown) => void
    reject: (e: unknown) => void
}

export const injectProvider = ({
    sendMsgTo,
    insertProviderInto,
}: Params): void => {
    const send = (msg: ProviderToZwidget) => {
        sendMsgTo.postMessage(msg)
    }

    let zwidgetState: ZwidgetState = {
        type: 'waiting_for_zwidget',
        requestBuffer: [],
    }

    const cache: Record<number | string, Resolver> = {}

    const state: State = {
        currentProvider: new Provider((msg) => {
            switch (msg.type) {
                case 'rpc_request':
                    cache[msg.request.request.id] = msg.resolver
                    if (state.currentProvider === state.alternativeProvider) {
                        return state.currentProvider
                            .request(msg.request.request)
                            .then(msg.resolver.resolve)
                            .catch(msg.resolver.reject)
                    }
                    switch (zwidgetState.type) {
                        case 'waiting_for_zwidget':
                            zwidgetState.requestBuffer.push(msg.request)
                            break
                        case 'zwidget_initialised':
                            send(msg.request)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(zwidgetState)
                    }

                    break
                /* istanbul ignore next */
                default:
                    notReachable(msg.type)
            }
        }),
        alternativeProvider: insertProviderInto.ethereum,
    }
    const provider = state.currentProvider

    sendMsgTo.addEventListener('message', (event: MessageEvent<unknown>) => {
        const msg = parseZwidgetToProvider(event.data).getSuccessResult()
        if (!msg) {
            return
        }

        switch (zwidgetState.type) {
            case 'waiting_for_zwidget': {
                switch (msg.type) {
                    case 'disconnect':
                    case 'account_change':
                    case 'network_change':
                    case 'rpc_response':
                    case 'select_meta_mask_provider':
                    case 'select_zeal_provider':
                        // TODO :: report
                        // eslint-disable-next-line no-console
                        console.error(
                            `got ${msg.type} msg in ${zwidgetState.type} state`
                        )
                        break
                    case 'ready':
                        switch (msg.state.type) {
                            case 'not_interacted':
                            case 'disconnected':
                                if (state.alternativeProvider) {
                                    send({
                                        type: 'meta_mask_provider_available',
                                    })
                                }

                                zwidgetState.requestBuffer.forEach((msg) => {
                                    send(msg)
                                })

                                zwidgetState = {
                                    type: 'zwidget_initialised',
                                }

                                break

                            case 'connected':
                                state.alternativeProvider &&
                                    send({
                                        type: 'meta_mask_provider_available',
                                    })

                                provider._chainId = msg.state.networkHexId
                                provider._selectedAddress = msg.state.address

                                zwidgetState.requestBuffer.forEach((msg) => {
                                    send(msg)
                                })

                                zwidgetState = {
                                    type: 'zwidget_initialised',
                                }
                                break

                            case 'connected_to_meta_mask':
                                if (state.alternativeProvider) {
                                    state.currentProvider =
                                        state.alternativeProvider

                                    assignEventListeners({
                                        from: provider,
                                        to: state.currentProvider,
                                    })
                                    // ;(state.currentProvider as any)._events = (
                                    //     provider as any
                                    // )._events
                                    provider._selectedAddress = undefined

                                    zwidgetState.requestBuffer.forEach(
                                        (msg) => {
                                            switch (msg.type) {
                                                case 'meta_mask_provider_available':
                                                case 'no_meta_mask_provider_during_init':
                                                case 'cannot_switch_to_meta_mask':
                                                case 'no_meta_mask_when_switching_to_zeal':
                                                    send(msg)
                                                    break
                                                case 'rpc_request':
                                                    const resolver =
                                                        cache[msg.request.id]
                                                    delete cache[msg.request.id]
                                                    if (resolver) {
                                                        state.currentProvider
                                                            .request(
                                                                msg.request
                                                            )
                                                            .then(
                                                                resolver.resolve
                                                            )
                                                            .catch(
                                                                resolver.reject
                                                            )
                                                    } else {
                                                        // eslint-disable-next-line no-console
                                                        console.error(
                                                            'no resolver for msg'
                                                        )
                                                    }
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }
                                    )
                                } else {
                                    send({
                                        type: 'no_meta_mask_provider_during_init',
                                    })
                                    zwidgetState.requestBuffer.forEach(
                                        (msg) => {
                                            send(msg)
                                        }
                                    )
                                }

                                zwidgetState = {
                                    type: 'zwidget_initialised',
                                }

                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.state)
                        }
                        break

                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }
                break
            }

            case 'zwidget_initialised':
                switch (msg.type) {
                    case 'disconnect':
                        provider.selectedAddress = undefined
                        break
                    case 'account_change':
                        provider.selectedAddress = msg.account
                        break
                    case 'network_change':
                        provider.chainId = msg.chainId
                        break
                    case 'rpc_response': {
                        if (state.currentProvider === provider) {
                            const { response, id } = msg
                            const resolver = cache[id]
                            if (!resolver) {
                                // probably request comes from provider from another iframe
                                return
                            }

                            delete cache[id]

                            const { reject, resolve } = resolver

                            switch (response.type) {
                                case 'Success':
                                    resolve(response.data)
                                    break
                                case 'Failure':
                                    // NOTE :: you MUST have property message here or some apps may not work
                                    reject(
                                        response.reason || {
                                            message: 'unknown error',
                                        }
                                    )
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(response)
                            }
                        } else {
                            // TODO :: report
                            // eslint-disable-next-line no-console
                            console.error(
                                `got ${msg.type} msg in with MM provider`
                            )
                        }

                        break
                    }

                    case 'select_meta_mask_provider': {
                        if (state.currentProvider !== provider) {
                            break
                        }
                        const resolver = cache[msg.request.id]
                        delete cache[msg.request.id]

                        if (state.alternativeProvider) {
                            state.currentProvider = state.alternativeProvider

                            assignEventListeners({
                                from: provider,
                                to: state.currentProvider,
                            })

                            const request = state.currentProvider.request(
                                msg.request
                            )

                            // if we use selectedAddress = undefined we will emit disconnect event and app will wait for user input
                            provider._selectedAddress = undefined

                            if (resolver) {
                                request
                                    .then(resolver.resolve)
                                    .catch(resolver.reject)
                            } else {
                                // TODO :: account request should be created here instead of zwidget
                                // If MM in the connected state it will not emit account change event
                                request
                                    .then((addresses) => {
                                        state.currentProvider.emit(
                                            'accountsChanged',
                                            addresses
                                        )
                                    })
                                    .catch((e) => {
                                        // eslint-disable-next-line no-console
                                        console.error(e)
                                    })
                            }
                        } else {
                            if (resolver) {
                                // we need to respond to dApp otherwise dApp will not be able to recover
                                // but zwidget and provider currently in out of zync state (I can reproduce when MM was disabled or deleted after connecting to MM via zeal)
                                // but error we should send to dApp?
                                resolver.reject({
                                    code: 4001,
                                    message: 'User Rejected Request',
                                })
                            }

                            send({
                                type: 'cannot_switch_to_meta_mask',
                            })
                        }
                        break
                    }
                    case 'select_zeal_provider':
                        if (state.currentProvider === provider) {
                            break
                        }
                        assignEventListeners({
                            from: state.currentProvider,
                            to: provider,
                        })

                        state.currentProvider = provider
                        state.currentProvider.selectedAddress = msg.address
                        state.currentProvider.chainId = msg.chainId

                        // lot of dApps didn't accept emitted event on the same tick, dunno why
                        setTimeout(() => {
                            state.currentProvider.emit('accountsChanged', [
                                state.currentProvider.selectedAddress,
                            ])
                            state.currentProvider.emitNetworkChangeEvents(
                                msg.chainId
                            )
                        }, 0)

                        if (!state.alternativeProvider) {
                            send({
                                type: 'no_meta_mask_when_switching_to_zeal',
                            })
                        }

                        break
                    case 'ready':
                        // TODO :: report
                        // eslint-disable-next-line no-console
                        console.error(
                            `got ${msg.type} msg in ${zwidgetState.type} state`
                        )
                        break

                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }

                break
            /* istanbul ignore next */
            default:
                return notReachable(zwidgetState)
        }
    })

    if (insertProviderInto.ethereum) {
        assignEventListeners({
            from: insertProviderInto.ethereum,
            to: state.currentProvider,
        })
    }

    const proxyProvider = new Proxy(state.currentProvider, {
        set(target: any, p: string | symbol, newValue: any): boolean {
            // allow to overwrite values on provider to make wallet guard work
            // this will still have race conditions with switching to MM
            target[p] = newValue
            return true
        },
        get(_, property: keyof Provider) {
            postUserEventOnce({
                type: 'DAppOpenedEvent',
                host: window.location.host,
                installationId: 'content_script',
            })
            return state.currentProvider[property]
        },
    })

    const identifyAsMetaMask = new Proxy(proxyProvider, {
        get(_, property: string) {
            switch (property) {
                case 'isMetaMask':
                    return true

                case '_state':
                    return {
                        initialized: true,
                    }

                case '_metamask':
                    return {
                        isUnlocked: async () => true,
                    }

                default:
                    return proxyProvider[property]
            }
        },
    })

    const identifyAsZeal = new Proxy(proxyProvider, {
        get(_, property: string) {
            return property === 'isZeal' ? true : proxyProvider[property]
        },
    })

    Object.defineProperty(insertProviderInto, 'zeal', {
        value: identifyAsZeal,
        writable: false,
    })

    try {
        Object.defineProperty(insertProviderInto, 'ethereum', {
            configurable: false,

            get() {
                return identifyAsMetaMask
            },
            set(alternativeProvider: Provider) {
                if (provider === alternativeProvider) {
                    return
                }
                state.alternativeProvider = alternativeProvider
                const msg = {
                    type: 'meta_mask_provider_available' as const,
                }
                switch (zwidgetState.type) {
                    case 'zwidget_initialised':
                        send(msg)
                        break
                    case 'waiting_for_zwidget':
                        zwidgetState.requestBuffer.push(msg)
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(zwidgetState)
                }
            },
        })

        Object.defineProperty(insertProviderInto, 'web3', {
            configurable: false,
            get() {
                return {
                    currentProvider: identifyAsMetaMask,
                }
            },
        })
    } catch (e) {
        // user has pocket universe that is installed first
        // then we cannot install so we default to catch block
        // but then R and MM try to install provider and overwrite us because pocket universe try to forward request to lastly installed wallet
        // so wait while every one try to install them self and we should be last in the game
        setTimeout(() => {
            // @ts-ignore
            insertProviderInto.ethereum = provider
        }, 100)
    }

    insertProviderInto.dispatchEvent(new Event('ethereum#initialized'))

    const announceProvider = () => {
        insertProviderInto.dispatchEvent(
            new CustomEvent('eip6963:announceProvider', {
                detail: Object.freeze({
                    info: EIP6963ProviderInfo,
                    provider: identifyAsZeal,
                }),
            })
        )
    }

    insertProviderInto.addEventListener(
        'eip6963:requestProvider',
        announceProvider
    )
    announceProvider()
}

const assignEventListeners = ({
    from,
    to,
}: {
    from: Provider
    to: Provider
}): void => {
    from.eventNames().forEach((e) => {
        from.listeners(e).forEach((lister) => {
            to.on(e, lister)
            from.removeListener(e, lister)
        })
    })
}
