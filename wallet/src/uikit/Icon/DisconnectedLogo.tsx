import React from 'react'
import { Icon } from 'src/uikit/Icon/Icon'

type Props = {
    size: number
}

export const DisconnectedLogo = ({ size }: Props) => {
    return (
        <Icon viewBox="0 0 36 36" width={size}>
            <rect width="36" height="36" rx="10" fill="white" />
            <path
                d="M7.71484 28.2863H28.2863V19.0291H11.8291C9.55687 19.0291 7.71484 20.8712 7.71484 23.1434V28.2863Z"
                fill="#0B1821"
            />
            <path
                d="M28.2863 7.71484H7.71484V16.972H24.172C26.4443 16.972 28.2863 15.13 28.2863 12.8577V7.71484Z"
                fill="#0B1821"
            />
        </Icon>
    )
}
