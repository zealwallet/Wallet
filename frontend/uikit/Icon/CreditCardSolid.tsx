import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const CreditCardSolid = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 29 29"
            fill="none"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.8821 5.94403L14.5007 5.75L6.11924 5.94403C4.42553 5.97844 2.98966 7.19939 2.68343 8.86554C1.99875 12.5908 1.99875 16.4097 2.68343 20.1349C2.98966 21.8011 4.42553 23.022 6.11924 23.0565L14.5007 23.2505L22.8821 23.0565C24.5758 23.022 26.0117 21.8011 26.3179 20.1349C27.0026 16.4097 27.0026 12.5908 26.3179 8.86554C26.0117 7.19939 24.5758 5.97844 22.8821 5.94403ZM25.0007 13.3335C25.0007 13.9779 24.4783 14.5002 23.834 14.5002H5.16734C4.52301 14.5002 4.00067 13.9779 4.00067 13.3335C4.00067 12.6892 4.52301 12.1669 5.16734 12.1669H23.834C24.4783 12.1669 25.0007 12.6892 25.0007 13.3335Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
