import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgCm = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7115)">
            <Path
                d="M367.304 25.402C333.648 9.128 295.89 0 256 0C216.11 0 178.352 9.128 144.696 25.402L122.435 256L144.696 486.598C178.352 502.872 216.11 512 256 512C295.89 512 333.648 502.872 367.304 486.598L389.565 256L367.304 25.402Z"
                fill="#D80027"
            />
            <Path
                d="M255.998 166.957L278.098 234.976H349.626L291.762 277.02L313.863 345.043L255.998 303.002L198.133 345.043L220.238 277.02L162.374 234.976H233.897L255.998 166.957Z"
                fill="#FFDA44"
            />
            <Path
                d="M144.696 25.4109C59.066 66.8169 0 154.506 0 256C0 357.494 59.066 445.183 144.696 486.589V25.4109Z"
                fill="#496E2D"
            />
            <Path
                d="M367.304 25.4109V486.589C452.934 445.183 512 357.493 512 256C512 154.507 452.934 66.8169 367.304 25.4109Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7115">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgCm
