import React from 'react'
import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SafetyCheckSubtitleSource } from '@zeal/domains/SafetyCheck/components/SafetyCheckSubtitleSource'

type Props = {
    safetyCheck: TransactionSafetyCheck
    knownCurrencies: KnownCurrencies
}

export const TransactionSafetyCheckSubtitle = ({ safetyCheck }: Props) => {
    switch (safetyCheck.type) {
        case 'TransactionSimulationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="TransactionSimulationCheck.Failed.subtitle"
                            defaultMessage="Error: {errorMessage}"
                            values={{
                                errorMessage: safetyCheck.message,
                            }}
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="TransactionSimulationCheck.Passed.subtitle"
                            defaultMessage="Simulation done using <source></source>"
                            values={{
                                source: () => (
                                    <SafetyCheckSubtitleSource
                                        checkSource={safetyCheck.checkSource}
                                    />
                                ),
                            }}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        case 'TokenVerificationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="TokenVerificationCheck.Failed.subtitle"
                            defaultMessage="Token isn't listed on <source></source>"
                            values={{
                                source: () => (
                                    <SafetyCheckSubtitleSource
                                        checkSource={safetyCheck.checkSource}
                                    />
                                ),
                            }}
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="TokenVerificationCheck.Passed.subtitle"
                            defaultMessage="Token is listed on <source></source>"
                            values={{
                                source: () => (
                                    <SafetyCheckSubtitleSource
                                        checkSource={safetyCheck.checkSource}
                                    />
                                ),
                            }}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        case 'SmartContractBlacklistCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="SmartContractBlacklistCheck.Failed.subtitle"
                            defaultMessage="Malicious reports by <source></source>"
                            values={{
                                source: () => (
                                    <SafetyCheckSubtitleSource
                                        checkSource={safetyCheck.checkSource}
                                    />
                                ),
                            }}
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="SmartContractBlacklistCheck.Passed.subtitle"
                            defaultMessage="No malicious reports by <source></source>"
                            values={{
                                source: () => (
                                    <SafetyCheckSubtitleSource
                                        checkSource={safetyCheck.checkSource}
                                    />
                                ),
                            }}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        case 'NftCollectionCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="NftCollectionCheck.Failed.subtitle"
                            defaultMessage="Collection isn't verified on <source></source>"
                            values={{
                                source: () => (
                                    <SafetyCheckSubtitleSource
                                        checkSource={safetyCheck.checkSource}
                                    />
                                ),
                            }}
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="NftCollectionCheck.Passed.subtitle"
                            defaultMessage="Collection is verified on <source></source>"
                            values={{
                                source: () => (
                                    <SafetyCheckSubtitleSource
                                        checkSource={safetyCheck.checkSource}
                                    />
                                ),
                            }}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }
        case 'P2pReceiverTypeCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="P2pReceiverTypeCheck.Failed.subtitle"
                            defaultMessage="Are you sending to the correct address?"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="P2pReceiverTypeCheck.Passed.subtitle"
                            defaultMessage="Generally you send assets to other wallets"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }
        case 'ApprovalSpenderTypeCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="ApprovalSpenderTypeCheck.Failed.subtitle"
                            defaultMessage="Likely a scam: spenders should be contracts"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="ApprovalSpenderTypeCheck.Passed.subtitle"
                            defaultMessage="Generally you approve assets to contracts"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        /* istanbul ignore next */
        default:
            return notReachable(safetyCheck)
    }
}
