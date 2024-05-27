import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgAm = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7084)">
            <Path
                d="M512 256C512 224.686 506.368 194.689 496.077 166.957L256 155.826L15.923 166.956C5.633 194.689 0 224.686 0 256C0 287.314 5.633 317.311 15.923 345.043L256 356.174L496.077 345.044C506.368 317.311 512 287.314 512 256Z"
                fill="#0052B4"
            />
            <Path
                d="M256 512C366.071 512 459.906 442.528 496.077 345.043H15.9229C52.0939 442.528 145.929 512 256 512Z"
                fill="#FF9811"
            />
            <Path
                d="M15.9229 166.957H496.078C459.906 69.472 366.071 0 256 0C145.929 0 52.0939 69.472 15.9229 166.957Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7084">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgAm
