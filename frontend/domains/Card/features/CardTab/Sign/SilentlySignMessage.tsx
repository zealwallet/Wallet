import { useEffect } from 'react'

import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Account } from '@zeal/domains/Account'
import { GnosisPayLoginSignature } from '@zeal/domains/Card'
import { CardLoadingScreen } from '@zeal/domains/Card/components/CardLoadingScreen'
import { CARD_NETWORK } from '@zeal/domains/Card/constants'
import { getLoginMessage } from '@zeal/domains/Card/helpers/getLoginMessage'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { EOA, Safe4337, SigningKeyStore } from '@zeal/domains/KeyStore'
import { PersonalSign } from '@zeal/domains/RPCRequest'
import { signMessage } from '@zeal/domains/RPCRequest/helpers/signMessage'

type Props = {
    account: Account
    keyStore: EOA | Safe4337
    loadingVariant: 'card' | 'spinner'
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_gnosis_pay_message_signed'
    gnosisPayLoginSignature: GnosisPayLoginSignature
}

const fetch = async ({
    account,
    keyStore,
    sessionPassword,
}: {
    account: Account
    keyStore: SigningKeyStore
    sessionPassword: string
}): Promise<GnosisPayLoginSignature> => {
    const address = account.address
    const message = await getLoginMessage({ address })

    const request: PersonalSign = {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'personal_sign',
        params: [message],
    }

    const signature = await signMessage({
        keyStore,
        network: CARD_NETWORK,
        request,
        sessionPassword,
    })

    return {
        type: 'gnosis_pay_login_info',
        address,
        message,
        signature,
    }
}

export const SilentlySignMessage = ({
    keyStore,
    sessionPassword,
    account,
    loadingVariant,
    onMsg,
}: Props) => {
    const onMsgLive = useLiveRef(onMsg)
    const [loadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            keyStore,
            account,
            network: CARD_NETWORK,
            sessionPassword,
        },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
                onMsgLive.current({
                    type: 'on_gnosis_pay_message_signed',
                    gnosisPayLoginSignature: loadable.data,
                })
                break

            case 'loading':
                break

            case 'error':
                captureError(loadable.error)
                break

            default:
                notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    switch (loadingVariant) {
        case 'card':
            return <CardLoadingScreen account={account} />
        case 'spinner':
            return <LoadingLayout actionBar={null} onClose={null} />
        /* istanbul ignore next */
        default:
            return notReachable(loadingVariant)
    }
}
