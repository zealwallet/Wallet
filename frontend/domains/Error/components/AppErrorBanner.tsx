import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Refresh } from '@zeal/uikit/Icon/Refresh'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { useLiveRef } from '@zeal/toolkit'

import { AppError } from '@zeal/domains/Error'
import { Title } from '@zeal/domains/Error/components/Title'
import { captureAppError } from '@zeal/domains/Error/helpers/captureAppError'

type Props = {
    error: AppError
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'try_again_clicked' }

export const AppErrorBanner = ({ error, onMsg }: Props) => {
    const liveError = useLiveRef(error)

    // We hold actual error in ref, but if type somehow changes - we report
    // This will prevent report spamming, since we usually do parsing in render
    useEffect(() => {
        captureAppError(liveError.current, { source: 'app_error_popup' })
    }, [liveError, liveError.current.type])

    return (
        <BannerSolid
            rounded
            right={
                <Tertiary
                    size="regular"
                    color="warning"
                    onClick={() => onMsg({ type: 'try_again_clicked' })}
                >
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Refresh size={14} color={color} />
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="app.error-banner.retry"
                                    defaultMessage="Retry"
                                />
                            </Text>
                        </>
                    )}
                </Tertiary>
            }
            title={<Title error={error} />}
            subtitle={JSON.stringify(error)}
            variant="warning"
        />
    )
}
