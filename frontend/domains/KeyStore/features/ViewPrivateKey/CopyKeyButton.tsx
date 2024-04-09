import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Copy } from '@zeal/uikit/Icon/Copy'
import { TickSquare } from '@zeal/uikit/Icon/TickSquare'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'

import { captureError } from '@zeal/domains/Error/helpers/captureError'

type Props = {
    pk: string
}

export const CopyKeyButton = ({ pk }: Props) => {
    const [state, setState] = useCopyTextToClipboard()

    useEffect(() => {
        switch (state.type) {
            case 'loaded':
            case 'not_asked':
            case 'loading':
                break

            case 'error':
                captureError(state.error)
                break

            /* istanbul ignore next */
            default:
                notReachable(state)
        }
    }, [state])

    switch (state.type) {
        case 'not_asked':
            return (
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() => {
                        setState({
                            type: 'loading',
                            params: { stringToCopy: pk },
                        })
                    }}
                >
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Copy size={14} color={color} />
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="CopyKeyButton.copyYourKey"
                                    defaultMessage="Copy your key"
                                />
                            </Text>
                        </>
                    )}
                </Tertiary>
            )
        case 'loading':
            return (
                <Tertiary color="on_light" size="small" onClick={noop}>
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Copy size={14} color={color} />
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="CopyKeyButton.copyYourKey"
                                    defaultMessage="Copy your key"
                                />
                            </Text>
                        </>
                    )}
                </Tertiary>
            )
        case 'error':
            return null

        case 'loaded':
            return (
                <Tertiary color="on_light" size="small">
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <TickSquare color="iconAccent1" size={14} />
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="CopyKeyButton.copied"
                                    defaultMessage="Copied"
                                />
                            </Text>
                        </>
                    )}
                </Tertiary>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
