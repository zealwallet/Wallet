import React from 'react'

import { ListItem } from '@zeal/uikit/ListItem'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'

import { Icon } from './Icon'
import { TransactionSafetyCheckSubtitle } from './TransactionSafetyCheckSubtitle'
import { TransactionSafetyCheckTitle } from './TransactionSafetyCheckTitle'

type Props = {
    safetyCheck: TransactionSafetyCheck
    knownCurrencies: KnownCurrencies
}

export const TransactionItem = ({ safetyCheck, knownCurrencies }: Props) => (
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
        primaryText={
            <TransactionSafetyCheckTitle
                safetyCheck={safetyCheck}
                knownCurrencies={knownCurrencies}
            />
        }
        shortText={
            <TransactionSafetyCheckSubtitle
                safetyCheck={safetyCheck}
                knownCurrencies={knownCurrencies}
            />
        }
        side={{
            rightIcon: ({ size }) => (
                <Icon size={size} safetyCheck={safetyCheck} />
            ),
        }}
    />
)
