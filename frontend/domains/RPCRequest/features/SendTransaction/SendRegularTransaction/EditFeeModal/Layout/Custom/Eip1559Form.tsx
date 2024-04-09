import { components } from '@zeal/api/portfolio'

import { Column } from '@zeal/uikit/Column'

import { InputGasLimit, Msg as InputGasLimitMsg } from './InputGasLimit'
import { InputMaxBaseFee } from './InputMaxBaseFee'
import { InputNonce, Msg as InputNonceMsg } from './InputNonce'
import { InputPriorityFee } from './InputPriorityFee'

import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

type Props = {
    networkState: components['schemas']['Eip1559NetworkState'] | null // we don't have this if BE is down
    gasLimit: string
    nonce: number
    simulatedNonce: number
    fee: components['schemas']['Eip1559CustomPresetRequestFee']
    validationData: EditFormCustomPresetValidationError
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'on_max_base_fee_change'
          maxBaseFee: string
      }
    | {
          type: 'on_max_priority_fee_change'
          maxPriorityFee: string
      }
    | InputGasLimitMsg
    | InputNonceMsg

export const Eip1559Form = ({
    fee,
    gasLimit,
    nonce,
    onMsg,
    validationData,
    simulatedNonce,
    networkState,
}: Props) => {
    return (
        <Column spacing={24}>
            <InputMaxBaseFee
                networkState={networkState}
                maxBaseFee={fee.maxBaseFee}
                error={validationData.maxBaseFee || null}
                onMsg={onMsg}
            />

            <InputPriorityFee
                maxPriorityFee={fee.maxPriorityFee}
                error={validationData.priorityFee || null}
                networkState={networkState}
                onMsg={onMsg}
            />

            <Column spacing={8}>
                <InputGasLimit
                    gasLimit={gasLimit}
                    onMsg={onMsg}
                    error={validationData.gasLimit || null}
                />

                <InputNonce
                    nonce={nonce}
                    simulatedNonce={simulatedNonce}
                    onMsg={onMsg}
                    error={validationData.nonce || null}
                />
            </Column>
        </Column>
    )
}
