import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ArrowLeftSquared = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            viewBox="0 0 24 24"
            fill="none"
            width={size}
            height={size}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.24065 0.333496H16.7723C20.8906 0.333496 23.6673 2.983 23.6673 6.93683V17.0518C23.6673 21.0068 20.8906 23.6668 16.7723 23.6668H7.24065C3.11065 23.6668 0.333984 21.0068 0.333984 17.0518V6.93683C0.333984 2.983 3.11065 0.333496 7.24065 0.333496ZM13.2546 9.50878L8.01613 14.7473C7.66964 15.0937 7.67789 15.6465 8.01613 15.9847C8.36261 16.3312 8.90708 16.3312 9.25356 15.9847L14.492 10.7462L14.4838 14.8298C14.4838 15.0608 14.5828 15.2917 14.7395 15.4485C14.8954 15.6044 15.119 15.696 15.3583 15.7042C15.8367 15.7042 16.2327 15.3082 16.2327 14.8298L16.2492 8.62608C16.2492 8.1641 15.8367 7.75162 15.3748 7.75162L9.17107 7.76812C8.69259 7.76812 8.29661 8.1641 8.29661 8.64258C8.30486 9.1293 8.69259 9.51703 9.17932 9.52528L13.2546 9.50878Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
