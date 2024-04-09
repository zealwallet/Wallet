import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'

type Props = {
    color?: Color
    size: number
}

export const OutlineWallet = ({ color, size }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 24 24"
        fill="none"
        color={color && colors[color]}
        width={size}
        height={size}
    >
        <Path
            id="Stroke 1"
            d="M21.6389 14.3943H17.5906C16.1042 14.3934 14.8993 13.1894 14.8984 11.703C14.8984 10.2165 16.1042 9.01263 17.5906 9.01172H21.6389"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            id="Stroke 3"
            d="M18.049 11.6432H17.7373"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            id="Stroke 5"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.74766 3H16.3911C19.2892 3 21.6388 5.34951 21.6388 8.24766V15.4247C21.6388 18.3229 19.2892 20.6724 16.3911 20.6724H7.74766C4.84951 20.6724 2.5 18.3229 2.5 15.4247V8.24766C2.5 5.34951 4.84951 3 7.74766 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            id="Stroke 7"
            d="M7.03516 7.53772H12.4341"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)
