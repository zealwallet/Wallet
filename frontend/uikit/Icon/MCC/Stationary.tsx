import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Stationary = ({ size, color }: Props) => {
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
                d="M8.5 7C8.22386 7 8 7.22386 8 7.5V24.5C8 24.7761 8.22386 25 8.5 25H13.5C13.7761 25 14 24.7761 14 24.5V23H12.5C12.2239 23 12 22.7761 12 22.5V21.5C12 21.2239 12.2239 21 12.5 21H14V19H11.5C11.2239 19 11 18.7761 11 18.5V17.5C11 17.2239 11.2239 17 11.5 17H14V15H12.5C12.2239 15 12 14.7761 12 14.5V13.5C12 13.2239 12.2239 13 12.5 13H14V11H11.5C11.2239 11 11 10.7761 11 10.5V9.5C11 9.22386 11.2239 9 11.5 9H14V7.5C14 7.22386 13.7761 7 13.5 7H8.5ZM18.5 13C18.2239 13 18 13.2239 18 13.5V21H24V13.5C24 13.2239 23.7761 13 23.5 13H18.5ZM20.5573 7.58022C20.7446 7.22337 21.2554 7.22337 21.4427 7.58022L23.1156 10.7676C23.2904 11.1006 23.0489 11.5 22.6729 11.5H19.3271C18.9511 11.5 18.7096 11.1006 18.8844 10.7676L20.5573 7.58022ZM24 22.5H18V23C18 24.1046 18.8954 25 20 25H22C23.1046 25 24 24.1046 24 23V22.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
