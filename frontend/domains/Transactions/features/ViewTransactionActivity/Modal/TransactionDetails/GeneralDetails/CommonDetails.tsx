import { FormattedMessage } from 'react-intl'

import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { FormattedFeeInDefaultCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { FormattedFeeInNativeTokenCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInNativeTokenCurrency'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import {
    ActivityTransaction,
    InboundP2PActivityTransaction,
    RpcTransaction,
} from '@zeal/domains/Transactions'
import { format } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/format'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

import { BlockNumber } from './BlockNumber'
import { DetailItem } from './DetailItem'
import { Nonce } from './Nonce'

export const CommonDetails = ({
    transaction,
    networkMap,
    loadable,
}: {
    transaction: Exclude<ActivityTransaction, InboundP2PActivityTransaction>
    networkMap: NetworkMap
    loadable: LoadableData<RpcTransaction, unknown>
}) => {
    const network = findNetworkByHexChainId(
        transaction.networkHexId,
        networkMap
    )

    return (
        <>
            <DetailItem
                label={
                    <FormattedMessage
                        id="activity.detail.general.hash"
                        defaultMessage="Transaction hash"
                    />
                }
                value={format({ transactionHash: transaction.hash })}
                explorerLink={getExplorerLink(
                    { transactionHash: transaction.hash },
                    network
                )}
            />
            <DetailItem
                label={
                    <FormattedMessage
                        id="activity.detail.general.network"
                        defaultMessage="Network"
                    />
                }
                value={network.name}
                explorerLink={null}
            />
            {transaction.paidFee && (
                <>
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.fee-in-tokens"
                                defaultMessage="Network fee in Tokens"
                            />
                        }
                        value={
                            <FormattedFeeInNativeTokenCurrency2
                                money={
                                    transaction.paidFee.priceInNativeCurrency
                                }
                            />
                        }
                        explorerLink={null}
                    />
                    {transaction.paidFee.priceInDefaultCurrency && (
                        <DetailItem
                            label={
                                <FormattedMessage
                                    id="activity.detail.general.fee-in-default-currency"
                                    defaultMessage="Network fee in {defaultCurrency}"
                                    values={{
                                        defaultCurrency:
                                            transaction.paidFee
                                                .priceInDefaultCurrency.currency
                                                .id,
                                    }}
                                />
                            }
                            value={
                                <FormattedFeeInDefaultCurrency2
                                    money={
                                        transaction.paidFee
                                            .priceInDefaultCurrency
                                    }
                                />
                            }
                            explorerLink={null}
                        />
                    )}
                </>
            )}
            <Nonce loadable={loadable} />
            <BlockNumber loadable={loadable} network={network} />
        </>
    )
}
