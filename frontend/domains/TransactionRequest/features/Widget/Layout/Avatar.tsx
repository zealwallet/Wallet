import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { BoldImageCollection } from '@zeal/uikit/Icon/BoldImageCollection'
import { Document } from '@zeal/uikit/Icon/Document'

import { notReachable } from '@zeal/toolkit'

import { Avatar as CurrencyAvatar } from '@zeal/domains/Currency/components/Avatar'
import { Network } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { NftAvatar } from '@zeal/domains/NFTCollection/components/NftAvatar'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

type Props = {
    simulatedTransaction: SimulationResult
    network: Network
}

export const Avatar = ({ simulatedTransaction, network }: Props) => {
    switch (simulatedTransaction.type) {
        case 'failed':
        case 'not_supported':
            return null
        case 'simulated': {
            const { transaction, currencies } = simulatedTransaction.simulation

            switch (transaction.type) {
                case 'BridgeTrx':
                case 'FailedTransaction':
                case 'WithdrawalTrx':
                    return null
                case 'ApprovalTransaction':
                case 'UnknownTransaction': // TODO: Multi-token dynamic icon
                    return (
                        <UIAvatar
                            size={32}
                            variant="squared"
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        >
                            <Document size={32} color="iconDefault" />
                        </UIAvatar>
                    )
                case 'SingleNftApprovalTransaction':
                    return (
                        <NftAvatar
                            size={32}
                            nft={transaction.nft}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )
                case 'NftCollectionApprovalTransaction':
                    return (
                        <UIAvatar
                            size={32}
                            variant="squared"
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        >
                            <BoldImageCollection
                                size={32}
                                color="iconDefault"
                            />
                        </UIAvatar>
                    )
                case 'P2PTransaction':
                    const currency =
                        currencies[transaction.token.amount.currencyId]
                    return (
                        <CurrencyAvatar
                            currency={currency}
                            size={32}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )
                case 'P2PNftTransaction':
                    return (
                        <NftAvatar
                            size={32}
                            nft={transaction.nft.nft}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(transaction)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(simulatedTransaction)
    }
}
