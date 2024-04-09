import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { SumSubAccessToken } from '@zeal/domains/Storage'

import { ContinueWithPartner } from './ContinueWithPartner'
import { SumSubWrapper } from './SumSubWrapper'
import { UploadSuccess } from './UploadSuccess'

import { LoadingLayout } from '../../LoadingLayout'

type Props = {
    sumSubAccessToken: SumSubAccessToken
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'kyc_data_updated' }

type State =
    | { type: 'continue_with_partner' }
    | { type: 'document_upload_flow' }
    | { type: 'documents_uploaded' }

export const DocumentUpload = ({
    sumSubAccessToken,
    onMsg,
    account,
    network,
    keyStoreMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'continue_with_partner' })

    switch (state.type) {
        case 'continue_with_partner':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        onMsg={onMsg}
                    />
                    <ContinueWithPartner
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_continue_clicked':
                                    setState({ type: 'document_upload_flow' })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg.type)
                            }
                        }}
                    />
                </>
            )
        case 'document_upload_flow':
            return (
                <SumSubWrapper
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    sumSubAccessToken={sumSubAccessToken}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'application_submitted':
                                setState({ type: 'documents_uploaded' })
                                break
                            case 'close':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'documents_uploaded':
            return <UploadSuccess onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
