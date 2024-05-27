import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ExpandOutline = ({ color, size }: Props) => (
    <SvgIcon
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        color={color && colors[color]}
    >
        <Path
            d="M21 4.125C21 3.82663 20.8815 3.54048 20.6705 3.32951C20.4595 3.11853 20.1734 3 19.875 3H14.25C13.9516 3 13.6655 3.11853 13.4545 3.32951C13.2435 3.54048 13.125 3.82663 13.125 4.125C13.125 4.42337 13.2435 4.70952 13.4545 4.92049C13.6655 5.13147 13.9516 5.25 14.25 5.25H17.1412L13.4513 8.95125C13.3458 9.05583 13.2621 9.18026 13.205 9.31735C13.1479 9.45444 13.1185 9.60149 13.1185 9.75C13.1185 9.89851 13.1479 10.0456 13.205 10.1826C13.2621 10.3197 13.3458 10.4442 13.4513 10.5487C13.5558 10.6542 13.6803 10.7379 13.8174 10.795C13.9544 10.8521 14.1015 10.8815 14.25 10.8815C14.3985 10.8815 14.5456 10.8521 14.6826 10.795C14.8197 10.7379 14.9442 10.6542 15.0487 10.5487L18.75 6.8475V9.75C18.75 10.0484 18.8685 10.3345 19.0795 10.5455C19.2905 10.7565 19.5766 10.875 19.875 10.875C20.1734 10.875 20.4595 10.7565 20.6705 10.5455C20.8815 10.3345 21 10.0484 21 9.75V4.125ZM10.5487 13.4513C10.4442 13.3458 10.3197 13.2621 10.1826 13.205C10.0456 13.1479 9.89851 13.1185 9.75 13.1185C9.60149 13.1185 9.45444 13.1479 9.31735 13.205C9.18026 13.2621 9.05583 13.3458 8.95125 13.4513L5.25 17.1412V14.25C5.25 13.9516 5.13147 13.6655 4.92049 13.4545C4.70952 13.2435 4.42337 13.125 4.125 13.125C3.82663 13.125 3.54048 13.2435 3.32951 13.4545C3.11853 13.6655 3 13.9516 3 14.25V19.875C3 20.1734 3.11853 20.4595 3.32951 20.6705C3.54048 20.8815 3.82663 21 4.125 21H9.75C10.0484 21 10.3345 20.8815 10.5455 20.6705C10.7565 20.4595 10.875 20.1734 10.875 19.875C10.875 19.5766 10.7565 19.2905 10.5455 19.0795C10.3345 18.8685 10.0484 18.75 9.75 18.75H6.8475L10.5487 15.0487C10.6542 14.9442 10.7379 14.8197 10.795 14.6826C10.8521 14.5456 10.8815 14.3985 10.8815 14.25C10.8815 14.1015 10.8521 13.9544 10.795 13.8174C10.7379 13.6803 10.6542 13.5558 10.5487 13.4513Z"
            fill="currentColor"
        />
    </SvgIcon>
)
