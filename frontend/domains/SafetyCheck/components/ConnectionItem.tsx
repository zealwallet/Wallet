import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ListItem } from '@zeal/uikit/ListItem'

import { notReachable } from '@zeal/toolkit'

import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SafetyCheckSubtitleSource } from '@zeal/domains/SafetyCheck/components/SafetyCheckSubtitleSource'

import { Icon } from './Icon'

type Props = {
    safetyCheck: ConnectionSafetyCheck
}

const Title = ({ safetyCheck }: Props) => {
    switch (safetyCheck.type) {
        case 'SuspiciousCharactersCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.Failed.title"
                            defaultMessage="We check for common phishing patterns"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.Passed.title"
                            defaultMessage="Address has no unusual characters"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        case 'BlacklistCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="BlacklistCheck.Failed.title"
                            defaultMessage="Site is blacklisted"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="BlacklistCheck.Passed.title"
                            defaultMessage="Site is not blacklisted"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        case 'DAppVerificationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="DAppVerificationCheck.Failed.title"
                            defaultMessage="Site wasn’t found in app registries"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="DAppVerificationCheck.Passed.title"
                            defaultMessage="Site appears in app registries"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        default:
            return notReachable(safetyCheck)
    }
}

const Subtitle = ({ safetyCheck }: Props) => {
    switch (safetyCheck.type) {
        case 'SuspiciousCharactersCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.Failed.subtitle"
                            defaultMessage="This is a common phishing tactic"
                        />
                    )

                case 'Passed':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.Passed.subtitle"
                            defaultMessage="We check for phishing attemps"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        case 'BlacklistCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="BlacklistCheck.Failed.subtitle"
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
                            id="BlacklistCheck.Passed.subtitle"
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

                default:
                    return notReachable(safetyCheck)
            }

        case 'DAppVerificationCheck':
            switch (safetyCheck.state) {
                case 'Failed':
                    return (
                        <FormattedMessage
                            id="DAppVerificationCheck.Failed.subtitle"
                            defaultMessage="Site isn't listed on <source></source>"
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
                            id="DAppVerificationCheck.Passed.subtitle"
                            defaultMessage="Site is listed on <source></source>"
                            values={{
                                source: () => (
                                    <SafetyCheckSubtitleSource
                                        checkSource={safetyCheck.checkSource}
                                    />
                                ),
                            }}
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }

        default:
            return notReachable(safetyCheck)
    }
}

export const ConnectionItem = ({ safetyCheck }: Props) => (
    <ListItem
        aria-current={false}
        size="regular"
        variant={(() => {
            switch (safetyCheck.state) {
                case 'Failed':
                    switch (safetyCheck.severity) {
                        case 'Caution':
                            return 'default'

                        case 'Danger':
                            return 'critical'

                        default:
                            return notReachable(safetyCheck.severity)
                    }

                case 'Passed':
                    return 'default'

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheck)
            }
        })()}
        primaryText={<Title safetyCheck={safetyCheck} />}
        shortText={<Subtitle safetyCheck={safetyCheck} />}
        side={{
            rightIcon: ({ size }) => (
                <Icon size={size} safetyCheck={safetyCheck} />
            ),
        }}
    />
)
