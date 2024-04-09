import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgSn = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7277)">
            <Path
                d="M367.304 25.402C333.648 9.128 295.89 0 256 0C216.11 0 178.352 9.128 144.696 25.402L122.435 256L144.696 486.598C178.352 502.872 216.11 512 256 512C295.89 512 333.648 502.872 367.304 486.598L389.565 256L367.304 25.402Z"
                fill="#FFDA44"
            />
            <Path
                d="M255.998 166.957L278.098 234.977H349.626L291.762 277.02L313.863 345.043L255.998 303.003L198.133 345.043L220.238 277.02L162.374 234.977H233.897L255.998 166.957Z"
                fill="#496E2D"
            />
            <Path
                d="M144.696 25.411C59.066 66.818 0 154.507 0 256C0 357.493 59.066 445.182 144.696 486.589V25.411Z"
                fill="#496E2D"
            />
            <Path
                d="M367.304 25.411V486.589C452.934 445.182 512 357.493 512 256C512 154.507 452.934 66.818 367.304 25.411Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7277">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgSn
