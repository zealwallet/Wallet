import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
}

export const CustomSafeIcon = ({ color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 27"
            width={24}
            height={27}
            color={color && colors[color]}
            fill="none"
        >
            <Path
                fill="currentColor"
                d="M20.865 17h-2.1c-.628 0-1.137.524-1.137 1.172v3.145c0 .648-.508 1.172-1.135 1.172H8.136c-.628 0-1.136.525-1.136 1.172v2.167C7 26.476 7.508 27 8.136 27h8.84c.628 0 1.129-.524 1.129-1.172V24.09c0-.647.508-1.106 1.136-1.106h1.623c.628 0 1.136-.524 1.136-1.172v-3.653c0-.647-.508-1.158-1.135-1.158Z"
            />
            <Path
                fill="currentColor"
                d="M6.373 12.69c0-.649.509-1.174 1.137-1.174h8.354c.627 0 1.136-.525 1.136-1.173v-2.17C17 7.525 16.491 7 15.864 7H7.025c-.627 0-1.136.525-1.136 1.173v1.672c0 .648-.508 1.173-1.136 1.173H3.136c-.627 0-1.136.526-1.136 1.174v3.661C2 16.501 2.51 17 3.138 17H5.24c.628 0 1.137-.525 1.137-1.173l-.003-3.137Z"
            />
            <Path
                fill="currentColor"
                d="M11.083 15h1.834c.598 0 1.083.485 1.083 1.083v1.834c0 .598-.485 1.083-1.083 1.083h-1.834A1.083 1.083 0 0 1 10 17.917v-1.834c0-.598.485-1.083 1.083-1.083Z"
            />
        </SvgIcon>
    )
}
