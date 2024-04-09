import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { Account } from '@zeal/domains/Account'
import { OffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    createOffRampAccount,
    CreateOffRampAccountRequest,
} from '@zeal/domains/Currency/domains/BankTransfer/api/createOffRampAccount'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { setUnblockUserBankVerificationNumber } from '@zeal/domains/Currency/domains/BankTransfer/api/setUnblockUserBankVerificationNumber'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Form } from './Form'

import { BankDetailsDoNoMatch } from '../BankDetailsDoNoMatch'
import { InvalidBVN } from '../InvalidBVN'
import { InvalidIBAN } from '../InvalidIBAN'
import { LoadingLayout } from '../LoadingLayout'

type Props = {
    bankTransferInfo: BankTransferUnblockUserCreated
    currencies: BankTransferCurrencies
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    unblockLoginInfo: UnblockLoginInfo
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'unblock_offramp_account_created'
          account: OffRampAccount
      }

export const updateUserAndCreateOffRampAccount = async ({
    account,
    bankTransferInfo,
    unblockLoginInfo,
    currencies,
    signal,
}: {
    account: CreateOffRampAccountRequest
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OffRampAccount> => {
    switch (account.bankDetails.type) {
        case 'iban':
        case 'uk':
            return createOffRampAccount({
                account,
                unblockLoginInfo,
                bankTransferInfo,
                currencies,
                signal,
            })
        case 'ngn':
            return setUnblockUserBankVerificationNumber({
                bankTransferInfo,
                loginInfo: unblockLoginInfo,
                bankVerificationNumber:
                    account.bankDetails.bankVerificationNumber,
                signal,
            }).then(() =>
                createOffRampAccount({
                    account,
                    unblockLoginInfo,
                    bankTransferInfo,
                    currencies,
                    signal,
                })
            )
        /* istanbul ignore next */
        default:
            return notReachable(account.bankDetails)
    }
}

export const SubmitCreateAccount = ({
    bankTransferInfo,
    currencies,
    account,
    keyStoreMap,
    network,
    unblockLoginInfo,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(
        updateUserAndCreateOffRampAccount
    )

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Form
                    currencies={currencies}
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    loginInfo={unblockLoginInfo}
                    bankTransferInfo={bankTransferInfo}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'form_submitted':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        account: msg.form,
                                        unblockLoginInfo,
                                        bankTransferInfo,
                                        currencies,
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
                            id="currency.bank_transfer.create_unblock_withdraw_account.success"
                            defaultMessage="Account set up"
                        />
                    }
                    onAnimationComplete={() => {
                        onMsg({
                            type: 'unblock_offramp_account_created',
                            account: loadable.data,
                        })
                    }}
                />
            )

        case 'error':
            const parsed = parseAppError(loadable.error)

            switch (parsed.type) {
                case 'unblock_account_number_and_sort_code_mismatch':
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <BankDetailsDoNoMatch
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            setLoadable({
                                                type: 'not_asked',
                                            })
                                            break

                                        default:
                                            notReachable(msg.type)
                                    }
                                }}
                            />
                        </>
                    )

                case 'unblock_invalid_iban':
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <InvalidIBAN
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            setLoadable({
                                                type: 'not_asked',
                                            })
                                            break

                                        default:
                                            notReachable(msg.type)
                                    }
                                }}
                            />
                        </>
                    )

                case 'unblock_bvn_does_not_match':
                case 'unblock_unable_to_verify_bvn':
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <InvalidBVN
                                error={parsed}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            setLoadable({
                                                type: 'not_asked',
                                            })
                                            break

                                        default:
                                            notReachable(msg.type)
                                    }
                                }}
                            />
                        </>
                    )

                default:
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <AppErrorPopup
                                error={parsed}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            setLoadable({ type: 'not_asked' })
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
            }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
