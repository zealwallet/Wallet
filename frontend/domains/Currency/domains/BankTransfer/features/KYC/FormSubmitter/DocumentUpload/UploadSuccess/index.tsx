import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

import { Modal, State as ModalState } from './Modal'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'kyc_data_updated' }

export const UploadSuccess = ({ onMsg }: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <SuccessLayout
                title={
                    <FormattedMessage
                        id="kyc.submitted"
                        defaultMessage="Submitted"
                    />
                }
                onAnimationComplete={() =>
                    setState({ type: 'kyc_pending_modal' })
                }
            />
            <Modal
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg({ type: 'kyc_data_updated' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
