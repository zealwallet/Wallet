import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { Header } from '@zeal/uikit/Header'
import { Rocket } from '@zeal/uikit/Icon/Rocket'
import { Popup } from '@zeal/uikit/Popup'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'
import {
    NotEnoughBalance,
    validateNotEnoughBalance,
} from '@zeal/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { ForecastTime } from '@zeal/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { EstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import {
    calculate,
    mergeFastFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/calculate'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type LoadedPollable = Extract<
    PollableData<FeeForecastResponse, FeeForecastRequest>,
    { type: 'loaded' | 'reloading' | 'subsequent_failed' }
>

type Props = {
    transactionRequest: SubmitedQueued
    pollingInterval: number
    pollable: LoadedPollable
    keyStore: KeyStore
    installationId: string
    source: components['schemas']['TransactionEventSource']
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'confirm_speed_up_click'; newFee: EstimatedFee }
    | {
          type: 'on_reload_click'
          params: FeeForecastRequest
          data: FeeForecastResponse
      }

export const Layout = ({
    pollable,
    pollingInterval,
    transactionRequest,
    source,
    installationId,
    keyStore,
    onMsg,
}: Props) => {
    const oldFee = transactionRequest.selectedFee
    const newFee = calculate(oldFee, pollable.data.fast)
    const currencies = pollable.data.currencies

    const [pollingStartedAt, setPollingStartedAt] = useState<number>(Date.now)
    useEffect(() => {
        setPollingStartedAt(Date.now())
    }, [pollable])

    const validation = validateNotEnoughBalance({
        pollable: mergeFastFee(pollable, newFee),
        transactionRequest: transactionRequest.rpcRequest,
    }).getFailureReason()

    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => <Rocket size={size} color={color} />}
                title={
                    <FormattedMessage
                        id="transaction.speed_up_popup.title"
                        defaultMessage="Speed up transaction?"
                    />
                }
            />
            <Column spacing={12}>
                <Text
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    {(() => {
                        switch (oldFee.type) {
                            case 'LegacyCustomPresetRequestFee':
                            case 'Eip1559CustomPresetRequestFee':
                                return (
                                    <FormattedMessage
                                        id="transaction.speed_up_popup.description_without_original"
                                        defaultMessage="To speed up, you need to pay a new network fee"
                                    />
                                )
                            case 'LegacyFee':
                            case 'Eip1559Fee':
                                return (
                                    <FormattedMessage
                                        id="transaction.speed_up_popup.description"
                                        defaultMessage="To speed up, you need to pay a new network fee instead of the original fee of {amount}"
                                        values={{
                                            amount: (
                                                <FormattedFee
                                                    fee={oldFee}
                                                    knownCurrencies={currencies}
                                                />
                                            ),
                                        }}
                                    />
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(oldFee)
                        }
                    })()}
                </Text>

                <FeeInputButton
                    errored={!!validation}
                    disabled
                    left={
                        <>
                            <Text
                                ellipsis
                                variant="paragraph"
                                weight="regular"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="FeeForecastWiget.networkFee"
                                    defaultMessage="Network fee"
                                />
                            </Text>
                            <ProgressSpinner
                                key={pollingStartedAt}
                                size={20}
                                durationMs={pollingInterval}
                            />
                        </>
                    }
                    right={
                        <>
                            <ForecastTime
                                selectedPreset={{ type: 'Fast' }}
                                errored
                                forecastDuration={newFee.forecastDuration}
                            />
                            <Text
                                variant="paragraph"
                                weight="regular"
                                color="textPrimary"
                            >
                                <FormattedFee
                                    knownCurrencies={currencies}
                                    fee={newFee}
                                />
                            </Text>
                        </>
                    }
                    message={(() => {
                        if (validation) {
                            return <ErrorMessage error={validation} />
                        }

                        switch (pollable.type) {
                            case 'loaded':
                            case 'reloading':
                                return null

                            case 'subsequent_failed':
                                return (
                                    <FormattedMessage
                                        id="FeeForecastWiget.subsequent_failed.message"
                                        defaultMessage="Estimates might be old, last refresh failed"
                                    />
                                )

                            default:
                                return notReachable(pollable)
                        }
                    })()}
                    ctaButton={(() => {
                        if (validation) {
                            return null
                        }

                        switch (pollable.type) {
                            case 'loaded':
                            case 'reloading':
                                return null

                            case 'subsequent_failed':
                                return (
                                    <Tertiary
                                        size="small"
                                        color="on_light"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_reload_click',
                                                data: pollable.data,
                                                params: pollable.params,
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
                                                variant={textVariant}
                                                weight={textWeight}
                                            >
                                                <FormattedMessage
                                                    id="action.retry"
                                                    defaultMessage="Retry"
                                                />
                                            </Text>
                                        )}
                                    </Tertiary>
                                )

                            default:
                                return notReachable(pollable)
                        }
                    })()}
                />
            </Column>
            <Popup.Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="transaction.speed_up_popup.cancel"
                        defaultMessage="No, wait"
                    />
                </Button>

                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        postUserEvent({
                            type: 'TransactionReplacementRequestedEvent',
                            replacementType: 'speedup',
                            network: transactionRequest.networkHexId,
                            source,
                            installationId,
                            keystoreType: keystoreToUserEventType(keyStore),
                            keystoreId: keyStore.id,
                        })
                        onMsg({ type: 'confirm_speed_up_click', newFee })
                    }}
                >
                    <FormattedMessage
                        id="transaction.speed_up_popup.confirm"
                        defaultMessage="Yes, speed up"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}

const ErrorMessage = ({ error }: { error: NotEnoughBalance }) => {
    switch (error.type) {
        case 'not_enough_balance':
            const { currencies } = error.pollable.data
            const nativeCurrency = currencies[error.requiredAmount.currencyId]

            return (
                <FormattedMessage
                    id="FeeForecastWiget.NotEnoughBalance.errorMessage"
                    defaultMessage="Need {amount} {symbol} to submit transaction"
                    values={{
                        amount: (
                            <FormattedTokenBalances
                                knownCurrencies={currencies}
                                money={error.requiredAmount}
                            />
                        ),
                        symbol: nativeCurrency.symbol,
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error.type)
    }
}
