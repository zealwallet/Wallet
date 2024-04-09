import { FormattedMessage } from 'react-intl'

import { FeeInputButton } from '@zeal/uikit//FeeInputButton'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { KeyStore } from '@zeal/domains/KeyStore'
import { ForecastTime } from '@zeal/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { getEstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'

import { Skeleton } from './Skeleton'

import { NetworkFeeLabel } from '../components/Labels'
import {
    TrxMayTakeLongToProceedBaseFeeLow as TrxMayTakeLongToProceedBaseFeeLowType,
    TrxMayTakeLongToProceedGasPriceLow as TrxMayTakeLongToProceedGasPriceLowType,
    TrxMayTakeLongToProceedPriorityFeeLow as TrxMayTakeLongToProceedPriorityFeeLowType,
} from '../helpers/validation'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    error:
        | TrxMayTakeLongToProceedBaseFeeLowType<KeyStore>
        | TrxMayTakeLongToProceedGasPriceLowType<KeyStore>
        | TrxMayTakeLongToProceedPriorityFeeLowType<KeyStore>
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

export const TrxMayTakeLongToProceed = ({
    error,
    pollingInterval,
    pollingStartedAt,
    onMsg,
}: Props) => {
    const preset = getEstimatedFee(error.pollable)

    return preset ? (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            errored
            left={
                <>
                    <NetworkFeeLabel />
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
                        errored
                        forecastDuration={preset.forecastDuration}
                        selectedPreset={error.pollable.params.selectedPreset}
                    />
                    <Row spacing={4}>
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

                        <LightArrowRight2 size={24} color="iconDefault" />
                    </Row>
                </>
            }
            message={
                <FormattedMessage
                    id="FeeForecastWiget.TrxMayTakeLongToProceed.errorMessage"
                    defaultMessage="Might take long to process"
                />
            }
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
