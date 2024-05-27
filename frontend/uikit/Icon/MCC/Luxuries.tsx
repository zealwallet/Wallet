import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Luxuries = ({ size, color }: Props) => {
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
                d="M12 9L14.2266 11.2266C11.2193 12.0118 9 14.7467 9 18C9 21.866 12.134 25 16 25C19.866 25 23 21.866 23 18C23 14.7467 20.7807 12.0118 17.7734 11.2266L20 9L18 7H14L12 9ZM21 18C21 20.7614 18.7614 23 16 23C13.2386 23 11 20.7614 11 18C11 15.2386 13.2386 13 16 13C18.7614 13 21 15.2386 21 18Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
