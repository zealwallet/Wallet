import React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
}

export const JumperLogo = ({ size }: Props) => {
    return (
        <SvgIcon viewBox="0 0 32 32" width={size} height={size} fill="none">
            <G clipPath="url(#clip0_4179_25889)">
                <Rect width="32" height="32" rx="16" fill="#0B0124" />
                <Path
                    d="M17.3699 16.115L9.19458 24.2896L11.2379 26.3329C12.2595 27.3545 14.3035 27.3545 15.3252 26.3329L23.5005 18.1583C24.5222 17.1366 24.5222 15.0933 23.5005 14.0717L19.4132 9.98438L15.3259 14.0717L17.3699 16.115Z"
                    fill="#BEA0EB"
                />
                <Path
                    d="M9.1953 7.94038L11.2393 5.89709C12.2617 4.87545 14.305 4.87545 15.3266 5.89709L17.3706 7.94038L13.2833 12.0277L9.1953 7.94038Z"
                    fill="#D35CFF"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_4179_25889">
                    <Rect width="32" height="32" rx="16" fill="white" />
                </ClipPath>
            </Defs>
        </SvgIcon>
    )
}
