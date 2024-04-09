import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Row } from '@zeal/uikit/Row'

import { notReachable } from '@zeal/toolkit'
import { failure, success } from '@zeal/toolkit/Result'

import { KeyStore, SigningKeyStore } from '@zeal/domains/KeyStore'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import {
    FailedSignMessageSafetyCheck,
    SignMessageSafetyCheck,
    SignMessageSafetyCheckResult,
} from '@zeal/domains/SafetyCheck'
import { calculateSignMessageSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateSignMessageSafetyChecksResult'

type Props = {
    keyStore: KeyStore
    request: SignMessageRequest
    safetyChecks: SignMessageSafetyCheck[]
    isLoading: boolean
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'cancel_button_click' }
    | { type: 'import_keys_button_clicked' }
    | {
          type: 'sign_click'
          keyStore: SigningKeyStore
          request: SignMessageRequest
      }
    | {
          type: 'on_user_confirmation_requested'
          failedSafetyChecks: FailedSignMessageSafetyCheck[]
          request: SignMessageRequest
          keyStore: SigningKeyStore
      }

const validateSafetyChecks = (
    safetyChecks: SignMessageSafetyCheck[]
): SignMessageSafetyCheckResult => {
    const safetyChecksResult =
        calculateSignMessageSafetyChecksResult(safetyChecks)

    switch (safetyChecksResult.type) {
        case 'Failure': {
            const danger = safetyChecksResult.reason.failedChecks.filter(
                (check) => {
                    switch (check.severity) {
                        case 'Caution':
                            return false
                        case 'Danger':
                            return true
                        /* istanbul ignore next */
                        default:
                            return notReachable(check.severity)
                    }
                }
            )

            return !!danger.length
                ? failure({ type: 'safety_check_failed', failedChecks: danger })
                : success(undefined)
        }
        case 'Success':
            return success(undefined)
        /* istanbul ignore next */
        default:
            return notReachable(safetyChecksResult)
    }
}

export const ActionButtons = ({
    keyStore,
    safetyChecks,
    isLoading,
    request,
    onMsg,
}: Props) => {
    return (
        <Row spacing={8}>
            <Button
                size="regular"
                variant="secondary"
                onClick={() =>
                    onMsg({
                        type: 'cancel_button_click',
                    })
                }
            >
                <FormattedMessage id="action.cancel" defaultMessage="Cancel" />
            </Button>
            <MainCTA
                keyStore={keyStore}
                request={request}
                safetyChecks={safetyChecks}
                isLoading={isLoading}
                onMsg={onMsg}
            />
        </Row>
    )
}

const MainCTA = ({
    keyStore,
    safetyChecks,
    request,
    isLoading,
    onMsg,
}: {
    keyStore: KeyStore
    request: SignMessageRequest
    safetyChecks: SignMessageSafetyCheck[]
    isLoading: boolean
    onMsg: (msg: Msg) => void
}) => {
    const safetyChecksValidationResult = validateSafetyChecks(safetyChecks)
    switch (keyStore.type) {
        case 'track_only':
            return (
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({ type: 'import_keys_button_clicked' })
                    }
                >
                    <FormattedMessage
                        id="confirmTransaction.importKeys"
                        defaultMessage="Import keys"
                    />
                </Button>
            )
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
        case 'safe_4337':
            switch (safetyChecksValidationResult.type) {
                case 'Failure':
                    return (
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                onMsg({
                                    type: 'on_user_confirmation_requested',
                                    keyStore,
                                    request,
                                    failedSafetyChecks:
                                        safetyChecksValidationResult.reason
                                            .failedChecks,
                                })
                            }}
                        >
                            <FormattedMessage
                                id="rpc.sign.accept"
                                defaultMessage="Accept"
                            />
                        </Button>
                    )
                case 'Success':
                    return (
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                onMsg({ type: 'sign_click', keyStore, request })
                            }}
                        >
                            <FormattedMessage
                                id="rpc.sign.accept"
                                defaultMessage="Accept"
                            />
                        </Button>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(safetyChecksValidationResult)
            }

        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}
