import { encodeFunctionData, getAddress } from 'viem'

import { notReachable } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'

const ERC721_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable' as const,
        type: 'function' as const,
    },
] as const

const ERC1155_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable' as const,
        type: 'function' as const,
    },
] as const

type Params = {
    fromAccount: Account
    toAddress: Address
    nft: PortfolioNFT
    collection: PortfolioNFTCollection
}

export const createNFTEthSendTransaction = ({
    fromAccount,
    toAddress,
    collection,
    nft,
}: Params): EthSendTransaction => {
    switch (nft.standard) {
        case 'Erc1155': {
            const data = encodeFunctionData({
                abi: ERC1155_ABI,
                functionName: 'safeTransferFrom',
                args: [
                    getAddress(fromAccount.address),
                    getAddress(toAddress),
                    BigInt(nft.tokenId),
                    1n,
                    '0x',
                ],
            })

            return {
                id: generateRandomNumber(),
                jsonrpc: '2.0' as const,
                method: 'eth_sendTransaction' as const,
                params: [
                    {
                        from: fromAccount.address,
                        data,
                        to: collection.mintAddress,
                    },
                ],
            }
        }
        case 'Erc721': {
            const data = encodeFunctionData({
                abi: ERC721_ABI,
                functionName: 'safeTransferFrom',
                args: [
                    getAddress(fromAccount.address),
                    getAddress(toAddress),
                    BigInt(nft.tokenId),
                ],
            })

            return {
                id: generateRandomNumber(),
                jsonrpc: '2.0' as const,
                method: 'eth_sendTransaction' as const,
                params: [
                    {
                        from: fromAccount.address,
                        data,
                        to: collection.mintAddress,
                    },
                ],
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(nft.standard)
    }
}
