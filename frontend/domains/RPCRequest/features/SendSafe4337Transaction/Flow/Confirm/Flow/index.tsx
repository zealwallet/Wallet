import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import {
    CryptoCurrency,
    CurrencyId,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { GasAbstractionTransactionFee } from '@zeal/domains/UserOperation'
import { fetchGasAbstractionTransactionFees } from '@zeal/domains/UserOperation/api/fetchGasAbstractionTransactionFees'
import {
    DUMMY_EOA_SIGNATURE,
    DUMMY_PASSKEY_SIGNATURE,
    EOA_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
    PASSKEY_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
} from '@zeal/domains/UserOperation/constants'

import { Layout, VisualState } from './Layout'
import { Modal, State as ModalState } from './Modal'
import { validate } from './validation'

type Props = {
    initialGasAbstractionTransactionFees: GasAbstractionTransactionFee[]
    userOperationRequest: SimulatedUserOperationRequest
    installationId: string
    simulation: SimulateTransactionResponse
    network: Network
    dAppInfo: DAppSiteInfo | null
    portfolio: Portfolio | null
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    visualState: VisualState
    actionSource: ActionSource
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_minimize_click' }
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'on_submit_click'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'drag'
                  | 'on_expand_request'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_user_confirmed_transaction_for_signing'
                  | 'on_4337_gas_currency_selected'
          }
      >

const calculateSelectedGasCurrencyId = ({
    initialGasAbstractionTransactionFees,
    portfolio,
    gasCurrencyPresetMap,
    network,
}: {
    portfolio: Portfolio | null
    initialGasAbstractionTransactionFees: GasAbstractionTransactionFee[]
    gasCurrencyPresetMap: GasCurrencyPresetMap
    network: Network
}): CryptoCurrency => {
    const savedGasCurrencyId = gasCurrencyPresetMap[network.hexChainId] || null

    const gasCurrency =
        initialGasAbstractionTransactionFees
            .map(({ feeInTokenCurrency }) => feeInTokenCurrency.currency)
            .find((currency) => currency.id === savedGasCurrencyId) || null

    if (gasCurrency) {
        return gasCurrency
    }

    const portfolioTokens = portfolio?.tokens || []

    const portfolioCurrencies = new Set<CurrencyId>(
        portfolioTokens.map((token) => token.balance.currencyId)
    )

    const feesWithCurrencyInPortfolio =
        initialGasAbstractionTransactionFees.filter((fee) =>
            portfolioCurrencies.has(fee.feeInTokenCurrency.currency.id)
        )

    const feesWithEnoughBalance = feesWithCurrencyInPortfolio.filter((fee) => {
        const balance = portfolioTokens.find(
            (token) =>
                token.balance.currencyId === fee.feeInTokenCurrency.currency.id
        )?.balance

        return balance && balance.amount >= fee.feeInTokenCurrency.amount
    })

    if (feesWithEnoughBalance.length) {
        return feesWithEnoughBalance[0].feeInTokenCurrency.currency
    }

    if (feesWithCurrencyInPortfolio.length) {
        return feesWithCurrencyInPortfolio[0].feeInTokenCurrency.currency
    }

    return initialGasAbstractionTransactionFees[0].feeInTokenCurrency.currency
}

const POLLABLE_INTERVAL_MS = 10_000

export const Flow = ({
    portfolio,
    initialGasAbstractionTransactionFees,
    dAppInfo,
    network,
    accountsMap,
    networkMap,
    keyStoreMap,
    onMsg,
    userOperationRequest,
    gasCurrencyPresetMap,
    simulation,
    visualState,
    actionSource,
    networkRPCMap,
    installationId,
}: Props) => {
    const [pollable] = usePollableData(
        fetchGasAbstractionTransactionFees,
        {
            type: 'loaded',
            data: initialGasAbstractionTransactionFees,
            params: (() => {
                switch (userOperationRequest.type) {
                    case 'simulated_safe_deployment_bundle_user_operation_request':
                    case 'simulated_safe_with_add_owner_user_operation_request':
                        return {
                            initCode: userOperationRequest.initCode,
                            network,
                            sender: userOperationRequest.account.address,
                            metaTransactionDatas: [
                                userOperationRequest.metaTransactionData,
                                userOperationRequest.addOwnerMetaTransactionData,
                            ],
                            networkRPCMap,
                            verificationGasLimitBuffer:
                                PASSKEY_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
                            entrypoint: userOperationRequest.entrypoint,
                            portfolio,
                            dummySignature: DUMMY_PASSKEY_SIGNATURE,
                        }
                    case 'simulated_safe_without_deployment_bundle_user_operation_request':
                        return {
                            initCode: userOperationRequest.initCode,
                            network,
                            sender: userOperationRequest.account.address,
                            metaTransactionDatas: [
                                userOperationRequest.metaTransactionData,
                            ],
                            networkRPCMap,
                            verificationGasLimitBuffer:
                                EOA_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
                            entrypoint: userOperationRequest.entrypoint,
                            portfolio,
                            dummySignature: DUMMY_EOA_SIGNATURE,
                        }

                    default:
                        return notReachable(userOperationRequest)
                }
            })(),
        },
        { pollIntervalMilliseconds: POLLABLE_INTERVAL_MS, stopIf: () => false }
    )
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    const [selectedGasCurrency, setSelectedGasCurrency] =
        useState<CryptoCurrency>(
            calculateSelectedGasCurrencyId({
                portfolio,
                initialGasAbstractionTransactionFees:
                    initialGasAbstractionTransactionFees,
                gasCurrencyPresetMap,
                network: userOperationRequest.network,
            })
        )

    const [pollingStartedAt, setPollingStartedAt] = useState<number>(Date.now)

    useEffect(() => {
        setPollingStartedAt(Date.now())
    }, [pollable])

    switch (pollable.type) {
        case 'loading':
        case 'error':
            throw new ImperativeError(
                'Impossible pollable state in SendSafeTransaction confirm flow'
            )
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            const validationResult = validate({
                feeForecast: pollable.data,
                portfolio,
                selectedGasCurrency,
                simulatedTransaction: simulation.transaction,
            })

            return (
                <>
                    <Layout
                        installationId={installationId}
                        pollingStartedAt={pollingStartedAt}
                        pollingInterval={POLLABLE_INTERVAL_MS}
                        selectedGasCurrency={selectedGasCurrency}
                        feeForecastValidation={validationResult}
                        simulation={simulation}
                        accountsMap={accountsMap}
                        keyStoreMap={keyStoreMap}
                        networkMap={networkMap}
                        userOperationRequest={userOperationRequest}
                        feeForecast={pollable.data}
                        dAppInfo={dAppInfo}
                        portfolio={portfolio}
                        visualState={visualState}
                        actionSource={actionSource}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_safety_checks_clicked':
                                    setModal({
                                        type: 'safety_checks_popup',
                                        simulation: msg.simulation,
                                    })
                                    break
                                case 'drag':
                                case 'on_expand_request':
                                case 'on_submit_click':
                                case 'on_minimize_click':
                                case 'on_cancel_confirm_transaction_clicked':
                                    onMsg(msg)
                                    break
                                case 'on_user_confirmation_requested':
                                    setModal({
                                        type: 'user_confirmation',
                                        failedSafetyChecks:
                                            msg.failedSafetyChecks,
                                        knownCurrencies: msg.knownCurrencies,
                                        selectedFee: msg.selectedFee,
                                    })
                                    break
                                case 'on_fee_forecast_click':
                                    setModal({ type: 'gas_currency_selector' })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                    <Modal
                        pollingInterval={POLLABLE_INTERVAL_MS}
                        pollingStartedAt={pollingStartedAt}
                        feeForecastValidation={validationResult}
                        simulation={simulation}
                        account={userOperationRequest.account}
                        network={userOperationRequest.network}
                        state={modal}
                        userOperationRequest={userOperationRequest}
                        feeForecast={pollable.data}
                        portfolio={portfolio}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_minimize_click':
                                    onMsg(msg)
                                    break
                                case 'close':
                                    setModal({ type: 'closed' })
                                    break
                                case 'on_user_confirmed_transaction_for_signing':
                                    onMsg(msg)
                                    break
                                case 'on_4337_gas_currency_selected':
                                    onMsg(msg)
                                    setModal({ type: 'closed' })
                                    setSelectedGasCurrency(
                                        msg.selectedGasCurrency
                                    )
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
