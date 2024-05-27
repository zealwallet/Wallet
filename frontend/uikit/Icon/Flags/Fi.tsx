import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgFi = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7155)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M509.833 222.609H200.349H200.348V6.08502C176.69 11.331 154.261 19.834 133.565 31.127V222.607V222.608H2.167C0.742 233.539 0 244.683 0 256C0 267.317 0.742 278.461 2.167 289.391H133.564H133.565V480.872C154.261 492.164 176.69 500.669 200.348 505.914V289.394V289.392H509.833C511.256 278.461 512 267.317 512 256C512 244.683 511.256 233.539 509.833 222.609Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7155">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgFi
