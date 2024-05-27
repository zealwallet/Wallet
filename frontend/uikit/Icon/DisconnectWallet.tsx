import React from 'react'
import { G, Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const DisconnectWallet = ({ color, size }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            fill="none"
            color={color && colors[color]}
            width={size}
            height={size}
        >
            <G id="icon/Disconnect">
                <Path
                    id="Vector"
                    d="M18.156 12.225L19.704 10.686H19.686C20.5146 9.82744 20.9686 8.67516 20.9483 7.48216C20.9281 6.28916 20.4352 5.15295 19.578 4.323C18.7383 3.51317 17.6171 3.06065 16.4505 3.06065C15.2839 3.06065 14.1627 3.51317 13.323 4.323L11.775 5.862M5.853 11.775L4.314 13.314C3.48543 14.1726 3.03143 15.3248 3.05168 16.5178C3.07193 17.7108 3.56477 18.847 4.422 19.677C5.26175 20.4868 6.38288 20.9393 7.5495 20.9393C8.71612 20.9393 9.83725 20.4868 10.677 19.677L12.216 18.138M8.4 3V5.7M3 8.4H5.7M15.6 18.3V21M18.3 15.6H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </G>
        </SvgIcon>
    )
}
