import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Filter = ({ size, color }: Props) => {
    return (
        <SvgIcon
            fill="transparent"
            viewBox="0 0 15 15"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M11.7617 2.50738C9.2329 2.22475 6.68046 2.22475 4.15164 2.50738C3.5226 2.57769 3.21968 3.31535 3.61777 3.80745L5.81638 6.52526C6.44633 7.30396 6.79001 8.27525 6.79001 9.27685V11.11C6.79001 11.2494 6.85641 11.3804 6.96879 11.4628L8.58493 12.648C8.80841 12.8119 9.12334 12.6523 9.12334 12.3752V9.27686C9.12334 8.27525 9.46702 7.30396 10.097 6.52526L12.2956 3.80745C12.6937 3.31535 12.3908 2.57769 11.7617 2.50738Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
