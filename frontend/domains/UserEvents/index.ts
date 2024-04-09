import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'

import { KeyStore } from '@zeal/domains/KeyStore'

export type UserEvent =
    | components['schemas']['UserEvent']
    | {
          type: 'ActionBannerClickedEvent'

          action: string
      }
    | {
          type: 'ActionBannerDismissedEvent'
          action: string
      }
    | {
          type: 'BankTransferFlowEnteredEvent'
      }
    | {
          type: 'PasswordCreationFlowEntered'
      }
    | {
          type: 'PasswordConfirmedEvent'
      }
    | { type: 'ConnectionManagerOpenInNoWeb3SiteEvent' }
    | {
          type: 'PortfolioLoadedEvent'
          isFunded: boolean
          tokenCount: number
          dappCount: number
          nftCount: number
          keystoreType: components['schemas']['KeystoreType']
          keystoreId: string
      }
    | {
          type: 'RecoveryKitStartedEvent'
          action: 'googleDrive' | 'manual'
      }
    | {
          type: 'RecoveryKitCreatedEvent'
          action: 'googleDrive' | 'manual'
      }
    | {
          type: 'UserSurveyAnsweredEvent'
          survey: string
          answer: string
      }
    | {
          type: 'ZwidgetOpenedEvent'
          state: 'disconnected' | 'connected' | 'metamask'
          location: 'extension' | 'dapp'
      }
    | {
          type: 'ActivityEnteredEvent'
      }
    | {
          type: 'AppDisconnectedEvent'
          location: 'settings' | 'zwidget'
          scope: 'all' | 'single'
      }
    | {
          type: 'AssetHiddenEvent'
          assetType: 'token'
      }
    | {
          type: 'AssetStarredEvent'
          assetType: 'token'
      }
    | {
          type: 'AssetUnhiddenEvent'
          assetType: 'token'
      }
    | {
          type: 'AssetUnstarredEvent'
          assetType: 'token'
      }
    | {
          type: 'BridgeFlowEnteredEvent'
          location:
              | 'actions_modal'
              | 'token_actions_modal'
              | 'portfolio_quick_actions'
      }
    | {
          type: 'SwapFlowEnteredEvent'
          location:
              | 'actions_modal'
              | 'token_actions_modal'
              | 'portfolio_quick_actions'
      }
    | {
          type: 'ReceiveFlowEnteredEvent'
          location:
              | 'token_actions_modal'
              | 'actions_modal'
              | 'add_funds_modal'
              | 'wallet_details'
              | 'nba'
              | 'portfolio_quick_actions'
      }
    | { type: 'ConnectedNetworkSelectedEvent' }
    | { type: 'ConnectedNetworkSelectorEnteredEvent' }
    | { type: 'CopyAddress' }
    | { type: 'WalletInstalledEvent'; os: string; userAgent: string }
    | {
          type: 'WalletAddedEvent'
          keystoreType: components['schemas']['KeystoreType']
          keystoreId: string
      }
    | {
          type: 'ConnectionAcceptedEvent'
          keystoreType: components['schemas']['KeystoreType']
          keystoreId: string
          network: string
      }
    | {
          type: 'SendFlowEnteredEvent'
          location:
              | 'actions_modal'
              | 'token_actions_modal'
              | 'nft_view'
              | 'portfolio_quick_actions'
          asset: 'nft' | 'token'
      }
    | {
          type: 'StoryFlowStartedEvent'
          name:
              | 'onboarding'
              | 'safe'
              | 'bank_transfers'
              | 'how_to_connect_to_metamask'
              | 'how_to_connect'
      }
    | {
          type: 'StoryFlowAdvancedEvent'
          name:
              | 'onboarding'
              | 'safe'
              | 'bank_transfers'
              | 'how_to_connect_to_metamask'
              | 'how_to_connect'
          slideNumber: number
      }
    | {
          type: 'StoryFlowFinishedEvent'
          name:
              | 'onboarding'
              | 'safe'
              | 'bank_transfers'
              | 'how_to_connect_to_metamask'
              | 'how_to_connect'
      }
    | {
          type: 'StoryFlowDismissedEvent'
          name:
              | 'onboarding'
              | 'safe'
              | 'bank_transfers'
              | 'how_to_connect_to_metamask'
              | 'how_to_connect'
      }
    | {
          type: 'ExistingWalletFlowEnteredEvent'
          name: 'onboarding'
      }
    | { type: 'AppListEnteredEvent' }
    | { type: 'ConnectionListEnteredEvent' }
    | { type: 'ExpandedViewEnteredEvent'; location: 'settings' | 'portfolio' }
    | { type: 'SettingsEnteredEvent' }
    | { type: 'FilterFlowEnteredEvent' }
    | { type: 'FilterAppliedEvent' }
    | { type: 'NFTListEnteredEvent' }
    | { type: 'TokenListEnteredEvent' }

export const keystoreToUserEventType = (
    keystore: KeyStore
): components['schemas']['KeystoreType'] => {
    switch (keystore.type) {
        case 'safe_4337':
            return 'Safe'
        case 'track_only':
            return 'Contact'
        case 'private_key_store':
            return 'PrivateKey'
        case 'ledger':
            return 'Ledger'
        case 'secret_phrase_key':
            return 'SecretPhrase'
        case 'trezor':
            return 'Trezor'
        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}
