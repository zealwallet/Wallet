import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { SignMessageSimulationResponse } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'
import { ResultIcon } from '@zeal/domains/SafetyCheck/components/ResultIcon'
import { SignMessageItem } from '@zeal/domains/SafetyCheck/components/SignMessageItem'
import { calculateSignMessageSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateSignMessageSafetyChecksResult'

type Props = {
    simulationResponse: SignMessageSimulationResponse
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const SafetyCheckPopup = ({ simulationResponse, onMsg }: Props) => {
    const { checks, currencies } = simulationResponse
    const result = calculateSignMessageSafetyChecksResult(checks)

    return (
        <Popup.Layout
            aria-labelledby="SignMessageSafetyChecksConfirmation-label"
            onMsg={onMsg}
        >
            <Header
                icon={({ size }) => (
                    <ResultIcon size={size} safetyCheckResult={result} />
                )}
                titleId="SignMessageSafetyChecksConfirmation-label"
                title={<Title simulationResponse={simulationResponse} />}
            />
            <Popup.Content>
                <Column spacing={12}>
                    {checks.map((check) => (
                        <SignMessageItem
                            knownCurrencies={currencies}
                            key={check.type}
                            safetyCheck={check}
                        />
                    ))}
                </Column>
            </Popup.Content>
        </Popup.Layout>
    )
}

const Title = ({
    simulationResponse,
}: {
    simulationResponse: SignMessageSimulationResponse
}) => {
    switch (simulationResponse.message.type) {
        case 'UnknownSignMessage':
            return null
        case 'PermitSignMessage':
        case 'DaiPermitSignMessage':
        case 'Permit2SignMessage':
            return (
                <FormattedMessage
                    id="SignMessageSafetyChecksPopup.title.permits"
                    defaultMessage="Permit safety checks"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(simulationResponse.message)
    }
}
