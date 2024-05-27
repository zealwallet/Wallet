import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgSi = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7285)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M496.077 166.957H222.609V100.174H89.043V166.957H15.923C5.633 194.689 0 224.686 0 256C0 287.314 5.633 317.31 15.923 345.043L256 367.304L496.077 345.043C506.367 317.31 512 287.314 512 256C512 224.686 506.367 194.689 496.077 166.957Z"
                fill="#0052B4"
            />
            <Path
                d="M256 512C366.071 512 459.906 442.528 496.077 345.043H15.9229C52.0939 442.528 145.929 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M89.043 166.957V189.217C89.043 240.338 155.826 256.001 155.826 256.001C155.826 256.001 222.609 240.338 222.609 189.217V166.957L200.348 189.218L155.826 155.827L111.304 189.218L89.043 166.957Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7285">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgSi
