import { notReachable } from '@zeal/toolkit'

import { AccountsMap } from '@zeal/domains/Account'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { NftCollectionListItem } from '@zeal/domains/NFTCollection/components/NftCollectionListItem'
import { NftListItem } from '@zeal/domains/NFTCollection/components/NftListItem'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { Approve } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/Approve'
import { BridgeTrxView } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/BridgeTrx'
import { Failed } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/Failed'
import { P2PTransactionView } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/P2PTransactionView'
import { Unknown } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/Unknown'

export const SafeTransactionInfo = ({
    simulation,
    dApp,
    accounts,
    keyStores,
    networkMap,
    installationId,
}: {
    simulation: SimulateTransactionResponse
    dApp: DAppSiteInfo | null
    accounts: AccountsMap
    keyStores: KeyStoreMap
    networkMap: NetworkMap
    installationId: string
}) => {
    const { transaction, checks, currencies } = simulation

    switch (transaction.type) {
        case 'BridgeTrx':
            return (
                <BridgeTrxView
                    networkMap={networkMap}
                    transaction={transaction}
                    knownCurrencies={currencies}
                />
            )
        case 'WithdrawalTrx':
            return (
                <OffRampTransactionView
                    variant={{ type: 'no_status' }}
                    networkMap={networkMap}
                    withdrawalRequest={transaction.withdrawalRequest}
                />
            )
        case 'ApprovalTransaction':
            // TODO: Make these approvals editable - will need to edit the requestToBundle
            return (
                <Approve
                    transaction={transaction}
                    checks={checks}
                    knownCurrencies={currencies}
                />
            )
        case 'UnknownTransaction':
            return (
                <Unknown
                    networkMap={networkMap}
                    checks={checks}
                    knownCurrencies={currencies}
                    transaction={transaction}
                />
            )
        case 'FailedTransaction':
            return <Failed dApp={dApp} transaction={transaction} />
        case 'SingleNftApprovalTransaction':
            return (
                <NftListItem
                    networkMap={networkMap}
                    nft={transaction.nft}
                    checks={checks}
                    rightNode={null}
                />
            )
        case 'NftCollectionApprovalTransaction':
            return (
                <NftCollectionListItem
                    networkMap={networkMap}
                    checks={checks}
                    nftCollection={transaction.nftCollectionInfo}
                />
            )
        case 'P2PTransaction':
        case 'P2PNftTransaction':
            return (
                <P2PTransactionView
                    installationId={installationId}
                    networkMap={networkMap}
                    transaction={transaction}
                    dApp={dApp}
                    knownCurrencies={currencies}
                    checks={checks}
                    accounts={accounts}
                    keystores={keyStores}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
