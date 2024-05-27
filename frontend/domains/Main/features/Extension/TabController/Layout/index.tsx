import { useState } from 'react'
import { useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { BoldBrowseGlobe } from '@zeal/uikit/Icon/BoldBrowseGlobe'
import { Clock } from '@zeal/uikit/Icon/Clock'
import { CreditCardSolid } from '@zeal/uikit/Icon/CreditCardSolid'
import { Logo } from '@zeal/uikit/Icon/Logo'
import { Setting } from '@zeal/uikit/Icon/Setting'
import { IconButton } from '@zeal/uikit/IconButton'
import { TabsLayout } from '@zeal/uikit/TabsLayout'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { keys } from '@zeal/toolkit/Object'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import {
    Msg as ViewAccountsMsg,
    View as ViewAccounts,
} from '@zeal/domains/Account/features/View'
import { Address } from '@zeal/domains/Address'
import { AppBrowser } from '@zeal/domains/App/components/AppBrowser'
import { CardConfig } from '@zeal/domains/Card'
import { CardTab } from '@zeal/domains/Card/features/CardTab'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'
import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Mode } from '@zeal/domains/Main'
import { Manifest } from '@zeal/domains/Manifest'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { Settings } from '@zeal/domains/Settings/components/Settings'
import { BankTransferInfo, CustomCurrencyMap } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import {
    Msg as ViewTransactionHistoryMsg,
    ViewTransactionActivity,
} from '@zeal/domains/Transactions/features/ViewTransactionActivity'

