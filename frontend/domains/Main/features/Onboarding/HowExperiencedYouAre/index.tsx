import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AccountsMap } from '@zeal/domains/Account'
import { Add } from '@zeal/domains/Account/features/Add'
import { AddFromHardwareWallet } from '@zeal/domains/Account/features/AddFromHardwareWallet'
import { CreateNewSafe4337 } from '@zeal/domains/Account/features/CreateNewSafe4337'
import { CreateNewSafe4337WithStories } from '@zeal/domains/Account/features/CreateNewSafe4337WithStories'
import { TrackWallet } from '@zeal/domains/Account/features/TrackWallet'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { NewToWeb3 } from './NewToWeb3'

import { NextAction } from '../WalletStories'

type Props = {
    accountsMap: AccountsMap
    sessionPassword: string
    networkRPCMap: NetworkRPCMap
    installationId: string

    keyStoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    nextAction: NextAction

    onMsg: (msg: Msg) => void
}

type State =
    | 'used_web3_before'
    | 'new_to_web3'
    | 'add_wallet'
    | 'hardware_wallet'
    | 'safe_wallet'

type Msg =
    | MsgOf<typeof AddFromHardwareWallet>
    | MsgOf<typeof CreateNewSafe4337WithStories>
    | MsgOf<typeof CreateNewSafe4337>
    | MsgOf<typeof Add>
    | MsgOf<typeof TrackWallet>
    | MsgOf<typeof NewToWeb3>

export const HowExperiencedYouAre = ({
    onMsg,
    accountsMap,
    sessionPassword,
    installationId,
    networkRPCMap,
    currencyHiddenMap,
    customCurrencies,
    nextAction,
    keyStoreMap,
    networkMap,
}: Props) => {
    const state: State = (() => {
        switch (nextAction.type) {
            case 'add_wallet_clicked':
                return 'add_wallet'
            case 'safe_wallet_clicked':
                return 'safe_wallet'
            case 'hardware_wallet_clicked':
                return 'hardware_wallet'
            case 'on_new_to_web3_click':
            case 'create_clicked':
                return 'new_to_web3'
            case 'on_used_web3_before_click':
            case 'track_wallet_clicked':
                return 'used_web3_before'
            /* istanbul ignore next */
            default:
                return notReachable(nextAction)
        }
    })()

    switch (state) {
        case 'hardware_wallet':
            return (
                <AddFromHardwareWallet
                    accounts={accountsMap}
                    keystoreMap={keyStoreMap}
                    sessionPassword={sessionPassword}
                    customCurrencies={customCurrencies}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    currencyHiddenMap={currencyHiddenMap}
                    closable={true}
                    onMsg={onMsg}
                />
            )

        case 'safe_wallet':
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return (
                        <CreateNewSafe4337
                            accountsMap={accountsMap}
                            networkRPCMap={networkRPCMap}
                            sessionPassword={sessionPassword}
                            onMsg={onMsg}
                        />
                    )
                case 'web':
                    return (
                        <CreateNewSafe4337WithStories
                            accountsMap={accountsMap}
                            networkRPCMap={networkRPCMap}
                            sessionPassword={sessionPassword}
                            installationId={installationId}
                            onMsg={onMsg}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        case 'add_wallet':
            return (
                <Add
                    accountsMap={accountsMap}
                    sessionPassword={sessionPassword}
                    keystoreMap={keyStoreMap}
                    customCurrencies={customCurrencies}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    currencyHiddenMap={currencyHiddenMap}
                    onMsg={onMsg}
                />
            )

        case 'used_web3_before':
            return (
                <TrackWallet
                    installationId={installationId}
                    currencyHiddenMap={currencyHiddenMap}
                    customCurrencies={customCurrencies}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    variant="track_or_create"
                    accountsMap={accountsMap}
                    onMsg={onMsg}
                />
            )

        case 'new_to_web3':
            return (
                <NewToWeb3
                    installationId={installationId}
                    accountsMap={accountsMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
