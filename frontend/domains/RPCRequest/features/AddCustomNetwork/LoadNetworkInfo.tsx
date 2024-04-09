import { useEffect } from 'react'

import { CloseCross } from '@zeal/uikit/Icon/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { ChainIdNetwork } from '@zeal/domains/ChainIdNetwork'
import { fetchNetwork } from '@zeal/domains/ChainIdNetwork/helpers/fetchNetwork'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { WalletAddEthereumChain } from '@zeal/domains/RPCRequest'

type Props = {
    request: WalletAddEthereumChain
    account: Account
    dApp: DAppSiteInfo
    network: Network
    keyStore: KeyStore

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_minimize_click' }
    | { type: 'close' }
    | { type: 'chainid_network_loaded'; chainIdNetwork: ChainIdNetwork }

const fetch = async ({
    chainId,
}: {
    chainId: string
}): Promise<{ network: ChainIdNetwork }> => {
    return fetchNetwork(chainId).then((network) => {
        return { network }
    })
}

export const LoadNetworkInfo = ({
    keyStore,
    request,
    account,
    dApp,
    network,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            chainId: request.params[0].chainId,
        },
    })

    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                liveOnMsg.current({
                    type: 'chainid_network_loaded',
                    chainIdNetwork: loadable.data.network,
                })
                break
            default:
                notReachable(loadable)
        }
    }, [liveOnMsg, loadable])

    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    actionBar={
                        <ActionBar
                            keystore={keyStore}
                            network={network}
                            account={account}
                            right={
                                <IconButton
                                    variant="on_light"
                                    onClick={() => {
                                        onMsg({ type: 'on_minimize_click' })
                                    }}
                                >
                                    {({ color }) => (
                                        <CloseCross size={24} color={color} />
                                    )}
                                </IconButton>
                            }
                        />
                    }
                />
            )

        case 'loaded':
            return null

        case 'error':
            const parsed = parseAppError(loadable.error)

            return (
                <>
                    <LoadingLayout
                        actionBar={
                            <ActionBar
                                keystore={keyStore}
                                network={network}
                                account={account}
                                right={
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => {
                                            onMsg({ type: 'on_minimize_click' })
                                        }}
                                    >
                                        {({ color }) => (
                                            <CloseCross
                                                size={24}
                                                color={color}
                                            />
                                        )}
                                    </IconButton>
                                }
                            />
                        }
                    />
                    {/* 
                    The original request to add network was missing required information or was malformed.
                    The actual error here should be one of:
                       - the request to get chains.json failed
                       - parsing the json failed
                       - the network is not in chainid.network           
                    These are the messages to use here (from Martin), if we put a error specific Popup here:
                    title: Failed to Add Network
                    subtitle: The network that you were trying to add wasn't formatted correctly 
                    */}
                    <AppErrorPopup
                        error={parsed}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break
                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        default:
            return notReachable(loadable)
    }
}
