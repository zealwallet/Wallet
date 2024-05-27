import React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const CustomGoogleDrive = ({ size, color }: Props) => (
    <SvgIcon
        color={color && colors[color]}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        width={size}
    >
        <G clipPath="url(#clip0_3282_53759)">
            <Path
                d="M4.00024 22.793L7.99994 15.8633H24L19.9999 22.793H4.00024Z"
                fill="#3777E3"
            />
            <Path
                d="M16.0003 15.8633H24.0001L16.0003 2.00391H8L16.0003 15.8633Z"
                fill="#FFCF63"
            />
            <Path
                d="M0 15.8633L4.00025 22.7929L12 8.93359L7.99994 2.00391L0 15.8633Z"
                fill="#11A861"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_3282_53759">
                <Rect
                    width="24"
                    height="20.7936"
                    fill="white"
                    transform="translate(0 2)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
