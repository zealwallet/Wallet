import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Withdraw = ({ size, color }: Props) => {
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
                d="M7.5 10C7.22386 10 7 10.2239 7 10.5V21.5C7 21.7761 7.22386 22 7.5 22H24.5C24.7761 22 25 21.7761 25 21.5V10.5C25 10.2239 24.7761 10 24.5 10H7.5ZM14.5 11.5C14.2239 11.5 14 11.7239 14 12V15H13.5C13.2239 15 13 15.2239 13 15.5V16C13 16.2761 13.2239 16.5 13.5 16.5H14V17.5H13.5C13.2239 17.5 13 17.7239 13 18V18.5C13 18.7761 13.2239 19 13.5 19H14V20C14 20.2761 14.2239 20.5 14.5 20.5H15C15.2761 20.5 15.5 20.2761 15.5 20V19H18C18.2761 19 18.5 18.7761 18.5 18.5V18C18.5 17.7239 18.2761 17.5 18 17.5H15.5V16V15.5V15V14V13V11.5H14.5ZM15.6664 13H17C17.5523 13 18 13.4477 18 14C18 14.5523 17.5523 15 17 15H15.6664C15.975 15.883 16.6799 16.5 17.5 16.5C18.6046 16.5 19.5 15.3807 19.5 14C19.5 12.6193 18.6046 11.5 17.5 11.5C16.6799 11.5 15.975 12.117 15.6664 13ZM21 12C21 11.7239 21.2239 11.5 21.5 11.5H23C23.2761 11.5 23.5 11.7239 23.5 12V12.5C23.5 12.7761 23.2761 13 23 13H21.5C21.2239 13 21 12.7761 21 12.5V12ZM9 19C8.72386 19 8.5 19.2239 8.5 19.5V20C8.5 20.2761 8.72386 20.5 9 20.5H10.5C10.7761 20.5 11 20.2761 11 20V19.5C11 19.2239 10.7761 19 10.5 19H9Z"
                fill="currentColors"
            />
        </SvgIcon>
    )
}
