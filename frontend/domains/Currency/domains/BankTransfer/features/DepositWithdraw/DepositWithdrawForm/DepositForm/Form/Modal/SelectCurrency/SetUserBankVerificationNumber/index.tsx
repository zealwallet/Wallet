import { FormattedMessage } from 'react-intl'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { FiatCurrency } from '@zeal/domains/Currency'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { setUnblockUserBankVerificationNumber } from '@zeal/domains/Currency/domains/BankTransfer/api/setUnblockUserBankVerificationNumber'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Form } from './Form'

type Props = {
    loginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    currency: FiatCurrency
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'user_bank_verification_number_successfully_set'
          bankVerificationNumber: string
          currency: FiatCurrency
      }

export const SetUserBankVerificationNumber = ({
    account,
    keyStoreMap,
    network,
    currency,
    loginInfo,
    bankTransferInfo,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(
        setUnblockUserBankVerificationNumber
    )

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Form
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_form_submitted':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        loginInfo,
                                        bankTransferInfo,
                                        bankVerificationNumber:
                                            msg.bankVerificationNumber,
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'loading':
            return (
                <LoadingLayout
                    actionBar={
                        <ActionBar
                            account={account}
                            keystore={getKeyStore({
                                keyStoreMap,
                                address: account.address,
                            })}
                            network={network}
                            left={
                                <IconButton
                                    variant="on_light"
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    {({ color }) => (
                                        <BackIcon size={24} color={color} />
                                    )}
                                </IconButton>
                            }
                        />
                    }
                />
            )
        case 'loaded':
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="currency.bank_transfer.set_user_bvn.success"
                            defaultMessage="Account set up"
                        />
                    }
                    onAnimationComplete={() => {
                        onMsg({
                            type: 'user_bank_verification_number_successfully_set',
                            bankVerificationNumber:
                                loadable.params.bankVerificationNumber,
                            currency,
                        })
                    }}
                />
            )
        case 'error':
            return (
                <>
                    <LoadingLayout
                        actionBar={
                            <ActionBar
                                account={account}
                                keystore={getKeyStore({
                                    keyStoreMap,
                                    address: account.address,
                                })}
                                network={network}
                                left={
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => onMsg({ type: 'close' })}
                                    >
                                        {({ color }) => (
                                            <BackIcon size={24} color={color} />
                                        )}
                                    </IconButton>
                                }
                            />
                        }
                    />
                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
