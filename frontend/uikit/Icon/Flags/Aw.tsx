import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgAw = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7085)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 512C333.591 512 403.114 477.476 450.061 422.957H61.9395C108.886 477.476 178.409 512 256 512Z"
                fill="#338AF3"
            />
            <Path
                d="M512 256C512 114.616 397.384 0 256 0C114.616 0 0 114.616 0 256C0 279.107 3.08 301.489 8.819 322.783H503.182C508.92 301.489 512 279.107 512 256Z"
                fill="#338AF3"
            />
            <Path
                d="M20.3486 356.174C25.2836 367.77 31.0526 378.922 37.5736 389.565H474.426C480.947 378.921 486.716 367.769 491.653 356.174H20.3486Z"
                fill="#338AF3"
            />
            <Path
                d="M117.317 161.463L67.3008 139.389L117.317 117.315L139.39 67.2998L161.463 117.315L211.478 139.389L161.463 161.463L139.39 211.478L117.317 161.463Z"
                fill="#F0F0F0"
            />
            <Path
                d="M139.39 94.8672L153.021 125.756L183.911 139.389L153.021 153.021L139.39 183.91L125.757 153.021L94.8682 139.389L125.757 125.756L139.39 94.8672Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7085">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgAw
