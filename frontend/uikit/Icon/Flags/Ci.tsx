import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgCi = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7188)">
            <Path
                d="M256 512C287.314 512 317.311 506.368 345.043 496.077L356.174 256L345.044 15.923C317.311 5.633 287.314 0 256 0C224.686 0 194.689 5.633 166.957 15.923L155.826 256L166.956 496.077C194.689 506.368 224.686 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M0 256C0 366.071 69.472 459.906 166.957 496.077V15.9231C69.472 52.0941 0 145.929 0 256Z"
                fill="#FF9811"
            />
            <Path
                d="M345.043 15.9231V496.078C442.528 459.906 512 366.071 512 256C512 145.929 442.528 52.0941 345.043 15.9231Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7188">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgCi
