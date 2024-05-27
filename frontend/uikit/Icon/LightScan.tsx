import React from 'react'
import { G, Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const LightScan = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 24 24"
        width={size}
        height={size}
        color={color && colors[color]}
        fill="none"
    >
        <G
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
        >
            <Path d="M22.5 12.809h-21M20.63 8.597V7.084a3.732 3.732 0 0 0-3.734-3.732h-1.205M3.37 8.597V7.084a3.732 3.732 0 0 1 3.732-3.732h1.236M20.63 12.805v4.074a3.733 3.733 0 0 1-3.734 3.733h-1.205M3.37 12.805v4.074a3.733 3.733 0 0 0 3.732 3.733h1.236" />
        </G>
    </SvgIcon>
)
