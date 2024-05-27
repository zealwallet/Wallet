import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { WalletConnectInstance } from '..'
import { WALLET_CONNECT_METADATA } from '../constants'

type Response =
    | {
          type: 'available'
          walletConnectInstance: WalletConnectInstance
      }
    | { type: 'not_available' }

export type WalletConnectInstanceLoadable = LoadableData<Response, unknown>

export const fetchWalletConnectInstance = async (): Promise<Response> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            const core = new Core({
                projectId: '77e3b295469d80a9a369cc184afe0369',
            })
            const instance = await Web3Wallet.init({
                core,
                metadata: WALLET_CONNECT_METADATA,
            })

            return { type: 'available', walletConnectInstance: instance }
        case 'web':
            return { type: 'not_available' }
        default:
            return notReachable(ZealPlatform.OS)
    }
}
