import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'
import { CheckMarkCircle } from '@zeal/uikit/Icon/CheckMarkCircle'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import {
    KycStatus,
    OffRampSuccessEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

type Props = {
    withdrawalRequest: WithdrawalRequest
    kycStatus: KycStatus
    offRampTransactionEvent: OffRampSuccessEvent
    network: Network
    networkMap: NetworkMap
    transactionHash: string
    onMsg: (msg: Msg) => void
}

type State = { type: 'splash_animation' } | { type: 'final_success_screen' }

type Msg = { type: 'close' }

export const FiatTransferCompleted = ({
    withdrawalRequest,
    networkMap,
    kycStatus,
    network,
    offRampTransactionEvent,
    transactionHash,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'splash_animation' })

    return (
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
                        <Progress
                            initialProgress={80}
                            progress={100}
                            title={
                                <FormattedMessage
                                    id="currency.bankTransfer.off_ramp.complete"
                                    defaultMessage="Check your bank account"
                                />
                            }
                            variant="success"
                            right={(() => {
                                const explorerLink = getExplorerLink(
                                    { transactionHash },
                                    network
                                )

                                return (
                                    <Row spacing={4}>
                                        <CheckMarkCircle
                                            size={16}
                                            color="iconStatusSuccessOnColor"
                                        />
                                        {explorerLink && (
                                            <Tertiary
                                                size="regular"
                                                color="success"
                                                onClick={() =>
                                                    openExternalURL(
                                                        explorerLink
                                                    )
                                                }
                                            >
                                                {({
                                                    color,
                                                    textVariant,
                                                    textWeight,
                                                }) => (
                                                    <Row
                                                        spacing={4}
                                                        alignY="center"
                                                    >
                                                        <Text
                                                            color={color}
                                                            variant={
                                                                textVariant
                                                            }
                                                            weight={textWeight}
                                                        >
                                                            0x
                                                        </Text>

                                                        <ExternalLink
                                                            size={14}
                                                            color={color}
                                                        />
                                                    </Row>
                                                )}
                                            </Tertiary>
                                        )}
                                    </Row>
                                )
                            })()}
                        />
                        <Divider variant="default" />

                        <BannerSolid
                            variant="success"
                            title={null}
                            subtitle={
                                <FormattedMessage
                                    id="currency.bankTransfer.withdrawal_status.finished.subtitle"
                                    defaultMessage="The funds should have arrived in your bank account by now."
                                />
                            }
                        />
                    </Column>
                }
            >
                {(() => {
                    switch (state.type) {
                        case 'splash_animation':
                            return (
                                <Content.Splash
                                    onAnimationComplete={() =>
                                        setState({
                                            type: 'final_success_screen',
                                        })
                                    }
                                    variant="success"
                                    title={
                                        <FormattedMessage
                                            id="currency.bankTransfer.withdrawal_status.success"
                                            defaultMessage="Sent to your bank"
                                        />
                                    }
                                />
                            )
                        case 'final_success_screen':
                            return (
                                <OffRampTransactionView
                                    variant={{
                                        type: 'status',
                                        offRampTransactionEvent,
                                        kycStatus,
                                    }}
                                    networkMap={networkMap}
                                    withdrawalRequest={withdrawalRequest}
                                />
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(state)
                    }
                })()}
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
