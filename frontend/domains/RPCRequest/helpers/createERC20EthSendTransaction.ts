import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Money } from '@zeal/domains/Money'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ZealWeb3RPCProvider } from '@zeal/domains/RPCRequest/helpers/ZealWeb3RPCProvider'

const CONTRACT_ABI = [
    {
        type: 'function' as const,
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
    },
] as const

type Params = {
    fromAccount: Account
    toAddress: Address
    network: Network
    networkRPCMap: NetworkRPCMap
    amount: Money
    knownCurrencies: KnownCurrencies
}

export const createERC20EthSendTransaction = ({
    fromAccount,
    knownCurrencies,
    toAddress,
    network,
    networkRPCMap,
    amount,
}: Params): EthSendTransaction => {
    const currency = knownCurrencies[amount.currencyId]
    if (!currency) {
        throw new Error(
            `Trying to create ERC20 trx, but fined to look up currency ${amount.currencyId}`
        )
    }
    switch (currency.type) {
        case 'FiatCurrency':
            throw new Error(
                `Trying to create ERC20 trx, but got FiatCurrency ${currency.id}`
            )
        case 'CryptoCurrency':
            const isTrxInNativeCurrency =
                currency.address === getNativeTokenAddress(network)
            if (isTrxInNativeCurrency) {
                return {
                    id: generateRandomNumber(),
                    jsonrpc: '2.0' as const,
                    method: 'eth_sendTransaction' as const,
                    params: [
                        {
                            from: fromAccount.address,
                            data: '',
                            to: toAddress,
                            value: '0x' + amount.amount.toString(16),
                        },
                    ],
                }
            } else {
                const web3 = new Web3(
                    new ZealWeb3RPCProvider({ network, networkRPCMap })
                )
                const contract = new web3.eth.Contract(
                    CONTRACT_ABI,
                    currency.address,
                    { from: fromAccount.address }
                )
                const hexAmount: string = '0x' + amount.amount.toString(16)
                const data: string = contract.methods
                    .transfer(toAddress, hexAmount)
                    .encodeABI()

                return {
                    id: generateRandomNumber(),
                    jsonrpc: '2.0' as const,
                    method: 'eth_sendTransaction' as const,
                    params: [
                        {
                            from: fromAccount.address,
                            data,
                            to: currency.address,
                        },
                    ],
                }
            }

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
