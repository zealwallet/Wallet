import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { CardWidget } from '@zeal/uikit/CardWidget'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop, useLiveRef } from '@zeal/toolkit'

import { GnosisPayAccountOnboardedState } from '@zeal/domains/Card'
import { SENSITIVE_SECRET_VIEW_TIMEOUT_SECONDS } from '@zeal/domains/Card/constants'

type Props = {
    gnosisPayAccountOnboardedState: GnosisPayAccountOnboardedState
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const LoadPin = ({ gnosisPayAccountOnboardedState, onMsg }: Props) => {
    const liveMsg = useLiveRef(onMsg)
    const [seconds, setSeconds] = useState<number>(
        SENSITIVE_SECRET_VIEW_TIMEOUT_SECONDS
    )

    useEffect(() => {
        if (seconds === 0) {
            liveMsg.current({ type: 'close' })
            return noop
        } else {
            const timeout = setTimeout(() => {
                setSeconds((sec) => sec - 1)
            }, 1000)

            return () => clearTimeout(timeout)
        }
    }, [liveMsg, seconds])

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => {
                onMsg({ type: 'close' })
            }}
        >
            <ActionBar
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />
                        </Row>
                    </Clickable>
                }
            />
            <Column spacing={16} alignX="center">
                <CardWidget side="front" />

                <Text variant="title1" color="textPrimary" weight="semi_bold">
                    {gnosisPayAccountOnboardedState.card.details?.pin}
                </Text>

                <Column spacing={12} alignX="center">
                    <Text
                        variant="paragraph"
                        color="textSecondary"
                        weight="regular"
                    >
                        <FormattedMessage
                            id="card.pin.change-pin-at-atm"
                            defaultMessage="The PIN can be changed at selected ATMs"
                        />
                    </Text>

                    <Text
                        variant="paragraph"
                        color="textSecondary"
                        weight="regular"
                    >
                        <FormattedMessage
                            id="card.pin.change-pin-at-atm"
                            defaultMessage="Screen will close in {seconds} sec"
                            values={{ seconds }}
                        />
                    </Text>
                </Column>
            </Column>
        </Screen>
    )
}
