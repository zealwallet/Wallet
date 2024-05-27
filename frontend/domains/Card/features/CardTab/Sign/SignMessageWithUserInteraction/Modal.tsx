import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GnosisPayLoginSignature } from '@zeal/domains/Card'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    NetworkMap,
    NetworkRPCMap,
    PredefinedNetwork,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { PersonalSign } from '@zeal/domains/RPCRequest'
import { Sign } from '@zeal/domains/RPCRequest/features/Sign'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    state: State

    account: Account
    keyStore: KeyStore
    sessionPassword: string

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    network: PredefinedNetwork

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_gnosis_pay_message_signed'
          gnosisPayLoginSignature: GnosisPayLoginSignature
      }

export type State =
    | { type: 'closed' }
    | { type: 'sign_message'; request: PersonalSign }

export const Modal = ({
    state,
    account,
    keyStore,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    networkRPCMap,
    sessionPassword,
    networkMap,
    portfolioMap,
    network,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'sign_message':
            return (
                <UIModal>
                    <Sign
                        dApp={{
                            hostname: 'app.gnosispay.com',
                            avatar: 'https://gnosispay.com/logo.png',
                            title: 'Gnosis Pay',
                        }}
                        state={{ type: 'maximised' }}
                        actionSource="extension"
                        account={account}
                        accountsMap={accountsMap}
                        feePresetMap={feePresetMap}
                        gasCurrencyPresetMap={gasCurrencyPresetMap}
                        installationId={installationId}
                        keyStore={keyStore}
                        keyStoreMap={keyStoreMap}
                        network={network}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        portfolio={getPortfolio({
                            address: account.address,
                            portfolioMap,
                        })}
                        sessionPassword={sessionPassword}
                        request={state.request}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'drag':
                                case 'import_keys_button_clicked':
                                case 'cancel_button_click':
                                case 'on_minimize_click':
                                case 'on_expand_request':
                                case 'on_cancel_confirm_transaction_clicked':
                                case 'on_4337_gas_currency_selected':
                                case 'on_safe_transaction_failure_accepted':
                                case 'on_wrong_network_accepted':
                                case 'on_safe_deployemnt_cancelled':
                                case 'on_pre_sign_safe_deployment_error_popup_cancel_clicked':
                                    onMsg({ type: 'close' })
                                    break

                                case 'message_signed':
                                    onMsg({
                                        type: 'on_gnosis_pay_message_signed',
                                        gnosisPayLoginSignature: {
                                            type: 'gnosis_pay_login_info',
                                            address: account.address,
                                            message: state.request.params[0],
                                            signature: msg.signature,
                                        },
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
