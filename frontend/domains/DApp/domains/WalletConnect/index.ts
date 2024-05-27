import { ProposalTypes } from '@walletconnect/types'
import { Web3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet'

import { Address } from '@zeal/domains/Address'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { NetworkHexId } from '@zeal/domains/Network'
import {
    EthSendTransaction,
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'

export type WalletConnectInstance = Awaited<ReturnType<typeof Web3Wallet.init>>

export type WalletConnectConnectionRequest = {
    type: 'wallect_connect_session_proposal'
    id: number
    dAppInfo: DAppSiteInfo
    requiredNetworkHexIds: NetworkHexId[]
    optionalNetworkHexIds: NetworkHexId[]
    originalProposal: ProposalTypes.Struct
}

type WallectConnectAllowedRPCRequests =
    | EthSendTransaction
    | EthSignTypedDataV4
    | EthSignTypedDataV3
    | EthSignTypedData
    | PersonalSign

export type WalletConnectRPCRequest = {
    type: 'session_request'
    id: WallectConnectAllowedRPCRequests['id']
    networkHexId: NetworkHexId
    address: Address
    dAppInfo: DAppSiteInfo
    originalRequest: Web3WalletTypes.SessionRequest
    rpcRequest: WallectConnectAllowedRPCRequests
}

export type WalletConnectPairingLink = {
    type: 'wallet_connect_pairing_link'
    uri: string
}
