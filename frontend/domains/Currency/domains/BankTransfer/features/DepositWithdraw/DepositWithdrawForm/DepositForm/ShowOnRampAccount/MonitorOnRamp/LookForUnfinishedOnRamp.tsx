import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Section } from '@zeal/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Progress } from '@zeal/uikit/Progress'
import { Screen } from '@zeal/uikit/Screen'
import { Spinner } from '@zeal/uikit/Spinner'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchLastUnfinishedOnRamp } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastUnfinishedOnRamp'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

type Props = {
    account: Account
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap

    form: OnRampFeeParams
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_onramp_found'; event: OnRampTransactionEvent }

export const LookForUnfinishedOnRamp = ({
    onMsg,
    account,
    networkMap,
    form,
    bankTransferCurrencies,
    bankTransferInfo,
    keyStoreMap,
}: Props) => {
    const liveMsg = useLiveRef(onMsg)
    const [pollable] = usePollableData(
        fetchLastUnfinishedOnRamp,
        {
            type: 'loading',
            params: {
                bankTransferCurrencies,
                bankTransferInfo,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: 5000,
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                if (pollable.data) {
                    liveMsg.current({
                        type: 'on_onramp_found',
                        event: pollable.data,
                    })
                }
                break

            case 'loading':
            case 'error':
                // We do nothing if there is no data yet
                break

            default:
                notReachable(pollable)
        }
    }, [pollable, liveMsg])

    return (
        <Screen padding="form" background="light">
            <ActionBar
                network={null}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />

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
                    <Progress
                        initialProgress={0}
                        progress={10}
                        title={
                            <FormattedMessage
                                id="MonitorOnRamp.waitingForTransfer"
                                defaultMessage="Waiting for you to transfer funds"
                            />
                        }
                        variant="neutral"
                    />
                }
            >
                <Column spacing={16}>
                    <Section>
                        <GroupHeader
                            left={({ color, textVariant, textWeight }) => (
                                <Text
                                    color={color}
                                    variant={textVariant}
                                    weight={textWeight}
                                >
                                    <FormattedMessage
                                        id="MonitorOnRamp.from"
                                        defaultMessage="From"
                                    />
                                </Text>
                            )}
                            right={null}
                        />
                        <ListItem
                            aria-current={false}
                            size="large"
                            primaryText={form.inputCurrency.code}
                            avatar={({ size }) => (
                                <Avatar
                                    rightBadge={() => null}
                                    size={size}
                                    currency={form.inputCurrency}
                                />
                            )}
                            side={{
                                rightIcon: ({ size }) => (
                                    <Spinner
                                        size={size}
                                        color="iconStatusNeutral"
                                    />
                                ),
                            }}
                        />
                    </Section>

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
                                    rightBadge={({ size }) => (
                                        <Badge
                                            network={
                                                networkMap[
                                                    form.outputCurrency
                                                        .networkHexChainId
                                                ]
                                            }
                                            size={size}
                                        />
                                    )}
                                    size={size}
                                    currency={form.outputCurrency}
                                />
                            )}
                        />
                    </Section>
                </Column>
            </Content>
        </Screen>
    )
}
