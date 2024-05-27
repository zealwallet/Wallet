import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgTh = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7306)">
            <Path
                d="M256 512.001C397.385 512.001 512 397.386 512 256.001C512 114.616 397.385 0.000976562 256 0.000976562C114.615 0.000976562 0 114.616 0 256.001C0 397.386 114.615 512.001 256 512.001Z"
                fill="#F0F0F0"
            />
            <Path
                d="M496.077 166.958H15.923C5.632 194.691 0 224.687 0 256.001C0 287.315 5.632 317.311 15.923 345.044H496.078C506.368 317.311 512 287.315 512 256.001C512 224.687 506.368 194.691 496.077 166.958Z"
                fill="#0052B4"
            />
            <Path
                d="M256 0.000976562C178.409 0.000976562 108.886 34.525 61.939 89.044H450.06C403.114 34.525 333.591 0.000976562 256 0.000976562Z"
                fill="#D80027"
            />
            <Path
                d="M450.061 422.958H61.939C108.886 477.477 178.409 512.001 256 512.001C333.591 512.001 403.114 477.477 450.061 422.958Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7306">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 0.000976562)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgTh
