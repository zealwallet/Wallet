import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgSc = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7279)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M428.809 67.137C383.269 25.445 322.608 0 256 0C245.096 0 234.351 0.687 223.805 2.01L100.174 144.696L8.10095 320.131C14.049 343.192 23.143 364.986 34.876 385.048L256 256L428.809 67.137Z"
                fill="#FFDA44"
            />
            <Path
                d="M469.131 397.838L110.963 466.958C152.192 495.359 202.15 512 256 512C344.921 512 423.24 466.657 469.131 397.838Z"
                fill="#6DA544"
            />
            <Path
                d="M428.845 67.171L35.022 385.296C45.323 402.864 57.656 419.095 71.703 433.664L512 256C512 181.241 479.949 113.973 428.845 67.171Z"
                fill="#D80027"
            />
            <Path
                d="M0 256C0 278.147 2.814 299.636 8.101 320.131L223.805 2.01C97.618 17.844 0 125.52 0 256Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7279">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgSc
