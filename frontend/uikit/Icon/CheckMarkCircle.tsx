import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const CheckMarkCircle = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 16 16"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M8 0C3.58867 0 0 3.58867 0 8C0 12.4113 3.58867 16 8 16C12.4113 16 16 12.4113 16 8C16 3.58867 12.4113 0 8 0ZM12.0547 6.30467L7.72133 10.638C7.59133 10.768 7.42067 10.8333 7.25 10.8333C7.07933 10.8333 6.90867 10.768 6.77867 10.638L4.612 8.47133C4.35133 8.21067 4.35133 7.78933 4.612 7.52867C4.87267 7.268 5.294 7.268 5.55467 7.52867L7.25 9.224L11.112 5.362C11.3727 5.10133 11.794 5.10133 12.0547 5.362C12.3153 5.62267 12.3153 6.044 12.0547 6.30467Z"
                fill="currentColor"
            />
            <Path
                d="M8 0C3.58867 0 0 3.58867 0 8C0 12.4113 3.58867 16 8 16C12.4113 16 16 12.4113 16 8C16 3.58867 12.4113 0 8 0ZM12.0547 6.30467L7.72133 10.638C7.59133 10.768 7.42067 10.8333 7.25 10.8333C7.07933 10.8333 6.90867 10.768 6.77867 10.638L4.612 8.47133C4.35133 8.21067 4.35133 7.78933 4.612 7.52867C4.87267 7.268 5.294 7.268 5.55467 7.52867L7.25 9.224L11.112 5.362C11.3727 5.10133 11.794 5.10133 12.0547 5.362C12.3153 5.62267 12.3153 6.044 12.0547 6.30467Z"
                fill="currentColor"
                fillOpacity="0.7"
            />
        </Svg>
    )
}
