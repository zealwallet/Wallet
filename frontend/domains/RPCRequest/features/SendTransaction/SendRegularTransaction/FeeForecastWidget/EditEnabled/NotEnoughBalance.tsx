import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { LightDangerTriangle } from '@zeal/uikit/Icon/LightDangerTriangle'
import { Text } from '@zeal/uikit/Text'

import { NotEnoughBalance as NotEnoughBalanceType } from '@zeal/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import { ForecastTime } from '@zeal/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { getEstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'

import { Skeleton } from './Skeleton'

import { NetworkFeeLabel, NotEnoughBalanceLabel } from '../components/Labels'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    error: NotEnoughBalanceType
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

export const NotEnoughBalance = ({ error, onMsg }: Props) => {
    const preset = getEstimatedFee(error.pollable)

    return preset ? (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            errored
            left={
                <>
                    <NetworkFeeLabel />
                    <LightDangerTriangle size={20} color="iconStatusCritical" />
                </>
            }
            right={
                <>
                    <ForecastTime
                        errored
                        forecastDuration={preset.forecastDuration}
                        selectedPreset={error.pollable.params.selectedPreset}
                    />
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        <FormattedFee
                            knownCurrencies={error.pollable.data.currencies}
                            fee={preset}
                        />
                    </Text>
                </>
            }
            message={<NotEnoughBalanceLabel error={error} />}
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
