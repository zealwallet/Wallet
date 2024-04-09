import { useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Manage as ManageAccounts } from '@zeal/domains/Account/features/Manage'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { ActivityTransaction } from '@zeal/domains/Transactions'

import { HiddenActivity } from './HiddenActivity'
import { TransactionDetails } from './TransactionDetails'

type Props = {
    state: State
    portfolioMap: PortfolioMap
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    account: Account
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    accounts: AccountsMap
    encryptedPassword: string
    installationId: string
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof NetworkFilter>
    | MsgOf<typeof ManageAccounts>

export type State =
    | {
          type:
              | 'closed'
              | 'account_filter'
              | 'network_filter'
              | 'hidden_activity'
      }
    | {
          type: 'transaction_details'
          transaction: ActivityTransaction
      }

export const Modal = ({
    state,
    account,
    portfolioMap,
    selectedNetwork,
    networkRPCMap,
    accountsMap,
    keystoreMap,
    networkMap,
    currencyHiddenMap,
    accounts,
    encryptedPassword,
    installationId,
    sessionPassword,
    customCurrencyMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()

    switch (state.type) {
        case 'closed':
            return null

        case 'hidden_activity':
            return (
                <UIModal>
                    <HiddenActivity
                        customCurrencyMap={customCurrencyMap}
                        sessionPassword={sessionPassword}
                        installationId={installationId}
                        networkMap={networkMap}
                        accountsMap={accountsMap}
                        account={account}
                        selectedNetwork={selectedNetwork}
                        networkRPCMap={networkRPCMap}
                        onMsg={onMsg}
                        portfolioMap={portfolioMap}
                        keystoreMap={keystoreMap}
                        currencyHiddenMap={currencyHiddenMap}
                        accounts={accounts}
                        encryptedPassword={encryptedPassword}
                    />
                </UIModal>
            )

        case 'transaction_details':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Popup.Content>
                        <ActionBar
                            right={
                                <IconButton
                                    variant="on_light"
                                    aria-label={formatMessage({
                                        id: 'transaction.activity.details.modal.close',
                                        defaultMessage: 'Close',
                                    })}
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    {({ color }) => (
                                        <CloseCross size={24} color={color} />
                                    )}
                                </IconButton>
                            }
                        />
                        <TransactionDetails
                            transaction={state.transaction}
                            accountsMap={accountsMap}
                            account={account}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                        />
                    </Popup.Content>
                </Popup.Layout>
            )

        case 'network_filter':
            const portfolio = getPortfolio({
                address: account.address,
                portfolioMap,
            })
            const networks: CurrentNetwork[] = [
                { type: 'all_networks' } as const,
                ...values(networkMap).map(
                    (network): CurrentNetwork => ({
                        type: 'specific_network',
                        network,
                    })
                ),
            ]

            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        keyStoreMap={keystoreMap}
                        networks={networks}
                        networkRPCMap={networkRPCMap}
                        portfolio={portfolio}
                        currentNetwork={selectedNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'account_filter':
            return (
                <UIModal>
                    <ManageAccounts
                        customCurrencyMap={customCurrencyMap}
                        networkMap={networkMap}
                        sessionPassword={sessionPassword}
                        installationId={installationId}
                        networkRPCMap={networkRPCMap}
                        currencyHiddenMap={currencyHiddenMap}
                        encryptedPassword={encryptedPassword}
                        keystoreMap={keystoreMap}
                        portfolioMap={portfolioMap}
                        accounts={accounts}
                        account={account}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