type Props = {
    manifest: Manifest
    mode: Mode

    sessionPassword: string
    account: Account
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    portfolioLoadable: ReloadableData<
        FetchPortfolioResponse,
        FetchPortfolioRequest
    >
    keystoreMap: KeyStoreMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    networkMap: NetworkMap
    bankTransferInfo: BankTransferInfo

    encryptedPassword: string
    transactionRequests: Record<Address, Submited[]>
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    customCurrencyMap: CustomCurrencyMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    connections: ConnectionMap
    installationId: string
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    cardConfig: CardConfig
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof ViewAccounts>,
          {
              type:
                  | 'reload_button_click'
                  | 'on_profile_change_confirm_click'
                  | 'on_recovery_kit_setup'
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
                  | 'on_token_click'
                  | 'on_send_nft_click'
                  | 'bridge_completed'
                  | 'on_bridge_submitted_click'
                  | 'on_transaction_request_widget_click'
                  | 'bank_transfer_click'
                  | 'on_dismiss_kyc_button_clicked'
                  | 'on_kyc_try_again_clicked'
                  | 'on_do_bank_transfer_clicked'
                  | 'transaction_request_completed'
                  | 'transaction_request_failed'
                  | 'on_onramp_success'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'from_any_wallet_click'
                  | 'transaction_request_replaced'
                  | 'on_open_fullscreen_view_click'
                  | 'on_refresh_button_clicked'
                  | 'on_zwidget_expand_request'
                  | 'on_send_clicked'
                  | 'on_bank_clicked'
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
                  | 'on_token_hide_click'
                  | 'on_token_un_pin_click'
                  | 'on_token_un_hide_click'
                  | 'on_token_pin_click'
                  | 'on_bank_transfer_selected'
                  | 'on_refresh_pulled'
                  | 'on_account_label_change_submit'
                  | 'account_item_clicked'
                  | 'confirm_account_delete_click'
                  | 'on_network_item_click'
                  | 'on_account_create_request'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'track_wallet_clicked'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'on_add_private_key_click'
                  | 'safe_wallet_clicked'
          }
      >
    | ViewTransactionHistoryMsg
    | Extract<
          MsgOf<typeof Settings>,
          {
              type:
                  | 'on_lock_zeal_click'
                  | 'on_recovery_kit_setup'
                  | 'on_disconnect_dapps_click'
                  | 'on_delete_all_dapps_confirm_click'
                  | 'on_open_fullscreen_view_click'
                  | 'settings_add_new_account_click'
          }
      >
    | MsgOf<typeof CardTab>

type State =
    | { type: 'portfolio' }
    | { type: 'activity' }
    | { type: 'settings' }
    | { type: 'card' }
    | { type: 'browse' }

const TABS: Record<State['type'], true> = {
    portfolio: true,
    activity: true,
    card: true,
    browse: true,
    settings: true,
}

export const Layout = ({
    mode,
    accounts,
    account,
    selectedNetwork,
    networkRPCMap,
    portfolioMap,
    portfolioLoadable,
    keystoreMap,
    submittedOffRampTransactions,
    encryptedPassword,
    manifest,
    transactionRequests,
    submitedBridgesMap,
    connections,
    networkMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    customCurrencyMap,
    installationId,
    sessionPassword,
    walletConnectInstanceLoadable,
    feePresetMap,
    gasCurrencyPresetMap,
    cardConfig,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'portfolio' })

    const tabs = keys(TABS)

    return (
        <TabsLayout
            tabs={tabs.map((tab) => (
                <TabButton
                    key={tab}
                    tab={tab}
                    selected={tab === state.type}
                    onClick={() => setState({ type: tab })}
                />
            ))}
            content={(() => {
                switch (state.type) {
                    case 'portfolio':
                        return (
                            <ViewAccounts
                                walletConnectInstanceLoadable={
                                    walletConnectInstanceLoadable
                                }
                                customCurrencyMap={customCurrencyMap}
                                sessionPassword={sessionPassword}
                                mode={mode}
                                installationId={installationId}
                                currencyHiddenMap={currencyHiddenMap}
                                currencyPinMap={currencyPinMap}
                                networkMap={networkMap}
                                networkRPCMap={networkRPCMap}
                                submitedBridgesMap={submitedBridgesMap}
                                encryptedPassword={encryptedPassword}
                                submittedOffRampTransactions={
                                    submittedOffRampTransactions
                                }
                                keystoreMap={keystoreMap}
                                selectedNetwork={selectedNetwork}
                                portfolioLoadable={portfolioLoadable}
                                transactionRequests={transactionRequests}
                                account={account}
                                portfolioMap={portfolioMap}
                                accounts={accounts}
                                bankTransferInfo={bankTransferInfo}
                                onMsg={(msg: ViewAccountsMsg) => {
                                    switch (msg.type) {
                                        case 'discover_more_apps_click':
                                            setState({ type: 'browse' })
                                            break
                                        case 'reload_button_click':
                                        case 'on_profile_change_confirm_click':
                                        case 'on_recovery_kit_setup':
                                        case 'on_custom_currency_delete_request':
                                        case 'on_custom_currency_update_request':
                                        case 'on_token_click':
                                        case 'on_send_nft_click':
                                        case 'bridge_completed':
                                        case 'on_bridge_submitted_click':
                                        case 'on_transaction_request_widget_click':
                                        case 'bank_transfer_click':
                                        case 'on_dismiss_kyc_button_clicked':
                                        case 'on_kyc_try_again_clicked':
                                        case 'on_do_bank_transfer_clicked':
                                        case 'transaction_request_completed':
                                        case 'transaction_request_failed':
                                        case 'on_onramp_success':
                                        case 'on_withdrawal_monitor_fiat_transaction_success':
                                        case 'from_any_wallet_click':
                                        case 'transaction_request_replaced':
                                        case 'on_open_fullscreen_view_click':
                                        case 'on_refresh_button_clicked':
                                        case 'on_zwidget_expand_request':
                                        case 'on_send_clicked':
                                        case 'on_bank_clicked':
                                        case 'on_swap_clicked':
                                        case 'on_bridge_clicked':
                                        case 'on_token_hide_click':
                                        case 'on_token_un_pin_click':
                                        case 'on_token_un_hide_click':
                                        case 'on_token_pin_click':
                                        case 'on_bank_transfer_selected':
                                        case 'on_refresh_pulled':
                                        case 'on_account_label_change_submit':
                                        case 'account_item_clicked':
                                        case 'confirm_account_delete_click':
                                        case 'on_network_item_click':
                                        case 'on_account_create_request':
                                        case 'add_wallet_clicked':
                                        case 'hardware_wallet_clicked':
                                        case 'track_wallet_clicked':
                                        case 'on_rpc_change_confirmed':
                                        case 'on_select_rpc_click':
                                        case 'on_add_private_key_click':
                                        case 'safe_wallet_clicked':
                                            onMsg(msg)
                                            break

                                        default:
                                            notReachable(msg)
                                    }
                                }}
                            />
                        )
                    case 'activity':
                        return (
                            <ViewTransactionActivity
                                sessionPassword={sessionPassword}
                                customCurrencyMap={customCurrencyMap}
                                installationId={installationId}
                                currencyHiddenMap={currencyHiddenMap}
                                networkMap={networkMap}
                                submitedBridgesMap={submitedBridgesMap}
                                transactionRequests={transactionRequests}
                                keystoreMap={keystoreMap}
                                portfolioMap={portfolioMap}
                                accounts={accounts}
                                account={account}
                                selectedNetwork={selectedNetwork}
                                networkRPCMap={networkRPCMap}
                                encryptedPassword={encryptedPassword}
                                onMsg={onMsg}
                            />
                        )
                    case 'settings':
                        return (
                            <Settings
                                installationId={installationId}
                                mode={mode}
                                connections={connections}
                                manifest={manifest}
                                onMsg={onMsg}
                            />
                        )

                    case 'browse':
                        return <AppBrowser installationId={installationId} />

                    case 'card':
                        return (
                            <CardTab
                                currencyHiddenMap={currencyHiddenMap}
                                accountsMap={accounts}
                                feePresetMap={feePresetMap}
                                gasCurrencyPresetMap={gasCurrencyPresetMap}
                                installationId={installationId}
                                keyStoreMap={keystoreMap}
                                networkMap={networkMap}
                                networkRPCMap={networkRPCMap}
                                portfolioMap={portfolioMap}
                                sessionPassword={sessionPassword}
                                encryptedPassword={encryptedPassword}
                                onMsg={onMsg}
                                cardConfig={cardConfig}
                            />
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(state)
                }
            })()}
        />
    )
}

type TabButtonProps = {
    tab: State['type']
    selected: boolean
    onClick: () => void
}

const TabButton = ({ tab, selected, onClick }: TabButtonProps) => {
    const { formatMessage } = useIntl()

    switch (tab) {
        case 'portfolio':
            return (
                <IconButton
                    variant="on_light"
                    aria-label={formatMessage({
                        id: 'mainTabs.portfolio.label',
                        defaultMessage: 'Portfolio',
                    })}
                    onClick={onClick}
                >
                    {({ color }) => (
                        <Column alignX="center" spacing={4}>
                            <Logo
                                color={
                                    selected ? 'actionPrimaryDefault' : color
                                }
                                size={20}
                            />
                            <Text
                                color={selected ? 'textAccent2' : color}
                                variant="caption2"
                                weight="regular"
                            >
                                {formatMessage({
                                    id: 'mainTabs.portfolio.label',
                                    defaultMessage: 'Portfolio',
                                })}
                            </Text>
                        </Column>
                    )}
                </IconButton>
            )

        case 'activity':
            return (
                <IconButton
                    variant="on_light"
                    aria-pressed={selected}
                    aria-label={formatMessage({
                        id: 'mainTabs.activity.label',
                        defaultMessage: 'Activity',
                    })}
                    onClick={onClick}
                >
                    {({ color }) => (
                        <Column alignX="center" spacing={4}>
                            <Clock
                                color={
                                    selected ? 'actionPrimaryDefault' : color
                                }
                                size={20}
                            />
                            <Text
                                color={selected ? 'textAccent2' : color}
                                variant="caption2"
                                weight="regular"
                            >
                                {formatMessage({
                                    id: 'mainTabs.activity.label',
                                    defaultMessage: 'Activity',
                                })}
                            </Text>
                        </Column>
                    )}
                </IconButton>
            )

        case 'settings':
            return (
                <IconButton
                    variant="on_light"
                    aria-pressed={selected}
                    aria-label={formatMessage({
                        id: 'mainTabs.settings.label',
                        defaultMessage: 'Settings',
                    })}
                    onClick={onClick}
                >
                    {({ color }) => (
                        <Column alignX="center" spacing={4}>
                            <Setting
                                color={
                                    selected ? 'actionPrimaryDefault' : color
                                }
                                size={20}
                            />
                            <Text
                                color={selected ? 'textAccent2' : color}
                                variant="caption2"
                                weight="regular"
                            >
                                {formatMessage({
                                    id: 'mainTabs.settings.label',
                                    defaultMessage: 'Settings',
                                })}
                            </Text>
                        </Column>
                    )}
                </IconButton>
            )

        case 'card':
            return (
                <IconButton
                    variant="on_light"
                    aria-pressed={selected}
                    aria-label={formatMessage({
                        id: 'mainTabs.card.label',
                        defaultMessage: 'Card',
                    })}
                    onClick={onClick}
                >
                    {({ color }) => (
                        <Column alignX="center" spacing={4}>
                            <CreditCardSolid
                                color={
                                    selected ? 'actionPrimaryDefault' : color
                                }
                                size={20}
                            />
                            <Text
                                color={selected ? 'textAccent2' : color}
                                variant="caption2"
                                weight="regular"
                            >
                                {formatMessage({
                                    id: 'mainTabs.card.label',
                                    defaultMessage: 'Card',
                                })}
                            </Text>
                        </Column>
                    )}
                </IconButton>
            )

        case 'browse':
            switch (ZealPlatform.OS) {
                case 'android':
                case 'ios':
                    return (
                        <IconButton
                            variant="on_light"
                            aria-pressed={selected}
                            aria-label={formatMessage({
                                id: 'mainTabs.browse.title',
                                defaultMessage: 'Browse',
                            })}
                            onClick={onClick}
                        >
                            {({ color }) => (
                                <Column alignX="center" spacing={4}>
                                    <BoldBrowseGlobe
                                        color={
                                            selected
                                                ? 'actionPrimaryDefault'
                                                : color
                                        }
                                        size={20}
                                    />
                                    <Text
                                        color={selected ? 'textAccent2' : color}
                                        variant="caption2"
                                        weight="regular"
                                    >
                                        {formatMessage({
                                            id: 'mainTabs.browse.label',
                                            defaultMessage: 'Browse',
                                        })}
                                    </Text>
                                </Column>
                            )}
                        </IconButton>
                    )

                case 'web':
                    return null
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }

        /* istanbul ignore next */
        default:
            return notReachable(tab)
    }
}
