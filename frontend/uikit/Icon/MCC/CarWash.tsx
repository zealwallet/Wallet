import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const CarWash = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.5 9C14.5 8.44772 14.9477 8 15.5 8H16.5C17.0523 8 17.5 8.44772 17.5 9V11.5L20.5044 13.8111C21.6396 14.6843 21.0221 16.5 19.5898 16.5H12.4102C10.9779 16.5 10.3604 14.6843 11.4956 13.8111L14.5 11.5V9ZM21.5 24C22.6046 24 23.5 22.7688 23.5 21.25C23.5 19.7312 22.6046 18.5 21.5 18.5C20.3954 18.5 19.5 19.7312 19.5 21.25C19.5 22.7688 20.3954 24 21.5 24ZM18 21.25C18 22.7688 17.1046 24 16 24C14.8954 24 14 22.7688 14 21.25C14 19.7312 14.8954 18.5 16 18.5C17.1046 18.5 18 19.7312 18 21.25ZM10.5 24C11.6046 24 12.5 22.7688 12.5 21.25C12.5 19.7312 11.6046 18.5 10.5 18.5C9.39543 18.5 8.5 19.7312 8.5 21.25C8.5 22.7688 9.39543 24 10.5 24Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
