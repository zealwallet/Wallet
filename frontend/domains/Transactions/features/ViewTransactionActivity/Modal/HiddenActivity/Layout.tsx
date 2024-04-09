import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBarAccountSelector } from '@zeal/domains/Account/components/ActionBarAccountSelector'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { TransactionList } from '@zeal/domains/Transactions/components/TransactionList'

type Props = {
    networkMap: NetworkMap
    accountsMap: AccountsMap
    account: Account
    selectedNetwork: CurrentNetwork
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_account_selector_click' }
    | MsgOf<typeof TransactionList>

export const Layout = ({
    account,
    selectedNetwork,
    accountsMap,
    onMsg,
    networkMap,
}: Props) => {
    return (
        <Screen padding="form" background="light">
            <ActionBar
                top={
                    <ActionBarAccountSelector
                        account={account}
                        onMsg={() => {
                            onMsg({ type: 'on_account_selector_click' })
                        }}
                    />
                }
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />
                            <ActionBar.Header>
                                <FormattedMessage
                                    id="transactions.hidden-activity.page.title"
                                    defaultMessage="Hidden activity"
                                />
                            </ActionBar.Header>
                        </Row>
                    </Clickable>
                }
            />
            <TransactionList
                scam
                onMsg={onMsg}
                account={account}
                accountsMap={accountsMap}
                networkMap={networkMap}
                selectedNetwork={selectedNetwork}
            />
        </Screen>
    )
}
