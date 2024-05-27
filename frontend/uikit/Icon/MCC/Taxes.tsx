import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Taxes = ({ size, color }: Props) => {
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
                d="M11.5 15C9.567 15 8 13.433 8 11.5C8 9.567 9.567 8 11.5 8C13.433 8 15 9.567 15 11.5C15 13.433 13.433 15 11.5 15ZM21.2929 9.29289L9.29289 21.2929C8.90237 21.6834 8.90237 22.3166 9.29289 22.7071C9.68342 23.0976 10.3166 23.0976 10.7071 22.7071L22.7071 10.7071C23.0976 10.3166 23.0976 9.68342 22.7071 9.29289C22.3166 8.90237 21.6834 8.90237 21.2929 9.29289ZM20.5 24C18.567 24 17 22.433 17 20.5C17 18.567 18.567 17 20.5 17C22.433 17 24 18.567 24 20.5C24 22.433 22.433 24 20.5 24ZM22 20.5C22 21.3284 21.3284 22 20.5 22C19.6716 22 19 21.3284 19 20.5C19 19.6716 19.6716 19 20.5 19C21.3284 19 22 19.6716 22 20.5ZM13 11.5C13 12.3284 12.3284 13 11.5 13C10.6716 13 10 12.3284 10 11.5C10 10.6716 10.6716 10 11.5 10C12.3284 10 13 10.6716 13 11.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
