import { CryptoMoney, FiatMoney } from '@zeal/domains/Money'

import { BundlerGasEstimate, BundlerGasPrice } from './GasEstimate'

export type GasAbstractionTransactionFee =
    | NativeGasAbstractionTransactionFee
    | ERC20GasAbstractionTransactionFee

export type NativeGasAbstractionTransactionFee = {
    type: 'native_gas_abstraction_transaction_fee'
    feeInTokenCurrency: CryptoMoney
    feeInDefaultCurrency: FiatMoney | null

    gasEstimate: BundlerGasEstimate
    gasPrice: BundlerGasPrice
    callData: string
}

export type ERC20GasAbstractionTransactionFee = {
    type: 'erc20_gas_abstraction_transaction_fee'
    feeInTokenCurrency: CryptoMoney
    feeInDefaultCurrency: FiatMoney | null

    gasEstimate: BundlerGasEstimate
    gasPrice: BundlerGasPrice
    callData: string // Might include approval
}
