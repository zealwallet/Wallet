import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'
import { GroupHeader, Section } from '@zeal/uikit/Group'
import { BoldCrossRound } from '@zeal/uikit/Icon/BoldCrossRound'
import { ListItem } from '@zeal/uikit/ListItem'
import { Progress } from '@zeal/uikit/Progress'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import {
    KycFailed as KycFailedState,
    OnRampTransactionOnHoldKycEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'

import { FiatCompletedSection } from '../FiatCompletedSection'
import { OnRampProgressTime } from '../OnRampProgressTime'

type Props = {
    networkMap: NetworkMap
    event: OnRampTransactionOnHoldKycEvent
    kycStatus: KycFailedState
    now: number
    startedAt: number
    form: OnRampFeeParams
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_contact_support_clicked' }

export const KycFailed = ({
    onMsg,
    event,
    form,
    knownCurrencies,
    now,
    startedAt,
    networkMap,
}: Props) => {
    const cryptoCurrency = form.outputCurrency
    const network = networkMap[cryptoCurrency.networkHexChainId] || null
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
                                    id="MonitorOnRamp.kycFailedBanner.title"
                                    defaultMessage="Identity verification failed"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="MonitorOnRamp.kycFailedBanner.subtitle"
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
                                                            id="MonitorOnRamp.contactSupport"
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
                <Column spacing={16}>
                    <FiatCompletedSection
                        event={event}
                        knownCurrencies={knownCurrencies}
                    />

                    <Section>
                        <GroupHeader
                            left={({ color, textVariant, textWeight }) => (
                                <Text
                                    color={color}
                                    variant={textVariant}
                                    weight={textWeight}
                                >
                                    <FormattedMessage
                                        id="MonitorOnRamp.to"
                                        defaultMessage="To"
                                    />
                                </Text>
                            )}
                            right={null}
                        />
                        <ListItem
                            aria-current={false}
                            size="large"
                            primaryText={form.outputCurrency.code}
                            avatar={({ size }) => (
                                <Avatar
                                    rightBadge={({ size }) =>
                                        network && (
                                            <Badge
                                                network={network}
                                                size={size}
                                            />
                                        )
                                    }
                                    size={size}
                                    currency={form.outputCurrency}
                                />
                            )}
                            side={{
                                rightIcon: ({ size }) => (
                                    <BoldCrossRound
                                        size={size}
                                        color="iconStatusWarning"
                                    />
                                ),
                            }}
                        />
                    </Section>
                </Column>
            </Content>
            <Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({ type: 'on_contact_support_clicked' })
                    }
                >
                    <FormattedMessage
                        id="MonitorOnRamp.contactSupport"
                        defaultMessage="Contact support"
                    />
                </Button>
            </Actions>
        </>
    )
}
