import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Cosmetics = ({ size, color }: Props) => {
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
                d="M17.5013 7.03099C17.776 7.00279 18 7.22389 18 7.50003V9.50003C18 9.77617 17.7761 10 17.5 10H14.5C14.2239 10 14.0095 9.77423 14.0841 9.50835C14.1919 9.12385 14.4381 8.56194 15 8.00003C15.686 7.31404 16.8426 7.09864 17.5013 7.03099ZM13.5 11.2C13.2239 11.2 13 11.4238 13 11.7V19H12.5C12.2239 19 12 19.2239 12 19.5V24.5C12 24.7762 12.2239 25 12.5 25H19.5C19.7761 25 20 24.7762 20 24.5V19.5C20 19.2239 19.7761 19 19.5 19H19V11.7C19 11.4238 18.7761 11.2 18.5 11.2H13.5ZM14.5 13C14.2239 13 14 13.2239 14 13.5V16.5C14 16.7762 14.2239 17 14.5 17H15C15.2761 17 15.5 16.7762 15.5 16.5V13.5C15.5 13.2239 15.2761 13 15 13H14.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
