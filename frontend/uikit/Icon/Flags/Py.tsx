import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgPy = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7254)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0C154.506 0 66.8099 59.065 25.4019 144.696H486.597C445.19 59.065 357.493 0 256 0Z"
                fill="#D80027"
            />
            <Path
                d="M256 512C357.493 512 445.19 452.935 486.598 367.304H25.4019C66.8099 452.935 154.506 512 256 512Z"
                fill="#0052B4"
            />
            <Path
                d="M318.963 181.907L295.352 205.518C305.423 215.589 311.653 229.502 311.653 244.87C311.653 275.606 286.736 300.522 256.001 300.522C225.266 300.522 200.349 275.605 200.349 244.87C200.349 229.502 206.579 215.589 216.65 205.518L193.039 181.907C176.924 198.019 166.958 220.28 166.958 244.87C166.958 294.048 206.824 333.913 256.001 333.913C305.178 333.913 345.044 294.047 345.044 244.87C345.043 220.28 335.077 198.019 318.963 181.907Z"
                fill="#6DA544"
            />
            <Path
                d="M256 211.478L264.289 236.988H291.11L269.411 252.752L277.7 278.261L256 262.496L234.3 278.261L242.589 252.752L220.89 236.988H247.711L256 211.478Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7254">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgPy
