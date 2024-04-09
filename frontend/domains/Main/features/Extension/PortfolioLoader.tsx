import { useEffect, useState } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import {
    ReloadableData,
    useReloadableData,
} from '@zeal/toolkit/LoadableData/ReloadableData'

import { Account } from '@zeal/domains/Account'
import {
    fetchAccounts,
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { isEqual } from '@zeal/domains/Currency/helpers/isEqual'
import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Mode } from '@zeal/domains/Main'
import { Manifest } from '@zeal/domains/Manifest'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { CustomCurrencyMap, Storage } from '@zeal/domains/Storage'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Msg as TabControllerMsg, TabController } from './TabController'

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

    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'portfolio_loaded'
          portfolio: Portfolio
          address: Address
          fetchedAt: Date
      }
    | { type: 'account_item_clicked'; account: Account }
    | { type: 'confirm_account_delete_click'; account: Account }
    | Extract<
          TabControllerMsg,
          {
              type:
                  | 'transaction_request_completed'
                  | 'transaction_request_failed'
                  | 'transaction_request_cancelled'
                  | 'on_account_label_change_submit'
                  | 'on_lock_zeal_click'
                  | 'on_profile_change_confirm_click'
                  | 'on_recovery_kit_setup'
                  | 'on_disconnect_dapps_click'
                  | 'on_delete_all_dapps_confirm_click'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
                  | 'on_send_nft_click'
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
                  | 'on_send_clicked'
                  | 'bridge_completed'
                  | 'on_accounts_create_success_animation_finished'
                  | 'on_bank_transfer_selected'
                  | 'on_dismiss_kyc_button_clicked'
                  | 'on_kyc_try_again_clicked'
                  | 'on_token_pin_click'
                  | 'on_token_un_pin_click'
                  | 'on_token_hide_click'
                  | 'on_token_un_hide_click'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'on_add_private_key_click'
                  | 'safe_wallet_clicked'
                  | 'on_open_fullscreen_view_click'
                  | 'from_any_wallet_click'
                  | 'transaction_request_replaced'
                  | 'on_nba_close_click'
                  | 'on_nba_cta_click'
                  | 'on_zwidget_expand_request'
                  | 'on_bank_clicked'
          }
      >

const initLoading = (
    storage: Storage,
    selectedAddress: Address,
    customCurrencies: CustomCurrencyMap,
    networkMap: NetworkMap
): ReloadableData<FetchPortfolioResponse, FetchPortfolioRequest> => {
    const portfolio = getPortfolio({
        address: selectedAddress,
        portfolioMap: storage.portfolios,
    })
    const params = {
        address: selectedAddress,
        customCurrencies,
        forceRefresh: false,
        networkMap,
        networkRPCMap: storage.networkRPCMap,
    }
    return portfolio
        ? {
              type: 'reloading',
              params,
              data: {
                  portfolio,
                  fetchedAt: storage.fetchedAt,
              },
          }
        : { type: 'loading', params }
}

export const PortfolioLoader = ({
    storage,
    manifest,
    selectedAddress,
    installationId,
    connections,
    customCurrencies,
    sessionPassword,
    networkMap,
    currencyHiddenMap,
    currencyPinMap,
    mode,
    onMsg,
}: Props) => {
    const liveOnMsg = useLiveRef(onMsg)
    const liveStorage = useLiveRef(storage)
    const liveNetworkMap = useLiveRef(networkMap)

    const [selectedNetwork, setSelectedNetwork] = useState<CurrentNetwork>({
        type: 'all_networks',
    })

    const [loadable, setLoadable] = useReloadableData(
        fetchAccounts,
        (): ReloadableData<FetchPortfolioResponse, FetchPortfolioRequest> =>
            initLoading(storage, selectedAddress, customCurrencies, networkMap)
    )

    useEffect(() => {
        // TODO :: this is a tricky part, you need to check if address was really changed before "re-loading"
        //         otherwise you will get infinite loop of updates,
        //         when loaded we want update storage, when storage update we want to reload loadable
        if (loadable.params.address !== selectedAddress) {
            setLoadable(
                initLoading(
                    storage,
                    selectedAddress,
                    customCurrencies,
                    liveNetworkMap.current
                )
            )
        }

        if (!isEqual(customCurrencies, loadable.params.customCurrencies)) {
            setLoadable({
                type: 'loading',
                params: {
                    address: selectedAddress,
                    customCurrencies,
                    forceRefresh: false,
                    networkMap: liveNetworkMap.current,
                    networkRPCMap: storage.networkRPCMap,
                },
            })
        }
    }, [
        loadable.params.address,
        storage,
        selectedAddress,
        setLoadable,
        loadable.params.customCurrencies,
        customCurrencies,
        liveNetworkMap,
    ])

    useEffect(() => {
        const keystore = getKeyStore({
            keyStoreMap: liveStorage.current.keystoreMap,
            address: loadable.params.address,
        })

        switch (loadable.type) {
            case 'loaded':
                postUserEvent({
                    type: 'PortfolioLoadedEvent',
                    installationId,
                    isFunded:
                        sumPortfolio(loadable.data.portfolio, {}).amount > 0,
                    dappCount: loadable.data.portfolio.apps.length,
                    nftCount: loadable.data.portfolio.nftCollections.length,
                    tokenCount: loadable.data.portfolio.tokens.filter(
                        (t) => !t.scam
                    ).length,
                    keystoreType: keystoreToUserEventType(keystore),
                    keystoreId: keystore.id,
                })
                break
            case 'loading':
                postUserEvent({
                    type: 'PortfolioLoadingEvent',
                    installationId,
                    keystoreId: keystore.id,
                    keystoreType: keystoreToUserEventType(keystore),
                })
                break
            case 'error':
                captureError(loadable.error)
                postUserEvent({
                    type: 'PortfolioLoadingFailedEvent',
                    installationId,
                    keystoreId: keystore.id,
                    keystoreType: keystoreToUserEventType(keystore),
                })
                break
            case 'reloading':
                break
            case 'subsequent_failed':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [installationId, liveStorage, loadable])

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
            case 'subsequent_failed':
            case 'reloading':
                break
            case 'loaded':
                liveOnMsg.current({
                    type: 'portfolio_loaded',
                    address: loadable.params.address,
                    portfolio: loadable.data.portfolio,
                    fetchedAt: loadable.data.fetchedAt,
                })
                break
            /* istanbul ignore next */
            default:
                notReachable(loadable)
        }
    }, [liveOnMsg, loadable])

    const account = storage.accounts[loadable.params.address]
    if (!account) {
        // as mention this is tricky part
        // if delete currently selected account, params will have current account but storage will have already new one
        // since params have current account and you already delete cashed values, this will throw
        return null
    }

    return (
        <TabController
            userMadeActionOnNextBestActionIds={
                storage.userMadeActionOnNextBestActionIds
            }
            mode={mode}
            currencyHiddenMap={currencyHiddenMap}
            currencyPinMap={currencyPinMap}
            networkMap={networkMap}
            installationId={installationId}
            customCurrencyMap={storage.customCurrencies}
            submitedBridgesMap={storage.submitedBridges}
            connections={connections}
            manifest={manifest}
            encryptedPassword={storage.encryptedPassword}
            sessionPassword={sessionPassword}
            keystoreMap={storage.keystoreMap}
            selectedNetwork={selectedNetwork}
            networkRPCMap={storage.networkRPCMap}
            transactionRequests={storage.transactionRequests}
            submittedOffRampTransactions={storage.submittedOffRampTransactions}
            portfolioLoadable={loadable}
            account={account}
            portfolioMap={storage.portfolios}
            accounts={storage.accounts}
            bankTransferInfo={storage.bankTransferInfo}
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_custom_currency_update_request':
                    case 'on_custom_currency_delete_request':
                    case 'on_open_fullscreen_view_click':
                        onMsg(msg)
                        break

                    case 'on_onramp_success':
                        setLoadable((old) => {
                            switch (old.type) {
                                case 'loaded':
                                case 'reloading':
                                case 'subsequent_failed':
                                    return {
                                        type: 'reloading',
                                        params: old.params,
                                        data: old.data,
                                    }

                                case 'error':
                                case 'loading':
                                    return {
                                        type: 'loading',
                                        params: old.params,
                                    }
                                default:
                                    return notReachable(old)
                            }
                        })
                        break

                    case 'on_refresh_button_clicked':
                    case 'reload_button_click':
                        setLoadable({
                            type: 'loading',
                            params: { ...loadable.params, forceRefresh: true },
                        })
                        break
                    case 'track_wallet_clicked':
                    case 'add_wallet_clicked':
                    case 'hardware_wallet_clicked':
                    case 'on_account_create_request':
                    case 'on_profile_change_confirm_click':
                    case 'account_item_clicked':
                    case 'confirm_account_delete_click':
                    case 'transaction_request_completed':
                    case 'transaction_request_failed':
                    case 'on_account_label_change_submit':
                    case 'on_lock_zeal_click':
                    case 'on_recovery_kit_setup':
                    case 'on_disconnect_dapps_click':
                    case 'on_delete_all_dapps_confirm_click':
                    case 'on_send_nft_click':
                    case 'on_swap_clicked':
                    case 'on_bridge_clicked':
                    case 'on_send_clicked':
                    case 'bridge_completed':
                    case 'on_bank_transfer_selected':
                    case 'on_dismiss_kyc_button_clicked':
                    case 'on_kyc_try_again_clicked':
                    case 'on_token_pin_click':
                    case 'on_token_un_pin_click':
                    case 'on_token_hide_click':
                    case 'on_token_un_hide_click':
                    case 'transaction_submited':
                    case 'cancel_submitted':
                    case 'on_rpc_change_confirmed':
                    case 'on_select_rpc_click':
                    case 'on_transaction_completed_splash_animation_screen_competed':
                    case 'on_withdrawal_monitor_fiat_transaction_success':
                    case 'on_add_private_key_click':
                    case 'safe_wallet_clicked':
                    case 'from_any_wallet_click':
                    case 'transaction_request_replaced':
                    case 'on_nba_close_click':
                    case 'on_nba_cta_click':
                    case 'on_zwidget_expand_request':
                    case 'on_bank_clicked':
                        onMsg(msg)
                        break

                    case 'on_network_item_click':
                        setSelectedNetwork(msg.network)
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }
            }}
        />
    )
}
