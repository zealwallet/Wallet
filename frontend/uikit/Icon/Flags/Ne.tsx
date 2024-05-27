import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgNe = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7238)">
            <Path
                d="M26.3903 144.696C10.1163 178.352 0.988281 216.109 0.988281 256C0.988281 295.891 10.1163 333.648 26.3903 367.304L256.988 389.565L487.586 367.304C503.86 333.648 512.988 295.891 512.988 256C512.988 216.109 503.86 178.352 487.586 144.696L256.988 122.435L26.3903 144.696Z"
                fill="#F0F0F0"
            />
            <Path
                d="M26.3992 367.304C67.8052 452.935 155.494 512 256.988 512C358.482 512 446.171 452.935 487.577 367.304H26.3992Z"
                fill="#6DA544"
            />
            <Path
                d="M26.3992 144.696H487.577C446.171 59.065 358.481 0 256.988 0C155.495 0 67.8052 59.065 26.3992 144.696Z"
                fill="#FF9811"
            />
            <Path
                d="M256.988 345.043C306.165 345.043 346.031 305.177 346.031 256C346.031 206.823 306.165 166.957 256.988 166.957C207.811 166.957 167.945 206.823 167.945 256C167.945 305.177 207.811 345.043 256.988 345.043Z"
                fill="#FF9811"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7238">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0.988281)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgNe
