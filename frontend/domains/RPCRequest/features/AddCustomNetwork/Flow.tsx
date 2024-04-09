import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { ChainIdNetwork } from '@zeal/domains/ChainIdNetwork'
import { initCustomCurrency } from '@zeal/domains/Currency/helpers/initCustomCurrency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CustomNetwork, Network } from '@zeal/domains/Network'
import { KNOWN_NETWORKS_MAP } from '@zeal/domains/Network/constants'
import { WalletAddEthereumChain } from '@zeal/domains/RPCRequest'

import { Layout } from './Layout'
import { LoadNetworkInfo } from './LoadNetworkInfo'

type Props = {
    request: WalletAddEthereumChain
    account: Account
    dApp: DAppSiteInfo
    network: Network
    keyStore: KeyStore

    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof Layout>
    | Extract<
          MsgOf<typeof LoadNetworkInfo>,
          { type: 'on_minimize_click' | 'close' }
      >

type State =
    | {
          type: 'request_incomplete'
      }
    | {
          type: 'network'
          network: CustomNetwork
      }

export const Flow = ({
    keyStore,
    request,
    account,
    dApp,
    network,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(customNetworkFromRequest(request))

    switch (state.type) {
        case 'request_incomplete':
            return (
                <LoadNetworkInfo
                    keyStore={keyStore}
                    request={request}
                    account={account}
                    dApp={dApp}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_minimize_click':
                            case 'close':
                                onMsg(msg)
                                break
                            case 'chainid_network_loaded':
                                setState({
                                    type: 'network',
                                    network:
                                        customNetworkFromRequestAndLoadedData(
                                            request,
                                            msg.chainIdNetwork
                                        ),
                                })
                                break
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'network':
            return (
                <Layout
                    keyStore={keyStore}
                    customNetwork={state.network}
                    account={account}
                    dApp={dApp}
                    network={network}
                    onMsg={onMsg}
                />
            )
        default:
            return notReachable(state)
    }
}

const customNetworkFromRequest = (
    request: WalletAddEthereumChain
):
    | { type: 'request_incomplete' }
    | { type: 'network'; network: CustomNetwork } => {
    const requestData = request.params[0]

    if (
        !requestData.chainName ||
        !requestData.nativeCurrency ||
        requestData.rpcUrls.length === 0
    ) {
        return {
            type: 'request_incomplete',
        }
    }

    const chainId = requestData.chainId

    const rpcUrl = requestData.rpcUrls[0]

    const address = parseAddress(
        '0x0000000000000000000000000000000000000000'
    ).getSuccessResultOrThrow('parse const address')

    return {
        type: 'network',
        network: {
            type: 'custom',
            hexChainId: chainId,
            blockExplorerUrl:
                requestData.blockExplorerUrls.length === 0
                    ? null
                    : requestData.blockExplorerUrls[0],
            defaultRpcUrl: rpcUrl,
            rpcUrl,
            isSimulationSupported: false,
            isZealRPCSupported: false,
            isSafeSupported: false,
            name: requestData.chainName,
            nativeCurrency: initCustomCurrency({
                address,
                id: [requestData.chainName, address].join('|'),
                fraction: requestData.nativeCurrency.decimals,
                icon:
                    iconUrlFromKnownNetworks(chainId) ||
                    requestData.iconUrls?.at(0) ||
                    null,
                networkHexChainId: chainId,
                symbol: requestData.nativeCurrency.symbol,
            }),
            trxType: 'legacy',
        },
    }
}

const customNetworkFromRequestAndLoadedData = (
    request: WalletAddEthereumChain,
    network: ChainIdNetwork
): CustomNetwork => {
    const requestData = request.params[0]

    const chainId = requestData.chainId
    const rpcUrl =
        requestData.rpcUrls.length > 0
            ? requestData.rpcUrls[0]
            : network.rpcUrls[0]

    const address = parseAddress(
        '0x0000000000000000000000000000000000000000'
    ).getSuccessResultOrThrow('parse const address')

    return {
        type: 'custom',
        hexChainId: chainId,
        blockExplorerUrl:
            requestData.blockExplorerUrls.length === 0
                ? null
                : requestData.blockExplorerUrls[0],
        defaultRpcUrl: rpcUrl,
        rpcUrl,
        isSimulationSupported: false,
        isZealRPCSupported: false,
        isSafeSupported: false,
        name: requestData.chainName || network.name,
        nativeCurrency: initCustomCurrency({
            address,
            id: [requestData.chainName, address].join('|'),
            fraction:
                requestData.nativeCurrency?.decimals ||
                network.nativeCurrency.decimals,
            icon:
                iconUrlFromKnownNetworks(chainId) ||
                requestData.iconUrls?.at(0) ||
                null,
            networkHexChainId: chainId,
            symbol:
                requestData.nativeCurrency?.symbol ||
                network.nativeCurrency.symbol,
        }),
        trxType: 'legacy',
    }
}

const iconUrlFromKnownNetworks = (chainId: string): string | null => {
    const chain = KNOWN_NETWORKS_MAP[chainId]

    if (!chain || !chain.icon) {
        return null
    }

    return `/chain-icons/${chain.icon}.png`
}
