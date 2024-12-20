import React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
}

export const BungeeLogo = ({ size }: Props) => {
    return (
        <SvgIcon viewBox="0 0 32 32" width={size} height={size} fill="none">
            <G clipPath="url(#clip0_4179_25915)">
                <Rect width="32" height="32" rx="16" fill="#FDA600" />
                <G clipPath="url(#clip1_4179_25915)">
                    <Path
                        d="M5.69851 18.5705C7.07888 18.5705 8.1976 17.4674 8.1976 16.107C8.1976 14.7466 7.07862 13.6436 5.69851 13.6436C4.32177 13.6436 3.20564 14.741 3.19995 16.0968V16.1175C3.20564 17.473 4.32177 18.5705 5.69851 18.5705Z"
                        fill="#ED1E7F"
                    />
                    <Path
                        d="M26.0298 18.5705C27.41 18.5705 28.5289 17.4676 28.5289 16.107C28.5289 14.7465 27.41 13.6436 26.0298 13.6436C24.6497 13.6436 23.5308 14.7465 23.5308 16.107C23.5308 17.4676 24.6497 18.5705 26.0298 18.5705Z"
                        fill="#4CB85D"
                    />
                    <Path
                        d="M13.0721 20.1141C13.8167 20.1141 14.5075 19.8878 15.0802 19.503V20.0565H16.6472V16.609C16.6472 16.6017 16.648 16.5945 16.648 16.5871V15.6245C16.648 14.5325 17.549 13.6443 18.6569 13.6443C19.7671 13.6443 20.6657 14.5325 20.6657 15.6245V20.0565H22.2349V15.6245C22.2349 13.6784 20.6335 12.0996 18.6569 12.0996C17.912 12.0996 17.2204 12.3261 16.6475 12.7113V12.1564H15.0805V16.6009C15.0729 17.6886 14.1756 18.5674 13.0723 18.5674C11.9624 18.5674 11.0635 17.6815 11.0635 16.5871V12.1572H9.49438V16.5871C9.49412 18.5356 11.0955 20.1141 13.0721 20.1141Z"
                        fill="#060316"
                    />
                </G>
            </G>
            <Defs>
                <ClipPath id="clip0_4179_25915">
                    <Rect width="32" height="32" rx="16" fill="white" />
                </ClipPath>
                <ClipPath id="clip1_4179_25915">
                    <Rect
                        width="25.6"
                        height="8.26667"
                        fill="white"
                        transform="translate(3.19995 12)"
                    />
                </ClipPath>
            </Defs>
        </SvgIcon>
    )
}
