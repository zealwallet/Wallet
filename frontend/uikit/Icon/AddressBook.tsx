import React from 'react'
import { Circle, Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}
export const AddressBook = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 28 28"
            fill="none"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Circle
                cx="14"
                cy="14.458"
                r="13.5"
                fill="white"
                stroke="currentColor"
            />
            <Path
                d="M14 8.27051C12.4467 8.27051 11.1875 9.52971 11.1875 11.083C11.1875 12.6363 12.4467 13.8955 14 13.8955C15.5533 13.8955 16.8125 12.6363 16.8125 11.083C16.8125 9.52971 15.5533 8.27051 14 8.27051Z"
                fill="currentColor"
            />
            <Path
                d="M11 15.3955C9.4467 15.3955 8.1875 16.6547 8.1875 18.208V19.0992C8.1875 19.6641 8.59691 20.1458 9.15445 20.2368C12.3636 20.7608 15.6364 20.7608 18.8455 20.2368C19.4031 20.1458 19.8125 19.6641 19.8125 19.0992V18.208C19.8125 16.6547 18.5533 15.3955 17 15.3955H16.7443C16.606 15.3955 16.4685 15.4174 16.3369 15.4603L15.6878 15.6723C14.5911 16.0304 13.4089 16.0304 12.3122 15.6723L11.6631 15.4603C11.5315 15.4174 11.394 15.3955 11.2557 15.3955H11Z"
                fill="currentColor"
            />
        </Svg>
    )
}
