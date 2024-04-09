import { useIntl } from 'react-intl'

import { BoldTickRound } from '@zeal/uikit/Icon/BoldTickRound'
import { Spinner } from '@zeal/uikit/Spinner'

import { notReachable } from '@zeal/toolkit'

import { RequestState } from '@zeal/domains/Currency/domains/Bridge'

type Props = {
    size: number
    requestState: RequestState
}

export const RequestStateIcon = ({ requestState, size }: Props) => {
    const { formatMessage } = useIntl()
    switch (requestState.type) {
        case 'not_started':
            return null
        case 'pending':
            return (
                <Spinner
                    aria-label={formatMessage({
                        id: 'bridge.request_status.pending',
                        defaultMessage: 'Pending',
                    })}
                    size={size}
                    color="iconStatusNeutral"
                />
            )
        case 'completed':
            return (
                <BoldTickRound
                    aria-label={formatMessage({
                        id: 'bridge.request_status.completed',
                        defaultMessage: 'Completed',
                    })}
                    size={size}
                    color="iconStatusSuccess"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(requestState.type)
    }
}
