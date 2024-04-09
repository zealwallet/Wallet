import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Text } from '@zeal/uikit/Text'

import { NotEnoughBalance as NotEnoughBalanceType } from '@zeal/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { getEstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'

import { Skeleton } from './Skeleton'
import { Time } from './Time'

import { NetworkFeeLabel, NotEnoughBalanceLabel } from '../components/Labels'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    error: NotEnoughBalanceType
}

export const NotEnoughBalance = ({
    error,
    pollingInterval,
    pollingStartedAt,
}: Props) => {
    const preset = getEstimatedFee(error.pollable)

    return preset ? (
        <FeeInputButton
            disabled
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
                    <Time errored forecastDuration={preset.forecastDuration} />
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
        <Skeleton />
    )
}
