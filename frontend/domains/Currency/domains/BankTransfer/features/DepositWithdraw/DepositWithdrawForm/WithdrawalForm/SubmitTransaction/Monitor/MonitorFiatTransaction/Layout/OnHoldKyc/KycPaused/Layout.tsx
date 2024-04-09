import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'

import {
    KycPaused,
    OffRampOnHoldKycEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { OffRampProgress } from '../../OffRampProgress'

type Props = {
    kycStatus: KycPaused
    networkMap: NetworkMap
    offRampTransactionEvent: OffRampOnHoldKycEvent
    withdrawalRequest: WithdrawalRequest
    network: Network
    transactionHash: string
    now: number
    startedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_review_verification_issues_clicked' }

export const Layout = ({
    onMsg,
    network,
    networkMap,
    now,
    startedAt,
    transactionHash,
    withdrawalRequest,
    kycStatus,
    offRampTransactionEvent,
}: Props) => (
    <>
        <Content
            header={
                <Content.Header
                    title={
                        <FormattedMessage
                            id="currency.bankTransfer.withdrawal_status.title"
                            defaultMessage="Withdrawal"
                        />
                    }
                />
            }
            footer={
                <Column spacing={0}>
                    <OffRampProgress
                        network={network}
                        now={now}
                        offRampTransactionEvent={offRampTransactionEvent}
                        startedAt={startedAt}
                        transactionHash={transactionHash}
                        withdrawalRequest={withdrawalRequest}
                    />

                    <Divider variant="default" />

                    <BannerSolid
                        variant="warning"
                        title={
                            <FormattedMessage
                                id="MonitoroffRamp.kycPausedBanner.title"
                                defaultMessage="Identity verification paused"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="MonitoroffRamp.kycPausedBanner.subtitle"
                                defaultMessage="This transaction will be on hold while verification is paused. Please review and resolve verifications issues to continue in 72 hours. Otherwise, we’ll revert the transaction."
                            />
                        }
                    />
                </Column>
            }
        >
            <OffRampTransactionView
                variant={{
                    type: 'status',
                    offRampTransactionEvent,
                    kycStatus,
                }}
                networkMap={networkMap}
                withdrawalRequest={withdrawalRequest}
            />
        </Content>

        <Actions>
            <Button
                size="regular"
                variant="primary"
                onClick={() =>
                    onMsg({ type: 'on_review_verification_issues_clicked' })
                }
            >
                <FormattedMessage
                    id="MonitoroffRamp.reviewVerificationIssues"
                    defaultMessage="Review verification issues"
                />
            </Button>
        </Actions>
    </>
)
