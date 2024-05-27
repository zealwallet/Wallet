import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { CreateUnblockUserAndLogin } from '@zeal/domains/Currency/domains/BankTransfer/features/CreateUnblockUserAndLogin'
import { Kyc } from '@zeal/domains/Currency/domains/BankTransfer/features/KYC'
import { SignUnblockLoginMsg } from '@zeal/domains/Currency/domains/BankTransfer/features/SignUnblockLoginMsg'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import {
    BankTransferInfo,
    BankTransferUnblockUserCreated,
    CustomCurrencyMap,
} from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    currencyHiddenMap: CurrencyHiddenMap
    customCurrencies: CustomCurrencyMap
    keyStoreMap: KeyStoreMap
    bankTransferInfo: BankTransferInfo
    sessionPassword: string
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    portfolioMap: PortfolioMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof SignUnblockLoginMsg>,
          {
              type:
                  | 'cancel_submitted'
                  | 'close'
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'on_predefined_fee_preset_selected'
                  | 'transaction_submited'
          }
      >
    | Extract<
          MsgOf<typeof Kyc>,
          { type: 'kyc_applicant_created' | 'on_do_bank_transfer_clicked' }
      >

type State =
    | { type: 'login_to_unblock' }
    | {
          type: 'kyc'
          loginInfo: UnblockLoginInfo
          bankTransferInfo: BankTransferUnblockUserCreated
      }

export const KycLogin = ({
    keyStoreMap,
    bankTransferInfo,
    sessionPassword,
    network,
    networkMap,
    networkRPCMap,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    currencyHiddenMap,
    customCurrencies,
    portfolioMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'login_to_unblock' })

    switch (state.type) {
        case 'login_to_unblock':
            return (
                <CreateUnblockUserAndLogin
                    portfolioMap={portfolioMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keyStoreMap}
                    currencyHiddenMap={currencyHiddenMap}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    networkRPCMap={networkRPCMap}
                    bankTransferInfo={bankTransferInfo}
                    network={network}
                    networkMap={networkMap}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_4337_gas_currency_selected':
                                onMsg(msg)
                                break

                            case 'on_user_login_to_unblock_success':
                                setState({
                                    type: 'kyc',
                                    loginInfo: msg.unblockLoginInfo,
                                    bankTransferInfo: msg.bankTransferInfo,
                                })
                                break
                            case 'on_account_create_request':
                                throw new ImperativeError('Impossible state')

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'kyc':
            return (
                <Kyc
                    account={
                        accountsMap[
                            state.bankTransferInfo.connectedWalletAddress
                        ]
                    }
                    network={network}
                    keyStoreMap={keyStoreMap}
                    bankTransferInfo={state.bankTransferInfo}
                    loginInfo={state.loginInfo}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'kyc_data_updated':
                                onMsg({ type: 'close' })
                                break
                            case 'kyc_applicant_created':
                            case 'on_do_bank_transfer_clicked':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
