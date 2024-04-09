import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { NetworkMap } from '@zeal/domains/Network'
import { Add as AddPasswordOrPin } from '@zeal/domains/Password/features/Add'
import { LockScreen } from '@zeal/domains/Password/features/LockScreen'
import { Storage } from '@zeal/domains/Storage'
import { addAccountsWithKeystores } from '@zeal/domains/Storage/helpers/addAccountsWithKeystores'
import { calculateStorageState } from '@zeal/domains/Storage/helpers/calculateStorageState'
import { init } from '@zeal/domains/Storage/helpers/init'
import { saveSessionPassword } from '@zeal/domains/Storage/helpers/saveSessionPassword'
import { toLocalStorage } from '@zeal/domains/Storage/helpers/toLocalStorage'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { HowExperiencedYouAre } from './HowExperiencedYouAre'
import { NextAction } from './WalletStories'

type Props = {
    storage: Storage | null
    sessionPassword: string | null
    installationId: string
    networkMap: NetworkMap
    nextAction: NextAction
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof HowExperiencedYouAre>,
          {
              type:
                  | 'on_accounts_create_success_animation_finished'
                  | 'on_user_skipped_add_assets'
                  | 'bank_transfer_click'
                  | 'from_any_wallet_click'
                  | 'safe_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'track_wallet_clicked'
          }
      >
    | Extract<MsgOf<typeof LockScreen>, { type: 'lock_screen_close_click' }>

export const StorageValidator = ({
    storage,
    sessionPassword,
    installationId,
    nextAction,
    networkMap,
    onMsg,
}: Props) => {
    const storageState = calculateStorageState({ sessionPassword, storage })

    switch (storageState.type) {
        case 'no_storage':
            return (
                <AddPasswordOrPin
                    installationId={installationId}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'password_added': {
                                await toLocalStorage(
                                    init(msg.encryptedPassword)
                                )
                                await saveSessionPassword(msg.sessionPassword)
                                break
                            }

                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={storageState.storage.encryptedPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'lock_screen_close_click':
                                onMsg(msg)
                                break

                            case 'session_password_decrypted':
                                saveSessionPassword(msg.sessionPassword)
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'unlocked':
            return (
                <HowExperiencedYouAre
                    nextAction={nextAction}
                    currencyHiddenMap={storageState.storage.currencyHiddenMap}
                    customCurrencies={storageState.storage.customCurrencies}
                    keyStoreMap={storageState.storage.keystoreMap}
                    networkMap={networkMap}
                    installationId={installationId}
                    networkRPCMap={storageState.storage.networkRPCMap}
                    sessionPassword={storageState.sessionPassword}
                    accountsMap={storageState.storage.accounts}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_accounts_create_success_animation_finished':
                            case 'on_user_skipped_add_assets':
                            case 'bank_transfer_click':
                            case 'from_any_wallet_click':
                                onMsg(msg)
                                break

                            case 'on_account_create_request':
                                msg.accountsWithKeystores.forEach(
                                    ({ keystore }) => {
                                        postUserEvent({
                                            type: 'WalletAddedEvent',
                                            keystoreType:
                                                keystoreToUserEventType(
                                                    keystore
                                                ),
                                            keystoreId: keystore.id,
                                            installationId,
                                        })
                                    }
                                )
                                await toLocalStorage(
                                    addAccountsWithKeystores(
                                        storageState.storage,
                                        msg.accountsWithKeystores
                                    )
                                )
                                break
                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(storageState)
    }
}
