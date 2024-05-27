import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Cinema = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 32 32"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 9C7 8.44772 7.44772 8 8 8H9L11 11H14L12 8H14L16 11H19L17 8H19L21 11H24L22 8H25V23C25 23.5523 24.5523 24 24 24H8C7.44772 24 7 23.5523 7 23V9ZM15.0397 20.4428C14.3741 20.8695 13.5 20.3916 13.5 19.601V14.8995C13.5 14.1095 14.373 13.6315 15.0386 14.057L18.7105 16.4044C19.3252 16.7974 19.3258 17.6951 18.7116 18.0888L15.0397 20.4428Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
