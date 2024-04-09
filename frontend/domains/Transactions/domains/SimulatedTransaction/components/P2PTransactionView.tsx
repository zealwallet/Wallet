import { FormattedMessage } from 'react-intl'

import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { ListItem } from '@zeal/uikit/ListItem'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Avatar as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { CopyAddress } from '@zeal/domains/Address/components/CopyAddress'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import {
    P2PNFTTransaction,
    P2PTransaction,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Nft } from './Unknown/Nft'
import { Token } from './Unknown/Token'

type Props = {
    installationId: string
    transaction: P2PTransaction | P2PNFTTransaction
    dApp: DAppSiteInfo | null
    knownCurrencies: KnownCurrencies
    checks: TransactionSafetyCheck[]
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
}

export type Msg = { type: 'close' }

export const P2PTransactionView = ({
    checks,
    transaction,
    knownCurrencies,
    accounts,
    keystores,
    installationId,
    networkMap,
}: Props) => {
    const account: Account | null = accounts[transaction.toAddress]
    const keystore = getKeyStore({
        keyStoreMap: keystores,
        address: transaction.toAddress,
    })

    return (
        <Column spacing={24}>
            <Column spacing={0}>
                {(() => {
                    switch (transaction.type) {
                        case 'P2PTransaction':
                            return (
                                <Token
                                    networkMap={networkMap}
                                    safetyChecks={checks}
                                    key={transaction.token.amount.currencyId}
                                    knownCurrencies={knownCurrencies}
                                    token={transaction.token}
                                />
                            )
                        case 'P2PNftTransaction':
                            return (
                                <Nft
                                    networkMap={networkMap}
                                    checks={checks}
                                    key={transaction.nft.nft.tokenId}
                                    transactionNft={transaction.nft}
                                />
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(transaction)
                    }
                })()}
            </Column>

            <Column spacing={12} aria-labelledby="receive-section-label">
                <Text
                    id="receive-section-label"
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    <FormattedMessage
                        id="simulatedTransaction.p2p.info.account"
                        defaultMessage="To"
                    />
                </Text>
                {account ? (
                    <ListItem
                        size="large"
                        avatar={({ size }) => (
                            <AccountAvatar
                                account={account}
                                keystore={keystore}
                                size={size}
                            />
                        )}
                        primaryText={account.label}
                        shortText={
                            <CopyAddress
                                installationId={installationId}
                                address={account.address}
                                color="on_light"
                                size="regular"
                            />
                        }
                        aria-current={false}
                    />
                ) : (
                    <ListItem
                        size="large"
                        avatar={({ size }) => (
                            <UIAvatar size={size}>
                                <QuestionCircle
                                    size={size}
                                    color="iconDefault"
                                />
                            </UIAvatar>
                        )}
                        primaryText={
                            <FormattedMessage
                                id="simulatedTransaction.p2p.info.unlabelledAccount"
                                defaultMessage="Unlabelled wallet"
                            />
                        }
                        shortText={
                            <CopyAddress
                                installationId={installationId}
                                address={transaction.toAddress}
                                color="on_light"
                                size="regular"
                            />
                        }
                        aria-current={false}
                    />
                )}
            </Column>
        </Column>
    )
}
