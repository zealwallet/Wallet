import { useEffect, useState } from 'react'

import Web3 from 'web3'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import {
    EOA,
    KeyStoreMap,
    LEDGER,
    PrivateKey,
    SecretPhrase,
    SigningKeyStore,
    Trezor,
} from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { PersonalSign } from '@zeal/domains/RPCRequest'
import { Sign } from '@zeal/domains/RPCRequest/features/Sign'
import {
    generateUnblockLoginRequest,
    UnblockSIWELoginRequest,
} from '@zeal/domains/RPCRequest/helpers/generateUnblockLoginRequest'
import { signMessage } from '@zeal/domains/RPCRequest/helpers/signMessage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    account: Account
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keystore: EOA
    sessionPassword: string
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_message_signed'
          account: Account
          loginSignature: UnblockLoginSignature
      }
    | Extract<
          MsgOf<typeof Sign>,
          {
              type:
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'on_predefined_fee_preset_selected'
                  | 'cancel_submitted'
                  | 'transaction_submited'
                  | 'transaction_request_replaced'
          }
      >

type State =
    | {
          type: 'no_user_interaction_required_to_sign_msg'
          keystore: SecretPhrase | PrivateKey
      }
    | {
          type: 'user_interaction_is_needed'
          keystore: Trezor | LEDGER
      }

const calculateState = ({ keystore }: { keystore: SigningKeyStore }): State => {
    switch (keystore.type) {
        case 'private_key_store':
        case 'secret_phrase_key':
            return {
                type: 'no_user_interaction_required_to_sign_msg',
                keystore,
            }

        case 'ledger':
        case 'trezor':
            return {
                type: 'user_interaction_is_needed',
                keystore,
            }
        case 'safe_4337':
            throw new ImperativeError(
                'ImpossibleState, Safe flow is not yet supported for bank transfer signature login'
            )

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

const createRPCRequest = (
    loginRequest: UnblockSIWELoginRequest
): PersonalSign => {
    return {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'personal_sign',
        params: [Web3.utils.utf8ToHex(loginRequest.message)],
    }
}

export const SignUnblockLoginMsg = ({
    account,
    sessionPassword,
    network,
    networkMap,
    networkRPCMap,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    portfolio,
    keystore,
    onMsg,
}: Props) => {
    const [state] = useState(() => calculateState({ keystore }))
    const onMsgLive = useLiveRef(onMsg)

    const loginRequest = generateUnblockLoginRequest({ account, network })
    const personalSign = createRPCRequest(loginRequest)

    useEffect(() => {
        switch (state.type) {
            case 'no_user_interaction_required_to_sign_msg':
                signMessage({
                    request: personalSign,
                    sessionPassword,
                    keyStore: state.keystore,
                    network,
                })
                    .then((signature) => {
                        onMsgLive.current({
                            type: 'on_message_signed',
                            loginSignature: {
                                message: loginRequest.message,
                                signature,
                            },
                            account,
                        })
                    })
                    .catch(() => {
                        captureError(
                            new ImperativeError(
                                `not able to generate generateUnblockLoginRequest`
                            )
                        )
                    })

                break
            case 'user_interaction_is_needed':
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [
        account,
        onMsgLive,
        sessionPassword,
        state,
        personalSign,
        loginRequest,
        network,
    ])

    switch (state.type) {
        case 'no_user_interaction_required_to_sign_msg':
            return (
                <LoadingLayout
                    onClose={() => onMsg({ type: 'close' })}
                    actionBar={
                        <ActionBar
                            account={account}
                            keystore={keystore}
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
        case 'user_interaction_is_needed':
            return (
                <Sign
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    keyStoreMap={keyStoreMap}
                    portfolio={portfolio}
                    networkRPCMap={networkRPCMap}
                    networkMap={networkMap}
                    sessionPassword={sessionPassword}
                    keyStore={state.keystore}
                    request={personalSign}
                    state={{ type: 'maximised' }}
                    account={account}
                    dApp={{
                        hostname: 'api.getunblock.com',
                        avatar: null,
                        title: null,
                    }}
                    network={network}
                    actionSource="extension"
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'cancel_button_click':
                            case 'on_wrong_network_accepted':
                            case 'on_minimize_click':
                            case 'on_pre_sign_safe_deployment_error_popup_cancel_clicked':
                            case 'on_safe_deployemnt_cancelled':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_safe_transaction_failure_accepted':
                                onMsg({ type: 'close' })
                                break
                            case 'message_signed':
                                onMsg({
                                    type: 'on_message_signed',
                                    loginSignature: {
                                        message: loginRequest.message,
                                        signature: msg.signature,
                                    },
                                    account,
                                })
                                break
                            case 'on_expand_request':
                            case 'drag':
                                throw new ImperativeError(
                                    `impossible state try to minimize send during singing unblock login msg`
                                )
                            case 'import_keys_button_clicked':
                                throw new ImperativeError(
                                    `Unblock should not be available with nonsigning key stores`
                                )

                            case 'on_4337_gas_currency_selected':
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
