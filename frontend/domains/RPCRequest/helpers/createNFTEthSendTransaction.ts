import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ZealWeb3RPCProvider } from '@zeal/domains/RPCRequest/helpers/ZealWeb3RPCProvider'

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
    network: Network
    networkRPCMap: NetworkRPCMap
}

export const createNFTEthSendTransaction = ({
    fromAccount,
    toAddress,
    collection,
    nft,
    network,
    networkRPCMap,
}: Params): EthSendTransaction => {
    const web3 = new Web3(new ZealWeb3RPCProvider({ network, networkRPCMap }))

    switch (nft.standard) {
        case 'Erc1155': {
            const contract = new web3.eth.Contract(
                ERC1155_ABI,
                collection.mintAddress,
                {
                    from: fromAccount.address,
                }
            )

            const data: string = contract.methods
                .safeTransferFrom(
                    fromAccount.address,
                    toAddress,
                    nft.tokenId,
                    1,
                    new Uint8Array(0)
                )
                .encodeABI()

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
            const contract = new web3.eth.Contract(
                ERC721_ABI,
                collection.mintAddress,
                {
                    from: fromAccount.address,
                }
            )
            const data: string = contract.methods
                .safeTransferFrom(fromAccount.address, toAddress, nft.tokenId)
                .encodeABI()

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
