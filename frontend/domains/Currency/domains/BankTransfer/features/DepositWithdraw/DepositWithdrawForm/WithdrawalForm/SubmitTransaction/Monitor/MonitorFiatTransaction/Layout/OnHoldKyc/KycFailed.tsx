import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import {
    KycFailed as KycFailedState,
    OffRampOnHoldKycEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { OffRampProgress } from '../OffRampProgress'

type Props = {
    kycStatus: KycFailedState

    networkMap: NetworkMap
    offRampTransactionEvent: OffRampOnHoldKycEvent
    withdrawalRequest: WithdrawalRequest
    network: Network
    transactionHash: string
    now: number
    startedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_contact_support_clicked' }

export const KycFailed = ({
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
                                id="MonitoroffRamp.kycFailedBanner.title"
                                defaultMessage="Identity verification failed"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="MonitoroffRamp.kycFailedBanner.subtitle"
                                defaultMessage="We had issues verifying your identity and need additional information. To continue, please {contact_support}"
                                values={{
                                    contact_support: (
                                        <Tertiary
                                            color="neutral"
                                            size="regular"
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_contact_support_clicked',
                                                })
                                            }
                                        >
                                            {({
                                                color,
                                                textVariant,
                                                textWeight,
                                            }) => (
                                                <Text
                                                    color={color}
                                                    weight={textWeight}
                                                    variant={textVariant}
                                                >
                                                    <FormattedMessage
                                                        id="MonitoroffRamp.contactSupport"
                                                        defaultMessage="Contact support"
                                                    />
                                                </Text>
                                            )}
                                        </Tertiary>
                                    ),
                                }}
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
                onClick={() => onMsg({ type: 'on_contact_support_clicked' })}
            >
                <FormattedMessage
                    id="MonitoroffRamp.contactSupport"
                    defaultMessage="Contact support"
                />
            </Button>
        </Actions>
    </>
)
