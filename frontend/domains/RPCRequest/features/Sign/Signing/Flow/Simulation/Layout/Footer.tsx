import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'
import { SimulatedSignMessage } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'
import { SignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SignMessageStatusButton } from '@zeal/domains/SafetyCheck/components/SignMessageStatusButton'
import { calculateSignMessageSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateSignMessageSafetyChecksResult'
import { ListItem } from '@zeal/domains/SmartContract/components/ListItem'

type Props = {
    simulatedSignMessage: SimulatedSignMessage
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    safetyChecks: SignMessageSafetyCheck[]
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_safety_checks_clicked' }

export const Footer = ({
    simulatedSignMessage,
    knownCurrencies,
    safetyChecks,
    networkMap,
    onMsg,
}: Props) => {
    // TODO: Footer should never be visible for UnknownSignMessage. Consider removing the switch and always returning something like "Sign Message Safety Checks"
    switch (simulatedSignMessage.type) {
        case 'UnknownSignMessage':
            return null
        case 'PermitSignMessage':
        case 'DaiPermitSignMessage':
        case 'Permit2SignMessage':
            const safetyChecksResult =
                calculateSignMessageSafetyChecksResult(safetyChecks)
            return (
                <Column spacing={0}>
                    <Group
                        variant="default"
                        aria-labelledby="simulation.permit.footer.for"
                    >
                        <Column spacing={0}>
                            <Text
                                id="simulation.permit.footer.for"
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="simulation.approve.footer.for"
                                    defaultMessage="For"
                                />
                            </Text>
                            <ListItem
                                smartContract={simulatedSignMessage.approveTo}
                                networkMap={networkMap}
                                safetyChecks={safetyChecks}
                            />
                        </Column>
                    </Group>

                    <SignMessageStatusButton
                        safetyCheckResult={safetyChecksResult}
                        knownCurrencies={knownCurrencies}
                        onClick={() =>
                            onMsg({ type: 'on_safety_checks_clicked' })
                        }
                    />
                </Column>
            )

        /* istanbul ignore next */
        default:
            return notReachable(simulatedSignMessage)
    }
}
