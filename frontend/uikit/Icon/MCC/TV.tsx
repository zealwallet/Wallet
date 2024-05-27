import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const TV = ({ size, color }: Props) => {
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
                d="M7 8.5C7 8.22386 7.22386 8 7.5 8H24.5C24.7761 8 25 8.22386 25 8.5V20.5C25 20.7761 24.7761 21 24.5 21H7.5C7.22386 21 7 20.7761 7 20.5V8.5ZM11 23C11 22.7239 11.2239 22.5 11.5 22.5H20.5C20.7761 22.5 21 22.7239 21 23V23.5C21 23.7761 20.7761 24 20.5 24H11.5C11.2239 24 11 23.7761 11 23.5V23ZM13.5615 11.3152C13.5615 10.9106 14.0168 10.6736 14.3482 10.9055L18.898 14.0904C19.1824 14.2895 19.1824 14.7106 18.898 14.9097L14.3482 18.0946C14.0168 18.3265 13.5615 18.0894 13.5615 17.6849V11.3152Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
