import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgFm = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7222)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#338AF3"
            />
            <Path
                d="M255.999 111.304L267.049 145.316H302.813L273.881 166.337L284.931 200.348L255.999 179.328L227.066 200.348L238.119 166.337L209.186 145.316H244.949L255.999 111.304Z"
                fill="#F0F0F0"
            />
            <Path
                d="M111.304 256.002L145.316 244.95V209.186L166.337 238.12L200.348 227.069L179.328 256.002L200.348 284.932L166.337 273.88L145.316 302.813V267.051L111.304 256.002Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256.001 400.696L244.95 366.684H209.186L238.12 345.663L227.069 311.652L256.001 332.672L284.932 311.652L273.88 345.663L302.813 366.684H267.051L256.001 400.696Z"
                fill="#F0F0F0"
            />
            <Path
                d="M400.696 255.999L366.684 267.05V302.813L345.663 273.88L311.652 284.931L332.672 255.999L311.652 227.068L345.663 238.12L366.684 209.186V244.949L400.696 255.999Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7222">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgFm
