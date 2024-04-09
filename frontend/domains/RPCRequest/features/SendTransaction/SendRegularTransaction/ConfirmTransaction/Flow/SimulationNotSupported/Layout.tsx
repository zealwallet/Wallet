import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Progress } from '@zeal/uikit/Progress'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

import { FeeForecastWidget } from '../../../FeeForecastWidget'
import {
    NonceRangeErrorBiggerThanCurrent,
    TrxLikelyToFail,
    TrxMayTakeLongToProceedBaseFeeLow,
    TrxMayTakeLongToProceedGasPriceLow,
    TrxMayTakeLongToProceedPriorityFeeLow,
} from '../../../FeeForecastWidget/helpers/validation'
import { ActionButton } from '../ActionButton'

type Props = {
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap

    pollable: PollableData<FeeForecastResponse, FeeForecastRequest>
    pollingStartedAt: number
    pollingInterval: number
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type UserConfirmationRequiredReason =
    | TrxMayTakeLongToProceedBaseFeeLow<SigningKeyStore>
    | TrxMayTakeLongToProceedGasPriceLow<SigningKeyStore>
    | TrxMayTakeLongToProceedPriorityFeeLow<SigningKeyStore>
    | TrxLikelyToFail<SigningKeyStore>
    | NonceRangeErrorBiggerThanCurrent<SigningKeyStore>

type Msg =
    | MsgOf<typeof FeeForecastWidget>
    | Extract<
          MsgOf<typeof ActionButton>,
          { type: 'continue_button_clicked' | 'import_keys_button_clicked' }
      >
    | { type: 'on_minimize_click' }
    | { type: 'on_cancel_confirm_transaction_clicked' }
    | {
          type: 'user_confirmation_requested'
          reason: UserConfirmationRequiredReason
      }

export const Layout = ({
    keyStoreMap,
    nonce,
    gasEstimate,
    transactionRequest,
    pollable,
    pollingStartedAt,
    pollingInterval,
    networkMap,
    actionSource,
    onMsg,
}: Props) => {
    const keystore = getKeyStore({
        keyStoreMap,
        address: transactionRequest.account.address,
    })

    return (
        <Screen padding="form" background="light">
            <ActionBar
                title={
                    <FormattedMessage
                        id="action_bar_title.transaction_request"
                        defaultMessage="Transaction request"
                    />
                }
                account={transactionRequest.account}
                actionSource={actionSource}
                network={findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                )}
                onMsg={onMsg}
            />

            <Column spacing={12} fill>
                <Content
                    footer={
                        <Progress
                            initialProgress={null}
                            progress={0}
                            variant="warning"
                            right={
                                <BoldDangerTriangle
                                    color="iconStatusWarning"
                                    size={20}
                                />
                            }
                            title={
                                <FormattedMessage
                                    id="SimulationNotSupported.footer.title"
                                    defaultMessage="Simulation not supported"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="SimulationNotSupported.footer.subtitle"
                                    defaultMessage="You can still submit this transaction"
                                />
                            }
                        />
                    }
                >
                    <Content.Splash
                        onAnimationComplete={null}
                        variant="warning"
                        title={
                            <FormattedMessage
                                id="SimulationNotSupported.Title"
                                defaultMessage="Simulation not{br}supported on{br}{network}"
                                values={{
                                    network: findNetworkByHexChainId(
                                        transactionRequest.networkHexId,
                                        networkMap
                                    ).name,
                                    br: '\n',
                                }}
                            />
                        }
                    />
                </Content>

                <FeeForecastWidget
                    keystore={keystore}
                    nonce={nonce}
                    gasEstimate={gasEstimate}
                    pollableData={pollable}
                    pollingInterval={pollingInterval}
                    pollingStartedAt={pollingStartedAt}
                    simulateTransactionResponse={{ type: 'not_supported' }}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />

                <Actions>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() =>
                            onMsg({
                                type: 'on_cancel_confirm_transaction_clicked',
                            })
                        }
                    >
                        <FormattedMessage
                            id="action.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>

                    <ActionButton
                        keystore={keystore}
                        nonce={nonce}
                        gasEstimate={gasEstimate}
                        pollableData={pollable}
                        transactionRequest={transactionRequest}
                        simulationResult={{ type: 'failed' }}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'continue_button_clicked':
                                case 'import_keys_button_clicked':
                                    onMsg(msg)
                                    break

                                case 'user_confirmation_requested': {
                                    switch (msg.reason.type) {
                                        case 'safety_check_failed':
                                        case 'safety_check_and_fee_validation_error':
                                        case 'simulation_failed_safety_checks':
                                            captureError(
                                                new ImperativeError(
                                                    `Impossible state, safety checks errors can not be triggered in unsupported simulation flow`
                                                )
                                            )
                                            break

                                        case 'trx_may_take_long_to_proceed_base_fee_low':
                                        case 'trx_may_take_long_to_proceed_gas_price_low':
                                        case 'trx_may_take_long_to_proceed_priority_fee_low':
                                        case 'nonce_range_error_bigger_than_current':
                                        case 'trx_likely_to_fail':
                                            onMsg({
                                                type: 'user_confirmation_requested',
                                                reason: msg.reason,
                                            })
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg.reason)
                                    }
                                    break
                                }

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </Actions>
            </Column>
        </Screen>
    )
}
