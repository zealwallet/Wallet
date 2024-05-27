import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgPs = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7251)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M155.826 166.957H496.076C459.906 69.472 366.07 0 256 0C185.306 0 121.313 28.659 74.989 74.989L155.826 166.957Z"
                fill="black"
            />
            <Path
                d="M155.826 345.043H496.076C459.906 442.528 366.07 512 256 512C185.306 512 121.313 483.341 74.989 437.011L155.826 345.043Z"
                fill="#6DA544"
            />
            <Path
                d="M74.98 74.98C-24.994 174.954 -24.994 337.045 74.98 437.02C116.293 395.707 156.026 355.974 256 256L74.98 74.98Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7251">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgPs
