import { notReachable } from '@zeal/toolkit'

import { AccountsMap } from '@zeal/domains/Account'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { NftCollectionListItem } from '@zeal/domains/NFTCollection/components/NftCollectionListItem'
import { NftListItem } from '@zeal/domains/NFTCollection/components/NftListItem'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Approve } from './Approve'
import { BridgeTrxView } from './BridgeTrx'
import { Failed } from './Failed'
import { P2PTransactionView } from './P2PTransactionView'
import { Unknown } from './Unknown'

type Props = {
    simulation: SimulateTransactionResponse
    installationId: string
    dApp: DAppSiteInfo | null
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
}

export const SimulatedTransactionInfo = ({
    simulation,
    accounts,
    keystores,
    installationId,
    networkMap,
    dApp,
}: Props) => {
    const { transaction, checks, currencies: knownCurrencies } = simulation

    switch (transaction.type) {
        case 'WithdrawalTrx':
            return (
                <OffRampTransactionView
                    variant={{ type: 'no_status' }}
                    networkMap={networkMap}
                    withdrawalRequest={transaction.withdrawalRequest}
                />
            )

        case 'BridgeTrx':
            return (
                <BridgeTrxView
                    networkMap={networkMap}
                    transaction={transaction}
                    knownCurrencies={knownCurrencies}
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
                    knownCurrencies={knownCurrencies}
                    checks={checks}
                    accounts={accounts}
                    keystores={keystores}
                />
            )

        case 'ApprovalTransaction':
            return (
                <Approve
                    checks={checks}
                    knownCurrencies={knownCurrencies}
                    transaction={transaction}
                />
            )

        case 'UnknownTransaction':
            return (
                <Unknown
                    networkMap={networkMap}
                    checks={checks}
                    knownCurrencies={knownCurrencies}
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

        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
