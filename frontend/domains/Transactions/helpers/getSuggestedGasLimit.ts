import { Big } from 'big.js'

import { toHex } from '@zeal/toolkit/Number'

import { GAS_MULTIPLIER } from '@zeal/domains/RPCRequest/constants'

export const getSuggestedGasLimit = (gasEstimate: string): string => {
    const simulatedGas = Big(BigInt(gasEstimate).toString(10))
    const gasWithMultiplierFloat = simulatedGas
        .times(Big(GAS_MULTIPLIER))
        .toFixed(0)

    return toHex(gasWithMultiplierFloat)
}
