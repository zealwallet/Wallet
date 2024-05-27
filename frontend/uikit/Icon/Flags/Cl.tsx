import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgCl = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7123)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M512 256C512 397.384 397.384 512 256 512C114.616 512 0 397.384 0 256C0 114.616 256 256 256 256C256 256 449.761 256 512 256Z"
                fill="#D80027"
            />
            <Path
                d="M0 256C0 114.616 114.616 0 256 0V256C256 256 89.043 256 0 256Z"
                fill="#0052B4"
            />
            <Path
                d="M152.389 89.043L168.966 140.061H222.609L179.211 171.591L195.787 222.609L152.389 191.078L108.991 222.609L125.567 171.591L82.1689 140.061H135.812L152.389 89.043Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7123">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgCl
