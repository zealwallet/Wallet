import { transformTypedData } from '@trezor/connect-plugin-ethereum'
import {
    EthereumTransaction,
    EthereumTransactionEIP1559,
    TrezorConnect as TrezorConnectPackage,
} from '@trezor/connect-web'
import { Buffer } from 'buffer'

import { notReachable } from '@zeal/toolkit'
import { failure, success } from '@zeal/toolkit/Result'

import { parseTrezorConnectionAlreadyInitialized } from '@zeal/domains/Error/domains/Trezor/parsers/parseTrezorError'
import { TERZOR_INIT_CONFIG } from '@zeal/domains/KeyStore/constants'
import { parseChromeRuntimeMessageRequestMsgs } from '@zeal/domains/Main/parsers/parseChromeRuntimeMessageRequestMsgs'

globalThis.Buffer = Buffer

declare const importScripts: (path: string) => void
declare const TrezorConnect: TrezorConnectPackage

const initTrezor = async () => {
    try {
        await TrezorConnect.init(TERZOR_INIT_CONFIG)
    } catch (e) {
        const alreadyInitError = parseTrezorConnectionAlreadyInitialized(e)

        if (!alreadyInitError) {
            throw e
        }
    }
}

importScripts('vendor/trezor-web-extension-service-worker-script.min.js')

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        const url = chrome.runtime.getURL(
            'page_entrypoint.html?type=onboarding'
        )
        chrome.tabs.create({ url })
    }
})

chrome.runtime.onMessage.addListener(
    (message, _, sendResponse: (data: unknown) => void) => {
        const parseResult = parseChromeRuntimeMessageRequestMsgs(message)

        switch (parseResult.type) {
            case 'Failure':
                return false

            case 'Success': {
                ;(async () => {
                    await initTrezor()

                    switch (parseResult.data.type) {
                        case 'to_service_worker_trezor_connect_get_public_key': {
                            try {
                                const result = await TrezorConnect.getPublicKey(
                                    {
                                        coin: parseResult.data.coin,
                                        path: parseResult.data.path,
                                    }
                                )

                                if (!result.success) {
                                    throw result.payload
                                }

                                sendResponse(success(result.payload.xpub))
                            } catch (error) {
                                sendResponse(failure(error))
                            }
                            break
                        }

                        case 'to_service_worker_trezor_connect_sign_transaction': {
                            try {
                                const result =
                                    await TrezorConnect.ethereumSignTransaction(
                                        {
                                            transaction: parseResult.data
                                                .transaction as
                                                | EthereumTransaction
                                                | EthereumTransactionEIP1559,
                                            path: parseResult.data.path,
                                        }
                                    )

                                if (!result.success) {
                                    throw result.payload
                                }
                                sendResponse(success(result.payload))
                            } catch (error) {
                                sendResponse(failure(error))
                            }
                            break
                        }

                        case 'to_service_worker_trezor_connect_sign_message': {
                            try {
                                const result =
                                    await TrezorConnect.ethereumSignMessage({
                                        path: parseResult.data.path,
                                        message: parseResult.data.message,
                                        hex: true,
                                    })

                                if (!result.success) {
                                    throw result.payload
                                }

                                sendResponse(
                                    success(`0x${result.payload.signature}`)
                                )
                            } catch (error) {
                                sendResponse(failure(error))
                            }
                            break
                        }

                        case 'to_service_worker_trezor_connect_sign_typed_data': {
                            try {
                                const typedData = parseResult.data
                                    .typedData as Parameters<
                                    typeof TrezorConnect.ethereumSignTypedData
                                >[0]['data']

                                const { domain_separator_hash, message_hash } =
                                    transformTypedData(
                                        {
                                            ...typedData,
                                            domain: {
                                                ...typedData.domain,
                                                chainId: typedData.domain
                                                    .chainId
                                                    ? Number(
                                                          typedData.domain
                                                              .chainId
                                                      )
                                                    : undefined,
                                            },
                                        },
                                        true
                                    )

                                const result =
                                    await TrezorConnect.ethereumSignTypedData({
                                        path: parseResult.data.path,
                                        data: typedData,
                                        metamask_v4_compat: true,

                                        // Required for Trezor One to work
                                        domain_separator_hash,
                                        message_hash: message_hash || undefined,
                                    })

                                if (!result.success) {
                                    throw result.payload
                                }

                                sendResponse(success(result.payload.signature))
                            } catch (error) {
                                sendResponse(failure(error))
                            }
                            break
                        }

                        case 'extension_to_zwidget_extension_address_change':
                        case 'extension_to_zwidget_query_zwidget_connection_state_and_network':
                        case 'extension_to_zwidget_expand_zwidget':
                            // not handled here
                            break

                        default:
                            notReachable(parseResult.data)
                    }
                })()

                return true
            }

            default:
                return notReachable(parseResult)
        }
    }
)
