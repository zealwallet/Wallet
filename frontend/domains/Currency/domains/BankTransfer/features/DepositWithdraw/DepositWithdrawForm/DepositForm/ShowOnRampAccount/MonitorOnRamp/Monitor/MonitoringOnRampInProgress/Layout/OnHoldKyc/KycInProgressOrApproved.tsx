import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'
import { Progress } from '@zeal/uikit/Progress'

import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    KycApproved as KycApprovedState,
    KycInProgress as KycInProgressState,
    OnRampTransactionOnHoldKycEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { NetworkMap } from '@zeal/domains/Network'

import { CryptoPendingSection } from '../CryptoPendingSection'
import { FiatCompletedSection } from '../FiatCompletedSection'
import { OnRampProgressTime } from '../OnRampProgressTime'

type Props = {
    networkMap: NetworkMap
    event: OnRampTransactionOnHoldKycEvent
    kycStatus: KycInProgressState | KycApprovedState
    now: number
    startedAt: number
    form: OnRampFeeParams
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const KycInProgressOrApproved = ({
    onMsg,
    event,
    form,
    knownCurrencies,
    networkMap,
    now,
    startedAt,
}: Props) => {
    return (
        <>
            <Content
                header={
                    <Content.Header
                        title={
                            <FormattedMessage
                                id="currency.bankTransfer.deposit_status.title"
                                defaultMessage="Deposit"
                            />
                        }
                    />
                }
                footer={
                    <Column spacing={0}>
                        <Progress
                            variant="warning"
                            initialProgress={20}
                            progress={20}
                            title={
                                <FormattedMessage
                                    id="MonitorOnRamp.onHold"
                                    defaultMessage="On hold"
                                />
                            }
                            right={
                                <OnRampProgressTime
                                    now={now}
                                    startedAt={startedAt}
                                />
                            }
                        />

                        <Divider variant="default" />

                        <BannerSolid
                            variant="neutral"
                            title={
                                <FormattedMessage
                                    id="MonitorOnRamp.kycInProgressBanner.title"
                                    defaultMessage="Account verification in progress"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="MonitorOnRamp.kycInProgressBanner.subtitle"
                                    defaultMessage="Your transaction will start again once verification is complete."
                                />
                            }
                        />
                    </Column>
                }
            >
                <Column spacing={16}>
                    <FiatCompletedSection
                        event={event}
                        knownCurrencies={knownCurrencies}
                    />

                    <CryptoPendingSection
                        event={event}
                        form={form}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />
                </Column>
            </Content>

            <Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="actions.close"
                        defaultMessage="Close"
                    />
                </Button>
            </Actions>
        </>
    )
}
