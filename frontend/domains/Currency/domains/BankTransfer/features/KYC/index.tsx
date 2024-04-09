import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { fetchUser } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUser'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KycApprovedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycApprovedModal'
import { KycFailedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycFailedModal'
import { KycPendingModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycPendingModal'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { FormSubmitter } from './FormSubmitter'
import { LoadingLayout } from './LoadingLayout'

type Props = {
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated
    loginInfo: UnblockLoginInfo
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof FormSubmitter>,
          {
              type:
                  | 'close'
                  | 'on_back_button_clicked'
                  | 'kyc_applicant_created'
                  | 'kyc_data_updated'
          }
      >
    | Extract<
          MsgOf<typeof KycApprovedModal>,
          { type: 'on_do_bank_transfer_clicked' }
      >

export const Kyc = ({
    loginInfo,
    account,
    network,
    keyStoreMap,
    bankTransferInfo,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchUser, {
        type: 'loading',
        params: {
            bankTransferInfo,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    onMsg={onMsg}
                />
            )

        case 'error':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        onMsg={onMsg}
                    />

                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break

                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break

                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        case 'loaded': {
            const unblockUser = loadable.data
            const { kycStatus } = unblockUser

            switch (kycStatus.type) {
                case 'not_started':
                case 'paused':
                    return (
                        <FormSubmitter
                            unblockUser={unblockUser}
                            account={account}
                            network={network}
                            keyStoreMap={keyStoreMap}
                            loginInfo={loginInfo}
                            bankTransferInfo={bankTransferInfo}
                            onMsg={onMsg}
                        />
                    )
                case 'approved':
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <KycApprovedModal onMsg={onMsg} />
                        </>
                    )
                case 'failed':
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <KycFailedModal onMsg={onMsg} />
                        </>
                    )
                case 'in_progress':
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <KycPendingModal onMsg={onMsg} />
                        </>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(kycStatus)
            }
        }

        default:
            return notReachable(loadable)
    }
}
