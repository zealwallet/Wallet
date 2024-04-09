import React from 'react'
import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Code } from '@zeal/domains/Currency/components/Code'
import { SignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'

type Props = {
    safetyCheck: SignMessageSafetyCheck
    knownCurrencies: KnownCurrencies
}

export const SignMessageSafetyCheckTitle = ({
    safetyCheck,
    knownCurrencies,
}: Props) => {
    switch (safetyCheck.type) {
        case 'ApprovalExpirationLimitCheck':
            switch (safetyCheck.state) {
                case 'Passed':
                    return (
                        <FormattedMessage
                            id="PermitExpirationCheck.Passed.title"
                            defaultMessage="Expiry time not too long"
                        />
                    )
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="PermitExpirationCheck.Failed.title"
                            defaultMessage="Long expiry time"
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
