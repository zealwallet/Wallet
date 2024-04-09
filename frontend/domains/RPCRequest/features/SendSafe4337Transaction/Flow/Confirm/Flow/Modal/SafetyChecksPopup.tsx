import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { ResultIcon } from '@zeal/domains/SafetyCheck/components/ResultIcon'
import { TransactionItem } from '@zeal/domains/SafetyCheck/components/TransactionItem'
import { calculateTransactionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateTransactionSafetyChecksResult'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

type Props = {
    simulation: SimulateTransactionResponse
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const SafetyChecksPopup = ({ onMsg, simulation }: Props) => {
    const result = calculateTransactionSafetyChecksResult(simulation.checks)

    return (
        <Popup.Layout
            aria-labelledby="safe-safety-checks-popup-label"
            onMsg={onMsg}
        >
            <Header
                icon={({ size }) => (
                    <ResultIcon size={size} safetyCheckResult={result} />
                )}
                titleId="safe-safety-checks-popup-label"
                title={
                    <FormattedMessage
                        id="safe-safety-checks-popup.title"
                        defaultMessage="Transaction Safety Checks"
                    />
                }
            />
            <Popup.Content>
                <Column spacing={12}>
                    {simulation.checks.map((check) => (
                        <TransactionItem
                            knownCurrencies={simulation.currencies}
                            key={check.type}
                            safetyCheck={check}
                        />
                    ))}
                </Column>
            </Popup.Content>
        </Popup.Layout>
    )
}
