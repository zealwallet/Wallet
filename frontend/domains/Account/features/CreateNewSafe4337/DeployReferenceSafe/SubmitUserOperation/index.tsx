import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { SubmittedUserOperationPending } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'
import { UserOperationWithSignature } from '@zeal/domains/UserOperation'
import { submitUserOperationToBundler } from '@zeal/domains/UserOperation/api/submitUserOperationToBundler'

import { CheckUserOperationStatus } from './CheckUserOperationStatus'

import { LoadingLayout } from '../LoadingLayout'

type Props = {
    userOperationWithSignature: UserOperationWithSignature
    keyStore: Safe4337
    label: string
    network: Network
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof CheckUserOperationStatus>

const fetch = async ({
    network,
    userOperationWithSignature,
    signal,
}: {
    userOperationWithSignature: UserOperationWithSignature
    network: Network
    signal?: AbortSignal
}): Promise<SubmittedUserOperationPending> => {
    const userOperationHash = await submitUserOperationToBundler({
        network,
        userOperationWithSignature,
        signal,
    })

    return {
        state: 'pending',
        queuedAt: Date.now(),
        sender: userOperationWithSignature.sender,
        userOperationHash,
    }
}

// FIXME :: @Nicvaniek check with team if we should confirm deployed safe address ==== predicted address [getSafeInstance -> throw if not deployed || deployed && address not the same]
export const SubmitUserOperation = ({
    network,
    userOperationWithSignature,
    onMsg,
    keyStore,
    label,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            network,
            userOperationWithSignature,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return <LoadingLayout onMsg={onMsg} />
        case 'loaded':
            return (
                <CheckUserOperationStatus
                    submittedUserOperation={loadable.data}
                    keyStore={keyStore}
                    label={label}
                    network={network}
                    onMsg={onMsg}
                />
            )
        case 'error':
            const error = parseAppError(loadable.error)

            return (
                <>
                    <LoadingLayout onMsg={onMsg} />
                    <AppErrorPopup
                        error={error}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break
                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
