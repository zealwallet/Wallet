import { FormattedMessage, useIntl } from 'react-intl'

import { Content } from '@zeal/uikit/Content'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { DAppSiteInfo } from '@zeal/domains/DApp'
import { SimulatedTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

type Props = {
    simulatedTransaction: SimulatedTransaction
    dAppInfo: DAppSiteInfo | null
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_approval_info_click'
}

export const Layout = ({ onMsg, simulatedTransaction, dAppInfo }: Props) => {
    const { formatMessage } = useIntl()

    switch (simulatedTransaction.type) {
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
                        <Text>
                            <FormattedMessage
                                id="currency.bridge.bridge_status.subtitle"
                                defaultMessage="Using {name}"
                                values={{
                                    name: simulatedTransaction.bridgeRoute
                                        .displayName,
                                }}
                            />
                        </Text>
                    }
                />
            )

        case 'FailedTransaction':
        case 'UnknownTransaction':
            return (
                <Content.Header
                    title={simulatedTransaction.method}
                    subtitle={
                        dAppInfo && (
                            <Text>
                                <FormattedMessage
                                    id="simulatedTransaction.unknown.using"
                                    defaultMessage="Using {app}"
                                    values={{
                                        app:
                                            dAppInfo?.title ||
                                            dAppInfo.hostname,
                                    }}
                                />
                            </Text>
                        )
                    }
                />
            )
        case 'ApprovalTransaction':
        case 'SingleNftApprovalTransaction':
        case 'NftCollectionApprovalTransaction':
            return (
                <Content.Header
                    title={
                        <Row spacing={16}>
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
                                size="small"
                                aria-label={formatMessage({
                                    id: 'approval.approval_info',
                                    defaultMessage: 'What are Approvals?',
                                })}
                                onClick={() =>
                                    onMsg({
                                        type: 'on_approval_info_click',
                                    })
                                }
                            >
                                {({ color }) => (
                                    <InfoCircle size={16} color={color} />
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
            return notReachable(simulatedTransaction)
    }
}
