import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgPf = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7157)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M31.127 133.565H480.872C437.454 53.989 353.035 0 256 0C158.965 0 74.546 53.989 31.127 133.565Z"
                fill="#D80027"
            />
            <Path
                d="M256 512C353.035 512 437.454 458.011 480.873 378.435H31.127C74.546 458.011 158.965 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M345.043 256C345.043 305.178 305.177 333.913 256 333.913C206.823 333.913 166.957 305.178 166.957 256C166.957 206.822 206.823 166.957 256 166.957C305.177 166.957 345.043 206.822 345.043 256Z"
                fill="#FFDA44"
            />
            <Path
                d="M345.043 256C345.043 305.178 305.177 345.043 256 345.043C206.823 345.043 166.957 305.178 166.957 256"
                fill="#0052B4"
            />
            <Path
                d="M200.348 233.739H222.609V278.261H200.348V233.739Z"
                fill="#D80027"
            />
            <Path
                d="M289.391 233.739H311.652V278.261H289.391V233.739Z"
                fill="#D80027"
            />
            <Path
                d="M244.87 200.348H267.131V278.261H244.87V200.348Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7157">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgPf
