import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Code } from '@zeal/domains/Currency/components/Code'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'

type Props = {
    safetyCheck: TransactionSafetyCheck
    knownCurrencies: KnownCurrencies
}

export const TransactionSafetyCheckTitle = ({
    safetyCheck,
    knownCurrencies,
}: Props) => {
    switch (safetyCheck.type) {
        case 'TransactionSimulationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="TransactionSimulationCheck.Failed.title"
                            defaultMessage="Transaction is likely to fail"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="TransactionSimulationCheck.Passed.title"
                            defaultMessage="Transaction preview was successful"
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

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="TokenVerificationCheck.Failed.title"
                            defaultMessage="{tokenCode} is verified by CoinGecko"
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

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }

        case 'SmartContractBlacklistCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="SmartContractBlacklistCheck.Failed.title"
                            defaultMessage="Contract is blacklisted"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="SmartContractBlacklistCheck.Passed.title"
                            defaultMessage="Contract is not blacklisted"
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
                            id="NftCollectionCheck.Failed.title"
                            defaultMessage="Collection is not verified"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="NftCollectionCheck.Passed.title"
                            defaultMessage="Collection is verified"
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
                            id="P2pReceiverTypeCheck.Failed.title"
                            defaultMessage="Receiver is smart contract, not wallet"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="P2pReceiverTypeCheck.Passed.title"
                            defaultMessage="Receiver is a wallet"
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
                            id="ApprovalSpenderTypeCheck.Failed.title"
                            defaultMessage="Spender is a wallet, not a contract"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="ApprovalSpenderTypeCheck.Passed.title"
                            defaultMessage="Spender is a smart contract"
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
