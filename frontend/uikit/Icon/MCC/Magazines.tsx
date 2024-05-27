import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Magazines = ({ size, color }: Props) => {
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
                d="M7 9V21C13.0292 21 15.6517 23.5811 16 23.9551V24C16 24 16.0066 23.992 16.0201 23.9769C16.0338 23.992 16.0405 24 16.0405 24V23.9544C16.3863 23.5782 18.9772 21 25.0405 21V9C18.8369 9 16.2683 11.6989 16.0201 11.9769C15.7683 11.6989 13.1652 9 7 9ZM14 12.5C14 12.5 12 11 9 11V15.5C11.5 15.5 14 17 14 17V12.5ZM9 17C12 17 14 18.5 14 18.5V20C14 20 11.5 18.5 9 18.5V17ZM18 12.5C18 12.5 20 11 23 11V12.5C20.5 12.5 18 14 18 14V12.5ZM23 14C20 14 18 15.5 18 15.5V17C18 17 20.5 15.5 23 15.5V14ZM18 18.5C18 18.5 20 17 23 17V18.5C20.5 18.5 18 20 18 20V18.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
