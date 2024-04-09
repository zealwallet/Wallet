import React from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CreateNewAccount } from '@zeal/domains/Account/features/CreateNewAccount'
import {
    DEFAULT_WALLET_LABEL,
    generateAccountLabel,
} from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { SelectAccount } from './SelectAccount'
import { SelectPhrase } from './SelectPhrase'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    secretPhraseMap: Record<
        string,
        { keystore: SecretPhrase; account: Account }[]
    >
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof SelectAccount>
    | MsgOf<typeof SelectPhrase>
    | {
          type: 'on_accounts_create_success_animation_finished'
          accountsWithKeystores: {
              account: Account
              keystore: SecretPhrase
          }[]
      }

type State =
    | { type: 'create_new' }
    | { type: 'select_phrase' }
    | { type: 'account_selection'; keystore: SecretPhrase }
    | {
          type: 'success'
          accountsWithKeystores: {
              account: Account
              keystore: SecretPhrase
          }[]
      }

const calculateState = (
    secretPhraseMap: Record<
        string,
        { keystore: SecretPhrase; account: Account }[]
    >
): State => {
    const keystoresWithAccounts = values(secretPhraseMap)

    if (keystoresWithAccounts.length === 1) {
        return {
            type: 'account_selection',
            keystore: keystoresWithAccounts[0][0].keystore,
        }
    }

    if (keystoresWithAccounts.length > 1) {
        return { type: 'select_phrase' }
    }

    return { type: 'create_new' }
}

export const AddFromSecretPhrase = ({
    accountsMap,
    keystoreMap,
    sessionPassword,
    secretPhraseMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(calculateState(secretPhraseMap))

    switch (state.type) {
        case 'create_new':
            return (
                <CreateNewAccount
                    label={generateAccountLabel(
                        values(accountsMap),
                        DEFAULT_WALLET_LABEL
                    )}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        case 'select_phrase':
            return (
                <SelectPhrase
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    accountsMap={accountsMap}
                    secretPhraseMap={secretPhraseMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_account_create_request':
                                setState({
                                    type: 'success',
                                    accountsWithKeystores:
                                        msg.accountsWithKeystores,
                                })
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'account_selection':
            return (
                <SelectAccount
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    accountsMap={accountsMap}
                    keystore={state.keystore}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_account_create_request':
                                setState({
                                    type: 'success',
                                    accountsWithKeystores:
                                        msg.accountsWithKeystores,
                                })
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'success':
            return (
                <SuccessLayout
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_accounts_create_success_animation_finished',
                            accountsWithKeystores: state.accountsWithKeystores,
                        })
                    }
                    title={
                        <FormattedMessage
                            id="AddFromExistingSecretPhrase.success"
                            defaultMessage="Wallets added to Zeal"
                        />
                    }
                />
            )

        default:
            return notReachable(state)
    }
}
