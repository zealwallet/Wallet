import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'
import { DefaultTheme } from 'styled-components'

type Props = {
    size: number
    color?: keyof DefaultTheme['colors']
}

export const SolidZeal = ({ size, color }: Props) => {
    return (
        <Icon viewBox="0 0 28 28" width={size} color={color}>
            <path
                d="M3.5 24.5H24.5V15.05H7.7C5.3804 15.05 3.5 16.9304 3.5 19.25V24.5Z"
                fill="#01C9C9"
            />
            <path
                d="M24.5 3.5H3.5V12.95H20.3C22.6196 12.95 24.5 11.0696 24.5 8.75V3.5Z"
                fill="#01C9C9"
            />
        </Icon>
    )
}
