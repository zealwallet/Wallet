import React from 'react'

import { Copy } from '@zeal/uikit/Icon/Copy'
import { TickSquare } from '@zeal/uikit/Icon/TickSquare'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'

import { Card } from '@zeal/domains/Card'

type Props = {
    card: Card
}

export const CopyDetailsButton = ({ card }: Props) => {
    const [state, setState] = useCopyTextToClipboard()
    const pan = card.details?.pan

    if (!pan) {
        return null
    }

    switch (state.type) {
        case 'not_asked':
            return (
                <Tertiary
                    color="on_dark"
                    size="regular"
                    onClick={(e) => {
                        e.stopPropagation()
                        setState({
                            type: 'loading',
                            params: { stringToCopy: pan },
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
                                {pan.replace(/(.{4})/g, '$1 ').trim()}
                            </Text>
                            <Copy size={14} color={color} />
                        </>
                    )}
                </Tertiary>
            )
        case 'loading':
            return (
                <Tertiary color="on_dark" size="regular" onClick={noop}>
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                {pan}
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
                <Tertiary color="on_dark" size="regular" onClick={noop}>
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                {pan}
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
