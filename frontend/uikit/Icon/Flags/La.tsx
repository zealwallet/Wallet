import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgLa = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7199)">
            <Path
                d="M486.598 144.696C445.19 59.065 357.494 0 256 0C154.506 0 66.8103 59.065 25.4023 144.696L256 166.957L486.598 144.696Z"
                fill="#D80027"
            />
            <Path
                d="M25.4023 367.304C66.8103 452.935 154.506 512 256 512C357.494 512 445.19 452.935 486.598 367.304L256 345.043L25.4023 367.304Z"
                fill="#D80027"
            />
            <Path
                d="M486.598 144.696H25.402C9.128 178.351 0 216.109 0 256C0 295.891 9.128 333.649 25.402 367.304H486.597C502.873 333.649 512 295.891 512 256C512 216.109 502.873 178.351 486.598 144.696Z"
                fill="#0052B4"
            />
            <Path
                d="M256 345.043C305.177 345.043 345.043 305.177 345.043 256C345.043 206.823 305.177 166.957 256 166.957C206.823 166.957 166.957 206.823 166.957 256C166.957 305.177 206.823 345.043 256 345.043Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7199">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgLa
