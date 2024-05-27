import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgSr = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7298)">
            <Path
                d="M256.578 512C397.963 512 512.578 397.385 512.578 256C512.578 114.615 397.963 0 256.578 0C115.193 0 0.578125 114.615 0.578125 256C0.578125 397.385 115.193 512 256.578 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M496.654 166.957H16.5001C6.21113 194.691 0.578125 224.686 0.578125 256C0.578125 287.314 6.21113 317.311 16.5001 345.043H496.655C506.946 317.311 512.578 287.314 512.578 256C512.578 224.686 506.946 194.691 496.654 166.957Z"
                fill="#A2001D"
            />
            <Path
                d="M257.319 512C345.001 512 422.377 467.908 468.515 400.696H46.124C92.262 467.908 169.636 512 257.319 512Z"
                fill="#6DA544"
            />
            <Path
                d="M257.319 0.00195312C345.001 0.00195312 422.377 44.094 468.515 111.306H46.124C92.262 44.094 169.636 0.00195312 257.319 0.00195312Z"
                fill="#6DA544"
            />
            <Path
                d="M256.578 166.957L278.679 234.977H350.204L292.34 277.021L314.443 345.043L256.578 303.004L198.713 345.043L220.817 277.021L162.952 234.977H234.477L256.578 166.957Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7298">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0.578125)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgSr
