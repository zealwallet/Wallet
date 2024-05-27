import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Appliances = ({ size, color }: Props) => {
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
                d="M14.25 13.8954V15.75C14.25 16.1642 13.9142 16.5 13.5 16.5C13.0858 16.5 12.75 16.1642 12.75 15.75V13.8954C12.017 14.1921 11.5 14.9107 11.5 15.75C11.5 16.8546 12.3954 17.75 13.5 17.75C14.6046 17.75 15.5 16.8546 15.5 15.75C15.5 14.9107 14.983 14.1921 14.25 13.8954ZM14.25 12.0622C16.3783 12.4193 18 14.2703 18 16.5V22.5V23.5V24.5C18 24.7761 17.7761 25 17.5 25H16.5C16.2239 25 16 24.7761 16 24.5V24H11V24.5C11 24.7761 10.7761 25 10.5 25H9.5C9.22386 25 9 24.7761 9 24.5V23.5V22.5V16.5C9 14.2703 10.6217 12.4193 12.75 12.0622V11C12.75 8.74733 14.8631 6.25 17.5 6.25C20.1369 6.25 22.25 8.74733 22.25 11V24H23.5C23.7761 24 24 24.2239 24 24.5V25.5C24 25.7761 23.7761 26 23.5 26H19.5C19.2239 26 19 25.7761 19 25.5V24.5C19 24.2239 19.2239 24 19.5 24H20.75V11C20.75 9.5254 19.2477 7.75 17.5 7.75C15.7523 7.75 14.25 9.5254 14.25 11V12.0622Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
