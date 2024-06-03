import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Pets = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 32 32"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.558 11.7468C11.7808 13.2901 12.8131 14.4115 13.8637 14.2517C14.9143 14.0919 15.5858 12.7106 15.363 11.1673C15.1402 9.62401 14.1079 8.50255 13.0573 8.66276C12.0075 8.82259 11.3352 10.2035 11.558 11.7468ZM21.0867 20.5565C21.0984 21.7789 19.9825 22.8582 19.2731 23.4201C18.942 23.6825 18.4813 23.6546 18.1513 23.3908L16.622 22.1688C16.2567 21.8768 15.7377 21.8771 15.3726 22.1694L13.8444 23.3934C13.5165 23.6559 13.059 23.6857 12.728 23.4271C12.0208 22.8745 10.9073 21.8105 10.9073 20.5887C10.9657 17.6762 13.1954 15.3115 16.0019 15.1855C18.8131 15.2682 21.0587 17.6402 21.0867 20.5565ZM10.8297 16.8232C10.0782 17.4196 8.88096 16.9271 8.15555 15.7245C7.43015 14.5219 7.45131 13.063 8.2024 12.467C8.95387 11.871 10.1512 12.3627 10.8766 13.5657C11.602 14.7687 11.5812 16.2268 10.8297 16.8232ZM20.442 11.7468C20.2192 13.2901 19.1869 14.4115 18.1363 14.2517C17.0857 14.0919 16.4142 12.7106 16.637 11.1673C16.8598 9.62401 17.8921 8.50255 18.9427 8.66276C19.9925 8.82259 20.6648 10.2035 20.442 11.7468ZM21.1703 16.8232C21.9218 17.4196 23.119 16.9271 23.8444 15.7245C24.5698 14.5219 24.5487 13.063 23.7976 12.467C23.0461 11.871 21.8488 12.3627 21.1234 13.5657C20.398 14.7687 20.4188 16.2268 21.1703 16.8232Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}