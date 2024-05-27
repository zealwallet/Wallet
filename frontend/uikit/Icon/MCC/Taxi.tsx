import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Taxi = ({ size, color }: Props) => {
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
                d="M7 12.25C7 11.9739 7.22386 11.75 7.5 11.75H10.5C10.7761 11.75 11 11.9739 11 12.25V15.25C11 15.5261 10.7761 15.75 10.5 15.75H7.5C7.22386 15.75 7 15.5261 7 15.25V12.25ZM14 12.25C14 11.9739 14.2239 11.75 14.5 11.75H17.5C17.7761 11.75 18 11.9739 18 12.25V15.25C18 15.5261 17.7761 15.75 17.5 15.75H14.5C14.2239 15.75 14 15.5261 14 15.25V12.25ZM11 17.25C10.7239 17.25 10.5 17.4739 10.5 17.75V20.75C10.5 21.0261 10.7239 21.25 11 21.25H14C14.2761 21.25 14.5 21.0261 14.5 20.75V17.75C14.5 17.4739 14.2761 17.25 14 17.25H11ZM17.5 17.75C17.5 17.4739 17.7239 17.25 18 17.25H21C21.2761 17.25 21.5 17.4739 21.5 17.75V20.75C21.5 21.0261 21.2761 21.25 21 21.25H18C17.7239 21.25 17.5 21.0261 17.5 20.75V17.75ZM21.5 11.75C21.2239 11.75 21 11.9739 21 12.25V15.25C21 15.5261 21.2239 15.75 21.5 15.75H24.5C24.7761 15.75 25 15.5261 25 15.25V12.25C25 11.9739 24.7761 11.75 24.5 11.75H21.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
