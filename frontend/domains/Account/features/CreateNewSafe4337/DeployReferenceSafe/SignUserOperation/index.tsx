import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { UserOperationWithoutSignature } from '@zeal/domains/UserOperation'
import { fetchUserOperationHash } from '@zeal/domains/UserOperation/api/fetchUserOperationHash'

import { Sign } from './Sign'

import { LoadingLayout } from '../LoadingLayout'

type Props = {
    userOperationWithoutSignature: UserOperationWithoutSignature
    network: Network
    passkey: Safe4337['safeDeplymentConfig']['passkeyOwner']
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Sign>

export const SignUserOperation = ({
    userOperationWithoutSignature,
    onMsg,
    network,
    sessionPassword,
    passkey,
    networkRPCMap,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchUserOperationHash, {
        type: 'loading',
        params: {
            network,
            networkRPCMap,
            userOperation: userOperationWithoutSignature,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return <LoadingLayout onMsg={onMsg} />
        case 'loaded':
            return (
                <Sign
                    passkey={passkey}
                    sessionPassword={sessionPassword}
                    userOperationWithoutSignature={
                        userOperationWithoutSignature
                    }
                    userOperationHash={loadable.data}
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
