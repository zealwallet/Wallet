import React, { ComponentPropsWithoutRef, useEffect } from 'react'

import { Copy } from '@zeal/uikit/Icon/Copy'
import { TickSquare } from '@zeal/uikit/Icon/TickSquare'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'

import { Address } from '@zeal/domains/Address'
import { format } from '@zeal/domains/Address/helpers/format'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    size: ComponentPropsWithoutRef<typeof Tertiary>['size']
    color: 'on_dark' | 'on_light'
    address: Address
}

export const CopyAddress = ({
    size,
    address,
    installationId,
    color,
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
                <Tertiary
                    color={color}
                    size={size}
                    onClick={(e) => {
                        e.stopPropagation()
                        setState({
                            type: 'loading',
                            params: { stringToCopy: address },
                        })
                    }}
                >
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                {format(address)}
                            </Text>
                            <Copy size={14} color={color} />
                        </>
                    )}
                </Tertiary>
            )
        case 'loading':
            return (
                <Tertiary color={color} size={size} onClick={noop}>
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                {format(address)}
                            </Text>
                            <Copy size={14} color={color} />
                        </>
                    )}
                </Tertiary>
            )
        case 'error':
            return null

        case 'loaded':
            return (
                <Tertiary color={color} size={size}>
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                {format(address)}
                            </Text>
                            <TickSquare color="iconAccent1" size={14} />
                        </>
                    )}
                </Tertiary>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
