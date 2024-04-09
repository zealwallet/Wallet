import { notReachable } from '@zeal/toolkit'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { fetchCryptoCurrencies } from '@zeal/domains/Currency/api/fetchCryptoCurrencies'
import { ImperativeError } from '@zeal/domains/Error'
import { fetchRate2 } from '@zeal/domains/FXRate/api/fetchRate'
import { applyRate2 } from '@zeal/domains/FXRate/helpers/applyRate'
import { CryptoMoney, FiatMoney } from '@zeal/domains/Money'
import { Network } from '@zeal/domains/Network'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { GasInfo } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'

const SCALAR_PRECISION = 1000000

const getFee = ({
    currency,
    gasInfo,
}: {
    gasInfo: GasInfo
    currency: CryptoCurrency
}): CryptoMoney => {
    switch (gasInfo.type) {
        case 'generic':
            return {
                amount: gasInfo.gasUsed * gasInfo.effectiveGasPrice,
                currency,
            }

        case 'l2_rollup':
            const l1FeeWithoutScalar = gasInfo.l1GasUsed * gasInfo.l1GasPrice
            const l1Fee =
                (l1FeeWithoutScalar *
                    BigInt(gasInfo.l1FeeScalar * SCALAR_PRECISION)) /
                BigInt(SCALAR_PRECISION)

            const l2Fee = gasInfo.gasUsed * gasInfo.l2GasPrice

            return {
                amount: l1Fee + l2Fee,
                currency,
            }

        /* istanbul ignore next */
        default:
            return notReachable(gasInfo)
    }
}

export const fetchFinalFee = async ({
    network,
    gasInfo,
}: {
    gasInfo: GasInfo
    network: Network
}): Promise<{
    fee: CryptoMoney
    priceInDefaultCurrency: FiatMoney | null
}> => {
    switch (network.type) {
        case 'predefined': {
            const nativeTokenAddress = getNativeTokenAddress(network)
            const rate = await fetchRate2({
                network,
                tokenAddress: nativeTokenAddress,
            })

            if (!rate) {
                const [nativeCurrency] = await fetchCryptoCurrencies({
                    currencies: [{ addresses: [nativeTokenAddress], network }],
                })

                if (!nativeCurrency) {
                    throw new ImperativeError(
                        `Failed to fetch native currency for missing rate`,
                        { networkHexId: network.hexChainId }
                    )
                }

                return {
                    fee: getFee({
                        gasInfo,
                        currency: nativeCurrency,
                    }),
                    priceInDefaultCurrency: null,
                }
            }

            const fee = getFee({ currency: rate.base, gasInfo })

            const priceInDefaultCurrency = applyRate2({ baseAmount: fee, rate })

            return {
                priceInDefaultCurrency,
                fee,
            }
        }
        case 'custom':
        case 'testnet': {
            const currency = network.nativeCurrency

            return {
                fee: getFee({
                    gasInfo,
                    currency,
                }),
                priceInDefaultCurrency: null,
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
