import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgMz = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7229)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M138.371 356.174L74.989 437.011C121.313 483.341 185.306 512 256 512C361.83 512 452.644 447.771 491.631 356.174H138.371Z"
                fill="#FFDA44"
            />
            <Path
                d="M492.029 156.753C453.26 64.662 362.188 0 256 0C185.306 0 121.313 28.659 74.989 74.989L139.099 156.753H492.029Z"
                fill="#496E2D"
            />
            <Path
                d="M55.652 188.29V322.782H503.182C508.924 301.491 512 279.107 512 256C512 232.558 508.842 209.858 502.939 188.29H55.652Z"
                fill="black"
            />
            <Path
                d="M74.98 74.98C-24.994 174.954 -24.994 337.045 74.98 437.02C116.293 395.707 156.026 355.974 256 256L74.98 74.98Z"
                fill="#A2001D"
            />
            <Path
                d="M103.61 189.217L120.185 240.233H173.831L130.433 271.765L147.007 322.783L103.61 291.252L60.211 322.783L76.789 271.765L33.391 240.233H87.033L103.61 189.217Z"
                fill="#FFDA44"
            />
            <Path
                d="M55.1071 256H152.131V300.522H55.1071V256Z"
                fill="#F0F0F0"
            />
            <Path
                d="M170.5 204.959L154.759 189.217L103.611 240.365L52.463 189.217L36.722 204.959L87.915 256.061L36.722 307.255L52.463 322.783L103.611 271.727L154.759 322.783L170.5 307.255L119.307 256.061L170.5 204.959Z"
                fill="black"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7229">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgMz
