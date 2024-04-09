import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldCrossRound } from '@zeal/uikit/Icon/BoldCrossRound'
import { Popup } from '@zeal/uikit/Popup'
import { Text } from '@zeal/uikit/Text'

import { useLiveRef } from '@zeal/toolkit'

import { AppError } from '@zeal/domains/Error'
import { captureAppError } from '@zeal/domains/Error/helpers/captureAppError'

import { Title } from './Title'

type Props = {
    error: AppError
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | { type: 'try_again_clicked' }

export const AppErrorPopup = ({ error, onMsg }: Props) => {
    const liveError = useLiveRef(error)

    // We hold actual error in ref, but if type somehow changes - we report
    // This will prevent report spamming, since we usually do parsing in render
    useEffect(() => {
        captureAppError(liveError.current, { source: 'app_error_popup' })
    }, [liveError, liveError.current.type])

    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => (
                    <BoldCrossRound size={size} color={color} />
                )}
                title={<Title error={error} />}
                subtitle={
                    <FormattedMessage
                        id="error.unknown_error.subtitle"
                        defaultMessage="Sorry! Our system seems to be having issues. Retry once and if it doesn’t work please report on our Discord for support and updates."
                    />
                }
            />

            <Popup.Content>
                <Text>
                    <Text
                        variant="paragraph"
                        weight="bold"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="error.unknown_error.error_message"
                            defaultMessage="Error message: "
                        />
                    </Text>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        {JSON.stringify(error)}
                    </Text>
                </Text>
            </Popup.Content>

            <Popup.Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="action.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>

                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => onMsg({ type: 'try_again_clicked' })}
                >
                    <FormattedMessage
                        id="action.retry"
                        defaultMessage="Retry"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
