import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgEs = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7292)">
            <Path
                d="M0 256C0 287.314 5.633 317.31 15.923 345.043L256 367.304L496.077 345.043C506.367 317.31 512 287.314 512 256C512 224.686 506.367 194.69 496.077 166.957L256 144.696L15.923 166.957C5.633 194.69 0 224.686 0 256H0Z"
                fill="#FFDA44"
            />
            <Path
                d="M496.077 166.957C459.906 69.473 366.071 0 256 0C145.929 0 52.094 69.473 15.923 166.957H496.077Z"
                fill="#D80027"
            />
            <Path
                d="M15.923 345.043C52.094 442.527 145.929 512 256 512C366.071 512 459.906 442.527 496.077 345.043H15.923Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7292">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgEs
