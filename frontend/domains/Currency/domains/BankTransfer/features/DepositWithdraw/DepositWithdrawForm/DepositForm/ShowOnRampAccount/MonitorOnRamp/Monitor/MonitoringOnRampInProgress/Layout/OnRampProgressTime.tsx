import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import { ON_RAMP_SERVICE_TIME_MS } from '@zeal/domains/Currency/domains/BankTransfer/constants'

type Props = {
    now: number
    startedAt: number
}

export const OnRampProgressTime = ({ now, startedAt }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    return (
        <>
            {`${formatHumanReadableDuration(
                now - startedAt,
                'floor'
            )} / ${formatHumanReadableDuration(ON_RAMP_SERVICE_TIME_MS)}`}
        </>
    )
}
