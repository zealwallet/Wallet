import { components } from '@zeal/api/portfolio'

import { Column } from '@zeal/uikit/Column'

import { InputGasLimit, Msg as InputGasLimitMsg } from './InputGasLimit'
import { InputGasPrice } from './InputGasPrice'
import { InputNonce, Msg as InputNonceMsg } from './InputNonce'

import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

type Props = {
    gasLimit: string
    nonce: number
    simulatedNonce: number
    fee: components['schemas']['LegacyCustomPresetRequestFee']
    validationData: EditFormCustomPresetValidationError
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'on_gas_price_change'
          gasPrice: string
      }
    | { type: 'on_edit_gas_limit_click' }
    | InputNonceMsg
    | InputGasLimitMsg

export const LegacyForm = ({
    fee,
    onMsg,
    gasLimit,
    nonce,
    simulatedNonce,
    validationData,
}: Props) => {
    return (
        <Column spacing={24}>
            <InputGasPrice
                error={validationData.gasPrice || null}
                gasPrice={fee.gasPrice}
                onMsg={onMsg}
            />

            <Column spacing={8}>
                <InputGasLimit
                    gasLimit={gasLimit}
                    onMsg={onMsg}
                    error={validationData.gasLimit || null}
                />

                <InputNonce
                    simulatedNonce={simulatedNonce}
                    nonce={nonce}
                    onMsg={onMsg}
                    error={validationData.nonce || null}
                />
            </Column>
        </Column>
    )
}
