import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Document = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.81 2.5H16.191C19.28 2.5 21 4.28 21 7.33V17.66C21 20.76 19.28 22.5 16.191 22.5H7.81C4.77 22.5 3 20.76 3 17.66V7.33C3 4.28 4.77 2.5 7.81 2.5ZM8.08094 7.15844V7.14844H11.0699C11.5009 7.14844 11.8509 7.49844 11.8509 7.92744C11.8509 8.36844 11.5009 8.71844 11.0699 8.71844H8.08094C7.64994 8.71844 7.30094 8.36844 7.30094 7.93844C7.30094 7.50844 7.64994 7.15844 8.08094 7.15844ZM8.08078 13.2368H15.9208C16.3508 13.2368 16.7008 12.8868 16.7008 12.4568C16.7008 12.0268 16.3508 11.6758 15.9208 11.6758H8.08078C7.64978 11.6758 7.30078 12.0268 7.30078 12.4568C7.30078 12.8868 7.64978 13.2368 8.08078 13.2368ZM8.08094 17.8084H15.9209C16.3199 17.7684 16.6209 17.4274 16.6209 17.0284C16.6209 16.6184 16.3199 16.2784 15.9209 16.2384H8.08094C7.78094 16.2084 7.49094 16.3484 7.33094 16.6084C7.17094 16.8584 7.17094 17.1884 7.33094 17.4484C7.49094 17.6984 7.78094 17.8484 8.08094 17.8084Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
