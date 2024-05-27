import { useEffect } from 'react'

import Messaging from '@react-native-firebase/messaging' // FIXME @resetko-zeal move to domain and there will be platform abstraction

import { noop, notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { keys } from '@zeal/toolkit/Object'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AccountsMap } from '@zeal/domains/Account'
import { CardConfig } from '@zeal/domains/Card'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'
import { fetchWalletConnectInstance } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { WalletConnectListener } from '@zeal/domains/DApp/domains/WalletConnect/features/WalletConnectListener'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Mode } from '@zeal/domains/Main'
import { Manifest } from '@zeal/domains/Manifest'
import { NetworkMap } from '@zeal/domains/Network'
import { fetchNotificationPermissions } from '@zeal/domains/Notification/api/fetchNotificationPermissions'
import { registerPushNotifications } from '@zeal/domains/Notification/api/registerPushNotifications'
import { CustomCurrencyMap, Storage } from '@zeal/domains/Storage'

import { PortfolioLoader } from './PortfolioLoader'

type Props = {
    manifest: Manifest
    mode: Mode
    storage: Storage
    sessionPassword: string
    selectedAddress: string
    customCurrencies: CustomCurrencyMap

    installationId: string

    connections: ConnectionMap
    networkMap: NetworkMap

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    cardConfig: CardConfig
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof PortfolioLoader> | MsgOf<typeof WalletConnectListener>

const subscribeForNotifications = async ({
    accountsMap,
    keyStoreMap,
}: {
    keyStoreMap: KeyStoreMap
    accountsMap: AccountsMap
}): Promise<void> => {
    // FIXME @resetko-zeal implement
    throw new Error(
        `Not implemented check if we are on mobile,
        and if we have permissions ${fetchNotificationPermissions}, then take all
        addresses ${accountsMap} with signing keystore ${keys(keyStoreMap)},
        take firebase token and send it to the backend ${registerPushNotifications}`
    )
}

// Naming is so hard so we can't really find a name for this global experimental area, so it's gonna be Area51
export const AreaFiftyOne = ({
    connections,
    currencyHiddenMap,
    currencyPinMap,
    customCurrencies,
    installationId,
    manifest,
    mode,
    networkMap,
    onMsg,
    selectedAddress,
    sessionPassword,
    storage,
    cardConfig,
}: Props) => {
    const [walletConnectInstanceLoadable] = useLoadableData(
        fetchWalletConnectInstance,
        {
            type: 'loading',
            params: undefined,
        }
    )

    const [notificationsLoadable, setNotificationsLoadable] = useLoadableData(
        subscribeForNotifications,
        {
            type: 'loading',
            params: {
                accountsMap: storage.accounts,
                keyStoreMap: storage.keystoreMap,
            },
        }
    )

    useEffect(() => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'android':
                const unsubscribe = Messaging().onTokenRefresh(() => {
                    throw new Error(
                        `Not implemented ${setNotificationsLoadable} with `
                    ) // FIXME @resetko-zeal implement
                })

                return () => unsubscribe()

            case 'web':
                return noop

            default:
                return notReachable(ZealPlatform.OS)
        }
    }, [setNotificationsLoadable])

    useEffect(() => {
        switch (notificationsLoadable.type) {
            case 'loading':
            case 'loaded':
                break
            case 'error':
                captureError(notificationsLoadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(notificationsLoadable)
        }
    }, [notificationsLoadable])

    return (
        <>
            <WalletConnectListener
                selectedAccount={storage.accounts[selectedAddress]}
                customCurrencyMap={storage.customCurrencies}
                currencyHiddenMap={storage.currencyHiddenMap}
                accountsMap={storage.accounts}
                feePresetMap={storage.feePresetMap}
                gasCurrencyPresetMap={storage.gasCurrencyPresetMap}
                installationId={installationId}
                keyStoreMap={storage.keystoreMap}
                networkMap={networkMap}
                networkRPCMap={storage.networkRPCMap}
                portfolioMap={storage.portfolios}
                sessionPassword={sessionPassword}
                walletConnectInstanceLoadable={walletConnectInstanceLoadable}
                onMsg={onMsg}
            />

            <PortfolioLoader
                cardConfig={cardConfig}
                walletConnectInstanceLoadable={walletConnectInstanceLoadable}
                connections={connections}
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                customCurrencies={customCurrencies}
                installationId={installationId}
                manifest={manifest}
                mode={mode}
                networkMap={networkMap}
                onMsg={onMsg}
                selectedAddress={selectedAddress}
                sessionPassword={sessionPassword}
                storage={storage}
            />
        </>
    )
}
