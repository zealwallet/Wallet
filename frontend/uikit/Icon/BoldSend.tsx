import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const BoldSend = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 24 24"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M21.4354 2.58198C20.9352 2.0686 20.1949 1.87734 19.5046 2.07866L3.408 6.75952C2.6797 6.96186 2.16349 7.54269 2.02443 8.28055C1.88237 9.0315 2.37858 9.98479 3.02684 10.3834L8.0599 13.4768C8.57611 13.7939 9.24239 13.7144 9.66956 13.2835L15.4329 7.4843C15.723 7.18231 16.2032 7.18231 16.4934 7.4843C16.7835 7.77623 16.7835 8.24935 16.4934 8.55134L10.72 14.3516C10.2918 14.7814 10.2118 15.4508 10.5269 15.9702L13.6022 21.0538C13.9623 21.6577 14.5826 22 15.2628 22C15.3429 22 15.4329 22 15.513 21.9899C16.2933 21.8893 16.9135 21.3558 17.1436 20.6008L21.9156 4.52479C22.1257 3.84028 21.9356 3.09537 21.4354 2.58198"
            fill="currentColor"
        />
    </SvgIcon>
)
