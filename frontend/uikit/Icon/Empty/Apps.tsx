import React from 'react'
import { Circle, Path, Svg } from 'react-native-svg'

import { Color, colors } from '../../colors'

type Props = {
    size: number
    color?: Color
}

export const Apps = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Circle cx="12" cy="12" r="12" fill="#CBD2D9" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.405 4.5H8.94C9.9975 4.5 10.845 5.3625 10.845 6.42075V8.9775C10.845 10.0425 9.9975 10.8975 8.94 10.8975H6.405C5.355 10.8975 4.5 10.0425 4.5 8.9775V6.42075C4.5 5.3625 5.355 4.5 6.405 4.5ZM6.405 13.1016H8.94C9.9975 13.1016 10.845 13.9573 10.845 15.0223V17.5791C10.845 18.6366 9.9975 19.4991 8.94 19.4991H6.405C5.355 19.4991 4.5 18.6366 4.5 17.5791V15.0223C4.5 13.9573 5.355 13.1016 6.405 13.1016ZM17.5958 4.5H15.0608C14.0033 4.5 13.1558 5.3625 13.1558 6.42075V8.9775C13.1558 10.0425 14.0033 10.8975 15.0608 10.8975H17.5958C18.6458 10.8975 19.5008 10.0425 19.5008 8.9775V6.42075C19.5008 5.3625 18.6458 4.5 17.5958 4.5ZM15.0608 13.1016H17.5958C18.6458 13.1016 19.5008 13.9573 19.5008 15.0223V17.5791C19.5008 18.6366 18.6458 19.4991 17.5958 19.4991H15.0608C14.0033 19.4991 13.1558 18.6366 13.1558 17.5791V15.0223C13.1558 13.9573 14.0033 13.1016 15.0608 13.1016Z"
                fill="currentColor"
            />
        </Svg>
    )
}
