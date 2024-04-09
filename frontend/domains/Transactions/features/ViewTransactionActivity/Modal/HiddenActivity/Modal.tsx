import { ActionBar } from '@zeal/uikit/ActionBar'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Manage as ManageAccounts } from '@zeal/domains/Account/features/Manage'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { ActivityTransaction } from '@zeal/domains/Transactions'

import { TransactionDetails } from '../TransactionDetails'

type Props = {
    installationId: string
    account: Account
    accountsMap: AccountsMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    state: State
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    currencyHiddenMap: CurrencyHiddenMap
    accounts: AccountsMap
    encryptedPassword: string
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof ManageAccounts>

export type State =
    | { type: 'closed' }
    | {
          type: 'transaction_details'
          transaction: ActivityTransaction
      }
    | { type: 'account_filter' }

export const Modal = ({
    state,
    account,
    accountsMap,
    networkMap,
    networkRPCMap,
    portfolioMap,
    keystoreMap,
    currencyHiddenMap,
    accounts,
    encryptedPassword,
    installationId,
    sessionPassword,
    customCurrencyMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'transaction_details':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Popup.Content>
                        <ActionBar
                            right={
                                <IconButton
                                    variant="on_light"
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

        case 'account_filter':
            return (
                <UIModal>
                    <ManageAccounts
                        sessionPassword={sessionPassword}
                        networkMap={networkMap}
                        customCurrencyMap={customCurrencyMap}
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
