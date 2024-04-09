import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'

import {
    KycApproved,
    KycInProgress,
    OffRampOnHoldKycEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { OffRampProgress } from '../OffRampProgress'

type Props = {
    kycStatus: KycApproved | KycInProgress

    networkMap: NetworkMap
    offRampTransactionEvent: OffRampOnHoldKycEvent
    withdrawalRequest: WithdrawalRequest
    network: Network
    transactionHash: string
    now: number
    startedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const KycInProgressOrApproved = ({
    onMsg,
    network,
    offRampTransactionEvent,
    transactionHash,
    withdrawalRequest,
    kycStatus,
    networkMap,
    now,
    startedAt,
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
                        variant="neutral"
                        title={
                            <FormattedMessage
                                id="MonitoroffRamp.kycInProgressBanner.title"
                                defaultMessage="Account verification in progress"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="MonitoroffRamp.kycInProgressBanner.subtitle"
                                defaultMessage="Your transaction will start again once verification is complete."
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
                onClick={() => onMsg({ type: 'close' })}
            >
                <FormattedMessage id="actions.close" defaultMessage="Close" />
            </Button>
        </Actions>
    </>
)
