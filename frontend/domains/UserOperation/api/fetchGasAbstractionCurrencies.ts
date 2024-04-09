import { notReachable } from '@zeal/toolkit'
import { bigIntToHex } from '@zeal/toolkit/BigInt'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import {
    array,
    combine,
    object,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { fetchCryptoCurrencies } from '@zeal/domains/Currency/api/fetchCryptoCurrencies'
import { ImperativeError } from '@zeal/domains/Error'
import { Network } from '@zeal/domains/Network'
import { InitialUserOperation } from '@zeal/domains/UserOperation'
import { FeeAndGasEstimates } from '@zeal/domains/UserOperation/api/fetchFeeAndGasEstimatesFromBundler'
import {
    fetchPaymasterResponse,
    PaymasterGetFeeQuoteOrData,
} from '@zeal/domains/UserOperation/api/fetchPaymasterResponse'

const parse = (
    input: unknown
): Result<
    unknown,
    {
        paymasterAddress: Address
        tokenAddresses: Address[]
    }
> =>
    object(input).andThen((obj) =>
        shape({
            paymasterAddress: string(obj.paymasterAddress).andThen(fromString),
            tokenAddresses: array(obj.feeQuotes).andThen((quotes) =>
                combine(
                    quotes.map((quote) =>
                        object(quote).andThen((quoteObj) =>
                            string(quoteObj.tokenAddress).andThen(fromString)
                        )
                    )
                )
            ),
        })
    )

export const fetchGasAbstractionCurrencies = async ({
    feeAndGasEstimates,
    dummySignature,
    initialUserOperation,
    network,
}: {
    initialUserOperation: InitialUserOperation
    feeAndGasEstimates: FeeAndGasEstimates
    dummySignature: string
    network: Network
}): Promise<{
    paymasterAddress: Address
    currencies: CryptoCurrency[]
}> => {
    // TODO :: @Nicvaniek create narrowed network type for chains that support gas abstraction
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            const { gasEstimate, gasPrice } = feeAndGasEstimates
            const request: PaymasterGetFeeQuoteOrData = {
                id: generateRandomNumber(),
                jsonrpc: '2.0',
                method: 'pm_getFeeQuoteOrData',
                params: [
                    {
                        sender: initialUserOperation.sender,
                        callData: initialUserOperation.callData,
                        nonce: bigIntToHex(initialUserOperation.nonce),
                        initCode: initialUserOperation.initCode || '0x',
                        maxFeePerGas: bigIntToHex(gasPrice.maxFeePerGas),
                        maxPriorityFeePerGas: bigIntToHex(
                            gasPrice.maxPriorityFeePerGas
                        ),
                        callGasLimit: gasEstimate.callGasLimit.toString(),
                        verificationGasLimit:
                            gasEstimate.verificationGasLimit.toString(),
                        preVerificationGas:
                            gasEstimate.preVerificationGas.toString(),
                        paymasterAndData: '0x',
                        signature: dummySignature,
                    },
                    {
                        mode: 'ERC20',
                        tokenInfo: {
                            tokenList: [],
                        },
                    },
                ],
            }
            const response = await fetchPaymasterResponse({
                request,
                network,
            }).then((response) =>
                parse(response).getSuccessResultOrThrow(
                    'Failed to parse Biconomy feeQuote response'
                )
            )

            const cryptoCurrencies = await fetchCryptoCurrencies({
                currencies: [
                    {
                        network,
                        addresses: response.tokenAddresses,
                    },
                ],
            })

            return {
                paymasterAddress: response.paymasterAddress,
                currencies: response.tokenAddresses.map((tokenAddress) => {
                    const currency = cryptoCurrencies.find(
                        (c) => c.address === tokenAddress
                    )

                    if (!currency) {
                        throw new ImperativeError(
                            'Biconomy currency not found in fetched currencies',
                            { tokenAddress }
                        )
                    }

                    return currency
                }),
            }

        case 'custom':
            throw new ImperativeError(
                'Custom network not supported for gas abstraction'
            )
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
