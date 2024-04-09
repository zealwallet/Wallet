import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ShieldDone = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            color={color && colors[color]}
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7281 21.9137C11.8388 21.9715 11.9627 22.0009 12.0865 22C12.2103 21.999 12.3331 21.9686 12.4449 21.9097L16.0128 20.0025C17.0245 19.4631 17.8168 18.8601 18.435 18.1579C19.779 16.6282 20.5129 14.6758 20.4998 12.6626L20.4575 6.02198C20.4535 5.25711 19.9511 4.57461 19.2082 4.32652L12.5707 2.09956C12.1711 1.96424 11.7331 1.96718 11.3405 2.10643L4.72824 4.41281C3.9893 4.67071 3.496 5.35811 3.50002 6.12397L3.54231 12.7597C3.5554 14.7758 4.31448 16.7194 5.68062 18.2335C6.3048 18.9258 7.10415 19.52 8.12699 20.0505L11.7281 21.9137ZM10.7831 14.1106C10.9321 14.2538 11.1254 14.3244 11.3187 14.3225C11.512 14.3215 11.7043 14.2489 11.8513 14.1038L15.7504 10.2598C16.0434 9.97053 16.0403 9.50572 15.7444 9.22037C15.4474 8.93501 14.9692 8.93697 14.6762 9.22625L11.3077 12.5466L9.92843 11.2208C9.63144 10.9354 9.15424 10.9384 8.86028 11.2277C8.56732 11.5169 8.57034 11.9818 8.86732 12.2671L10.7831 14.1106Z"
                fill="currentColor"
            />
        </Svg>
    )
}