import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { Header } from '@zeal/uikit/Header'
import { CloseSquare } from '@zeal/uikit/Icon/CloseSquare'
import { Popup } from '@zeal/uikit/Popup'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { generateRandomNumber, toHex } from '@zeal/toolkit/Number'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import {
    CancelSimulated,
    SubmitedQueued,
} from '@zeal/domains/TransactionRequest'
import {
    NotEnoughBalance,
    validateNotEnoughBalance,
} from '@zeal/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import { fetchFeeForecast } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import {
    CANCEL_GAS_AMOUNT,
    DEFAULT_CANCEL_FEE_PRESET,
} from '@zeal/domains/Transactions/constants'
import { ForecastTime } from '@zeal/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import {
    calculate,
    mergeFastFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/calculate'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keyStore: KeyStore
    installationId: string
    source: components['schemas']['TransactionEventSource']
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'cancellation_confirmed'
          transactionRequest: CancelSimulated
      }
    | { type: 'close' }

const POLLING_INTERVAL_MS = 5000

export const SimulateCancelPopup = ({
    transactionRequest,
    networkMap,
    keyStore,
    source,
    installationId,
    networkRPCMap,
    onMsg,
}: Props) => {
    const cancelRPCRequest: EthSendTransaction = {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'eth_sendTransaction',
        params: [
            {
                from: transactionRequest.account.address,
                to: transactionRequest.account.address,
                data: '',
                nonce: toHex(transactionRequest.selectedNonce),
                value: '0x0',
                gas: CANCEL_GAS_AMOUNT,
            },
        ],
    }

    const [pollingStartedAt, setPollingStartedAt] = useState<number>(Date.now)
    const [pollable, setPollable] = usePollableData(
        fetchFeeForecast,
        {
            type: 'loading',
            params: {
                gasEstimate: CANCEL_GAS_AMOUNT,
                gasLimit: CANCEL_GAS_AMOUNT,
                network: findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                ),
                networkRPCMap,
                address: transactionRequest.account.address,
                selectedPreset: DEFAULT_CANCEL_FEE_PRESET,
                sendTransactionRequest: cancelRPCRequest,
            },
        },
        {
            pollIntervalMilliseconds: POLLING_INTERVAL_MS,
        }
    )
    useEffect(() => {
        setPollingStartedAt(Date.now())
    }, [pollable])

    switch (pollable.type) {
        case 'reloading':
        case 'subsequent_failed':
        case 'loaded':
            const oldFee = transactionRequest.selectedFee
            const newFee = calculate(oldFee, pollable.data.fast) // Here we select fee we will use for cancel
            const currencies = pollable.data.currencies

            const validationError = validateNotEnoughBalance({
                transactionRequest: transactionRequest.rpcRequest,
                pollable: mergeFastFee(pollable, newFee),
            }).getFailureReason()

            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ color, size }) => (
                            <CloseSquare size={size} color={color} />
                        )}
                        title={
                            <FormattedMessage
                                id="transaction.cancel_popup.title"
                                defaultMessage="Stop transaction?"
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
                                                id="transaction.cancel_popup.description_without_original"
                                                defaultMessage="To stop, you need to pay a new network fee"
                                            />
                                        )
                                    case 'LegacyFee':
                                    case 'Eip1559Fee':
                                        return (
                                            <FormattedMessage
                                                id="transaction.cancel_popup.description"
                                                defaultMessage="To stop, you need to pay a new network fee instead of the original fee of {oldFee}"
                                                values={{
                                                    oldFee: (
                                                        <FormattedFee
                                                            fee={oldFee}
                                                            knownCurrencies={
                                                                currencies
                                                            }
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
                            errored={!!validationError}
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
                                        durationMs={POLLING_INTERVAL_MS}
                                    />
                                </>
                            }
                            right={
                                <>
                                    <ForecastTime
                                        selectedPreset={{ type: 'Fast' }}
                                        errored
                                        forecastDuration={
                                            newFee.forecastDuration
                                        }
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
                                if (validationError) {
                                    return (
                                        <ErrorMessage error={validationError} />
                                    )
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
                                if (validationError) {
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
                                                    setPollable({
                                                        type: 'reloading',
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
                    <Actions>
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="transaction.cancel_popup.cancel"
                                defaultMessage="No, wait"
                            />
                        </Button>

                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                postUserEvent({
                                    type: 'TransactionReplacementRequestedEvent',
                                    replacementType: 'cancel',
                                    network: transactionRequest.networkHexId,
                                    source,
                                    installationId,
                                    keystoreId: keyStore.id,
                                    keystoreType:
                                        keystoreToUserEventType(keyStore),
                                })
                                onMsg({
                                    type: 'cancellation_confirmed',
                                    transactionRequest: {
                                        state: 'cancel_simulated',

                                        account: transactionRequest.account,
                                        dApp: transactionRequest.dApp,
                                        networkHexId:
                                            transactionRequest.networkHexId,
                                        rawTransaction:
                                            transactionRequest.rawTransaction,
                                        rpcRequest:
                                            transactionRequest.rpcRequest,

                                        selectedFee:
                                            transactionRequest.selectedFee,
                                        selectedGas:
                                            transactionRequest.selectedGas,
                                        selectedNonce:
                                            transactionRequest.selectedNonce,

                                        simulation:
                                            transactionRequest.simulation,
                                        gasEstimate:
                                            transactionRequest.gasEstimate,
                                        submitedTransaction:
                                            transactionRequest.submitedTransaction,

                                        cancelRPCRequest,
                                        cancelFee: newFee,
                                    },
                                })
                            }}
                        >
                            <FormattedMessage
                                id="transaction.cancel_popup.confirm"
                                defaultMessage="Yes, stop"
                            />
                        </Button>
                    </Actions>
                </Popup.Layout>
            )

        case 'loading':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size, color }) => (
                            <CloseSquare size={size} color={color} />
                        )}
                        title={
                            <FormattedMessage
                                id="transaction.cancel_popup.title"
                                defaultMessage="Stop transaction?"
                            />
                        }
                    />
                    <Column spacing={12}>
                        <Row spacing={0} alignX="stretch">
                            <Text
                                variant="callout"
                                weight="medium"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="transaction.cancel_popup.stopping_fee"
                                    defaultMessage="Network stopping fee"
                                />
                            </Text>
                            <Skeleton variant="default" width={80} />
                        </Row>
                        <Column spacing={4}>
                            <Skeleton
                                variant="default"
                                width="100%"
                                height={16}
                            />
                            <Skeleton
                                variant="default"
                                width="100%"
                                height={16}
                            />
                            <Skeleton
                                variant="default"
                                width="70%"
                                height={16}
                            />
                        </Column>
                    </Column>
                    <Actions>
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="transaction.cancel_popup.cancel"
                                defaultMessage="No, wait"
                            />
                        </Button>

                        <Button variant="primary" size="regular" disabled>
                            <FormattedMessage
                                id="transaction.cancel_popup.confirm"
                                defaultMessage="Yes, stop"
                            />
                        </Button>
                    </Actions>
                </Popup.Layout>
            )

        case 'error':
            return (
                <AppErrorPopup
                    error={parseAppError(pollable.error)}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'try_again_clicked':
                                setPollable({
                                    type: 'loading',
                                    params: pollable.params,
                                })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        default:
            return notReachable(pollable)
    }
}

const ErrorMessage = ({ error }: { error: NotEnoughBalance }) => {
    const { currencies } = error.pollable.data
    const nativeCurrency = currencies[error.requiredAmount.currencyId]

    switch (error.type) {
        case 'not_enough_balance':
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
