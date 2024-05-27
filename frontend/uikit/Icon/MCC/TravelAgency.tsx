import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const TravelAgency = ({ size, color }: Props) => {
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
                d="M13 10C13 8.89543 13.8954 8 15 8H17C18.1046 8 19 8.89543 19 10V11H24C24.5523 11 25 11.4477 25 12V23C25 23.5523 24.5523 24 24 24H8C7.44772 24 7 23.5523 7 23V12C7 11.4477 7.44772 11 8 11H13V10ZM16 9.5C15.1716 9.5 14.5 10.1716 14.5 11H17.5C17.5 10.1716 16.8284 9.5 16 9.5ZM17.171 20.022C17.0766 19.7625 17.2104 19.4756 17.4698 19.3811L22.1683 17.671C22.4278 17.5766 22.7147 17.7104 22.8092 17.9698L23.1512 18.9095C23.2456 19.169 23.1118 19.4559 22.8523 19.5504L18.1539 21.2605C17.8944 21.3549 17.6075 21.2211 17.513 20.9617L17.171 20.022ZM17.75 17C18.7165 17 19.5 16.2165 19.5 15.25C19.5 14.2835 18.7165 13.5 17.75 13.5C16.7835 13.5 16 14.2835 16 15.25C16 16.2165 16.7835 17 17.75 17Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
