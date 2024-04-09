import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'

import { Currency } from '@zeal/domains/Currency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { ImperativeError } from '@zeal/domains/Error'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ZealWeb3RPCProvider } from '@zeal/domains/RPCRequest/helpers/ZealWeb3RPCProvider'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

const CONTRACT_ABI = [
    {
        constant: false,
        inputs: [
            {
                name: '_spender',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable' as const,
        type: 'function' as const,
    },
] as const

export const updateApprovalAmount = ({
    originalEthSendTransaction,
    approvalTransaction,
    currency,
    newSpendLimit,
    network,
    networkRPCMap,
}: {
    originalEthSendTransaction: EthSendTransaction
    currency: Currency
    approvalTransaction: ApprovalTransaction
    newSpendLimit: string
    network: Network
    networkRPCMap: NetworkRPCMap
}): EthSendTransaction => {
    const web3 = new Web3(new ZealWeb3RPCProvider({ network, networkRPCMap }))

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError(
                'Got FiatCurrency in updateApprovalAmount'
            )
        case 'CryptoCurrency': {
            const contract = new web3.eth.Contract(
                CONTRACT_ABI,
                currency.address
            )

            const amount = amountToBigint(newSpendLimit, currency.fraction)
            const hexAmount = `0x${amount.toString(16)}`

            const data = contract.methods
                .approve(approvalTransaction.approveTo.address, hexAmount)
                .encodeABI()

            return {
                ...originalEthSendTransaction,
                params: [
                    {
                        ...originalEthSendTransaction.params[0],
                        data,
                    },
                ],
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
