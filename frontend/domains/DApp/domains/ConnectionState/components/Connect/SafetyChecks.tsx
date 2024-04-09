import { FormattedMessage } from 'react-intl'

import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Progress } from '@zeal/uikit/Progress'
import { Spinner } from '@zeal/uikit/Spinner'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { ConnectionStatusButton } from '@zeal/domains/SafetyCheck/components/ConnectionStatusButton'
import { calculateConnectionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksResult'

type SafetyChecksMsg = {
    type: 'on_safety_checks_click'
    safetyChecks: ConnectionSafetyCheck[]
}

export const SafetyChecks = ({
    safetyChecksLoadable,
    onMsg,
}: {
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    onMsg: (msg: SafetyChecksMsg) => void
}) => {
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
                <ConnectionStatusButton
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
