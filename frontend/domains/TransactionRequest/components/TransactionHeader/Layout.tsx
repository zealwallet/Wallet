import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Content } from '@zeal/uikit/Content'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { format } from '@zeal/domains/Address/helpers/format'
import { NetworkMap } from '@zeal/domains/Network'
import { getExplorerLink } from '@zeal/domains/SmartContract/helpers/getExplorerLink'
import { TransactionRequest } from '@zeal/domains/TransactionRequest'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

type Props = {
    simulationResult: SimulationResult
    transactionRequest: TransactionRequest
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_approval_info_click' }

export const Layout = ({
    simulationResult,
    networkMap,
    onMsg,
    transactionRequest: { rpcRequest, networkHexId, dApp },
}: Props) => {
    switch (simulationResult.type) {
        case 'simulated': {
            const { transaction } = simulationResult.simulation
            const {
                params: [{ to }],
            } = rpcRequest

            switch (transaction.type) {
                case 'WithdrawalTrx':
                    return (
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="currency.bridge.withdrawal_status.title"
                                    defaultMessage="Withdrawal"
                                />
                            }
                        />
                    )

                case 'BridgeTrx':
                    return (
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="currency.bridge.bridge_status.title"
                                    defaultMessage="Bridge"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="currency.bridge.bridge_status.subtitle"
                                    defaultMessage="Using {name}"
                                    values={{
                                        name: transaction.bridgeRoute
                                            .displayName,
                                    }}
                                />
                            }
                        />
                    )
                case 'FailedTransaction':
                case 'UnknownTransaction': {
                    const explorerLink =
                        to &&
                        getExplorerLink(
                            {
                                address: to,
                                networkHexId,
                                name: null,
                                logo: null,
                                website: null,
                            },
                            networkMap
                        )

                    return (
                        <Content.Header
                            title={transaction.method}
                            subtitle={
                                <Row spacing={4}>
                                    <Text>
                                        <FormattedMessage
                                            id="simulatedTransaction.unknown.using"
                                            defaultMessage="Using {app}"
                                            values={{
                                                app:
                                                    dApp?.title ||
                                                    dApp?.hostname,
                                            }}
                                        />
                                    </Text>

                                    {to &&
                                        (!explorerLink ? (
                                            <Text
                                                color="textSecondary"
                                                variant="paragraph"
                                                weight="regular"
                                            >
                                                {format(to)}
                                            </Text>
                                        ) : (
                                            <Tertiary
                                                color="on_light"
                                                size="regular"
                                                onClick={() => {
                                                    openExternalURL(
                                                        explorerLink
                                                    )
                                                }}
                                            >
                                                {({
                                                    color,
                                                    textVariant,
                                                    textWeight,
                                                }) => (
                                                    <>
                                                        <Text
                                                            color={color}
                                                            variant={
                                                                textVariant
                                                            }
                                                            weight={textWeight}
                                                        >
                                                            {format(to)}
                                                        </Text>
                                                        <ExternalLink
                                                            size={14}
                                                            color={color}
                                                        />
                                                    </>
                                                )}
                                            </Tertiary>
                                        ))}
                                </Row>
                            }
                        />
                    )
                }
                case 'ApprovalTransaction':
                case 'SingleNftApprovalTransaction':
                case 'NftCollectionApprovalTransaction':
                    return (
                        <Content.Header
                            title={
                                <Row spacing={4}>
                                    <Text
                                        variant="title3"
                                        weight="semi_bold"
                                        color="textPrimary"
                                    >
                                        <FormattedMessage
                                            id="simulatedTransaction.approval.title"
                                            defaultMessage="Approve"
                                        />
                                    </Text>
                                    <IconButton
                                        variant="on_light"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_approval_info_click',
                                            })
                                        }
                                    >
                                        {({ color }) => (
                                            <InfoCircle
                                                size={16}
                                                color={color}
                                            />
                                        )}
                                    </IconButton>
                                </Row>
                            }
                        />
                    )
                case 'P2PTransaction':
                case 'P2PNftTransaction':
                    return (
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="simulatedTransaction.P2PTransaction.info.title"
                                    defaultMessage="Send"
                                />
                            }
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(transaction)
            }
        }

        case 'failed':
        case 'not_supported':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(simulationResult)
    }
}
