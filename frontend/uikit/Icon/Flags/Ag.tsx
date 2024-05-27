import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgAg = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7082)">
            <Path
                d="M0 256C0 273.535 1.768 290.657 5.127 307.2L256 322.783L506.874 307.2C510.234 290.657 512 273.535 512 256C512 238.465 510.232 221.343 506.874 204.8L256 189.217L5.127 204.8C1.768 221.343 0 238.465 0 256H0Z"
                fill="#0052B4"
            />
            <Path
                d="M506.874 307.2H5.12695C28.846 424.05 132.151 512 256 512C379.849 512 483.154 424.05 506.874 307.2Z"
                fill="#F0F0F0"
            />
            <Path
                d="M5.12695 204.8H506.875C483.154 87.95 379.851 0 256 0C132.149 0 28.846 87.95 5.12695 204.8Z"
                fill="black"
            />
            <Path
                d="M367.304 204.8H144.696L190.176 183.406L165.957 139.361L215.342 148.806L221.602 98.917L256 135.611L290.4 98.917L296.656 148.806L346.043 139.361L321.826 183.408L367.304 204.8Z"
                fill="#FFDA44"
            />
            <Path
                d="M0 256C0 397.384 114.616 512 256 512L51.196 102.391C19.052 145.18 0 198.363 0 256Z"
                fill="#A2001D"
            />
            <Path
                d="M256 512C397.384 512 512 397.384 512 256C512 198.363 492.948 145.18 460.804 102.391L256 512Z"
                fill="#A2001D"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7082">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgAg
