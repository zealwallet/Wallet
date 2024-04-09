import React, { useEffect } from 'react'

import { useLiveRef } from '@zeal/toolkit'

import { AppError } from '@zeal/domains/Error'
import { captureAppError } from '@zeal/domains/Error/helpers/captureAppError'

type Props = {
    error: AppError
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'try_again_clicked' }

export const AppErrorListItem = ({ error }: Props) => {
    const liveError = useLiveRef(error)

    // We hold actual error in ref, but if type somehow changes - we report
    // This will prevent report spamming, since we usually do parsing in render
    useEffect(() => {
        captureAppError(liveError.current, { source: 'app_error_list_item' })
    }, [liveError, liveError.current.type])

    // TODO Currently no design for this component
    return <></>
}
