import { FormattedMessage, useIntl } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import {
    FeeSelectorButton,
    FeeSelectorButtonSkeleton,
} from '@zeal/uikit/FeeSelectorButton'
import { BoldCheetah } from '@zeal/uikit/Icon/BoldCheetah'
import { BoldRabbit } from '@zeal/uikit/Icon/BoldRabbit'
import { BoldTurtle } from '@zeal/uikit/Icon/BoldTurtle'
import { Row } from '@zeal/uikit/Row'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { NetworkHexId } from '@zeal/domains/Network'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
    PredefinedPreset,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'

import { validateEditFormPresetValidationError } from '../../FeeForecastWidget/helpers/validation'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    transactionRequest: NotSigned
    onMsg: (msg: Msg) => void
}

export type Msg = {
    type: 'on_predefined_fee_preset_selected'
    preset: PredefinedPreset
    networkHexId: NetworkHexId
}

export const SelectPreset = ({
    pollableData,
    transactionRequest,
    onMsg,
}: Props) => {
    const validationData = validateEditFormPresetValidationError({
        pollableData,
        transactionRequest,
    })

    const { formatMessage } = useIntl()

    const sectionLabel = formatMessage({
        id: 'EditFeeModal.SelectPreset.ariaLabel',
        defaultMessage: 'Select fee preset',
    })

    switch (validationData.type) {
        case 'Failure': {
            const reason = validationData.reason
            switch (reason.type) {
                case 'pollable_failed_to_fetch':
                    return (
                        <Row
                            spacing={8}
                            aria-label={sectionLabel}
                            alignY="stretch"
                        >
                            <FeeSelectorButton
                                disabled
                                amount="$?"
                                icon={({ color }) => (
                                    <BoldTurtle size={20} color={color} />
                                )}
                                tabindex={1}
                                time={null}
                                title={
                                    <FormattedMessage
                                        id="EditFeeModal.SelectPreset.slow"
                                        defaultMessage="Slow"
                                    />
                                }
                            />

                            <FeeSelectorButton
                                disabled
                                amount="$?"
                                icon={({ color }) => (
                                    <BoldRabbit size={20} color={color} />
                                )}
                                tabindex={2}
                                time={null}
                                title={
                                    <FormattedMessage
                                        id="EditFeeModal.SelectPreset.normal"
                                        defaultMessage="Normal"
                                    />
                                }
                            />

                            <FeeSelectorButton
                                disabled
                                amount="$?"
                                icon={({ color }) => (
                                    <BoldCheetah size={20} color={color} />
                                )}
                                tabindex={3}
                                time={null}
                                title={
                                    <FormattedMessage
                                        id="EditFeeModal.SelectPreset.fast"
                                        defaultMessage="Fast"
                                    />
                                }
                            />
                        </Row>
                    )

                case 'pollable_data_loading':
                    return (
                        <Row spacing={8} alignY="stretch">
                            <FeeSelectorButtonSkeleton />

                            <FeeSelectorButtonSkeleton />

                            <FeeSelectorButtonSkeleton />
                        </Row>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(reason)
            }
        }

        case 'Success': {
            const request = validationData.data.pollable.params
            const { slow, normal, fast, currencies } =
                validationData.data.pollable.data

            return (
                <Row spacing={8} aria-label={sectionLabel} alignY="stretch">
                    <FeeSelectorButton
                        selected={request.selectedPreset.type === 'Slow'}
                        amount={
                            <FormattedFee
                                fee={slow}
                                knownCurrencies={currencies}
                            />
                        }
                        icon={({ color }) => (
                            <BoldTurtle size={20} color={color} />
                        )}
                        tabindex={1}
                        time={<Time duration={slow.forecastDuration} />}
                        title={
                            <FormattedMessage
                                id="EditFeeModal.SelectPreset.slow"
                                defaultMessage="Slow"
                            />
                        }
                        onClick={() =>
                            onMsg({
                                type: 'on_predefined_fee_preset_selected',
                                networkHexId: transactionRequest.networkHexId,
                                preset: { type: 'Slow' },
                            })
                        }
                    />

                    <FeeSelectorButton
                        selected={request.selectedPreset.type === 'Normal'}
                        amount={
                            <FormattedFee
                                fee={normal}
                                knownCurrencies={currencies}
                            />
                        }
                        icon={({ color }) => (
                            <BoldRabbit size={20} color={color} />
                        )}
                        tabindex={2}
                        time={<Time duration={normal.forecastDuration} />}
                        title={
                            <FormattedMessage
                                id="EditFeeModal.SelectPreset.normal"
                                defaultMessage="Normal"
                            />
                        }
                        onClick={() =>
                            onMsg({
                                type: 'on_predefined_fee_preset_selected',
                                networkHexId: transactionRequest.networkHexId,
                                preset: { type: 'Normal' },
                            })
                        }
                    />

                    <FeeSelectorButton
                        selected={request.selectedPreset.type === 'Fast'}
                        amount={
                            <FormattedFee
                                fee={fast}
                                knownCurrencies={currencies}
                            />
                        }
                        icon={({ color }) => (
                            <BoldCheetah size={20} color={color} />
                        )}
                        tabindex={3}
                        time={<Time duration={fast.forecastDuration} />}
                        title={
                            <FormattedMessage
                                id="EditFeeModal.SelectPreset.fast"
                                defaultMessage="Fast"
                            />
                        }
                        onClick={() =>
                            onMsg({
                                type: 'on_predefined_fee_preset_selected',
                                networkHexId: transactionRequest.networkHexId,
                                preset: { type: 'Fast' },
                            })
                        }
                    />
                </Row>
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(validationData)
    }
}

type TimeProps = {
    duration: components['schemas']['ForecastDuration']
}

export const Time = ({ duration }: TimeProps) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (duration.type) {
        case 'WithinForecast':
            return <>{formatHumanReadableDuration(duration.durationMs)}</>

        case 'OutsideOfForecast':
            return (
                <FormattedMessage
                    id="EditFeeModal.SelectPreset.Time.unknown"
                    defaultMessage="Time Unknown"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(duration)
    }
}
