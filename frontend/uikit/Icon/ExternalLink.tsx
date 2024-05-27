import React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const ExternalLink = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 14 14"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <G clipPath="url(#clip0_2533_17218)">
                <Path
                    d="M11.0833 11.5833H2.91667V3.41667H7V2.25H2.91667C2.26917 2.25 1.75 2.775 1.75 3.41667V11.5833C1.75 12.225 2.26917 12.75 2.91667 12.75H11.0833C11.725 12.75 12.25 12.225 12.25 11.5833V7.5H11.0833V11.5833ZM8.16667 2.25V3.41667H10.2608L4.52667 9.15083L5.34917 9.97333L11.0833 4.23917V6.33333H12.25V2.25H8.16667Z"
                    fill="currentColor"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_2533_17218">
                    <Rect
                        width="14"
                        height="14"
                        fill="white"
                        transform="translate(0 0.5)"
                    />
                </ClipPath>
            </Defs>
        </SvgIcon>
    )
}
