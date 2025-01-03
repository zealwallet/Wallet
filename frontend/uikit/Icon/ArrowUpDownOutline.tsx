import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ArrowUpDownOutline = ({ size, color }: Props) => (
    <SvgIcon
        color={color && colors[color]}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        width={size}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.4425 10.6823C14.833 11.0728 15.4662 11.0728 15.8567 10.6823C16.2473 10.2918 16.2473 9.65862 15.8567 9.2681L12.707 6.11833C12.5194 5.9308 12.2651 5.82544 11.9999 5.82544C11.7346 5.82544 11.4803 5.9308 11.2928 6.11833L8.14299 9.2681C7.75247 9.65862 7.75247 10.2918 8.14299 10.6823C8.53352 11.0728 9.16668 11.0728 9.5572 10.6823L11.9999 8.23965L14.4425 10.6823ZM9.55723 13.3177C9.16671 12.9272 8.53354 12.9272 8.14302 13.3177C7.7525 13.7082 7.7525 14.3414 8.14302 14.7319L11.2928 17.8817C11.4803 18.0692 11.7347 18.1746 11.9999 18.1746C12.2651 18.1746 12.5195 18.0692 12.707 17.8817L15.8568 14.7319C16.2473 14.3414 16.2473 13.7082 15.8568 13.3177C15.4662 12.9272 14.8331 12.9272 14.4425 13.3177L11.9999 15.7603L9.55723 13.3177Z"
            fill="currentColor"
        />
    </SvgIcon>
)
