import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgBh = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7091)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0C204.624 0 156.792 15.145 116.7 41.198L182.539 85.327L100.174 127.993L182.539 170.659L100.174 213.325L182.539 255.986L100.174 298.651L182.539 341.316L100.174 383.986L182.539 426.652L116.692 470.795C156.786 496.853 204.621 512 256 512C397.384 512 512 397.384 512 256C512 114.616 397.384 0 256 0V0Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7091">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgBh
