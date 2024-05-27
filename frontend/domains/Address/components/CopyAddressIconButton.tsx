import { ComponentPropsWithoutRef, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Copy } from '@zeal/uikit/Icon/Copy'
import { Tick } from '@zeal/uikit/Icon/Tick'
import { TickSquare } from '@zeal/uikit/Icon/TickSquare'
import { IconButton } from '@zeal/uikit/IconButton'
import { Modal } from '@zeal/uikit/Modal'
import { Toast, ToastContainer, ToastText } from '@zeal/uikit/Toast'

import { noop, notReachable } from '@zeal/toolkit'
import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'

import { Address } from '@zeal/domains/Address'
import { format } from '@zeal/domains/Address/helpers/format'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    size: number
    variant: ComponentPropsWithoutRef<typeof IconButton>['variant']
    address: Address
}

export const CopyAddressIconButton = ({
    size,
    address,
    installationId,
    variant,
}: Props) => {
    const [state, setState] = useCopyTextToClipboard()

    useEffect(() => {
        switch (state.type) {
            case 'loaded':
                postUserEvent({
                    type: 'CopyAddress',
                    installationId,
                })
                break
            case 'loading':
            case 'not_asked':
                break

            case 'error':
                captureError(state.error)
                break
            default:
                notReachable(state)
        }
    }, [installationId, state])

    switch (state.type) {
        case 'not_asked':
            return (
                <IconButton
                    variant={variant}
                    onClick={(e) => {
                        e.stopPropagation()
                        setState({
                            type: 'loading',
                            params: { stringToCopy: address },
                        })
                    }}
                >
                    {({ color }) => <Copy size={size} color={color} />}
                </IconButton>
            )

        case 'loading':
            return (
                <IconButton variant={variant} onClick={noop}>
                    {({ color }) => <Copy size={size} color={color} />}
                </IconButton>
            )

        case 'error':
            return null

        case 'loaded':
            return (
                <>
                    <IconButton variant={variant} onClick={noop}>
                        {({ color }) => (
                            <TickSquare color={color} size={size} />
                        )}
                    </IconButton>
                    <Modal isAnimated>
                        <ToastContainer>
                            <Toast>
                                <Tick size={20} color="backgroundLight" />
                                <ToastText>
                                    <FormattedMessage
                                        id="accounts.view.copiedAddress"
                                        defaultMessage={`Copied ${format(
                                            address
                                        )}`}
                                    />
                                </ToastText>
                            </Toast>
                        </ToastContainer>
                    </Modal>
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
