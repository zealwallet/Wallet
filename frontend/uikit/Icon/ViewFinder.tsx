import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const ViewFinder = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 284 284"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M282 72V34C282 16.3269 267.673 2 250 2H212M282 212V250C282 267.673 267.673 282 250 282H212M72 282H34C16.3269 282 2 267.673 2 250V212M2 72V34C2 16.3269 16.3269 2 34 2H72"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
        />
    </SvgIcon>
)
