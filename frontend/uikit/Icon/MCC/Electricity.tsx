import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Electricity = ({ size, color }: Props) => {
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
                d="M13.6339 20L15.8255 16H11.0884C10.8112 16 10.6773 15.7946 10.7899 15.5413L14.3822 7.45868C14.495 7.20489 14.8056 7 15.0765 7H18.0956C18.371 7 18.4972 7.20929 18.3875 7.46746L15.8255 13.5H20.5816C20.86 13.5 20.9794 13.7 20.8478 13.9467L17.6194 20H20.0887C20.3698 20 20.404 20.13 20.1794 20.2904L13.9926 24.7096C13.7733 24.8663 13.4867 24.8013 13.3642 24.5563L11.3079 20.4437C11.1871 20.2022 11.3087 20 11.5834 20H13.6339Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
