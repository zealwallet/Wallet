import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { SigningKeyStore } from '@zeal/domains/KeyStore'

import { NonceRangeErrorPopup } from './NonceRangeErrorPopup'
import { TrxLikelyToFailPopup } from './TrxLikelyToFailPopup'
import { TrxMayTakeLongToProceedBaseFeeLowPopup } from './TrxMayTakeLongToProceedBaseFeeLowTypePopup'
import { TrxMayTakeLongToProceedGasPriceLowPopup } from './TrxMayTakeLongToProceedGasPriceLowPopup'
import { TrxMayTakeLongToProceedPriorityFeeLowPopup } from './TrxMayTakeLongToProceedPriorityFeeLowPopup'

import {
    NonceRangeErrorBiggerThanCurrent,
    TrxLikelyToFail,
    TrxMayTakeLongToProceedBaseFeeLow,
    TrxMayTakeLongToProceedGasPriceLow,
    TrxMayTakeLongToProceedPriorityFeeLow,
} from '../FeeForecastWidget/helpers/validation'

type Props = {
    reason:
        | TrxMayTakeLongToProceedBaseFeeLow<SigningKeyStore>
        | TrxMayTakeLongToProceedGasPriceLow<SigningKeyStore>
        | TrxMayTakeLongToProceedPriorityFeeLow<SigningKeyStore>
        | TrxLikelyToFail<SigningKeyStore>
        | NonceRangeErrorBiggerThanCurrent<SigningKeyStore>
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof NonceRangeErrorPopup>
    | MsgOf<typeof TrxLikelyToFailPopup>
    | MsgOf<typeof TrxMayTakeLongToProceedBaseFeeLowPopup>
    | MsgOf<typeof TrxMayTakeLongToProceedGasPriceLowPopup>
    | MsgOf<typeof TrxMayTakeLongToProceedPriorityFeeLowPopup>

export const FeeValidationConfirmationPopup = ({ reason, onMsg }: Props) => {
    switch (reason.type) {
        case 'trx_may_take_long_to_proceed_base_fee_low':
            return (
                <TrxMayTakeLongToProceedBaseFeeLowPopup
                    error={reason}
                    onMsg={onMsg}
                />
            )

        case 'trx_may_take_long_to_proceed_gas_price_low':
            return (
                <TrxMayTakeLongToProceedGasPriceLowPopup
                    error={reason}
                    onMsg={onMsg}
                />
            )

        case 'trx_may_take_long_to_proceed_priority_fee_low':
            return (
                <TrxMayTakeLongToProceedPriorityFeeLowPopup
                    error={reason}
                    onMsg={onMsg}
                />
            )

        case 'trx_likely_to_fail':
            return <TrxLikelyToFailPopup error={reason} onMsg={onMsg} />

        case 'nonce_range_error_bigger_than_current':
            return <NonceRangeErrorPopup error={reason} onMsg={onMsg} />

        /* istanbul ignore next */
        default:
            return notReachable(reason)
    }
}
