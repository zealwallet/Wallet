import { FormattedMessage, useIntl } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksResult'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { shouldWeConfirmSafetyCheck } from '../../helpers'

type Props = {
    selectedNetwork: Network
    selectedAccount: Account
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    keystore: KeyStore
    alternativeProvider: AlternativeProvider
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_safety_checks_click'; safetyChecks: ConnectionSafetyCheck[] }
    | MsgOf<typeof MetaMaskButton>
    | { type: 'connect_button_click'; account: Account; network: Network }
    | { type: 'reject_connection_button_click' }
    | {
          type: 'connect_confirmation_requested'
          safetyChecks: ConnectionSafetyCheck[]
      }

export const Layout = ({
    safetyChecksLoadable,
    selectedAccount,
    selectedNetwork,
    keystore,
    alternativeProvider,
    installationId,
    onMsg,
}: Props) => {
    switch (safetyChecksLoadable.type) {
        case 'error':
        case 'loading':
            return (
                <Column spacing={12}>
                    <MetaMaskButton
                        installationId={installationId}
                        alternativeProvider={alternativeProvider}
                        onMsg={onMsg}
                    />

                    <Actions>
                        <Button
                            size="regular"
                            variant="secondary"
                            onClick={() =>
                                onMsg({
                                    type: 'reject_connection_button_click',
                                })
                            }
                        >
                            <FormattedMessage
                                id="connection_state.connect.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                postUserEvent({
                                    type: 'ConnectionAcceptedEvent',
                                    keystoreType:
                                        keystoreToUserEventType(keystore),
                                    network: selectedNetwork.hexChainId,
                                    installationId,
                                    keystoreId: keystore.id,
                                })
                                onMsg({
                                    type: 'connect_button_click',
                                    account: selectedAccount,
                                    network: selectedNetwork,
                                })
                            }}
                        >
                            <FormattedMessage
                                id="connection_state.connect.connect_button"
                                defaultMessage="Connect Zeal"
                            />
                        </Button>
                    </Actions>
                </Column>
            )

        case 'loaded':
            const checkResult = calculateConnectionSafetyChecksResult(
                safetyChecksLoadable.data.checks
            )
            return (
                <Column spacing={12}>
                    <MetaMaskButton
                        installationId={installationId}
                        alternativeProvider={alternativeProvider}
                        onMsg={onMsg}
                    />
                    <Actions>
                        <Button
                            size="regular"
                            variant="secondary"
                            onClick={() =>
                                onMsg({
                                    type: 'reject_connection_button_click',
                                })
                            }
                        >
                            <FormattedMessage
                                id="connection_state.connect.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                switch (checkResult.type) {
                                    case 'Failure': {
                                        shouldWeConfirmSafetyCheck(
                                            checkResult.reason.failedChecks
                                        )
                                            ? onMsg({
                                                  type: 'connect_confirmation_requested',
                                                  safetyChecks:
                                                      safetyChecksLoadable.data
                                                          .checks,
                                              })
                                            : (() => {
                                                  postUserEvent({
                                                      type: 'ConnectionAcceptedEvent',
                                                      keystoreType:
                                                          keystoreToUserEventType(
                                                              keystore
                                                          ),
                                                      network:
                                                          selectedNetwork.hexChainId,
                                                      installationId,
                                                      keystoreId: keystore.id,
                                                  })
                                                  onMsg({
                                                      type: 'connect_button_click',
                                                      account: selectedAccount,
                                                      network: selectedNetwork,
                                                  })
                                              })()

                                        break
                                    }
                                    case 'Success':
                                        postUserEvent({
                                            type: 'ConnectionAcceptedEvent',
                                            keystoreType:
                                                keystoreToUserEventType(
                                                    keystore
                                                ),
                                            network: selectedNetwork.hexChainId,
                                            installationId,
                                            keystoreId: keystore.id,
                                        })
                                        onMsg({
                                            type: 'connect_button_click',
                                            account: selectedAccount,
                                            network: selectedNetwork,
                                        })
                                        break

                                    default:
                                        notReachable(checkResult)
                                }
                            }}
                        >
                            <FormattedMessage
                                id="connection_state.connect.connect_button"
                                defaultMessage="Connect Zeal"
                            />
                        </Button>
                    </Actions>
                </Column>
            )

        /* istanbul ignore next */
        default:
            return notReachable(safetyChecksLoadable)
    }
}

const MetaMaskButton = ({
    alternativeProvider,
    installationId,
    onMsg,
}: {
    alternativeProvider: AlternativeProvider
    installationId: string
    onMsg: (msg: { type: 'use_meta_mask_instead_clicked' }) => void
}) => {
    const { formatMessage } = useIntl()
    switch (alternativeProvider) {
        case 'metamask':
            return (
                <Actions>
                    <Button
                        aria-label={formatMessage({
                            id: 'connection_state.connect.changeToMetamask.label',
                            defaultMessage: 'Change to MetaMask',
                        })}
                        variant="warning"
                        size="regular"
                        onClick={() => {
                            postUserEvent({
                                type: 'ConnectionToggledToMetamaskEvent',
                                installationId,
                            })
                            return onMsg({
                                type: 'use_meta_mask_instead_clicked',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="connection_state.connect.changeToMetamask"
                            defaultMessage="Change to MetaMask 🦊"
                        />
                    </Button>
                </Actions>
            )
        case 'provider_unavailable':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(alternativeProvider)
    }
}
