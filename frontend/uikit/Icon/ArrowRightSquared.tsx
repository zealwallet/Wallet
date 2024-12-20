import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ArrowRightSquared = ({ size, color }: Props) => {
    return (
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
                d="M7.24065 0.333496H16.7723C20.8906 0.333496 23.6673 2.983 23.6673 6.93683V17.0518C23.6673 21.0068 20.8906 23.6668 16.7723 23.6668H7.24065C3.11065 23.6668 0.333984 21.0068 0.333984 17.0518V6.93683C0.333984 2.983 3.11065 0.333496 7.24065 0.333496ZM10.7467 14.4915L15.9852 9.25298C16.3317 8.9065 16.3234 8.35378 15.9852 8.01555C15.6387 7.66907 15.0943 7.66907 14.7478 8.01555L9.50929 13.254L9.51754 9.17049C9.51754 8.9395 9.41855 8.70851 9.26181 8.55177C9.10589 8.39585 8.88233 8.30428 8.64309 8.29603C8.16461 8.29603 7.76863 8.69201 7.76863 9.17049L7.75213 15.3742C7.75213 15.8361 8.16461 16.2486 8.62659 16.2486L14.8303 16.2321C15.3087 16.2321 15.7047 15.8361 15.7047 15.3577C15.6965 14.8709 15.3087 14.4832 14.822 14.475L10.7467 14.4915Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
