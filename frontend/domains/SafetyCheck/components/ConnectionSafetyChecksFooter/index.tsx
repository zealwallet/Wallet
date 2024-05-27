import { FormattedMessage } from 'react-intl'

import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Progress } from '@zeal/uikit/Progress'
import { Spinner } from '@zeal/uikit/Spinner'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksResult'

import { StatusButton } from './StatusButton'

type Msg = {
    type: 'on_safety_checks_click'
    safetyChecks: ConnectionSafetyCheck[]
}

type Props = {
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    onMsg: (msg: Msg) => void
}

export const ConnectionSafetyChecksFooter = ({
    safetyChecksLoadable,
    onMsg,
}: Props) => {
    switch (safetyChecksLoadable.type) {
        case 'loading':
            return (
                <Progress
                    variant="neutral"
                    progress={0}
                    initialProgress={0}
                    title={
                        <FormattedMessage
                            id="connection_state.connect.safetyChecksLoading"
                            defaultMessage="Checking site safety"
                        />
                    }
                    right={<Spinner size={20} color="iconAccent2" />}
                />
            )
        case 'loaded':
            const checkResult = calculateConnectionSafetyChecksResult(
                safetyChecksLoadable.data.checks
            )
            return (
                <StatusButton
                    safetyCheckResult={checkResult}
                    onClick={() =>
                        onMsg({
                            type: 'on_safety_checks_click',
                            safetyChecks: safetyChecksLoadable.data.checks,
                        })
                    }
                />
            )
        case 'error':
            return (
                <Progress
                    variant="critical"
                    progress={0}
                    initialProgress={0}
                    title={
                        <FormattedMessage
                            id="connection_state.connect.safetyChecksLoadingError"
                            defaultMessage="Couldn’t complete safety checks"
                        />
                    }
                    right={
                        <BoldDangerTriangle color="statusWarning" size={24} />
                    }
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(safetyChecksLoadable)
    }
}
