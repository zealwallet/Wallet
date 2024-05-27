import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgPt = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7259)">
            <Path
                d="M0 256C0 366.07 69.472 459.905 166.955 496.076L189.217 255.999L166.955 15.923C69.472 52.095 0 145.929 0 256Z"
                fill="#6DA544"
            />
            <Path
                d="M512 256C512 114.616 397.384 0 256 0C224.686 0 194.689 5.633 166.955 15.923V496.077C194.689 506.368 224.686 512 256 512C397.384 512 512 397.384 512 256Z"
                fill="#D80027"
            />
            <Path
                d="M166.957 345.043C216.134 345.043 256 305.177 256 256C256 206.823 216.134 166.957 166.957 166.957C117.78 166.957 77.9141 206.823 77.9141 256C77.9141 305.177 117.78 345.043 166.957 345.043Z"
                fill="#FFDA44"
            />
            <Path
                d="M116.87 211.478V267.13C116.87 294.792 139.294 317.217 166.957 317.217C194.62 317.217 217.044 294.793 217.044 267.13V211.478H116.87Z"
                fill="#D80027"
            />
            <Path
                d="M166.957 283.826C157.751 283.826 150.261 276.336 150.261 267.13V244.87H183.652V267.131C183.652 276.336 176.162 283.826 166.957 283.826Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7259">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgPt
