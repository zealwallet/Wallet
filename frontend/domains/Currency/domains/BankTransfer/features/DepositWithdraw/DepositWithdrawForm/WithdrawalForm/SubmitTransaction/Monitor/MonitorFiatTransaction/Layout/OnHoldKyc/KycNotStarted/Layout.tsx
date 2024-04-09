import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'

import {
    KycNotStarted as KycNotStartedState,
    OffRampOnHoldKycEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { OffRampProgress } from '../../OffRampProgress'

type Props = {
    kycStatus: KycNotStartedState
    networkMap: NetworkMap
    offRampTransactionEvent: OffRampOnHoldKycEvent
    withdrawalRequest: WithdrawalRequest
    network: Network
    transactionHash: string
    now: number
    startedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_verify_account_clicked' }

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
                                id="MonitoroffRamp.kycNotStartedBanner.title"
                                defaultMessage="Identity verification required"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="MonitoroffRamp.kycNotStartedBanner.subtitle"
                                defaultMessage="You have reached the transaction limit. Please verify your account within 72 hours to complete the transaction. Otherwise, we’ll revert the transaction."
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
                onClick={() => onMsg({ type: 'on_verify_account_clicked' })}
            >
                <FormattedMessage
                    id="MonitoroffRamp.verifyAccount"
                    defaultMessage="Verify account"
                />
            </Button>
        </Actions>
    </>
)
