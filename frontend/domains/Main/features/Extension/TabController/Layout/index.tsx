import { useState } from 'react'
import { useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { BoldSwapHorizon } from '@zeal/uikit/Icon/BoldSwapHorizon'
import { Clock } from '@zeal/uikit/Icon/Clock'
import { Logo } from '@zeal/uikit/Icon/Logo'
import { Setting } from '@zeal/uikit/Icon/Setting'
import { IconButton } from '@zeal/uikit/IconButton'
import { TabsLayout } from '@zeal/uikit/TabsLayout'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { keys } from '@zeal/toolkit/Object'

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
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Mode } from '@zeal/domains/Main'
import { Manifest } from '@zeal/domains/Manifest'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { Settings } from '@zeal/domains/Settings/components/Settings'
import { BankTransferInfo, CustomCurrencyMap } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'
import {
    Msg as ViewTransactionHistoryMsg,
    ViewTransactionActivity,
} from '@zeal/domains/Transactions/features/ViewTransactionActivity'

import { ActionsTab } from './ActionsTab'

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

    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    connections: ConnectionMap
    installationId: string
    userMadeActionOnNextBestActionIds: string[]
    onMsg: (msg: Msg) => void
}

export type Msg =
    | ViewAccountsMsg
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
    | Extract<
          MsgOf<typeof ActionsTab>,
          {
              type:
                  | 'on_send_clicked'
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
                  | 'on_receive_selected'
                  | 'on_bank_transfer_selected'
                  | 'on_token_settings_click'
                  | 'on_token_pin_click'
                  | 'on_token_un_pin_click'
                  | 'on_token_hide_click'
                  | 'on_token_un_hide_click'
                  | 'on_open_fullscreen_view_click'
          }
      >

type State =
    | { type: 'portfolio' }
    | { type: 'activity' }
    | { type: 'settings' }
    | { type: 'actions' }

const TABS: Record<State['type'], true> = {
    portfolio: true,
    actions: true,
    activity: true,
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
    userMadeActionOnNextBestActionIds,
    sessionPassword,
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
                                customCurrencyMap={customCurrencyMap}
                                sessionPassword={sessionPassword}
                                mode={mode}
                                userMadeActionOnNextBestActionIds={
                                    userMadeActionOnNextBestActionIds
                                }
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
                                onMsg={onMsg}
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

                    case 'actions':
                        return (
                            <ActionsTab
                                mode={mode}
                                installationId={installationId}
                                networkMap={networkMap}
                                currencyPinMap={currencyPinMap}
                                customCurrencyMap={customCurrencyMap}
                                currencyHiddenMap={currencyHiddenMap}
                                currentAccount={account}
                                currentNetwork={selectedNetwork}
                                keystore={getKeyStore({
                                    address: account.address,
                                    keyStoreMap: keystoreMap,
                                })}
                                portfolio={getPortfolio({
                                    address: account.address,
                                    portfolioMap,
                                })}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            setState({ type: 'portfolio' })
                                            break

                                        case 'account_filter_click':
                                        case 'on_network_filter_button_clicked':
                                        case 'on_refresh_button_clicked':
                                            captureError(
                                                new ImperativeError(
                                                    'Widget should not be clickable during actions'
                                                )
                                            )
                                            break

                                        case 'on_send_clicked':
                                        case 'on_swap_clicked':
                                        case 'on_bridge_clicked':
                                        case 'on_receive_selected':
                                        case 'on_bank_transfer_selected':
                                        case 'on_token_settings_click':
                                        case 'on_token_pin_click':
                                        case 'on_token_un_pin_click':
                                        case 'on_token_hide_click':
                                        case 'on_token_un_hide_click':
                                            onMsg(msg)
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg)
                                    }
                                }}
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

        case 'actions':
            return (
                <IconButton
                    variant="on_light"
                    aria-pressed={selected}
                    aria-label={formatMessage({
                        id: 'mainTabs.transact.label',
                        defaultMessage: 'Actions',
                    })}
                    onClick={onClick}
                >
                    {({ color }) => (
                        <Column alignX="center" spacing={4}>
                            <BoldSwapHorizon
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
                                    id: 'mainTabs.transact.label',
                                    defaultMessage: 'Actions',
                                })}
                            </Text>
                        </Column>
                    )}
                </IconButton>
            )

        /* istanbul ignore next */
        default:
            return notReachable(tab)
    }
}
