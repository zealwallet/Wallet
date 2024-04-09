import { Result } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { CurrencyId } from '@zeal/domains/Currency'
import { ConnectionState } from '@zeal/domains/DApp/domains/ConnectionState'
import { NetworkHexId } from '@zeal/domains/Network'
import {
    EthAccounts,
    EthRequestAccounts,
    WalletRequestPermissions,
} from '@zeal/domains/RPCRequest'

export type EntryPoint =
    | AddAccount
    | AddFromHardwareWallet
    | CreateContact
    | Onboarding
    | SendERC20Token
    | SendNFT
    | SetupRecoveryKit
    | Swap
    | Bridge
    | BankTransfer
    | KycProcess
    | CreateSafe
    | ZWidget
    | Extension

export type PageEntrypoint = Exclude<EntryPoint, ZWidget | Extension>

export type OnboardedEntrypoint = Exclude<PageEntrypoint, Onboarding>

export type CreateSafe = {
    type: 'create_safe'
}

export type BankTransfer = {
    type: 'bank_transfer'
}

export type KycProcess = {
    type: 'kyc_process'
}

export type CreateContact = {
    type: 'create_contact'
}

export type AddFromHardwareWallet = {
    type: 'add_from_hardware_wallet'
}

export type Swap = {
    type: 'swap'
    fromAddress: Address
    fromCurrencyId: CurrencyId | null
}

export type Bridge = {
    type: 'bridge'
    fromAddress: Address
    fromCurrencyId: CurrencyId | null
}

export type Onboarding = {
    type: 'onboarding'
}

export type ZWidget = {
    type: 'zwidget'
    dAppUrl: string
}

export type Mode = 'fullscreen' | 'popup'

export type Extension = {
    type: 'extension'
    mode: Mode
}

export type AddAccount = {
    type: 'add_account'
}

export type SendERC20Token = {
    type: 'send_erc20_token'
    fromAddress: Address
    tokenCurrencyId: CurrencyId | null
}

export type SendNFT = {
    type: 'send_nft'
    fromAddress: Address
    nftId: string
    mintAddress: Address
    networkHexId: NetworkHexId
}

export type SetupRecoveryKit = {
    type: 'setup_recovery_kit'
    address: Address
}

export type ActionSource = 'zwidget' | 'extension'

// Messages

export type RPCRequestMsg = {
    type: 'rpc_request'
    request: {
        id: number | string
        method: unknown
        params: unknown
    }
}

export type ChangeIframeSizeMessage = {
    type: 'change_iframe_size'
    size: 'icon' | 'small' | 'large' | 'large_with_full_screen_takeover'
}

export type Drag = { type: 'drag'; movement: { x: number; y: number } }

export type RPCResponse = {
    type: 'rpc_response'
    id: number | string
    response: Result<unknown, unknown>
}

export type ReadyMsg = {
    type: 'ready'
    state:
        | { type: 'disconnected' | 'not_interacted' | 'connected_to_meta_mask' }
        | {
              type: 'connected'
              networkHexId: NetworkHexId
              address: Address
          }
}

export type NetworkChangeMsg = {
    type: 'network_change'
    chainId: string
}

export type Disconnect = {
    type: 'disconnect'
}

export type AccountsChangeMsg = {
    type: 'account_change'
    account: string
}

export type ExtensionToZwidgetExtensionAddressChange = {
    type: 'extension_to_zwidget_extension_address_change'
    address: string
}

export type ExtensionToZwidgetQueryZWidgetConnectionStateAndNetwork = {
    type: 'extension_to_zwidget_query_zwidget_connection_state_and_network'
}

export type MetaMaskProviderAvailable = {
    type: 'meta_mask_provider_available'
}

export type NoMetaMaskProviderDuringInit = {
    type: 'no_meta_mask_provider_during_init'
}

export type CannotSwitchToMetaMask = {
    type: 'cannot_switch_to_meta_mask'
}

export type NoMetaMaskWhenSwitchingToZeal = {
    type: 'no_meta_mask_when_switching_to_zeal'
}

export type AlternativeProvider = 'metamask' | 'provider_unavailable'

export type SelectMetaMaskProvider = {
    type: 'select_meta_mask_provider'
    request: EthRequestAccounts | EthAccounts | WalletRequestPermissions
}

export type SelectZealProvider = {
    type: 'select_zeal_provider'
    address: Address
    chainId: NetworkHexId
}

export type ToServiceWorkerTrezorConnectGetPublicKey = {
    type: 'to_service_worker_trezor_connect_get_public_key'
    coin: string
    path: string
}

export type ToServiceWorkerTrezorConnectSignTransaction = {
    type: 'to_service_worker_trezor_connect_sign_transaction'
    transaction: object
    path: string
}

export type ToServiceWorkerTrezorConnectSignMessage = {
    type: 'to_service_worker_trezor_connect_sign_message'
    message: string
    path: string
}

export type ToServiceWorkerTrezorConnectSignTypedData = {
    type: 'to_service_worker_trezor_connect_sign_typed_data'
    typedData: object
    path: string
}

export type CurrentZWidgetConnectionStateAndNetwork = {
    type: 'current_zwidget_connection_state_and_network'
    state: ConnectionState
    networkHexId: NetworkHexId
}

export type ExtensionToZwidgetExpandZWidget = {
    type: 'extension_to_zwidget_expand_zwidget'
}

export type ZWidgetToExtension = CurrentZWidgetConnectionStateAndNetwork

export type ChromeRuntimeMessageRequest =
    | ExtensionToZwidgetExtensionAddressChange
    | ExtensionToZwidgetQueryZWidgetConnectionStateAndNetwork
    | ExtensionToZwidgetExpandZWidget
    | ToServiceWorkerTrezorConnectGetPublicKey
    | ToServiceWorkerTrezorConnectSignTransaction
    | ToServiceWorkerTrezorConnectSignMessage
    | ToServiceWorkerTrezorConnectSignTypedData

export type ProviderToZwidget =
    | RPCRequestMsg
    | MetaMaskProviderAvailable
    | NoMetaMaskProviderDuringInit
    | CannotSwitchToMetaMask
    | NoMetaMaskWhenSwitchingToZeal

export type ZwidgetToContentScript = ChangeIframeSizeMessage | Drag

export type ZwidgetToProvider =
    | RPCResponse
    | AccountsChangeMsg
    | NetworkChangeMsg
    | Disconnect
    | ReadyMsg
    | SelectMetaMaskProvider
    | SelectZealProvider
