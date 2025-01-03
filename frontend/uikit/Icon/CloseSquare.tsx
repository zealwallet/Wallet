import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const CloseSquare = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 48 48"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.34 4H32.68C39.46 4 44 8.76 44 15.84V32.182C44 39.242 39.46 44 32.68 44H15.34C8.56 44 4 39.242 4 32.182V15.84C4 8.76 8.56 4 15.34 4ZM30.0192 29.9992C30.6992 29.3212 30.6992 28.2212 30.0192 27.5412L26.4592 23.9812L30.0192 20.4192C30.6992 19.7412 30.6992 18.6212 30.0192 17.9412C29.3392 17.2592 28.2392 17.2592 27.5392 17.9412L23.9992 21.4992L20.4392 17.9412C19.7392 17.2592 18.6392 17.2592 17.9592 17.9412C17.2792 18.6212 17.2792 19.7412 17.9592 20.4192L21.5192 23.9812L17.9592 27.5212C17.2792 28.2212 17.2792 29.3212 17.9592 29.9992C18.2992 30.3392 18.7592 30.5212 19.1992 30.5212C19.6592 30.5212 20.0992 30.3392 20.4392 29.9992L23.9992 26.4612L27.5592 29.9992C27.8992 30.3612 28.3392 30.5212 28.7792 30.5212C29.2392 30.5212 29.6792 30.3392 30.0192 29.9992Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
