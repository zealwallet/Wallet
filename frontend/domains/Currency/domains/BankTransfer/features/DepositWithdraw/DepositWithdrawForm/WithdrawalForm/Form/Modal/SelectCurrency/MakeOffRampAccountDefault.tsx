import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Account } from '@zeal/domains/Account'
import { OffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { makeOffRampAccountDefault } from '@zeal/domains/Currency/domains/BankTransfer/api/makeOffRampAccountDefault'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { LoadingLayout } from '../../../../../LoadingLayout'

type Props = {
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    offRampAccount: OffRampAccount
    unblockLoginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_off_ramp_account_become_default'
          offRampAccount: OffRampAccount
      }

export const MakeOffRampAccountDefault = ({
    account,
    network,
    keyStoreMap,
    offRampAccount,
    unblockLoginInfo,
    bankTransferInfo,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(makeOffRampAccountDefault, {
        type: 'loading',
        params: {
            offRampAccount,
            unblockLoginInfo,
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

        case 'loaded':
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="currency.bank_transfer.change_unblock_withdraw_account.success"
                            defaultMessage="Account changed"
                        />
                    }
                    onAnimationComplete={() => {
                        onMsg({
                            type: 'on_off_ramp_account_become_default',
                            offRampAccount,
                        })
                    }}
                />
            )

        case 'error':
            // TODO: rethink this
            return (
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
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
