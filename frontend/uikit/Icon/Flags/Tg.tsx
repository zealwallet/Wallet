import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgTg = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7308)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 0C255.814 0.002 244.87 102.4 244.87 102.4H460.812C414.107 40.223 339.752 0 256 0Z"
                fill="#496E2D"
            />
            <Path
                d="M256 512C339.752 512 414.107 471.777 460.811 409.6H51.189C97.893 471.777 172.248 512 256 512Z"
                fill="#496E2D"
            />
            <Path
                d="M506.874 204.8H244.87L256 307.2H506.874C510.234 290.657 512 273.535 512 256C512 238.465 510.232 221.343 506.874 204.8Z"
                fill="#496E2D"
            />
            <Path
                d="M256 307.2C256 253.774 256 60.104 256 0C114.616 0 0 114.616 0 256C0 273.535 1.768 290.657 5.126 307.2H256Z"
                fill="#D80027"
            />
            <Path
                d="M141.257 122.435L157.833 173.45H211.478L168.081 204.983L184.655 256L141.257 224.47L97.8591 256L114.436 204.983L71.0391 173.45H124.682L141.257 122.435Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7308">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgTg
