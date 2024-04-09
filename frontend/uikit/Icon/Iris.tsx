import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Iris = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fill="currentColor"
                fillRule="evenodd"
                d="M3.055 3.055A2.75 2.75 0 0 1 5 2.25h2a.75.75 0 0 1 0 1.5H5A1.25 1.25 0 0 0 3.75 5v2a.75.75 0 0 1-1.5 0V5c0-.73.29-1.429.805-1.945ZM16.25 3a.75.75 0 0 1 .75-.75h2A2.75 2.75 0 0 1 21.75 5v2a.75.75 0 0 1-1.5 0V5A1.25 1.25 0 0 0 19 3.75h-2a.75.75 0 0 1-.75-.75ZM3 16.25a.75.75 0 0 1 .75.75v2A1.25 1.25 0 0 0 5 20.25h2a.75.75 0 0 1 0 1.5H5A2.75 2.75 0 0 1 2.25 19v-2a.75.75 0 0 1 .75-.75Zm18 0a.75.75 0 0 1 .75.75v2A2.75 2.75 0 0 1 19 21.75h-2a.75.75 0 0 1 0-1.5h2A1.25 1.25 0 0 0 20.25 19v-2a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
            />
            <Path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M14.499 12.053a2.5 2.5 0 1 1-4.999-.001 2.5 2.5 0 0 1 4.999 0Z"
                clipRule="evenodd"
            />
            <Path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M11.998 17.825c3.01 0 5.764-2.165 7.315-5.773-1.55-3.608-4.304-5.772-7.315-5.772h.004c-3.01 0-5.764 2.164-7.315 5.772 1.55 3.608 4.304 5.773 7.315 5.773h-.004Z"
                clipRule="evenodd"
            />
        </Svg>
    )
}
