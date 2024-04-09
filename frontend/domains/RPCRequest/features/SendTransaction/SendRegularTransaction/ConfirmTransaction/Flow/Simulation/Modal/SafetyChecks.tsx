import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { ResultIcon } from '@zeal/domains/SafetyCheck/components/ResultIcon'
import { TransactionItem } from '@zeal/domains/SafetyCheck/components/TransactionItem'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { validateSafetyCheckFailedWithFailedChecksOnly } from '../helpers/validation'

type Props = {
    knownCurrencies: KnownCurrencies

    simulateTransactionResponse: SimulateTransactionResponse

    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const SafetyChecks = ({
    onMsg,
    knownCurrencies,
    simulateTransactionResponse,
}: Props) => {
    const result = validateSafetyCheckFailedWithFailedChecksOnly({
        simulationResult: {
            type: 'simulated',
            simulation: simulateTransactionResponse,
        },
    })
    const safetyChecks = simulateTransactionResponse.checks

    return (
        <Popup.Layout
            aria-labelledby="SafetyChecksConfirmation-label"
            onMsg={onMsg}
        >
            <Header
                icon={({ size }) => (
                    <ResultIcon size={size} safetyCheckResult={result} />
                )}
                titleId="SafetyChecksConfirmation-label"
                title={
                    <FormattedMessage
                        id="transactionSafetyChecksPopup.title"
                        defaultMessage="Transaction Safety Checks"
                    />
                }
            />
            <Popup.Content>
                <Column spacing={12}>
                    {safetyChecks.map((check) => (
                        <TransactionItem
                            knownCurrencies={knownCurrencies}
                            key={check.type}
                            safetyCheck={check}
                        />
                    ))}
                </Column>
            </Popup.Content>
        </Popup.Layout>
    )
}
