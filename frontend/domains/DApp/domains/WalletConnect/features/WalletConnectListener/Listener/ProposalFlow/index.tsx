import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import {
    WalletConnectConnectionRequest,
    WalletConnectInstance,
} from '@zeal/domains/DApp/domains/WalletConnect'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkHexId, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { fetchConnectionSafetychecks } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Form } from './Form'

type Props = {
    selectedAccount: Account
    proposal: WalletConnectConnectionRequest
    walletConnectInstance: WalletConnectInstance
    accountsMap: AccountsMap

    portflioMap: PortfolioMap
    installationId: string
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_wallet_connect_connected' }
    | { type: 'on_wallet_connect_rejected' }
    | { type: 'on_wallet_connect_action_error_cancel_clicked' }
    | Extract<
          MsgOf<typeof Form>,
          {
              type:
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
                  | 'safe_wallet_clicked'
                  | 'track_wallet_clicked'
          }
      >

const fetch = async ({
    actionType,
    proposal,
    walletConnectInstance,
    account,
}: {
    account: Account
    actionType: 'reject' | 'approve'
    walletConnectInstance: WalletConnectInstance
    proposal: WalletConnectConnectionRequest
}): Promise<void> => {
    switch (actionType) {
        case 'reject':
            return walletConnectInstance.rejectSession({
                id: proposal.id,
                reason: {
                    code: 4001,
                    message: 'User rejected session',
                },
            })

        case 'approve':
            const hexIds = Array.from(
                new Set<NetworkHexId>([
                    ...proposal.optionalNetworkHexIds,
                    ...proposal.requiredNetworkHexIds,
                ])
            )

            const eip155ChainIds = hexIds.map(
                (hexId) => `eip155:${BigInt(hexId)}` as const
            )

            const accountNamespace = eip155ChainIds.map(
                (chain) => `${chain}:${account.address}` as const
            )

            await walletConnectInstance.approveSession({
                id: proposal.id,
                namespaces: {
                    eip155: {
                        chains: eip155ChainIds,
                        accounts: accountNamespace,
                        methods: [
                            'eth_sendTransaction',
                            'personal_sign',
                            'eth_signTypedData',
                            'eth_signTypedData_v4',
                            'eth_sign',
                        ],
                        events: ['chainChanged', 'accountsChanged'],
                    },
                },
            })
            return

        default:
            return notReachable(actionType)
    }
}

export const ProposalFlow = ({
    accountsMap,
    proposal,
    walletConnectInstance,
    selectedAccount,
    currencyHiddenMap,
    customCurrencyMap,
    installationId,
    keystoreMap,
    networkMap,
    networkRPCMap,
    sessionPassword,
    portflioMap,
    onMsg,
}: Props) => {
    const liveOnMsg = useLiveRef(onMsg)
    const [loadable, setLoadable] = useLazyLoadableData(fetch)

    const [safetyChecksLoadable] = useLoadableData(
        fetchConnectionSafetychecks,
        { type: 'loading', params: proposal.dAppInfo }
    )

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
                switch (loadable.params.actionType) {
                    case 'reject':
                        liveOnMsg.current({
                            type: 'on_wallet_connect_rejected',
                        })
                        break

                    case 'approve':
                        break

                    default:
                        notReachable(loadable.params.actionType)
                }
                break

            case 'not_asked':
            case 'loading':
            case 'error':
                break

            default:
                notReachable(loadable)
        }
    }, [loadable, liveOnMsg])

    useEffect(() => {
        postUserEvent({
            type: 'ConnectionRequestedEvent',
            installationId,
        })
    }, [installationId])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Form
                    accountsMap={accountsMap}
                    customCurrencyMap={customCurrencyMap}
                    installationId={installationId}
                    keystoreMap={keystoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portflioMap={portflioMap}
                    sessionPassword={sessionPassword}
                    currencyHiddenMap={currencyHiddenMap}
                    proposal={proposal}
                    safetyChecksLoadable={safetyChecksLoadable}
                    selectedAccount={selectedAccount}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_reject':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        actionType: 'reject',
                                        account: msg.account,
                                        walletConnectInstance,
                                        proposal,
                                    },
                                })
                                break

                            case 'on_approve':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        actionType: 'approve',
                                        account: msg.account,
                                        walletConnectInstance,
                                        proposal,
                                    },
                                })
                                break

                            case 'add_wallet_clicked':
                            case 'hardware_wallet_clicked':
                            case 'on_account_create_request':
                            case 'safe_wallet_clicked':
                            case 'track_wallet_clicked':
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'loading':
            return (
                <LoadingLayout
                    onClose={null}
                    actionBar={
                        <ActionBar
                            left={
                                <Text
                                    variant="title3"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    <FormattedMessage
                                        id="wallet_connect.connect.title"
                                        defaultMessage="Connect"
                                    />
                                </Text>
                            }
                        />
                    }
                />
            )

        case 'loaded':
            switch (loadable.params.actionType) {
                case 'reject':
                    return null
                case 'approve':
                    return (
                        <SuccessLayout
                            title={
                                <FormattedMessage
                                    id="wallet_connect.connected.title"
                                    defaultMessage="Connected"
                                />
                            }
                            onAnimationComplete={() =>
                                onMsg({ type: 'on_wallet_connect_connected' })
                            }
                        />
                    )

                default:
                    return notReachable(loadable.params.actionType)
            }

        case 'error':
            return (
                <>
                    <LoadingLayout
                        onClose={null}
                        actionBar={
                            <ActionBar
                                left={
                                    <Text
                                        variant="title3"
                                        weight="medium"
                                        color="textPrimary"
                                    >
                                        <FormattedMessage
                                            id="wallet_connect.connect.title"
                                            defaultMessage="Connect"
                                        />
                                    </Text>
                                }
                            />
                        }
                    />
                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg({
                                        type: 'on_wallet_connect_action_error_cancel_clicked',
                                    })
                                    break

                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        default:
            return notReachable(loadable)
    }
}
