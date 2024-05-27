import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Construction = ({ size, color }: Props) => {
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
                d="M8 7.5C8 7.22386 8.22386 7 8.5 7H20.5C20.7761 7 21 7.22386 21 7.5V9.25L22.4974 9.24975C23.4645 9.24958 24.25 10.0325 24.25 10.9984V13.5012C24.25 14.42 23.5503 15.252 22.643 15.4032L15.6036 16.5764C15.4242 16.6063 15.25 16.8132 15.25 17.0024V18H15.5C15.7761 18 16 18.2239 16 18.5V24.5C16 24.7761 15.7761 25 15.5 25H13.5C13.2239 25 13 24.7761 13 24.5V18.5C13 18.2239 13.2239 18 13.5 18H13.75V17.0024C13.75 16.0819 14.4523 15.2476 15.357 15.0968L22.3964 13.9236C22.5782 13.8933 22.75 13.689 22.75 13.5012V10.9984C22.75 10.8621 22.6373 10.7497 22.4977 10.7497L21.0001 10.75L21 10V12.5C21 12.7761 20.7761 13 20.5 13H8.5C8.22386 13 8 12.7761 8 12.5V7.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
