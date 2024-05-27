import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Forward = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            viewBox="0 0 24 24"
            fill="none"
            width={size}
            height={size}
        >
            <Path
                d="M2.55394 16.0592C2.4578 16.2491 2.49237 16.479 2.6401 16.6322C2.78782 16.7854 3.01632 16.8283 3.20954 16.7391L5.70888 15.5856C7.80948 14.6161 10.1018 14.1725 12.3902 14.2769C12.4174 15.0117 12.4577 15.7462 12.5112 16.48L12.5797 17.419C12.6212 17.9886 13.2564 18.307 13.7376 17.9995C15.8266 16.6647 17.6427 14.9447 19.089 12.9313L19.5492 12.2907C19.6744 12.1164 19.6744 11.8816 19.5492 11.7073L19.089 11.0667C17.6427 9.05327 15.8266 7.33332 13.7376 5.9985C13.2564 5.69097 12.6212 6.0094 12.5797 6.57905L12.5112 7.51801C12.4653 8.14787 12.4291 8.77825 12.4025 9.40894H11.7595C8.17848 9.40894 4.90176 11.4226 3.28406 14.6173L2.55394 16.0592Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
