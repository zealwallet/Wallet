import { useState } from 'react'

import { LightScan } from '@zeal/uikit/Icon/LightScan'
import { IconButton } from '@zeal/uikit/IconButton'

import { notReachable } from '@zeal/toolkit'

import { WalletConnectInstance } from '@zeal/domains/DApp/domains/WalletConnect'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

import { Modal, State as ModalState } from './Modal'

type Props = {
    walletConnectInstance: WalletConnectInstance
}

export const Flow = ({ walletConnectInstance }: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <IconButton
                variant="on_color"
                onClick={() => setModal({ type: 'qr_scanner' })}
            >
                {({ color }) => <LightScan size={24} color={color} />}
            </IconButton>

            <Modal
                state={modal}
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'on_permissions_error':
                            captureError(msg.error)
                            break

                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        case 'on_pairing_uri_scanned':
                            try {
                                await walletConnectInstance.pair({
                                    uri: msg.link.uri,
                                })
                            } catch (error) {
                                captureError(error)
                            }
                            setModal({
                                type: 'closed',
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
