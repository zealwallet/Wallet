import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Dentist = ({ size, color }: Props) => {
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
                d="M17.5123 7.46167C18.1117 7.16607 18.7865 7 19.5 7C21.9853 7 24 9.01472 24 11.5C24 14 22.4 15.8136 21.5 18C20.6 20.1864 20.5 24 19 24C17.5 24 17.5 18 16 17.5V15.75V17.5C14.5 18 14.5 24 13 24C11.5 24 11.4 20.1864 10.5 18C9.6 15.8136 8 14 8 11.5C8 9.01472 10.0147 7 12.5 7C13.6129 7 14.6315 7.40401 15.417 8.07337C15.9915 8.6453 16.3754 9.33497 16.5136 10.1644C16.6044 10.7092 17.1196 11.0772 17.6644 10.9864C18.2092 10.8956 18.5772 10.3804 18.4864 9.8356C18.3368 8.93826 17.9987 8.14796 17.5123 7.46167Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
