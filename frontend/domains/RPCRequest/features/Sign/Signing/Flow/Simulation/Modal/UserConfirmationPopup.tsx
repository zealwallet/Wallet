import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Code } from '@zeal/domains/Currency/components/Code'
import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { FailedSignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ResultIcon } from '@zeal/domains/SafetyCheck/components/ResultIcon'
import { SignMessageItem } from '@zeal/domains/SafetyCheck/components/SignMessageItem'
import { calculateSignMessageSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateSignMessageSafetyChecksResult'

type Props = {
    failedSafetyChecks: FailedSignMessageSafetyCheck[]
    knownCurrencies: KnownCurrencies
    keyStore: SigningKeyStore
    isLoading: boolean
    request: SignMessageRequest
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'close'
      }
    | {
          type: 'sign_click'
          keyStore: SigningKeyStore
          request: SignMessageRequest
      }

export const UserConfirmationPopup = ({
    failedSafetyChecks,
    keyStore,
    knownCurrencies,
    isLoading,
    request,
    onMsg,
}: Props) => {
    return (
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby="sign-message-simulation-confirmation-popup-title"
        >
            <Header
                titleId="sign-message-simulation-confirmation-popup-title"
                icon={({ size }) => (
                    <ResultIcon
                        size={size}
                        safetyCheckResult={calculateSignMessageSafetyChecksResult(
                            failedSafetyChecks
                        )}
                    />
                )}
                title={
                    <Title
                        knownCurrencies={knownCurrencies}
                        safetyCheck={failedSafetyChecks[0]}
                    />
                }
            />
            <Popup.Content>
                <Column spacing={12}>
                    {failedSafetyChecks.map((check) => (
                        <SignMessageItem
                            knownCurrencies={knownCurrencies}
                            key={check.type}
                            safetyCheck={check}
                        />
                    ))}
                </Column>
            </Popup.Content>
            <Popup.Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="action.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>
                <Button
                    size="regular"
                    disabled={isLoading}
                    variant="secondary"
                    onClick={() =>
                        onMsg({ type: 'sign_click', keyStore, request })
                    }
                >
                    <FormattedMessage
                        id="action.accept"
                        defaultMessage="Accept"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}

const Title = ({
    safetyCheck,
    knownCurrencies,
}: {
    knownCurrencies: KnownCurrencies
    safetyCheck: FailedSignMessageSafetyCheck
}) => {
    switch (safetyCheck.type) {
        case 'ApprovalExpirationLimitCheck':
            return (
                <FormattedMessage
                    id="PermitExpirationCheck.Failed.title"
                    defaultMessage="Long expiry time"
                />
            )

        case 'TokenVerificationCheck':
            return (
                <FormattedMessage
                    id="TokenVerificationCheck.Passed.title"
                    defaultMessage="{tokenCode} is not verified by CoinGecko"
                    values={{
                        tokenCode: (
                            <Code
                                knownCurrencies={knownCurrencies}
                                currencyId={safetyCheck.currencyId}
                            />
                        ),
                    }}
                />
            )

        case 'SmartContractBlacklistCheck':
            return (
                <FormattedMessage
                    id="SmartContractBlacklistCheck.Failed.title"
                    defaultMessage="Contract is blacklisted"
                />
            )

        case 'ApprovalSpenderTypeCheck':
            return (
                <FormattedMessage
                    id="ApprovalSpenderTypeCheck.Failed.title"
                    defaultMessage="Spender is a wallet, not a contract"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(safetyCheck)
    }
}
