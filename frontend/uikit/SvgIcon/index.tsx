import React from 'react'
import type { ColorValue } from 'react-native'
import { Svg } from 'react-native-svg'
import type { NumberProp } from 'react-native-svg/src/lib/extract/types'

import { colors } from '@zeal/uikit/colors'
import { useTextStyleInheritContext } from '@zeal/uikit/Text'

type Props = {
    children: React.ReactNode
    id?: string
    viewBox?: string
    width?: NumberProp
    height?: NumberProp
    color?: ColorValue
    fill?: string
    'aria-label'?: string
}

export const SvgIcon = ({
    children,
    viewBox,
    width,
    height,
    color,
    fill,
    'aria-label': ariaLabel,
}: Props) => {
    const textStylesContext = useTextStyleInheritContext()
    const selectedColour = color || colors[textStylesContext.color]
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox={viewBox}
            width={width}
            height={height}
            color={selectedColour}
            fill={fill}
            aria-label={ariaLabel}
        >
            {children}
        </Svg>
    )
}
