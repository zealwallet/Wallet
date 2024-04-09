import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Divider } from '@zeal/uikit/Divider'
import { Group } from '@zeal/uikit/Group'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { format } from '@zeal/domains/Address/helpers/format'
import { getExplorerLink as getAddressExplorerLink } from '@zeal/domains/Address/helpers/getExplorerLink'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getExplorerLink as getContractExplorerLink } from '@zeal/domains/SmartContract/helpers/getExplorerLink'
import { ActivityTransaction } from '@zeal/domains/Transactions'
import { fetchTransactionByHash } from '@zeal/domains/Transactions/api/fetchTransactionByHash'
import { getExplorerLink as getTransactionExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

import { BlockNumber } from './BlockNumber'
import { CommonDetails } from './CommonDetails'
import { DetailItem } from './DetailItem'

type Props = {
    transaction: ActivityTransaction
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    account: Account
}

export const GeneralDetails = ({
    transaction,
    networkMap,
    networkRPCMap,
    account,
    accountsMap,
}: Props) => {
    return (
        <Group variant="default">
            <Column spacing={12}>
                <Text
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    <FormattedMessage
                        id="activity.detail.general.title"
                        defaultMessage="General"
                    />
                </Text>
                <Divider variant="secondary" />
                <Details
                    account={account}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transaction={transaction}
                    accountsMap={accountsMap}
                />
            </Column>
        </Group>
    )
}

const Details = ({
    transaction,
    networkMap,
    networkRPCMap,
    account,
    accountsMap,
}: {
    transaction: ActivityTransaction
    accountsMap: AccountsMap
    account: Account
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}) => {
    const network = findNetworkByHexChainId(
        transaction.networkHexId,
        networkMap
    )
    const [loadable] = useLoadableData(fetchTransactionByHash, {
        type: 'loading',
        params: {
            transactionHash: transaction.hash,
            network,
            networkRPCMap,
        },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'loaded':
                break
            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    switch (transaction.type) {
        case 'SelfP2PActivityTransaction':
            return (
                <>
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.sent-to"
                                defaultMessage="Sent to"
                            />
                        }
                        value={account.label}
                        explorerLink={getAddressExplorerLink(
                            account.address,
                            network
                        )}
                    />
                    <CommonDetails
                        networkMap={networkMap}
                        loadable={loadable}
                        transaction={transaction}
                    />
                </>
            )
        case 'OutboundP2PActivityTransaction':
        case 'OutboundP2PNftActivityTransaction': {
            const receiverAccount: Account | null =
                accountsMap[transaction.receiver]
            const displayValue = receiverAccount
                ? receiverAccount.label
                : format(transaction.receiver)
            return (
                <>
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.sent-to"
                                defaultMessage="Sent to"
                            />
                        }
                        value={displayValue}
                        explorerLink={getAddressExplorerLink(
                            transaction.receiver,
                            network
                        )}
                    />
                    <CommonDetails
                        networkMap={networkMap}
                        loadable={loadable}
                        transaction={transaction}
                    />
                </>
            )
        }
        case 'InboundP2PActivityTransaction': {
            const senderAccount: Account | null =
                accountsMap[transaction.sender]

            const displayValue = senderAccount
                ? senderAccount.label
                : format(transaction.sender)

            return (
                <>
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.received-from"
                                defaultMessage="Received from"
                            />
                        }
                        value={displayValue}
                        explorerLink={getAddressExplorerLink(
                            transaction.sender,
                            network
                        )}
                    />
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.hash"
                                defaultMessage="Transaction hash"
                            />
                        }
                        value={format(transaction.hash)}
                        explorerLink={getTransactionExplorerLink(
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
                    <BlockNumber loadable={loadable} network={network} />
                </>
            )
        }
        case 'SingleNftApprovalActivityTransaction':
        case 'NftCollectionApprovalActivityTransaction':
        case 'Erc20ApprovalActivityTransaction':
        case 'PartialTokenApprovalActivityTransaction': {
            const approveFor =
                transaction.approveTo.name ??
                format(transaction.approveTo.address)
            return (
                <>
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.approve-for"
                                defaultMessage="Approve for"
                            />
                        }
                        value={approveFor}
                        explorerLink={getContractExplorerLink(
                            transaction.approveTo,
                            networkMap
                        )}
                    />
                    <CommonDetails
                        networkMap={networkMap}
                        loadable={loadable}
                        transaction={transaction}
                    />
                </>
            )
        }
        case 'SingleNftApprovalRevokeActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
        case 'Erc20ApprovalRevokeActivityTransaction': {
            const revokeFrom =
                transaction.revokeFrom.name ??
                format(transaction.revokeFrom.address)
            return (
                <>
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.revoke-from"
                                defaultMessage="Revoke from"
                            />
                        }
                        value={revokeFrom}
                        explorerLink={getContractExplorerLink(
                            transaction.revokeFrom,
                            networkMap
                        )}
                    />
                    <CommonDetails
                        networkMap={networkMap}
                        loadable={loadable}
                        transaction={transaction}
                    />
                </>
            )
        }
        case 'UnknownActivityTransaction': {
            const { name, website, address } = transaction.smartContract

            return (
                <>
                    <DetailItem
                        label={
                            <FormattedMessage
                                id="activity.detail.general.using"
                                defaultMessage="Using"
                            />
                        }
                        value={name || website || format(address)}
                        explorerLink={getContractExplorerLink(
                            transaction.smartContract,
                            networkMap
                        )}
                    />
                    <CommonDetails
                        networkMap={networkMap}
                        loadable={loadable}
                        transaction={transaction}
                    />
                </>
            )
        }
        case 'FailedActivityTransaction':
            return (
                <CommonDetails
                    networkMap={networkMap}
                    loadable={loadable}
                    transaction={transaction}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
