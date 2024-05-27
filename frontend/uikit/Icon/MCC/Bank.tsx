import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Bank = ({ size, color }: Props) => {
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
                d="M8.5 12C8.22386 12 8 11.7762 8 11.5V10.827C8 10.6284 8.1176 10.4486 8.29959 10.3689L15.7996 7.0877C15.9274 7.0318 16.0726 7.0318 16.2004 7.0877L23.7004 10.3689C23.8824 10.4486 24 10.6284 24 10.827V11.5C24 11.7762 23.7761 12 23.5 12H8.5ZM10 14C10 13.7239 10.2239 13.5 10.5 13.5H11.5C11.7761 13.5 12 13.7239 12 14V20.5C12 20.7762 11.7761 21 11.5 21H10.5C10.2239 21 10 20.7762 10 20.5V14ZM8 23C8 22.7239 8.22386 22.5 8.5 22.5H23.5C23.7761 22.5 24 22.7239 24 23V24.5C24 24.7762 23.7761 25 23.5 25H8.5C8.22386 25 8 24.7762 8 24.5V23ZM15.5 13.5C15.2239 13.5 15 13.7239 15 14V20.5C15 20.7762 15.2239 21 15.5 21H16.5C16.7761 21 17 20.7762 17 20.5V14C17 13.7239 16.7761 13.5 16.5 13.5H15.5ZM20 14C20 13.7239 20.2239 13.5 20.5 13.5H21.5C21.7761 13.5 22 13.7239 22 14V20.5C22 20.7762 21.7761 21 21.5 21H20.5C20.2239 21 20 20.7762 20 20.5V14Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
