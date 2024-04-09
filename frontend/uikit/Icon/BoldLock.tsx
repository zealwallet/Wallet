import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const BoldLock = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color={color && colors[color]}
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.5227 7.39601V8.92935C19.2451 9.46696 20.5 11.0261 20.5 12.8884V17.8253C20.5 20.1308 18.5886 22 16.2322 22H7.7688C5.41136 22 3.5 20.1308 3.5 17.8253V12.8884C3.5 11.0261 4.75595 9.46696 6.47729 8.92935V7.39601C6.48745 4.41479 8.95667 2 11.9848 2C15.0535 2 17.5227 4.41479 17.5227 7.39601ZM12.0054 3.73828C14.0682 3.73828 15.7448 5.37795 15.7448 7.39524V8.71294H8.25586V7.37537C8.26602 5.36801 9.94265 3.73828 12.0054 3.73828ZM12.8896 16.4535C12.8896 16.9404 12.4933 17.328 11.9954 17.328C11.5076 17.328 11.1113 16.9404 11.1113 16.4535V14.2474C11.1113 13.7704 11.5076 13.3828 11.9954 13.3828C12.4933 13.3828 12.8896 13.7704 12.8896 14.2474V16.4535Z"
                fill="currentColor"
            />
        </Svg>
    )
}
