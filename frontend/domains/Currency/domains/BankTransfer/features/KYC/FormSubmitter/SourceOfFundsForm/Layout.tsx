import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { PredefinedSourceOfFunds } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'

type Props = {
    onMsg: (msg: Msg) => void
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
}

type Msg =
    | { type: 'on_source_of_funds_selected'; source: PredefinedSourceOfFunds }
    | { type: 'on_other_source_of_funds_clicked' }
    | {
          type: 'close'
      }

export const Layout = ({ onMsg, account, network, keyStoreMap }: Props) => {
    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                network={network}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="bank_transfers.source_of_funds.form.title"
                            defaultMessage="Your source of funds"
                        />
                    }
                />

                <Column spacing={8}>
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            primaryText={
                                <FormattedMessage
                                    id="bank_transfers.source_of_funds.form.salary"
                                    defaultMessage="Salary"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_source_of_funds_selected',
                                    source: { type: 'salary' },
                                })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            primaryText={
                                <FormattedMessage
                                    id="bank_transfers.source_of_funds.form.business_income"
                                    defaultMessage="Business income"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_source_of_funds_selected',
                                    source: { type: 'business_income' },
                                })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            primaryText={
                                <FormattedMessage
                                    id="bank_transfers.source_of_funds.form.pension"
                                    defaultMessage="Pension"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_source_of_funds_selected',
                                    source: { type: 'pension' },
                                })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            primaryText={
                                <FormattedMessage
                                    id="bank_transfers.source_of_funds.form.other"
                                    defaultMessage="Other"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_other_source_of_funds_clicked',
                                })
                            }
                        />
                    </Group>
                </Column>
            </Column>
        </Screen>
    )
}
