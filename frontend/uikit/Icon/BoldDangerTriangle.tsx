import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const BoldDangerTriangle = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            width={size}
            color={color && colors[color]}
            height={size}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.4773 4.44209L21.746 17.0572C21.906 17.4338 21.976 17.7399 21.996 18.058C22.036 18.8012 21.776 19.5236 21.2661 20.0795C20.7562 20.6334 20.0663 20.9604 19.3164 21H4.6789C4.36896 20.9812 4.05901 20.9108 3.76906 20.8018C2.3193 20.2172 1.61942 18.5723 2.20932 17.1464L9.52809 4.43317C9.77804 3.98628 10.158 3.60082 10.6279 3.35309C11.9877 2.59902 13.7174 3.09447 14.4773 4.44209ZM12.8669 12.7552C12.8669 13.2308 12.477 13.6282 11.997 13.6282C11.5171 13.6282 11.1172 13.2308 11.1172 12.7552V9.95193C11.1172 9.4753 11.5171 9.08984 11.997 9.08984C12.477 9.08984 12.8669 9.4753 12.8669 9.95193V12.7552ZM11.997 17.0184C11.5171 17.0184 11.1172 16.6211 11.1172 16.1464C11.1172 15.6698 11.5171 15.2734 11.997 15.2734C12.477 15.2734 12.8669 15.6609 12.8669 16.1355C12.8669 16.6211 12.477 17.0184 11.997 17.0184Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
