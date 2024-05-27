import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const CarRepair = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.8262 8.00695C12.068 8.06276 11.83 9.00154 12.3675 9.53909L13.6578 10.8294C14.0478 11.2194 14.0505 11.849 13.6502 12.2493L12.2493 13.6502C11.8551 14.0444 11.2164 14.0448 10.8294 13.6578L9.5391 12.3675C9.00154 11.83 8.06276 12.068 8.00695 12.8262C8.00246 12.8873 8 12.9455 8 13C8 15.7614 10.2386 18 13 18C13.6449 18 14.2612 17.8779 14.8272 17.6556L20.8284 23.6569C21.219 24.0474 21.8521 24.0474 22.2426 23.6569L23.6569 22.2426C24.0474 21.8521 24.0474 21.219 23.6569 20.8284L17.6556 14.8272C17.8779 14.2612 18 13.6449 18 13C18 10.2386 15.7614 8 13 8C12.9455 8 12.8873 8.00246 12.8262 8.00695Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
