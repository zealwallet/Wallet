import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgCr = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7131)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M496.077 166.957H15.923C5.633 194.69 0 224.686 0 256C0 287.314 5.633 317.31 15.923 345.043H496.078C506.368 317.31 512 287.314 512 256C512 224.686 506.368 194.69 496.077 166.957Z"
                fill="#D80027"
            />
            <Path
                d="M256 0C178.409 0 108.886 34.524 61.9395 89.043H450.06C403.114 34.524 333.591 0 256 0Z"
                fill="#0052B4"
            />
            <Path
                d="M450.061 422.957H61.9395C108.886 477.476 178.409 512 256 512C333.591 512 403.114 477.476 450.061 422.957Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7131">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgCr
