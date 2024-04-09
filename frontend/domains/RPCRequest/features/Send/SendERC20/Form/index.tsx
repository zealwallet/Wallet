import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate } from '@zeal/domains/FXRate'
import { fetchTokenRate } from '@zeal/domains/FXRate/api/fetchTokenRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Form as InitialForm, Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    installationId: string
    initialForm: InitialForm
    portfolioMap: PortfolioMap
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    account: Account
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    portfolio: Portfolio
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'on_submit_form' | 'close' }>
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >

const fetchFxRate = async ({
    form,
    knownCurrencies,
    networkMap,
}: {
    form: InitialForm
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}): Promise<FXRate | null> =>
    fetchTokenRate(form.token, knownCurrencies, networkMap)

export const Form = ({
    initialForm,
    networkMap,
    networkRPCMap,
    account,
    accountsMap,
    portfolioMap,
    keyStoreMap,
    customCurrencies,
    sessionPassword,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    portfolio,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    const [pollable, setPollable] = usePollableData<
        FXRate | null,
        {
            form: InitialForm
            knownCurrencies: KnownCurrencies
            networkMap: NetworkMap
        }
    >(
        fetchFxRate,
        {
            type: 'loaded' as const,
            params: {
                form: initialForm,
                knownCurrencies: portfolio.currencies,
                networkMap,
            },
            data: initialForm.token.rate,
        },
        { stopIf: () => false, pollIntervalMilliseconds: 2000 }
    )

    switch (pollable.type) {
        case 'loading':
        case 'error':
            throw new ImperativeError(
                'loading or error state should never be possible as we have rate'
            )
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <>
                    <Layout
                        installationId={installationId}
                        form={pollable.params.form}
                        knownCurrencies={portfolio.currencies}
                        fxRate={pollable.data}
                        accountsMap={accountsMap}
                        keyStoreMap={keyStoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        account={account}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'on_submit_form':
                                    onMsg(msg)
                                    break
                                case 'on_select_token':
                                    setModal({ type: 'select_token' })
                                    break
                                case 'on_select_to_address':
                                    setModal({ type: 'select_to_address' })
                                    break
                                case 'on_form_change':
                                    setPollable({
                                        type: 'loaded',
                                        data: pollable.data,
                                        params: {
                                            ...pollable.params,
                                            form: msg.form,
                                        },
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                    <Modal
                        installationId={installationId}
                        portfolio={portfolio}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        portfolioMap={portfolioMap}
                        keyStoreMap={keyStoreMap}
                        customCurrencies={customCurrencies}
                        sessionPassword={sessionPassword}
                        accountsMap={accountsMap}
                        state={modal}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        account={account}
                        selectedToken={pollable.params.form.token}
                        toAddress={pollable.params.form.toAddress}
                        knownCurrencies={portfolio.currencies}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_accounts_create_success_animation_finished':
                                case 'track_wallet_clicked':
                                case 'add_wallet_clicked':
                                case 'hardware_wallet_clicked':
                                    setModal({ type: 'closed' })
                                    onMsg(msg)
                                    break

                                case 'close':
                                    setModal({ type: 'closed' })
                                    break
                                case 'on_token_select':
                                    setModal({ type: 'closed' })
                                    setPollable({
                                        type: 'loaded',
                                        data: msg.token.rate,
                                        params: {
                                            ...pollable.params,
                                            form: {
                                                ...pollable.params.form,
                                                token: msg.token,
                                                amount: null,
                                            },
                                        },
                                    })
                                    break

                                case 'on_add_label_skipped':
                                    setModal({ type: 'closed' })
                                    setPollable({
                                        type: 'loaded',
                                        data: pollable.data,
                                        params: {
                                            ...pollable.params,
                                            form: {
                                                ...pollable.params.form,
                                                toAddress: msg.address,
                                            },
                                        },
                                    })
                                    break

                                case 'account_item_clicked':
                                    setModal({ type: 'closed' })
                                    setPollable({
                                        type: 'loaded',
                                        data: pollable.data,
                                        params: {
                                            ...pollable.params,
                                            form: {
                                                ...pollable.params.form,
                                                toAddress: msg.account.address,
                                            },
                                        },
                                    })
                                    break
                                case 'on_account_create_request':
                                    setModal({ type: 'closed' })
                                    setPollable({
                                        type: 'loaded',
                                        data: pollable.data,
                                        params: {
                                            ...pollable.params,
                                            form: {
                                                ...pollable.params.form,
                                                toAddress:
                                                    msg.accountsWithKeystores[0]
                                                        .account.address,
                                            },
                                        },
                                    })
                                    onMsg(msg)
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
            return notReachable(pollable)
    }
}
