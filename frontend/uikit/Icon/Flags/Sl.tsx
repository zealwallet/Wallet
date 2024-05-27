import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgSl = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7280)">
            <Path
                d="M496.077 345.042C506.368 317.309 512 287.313 512 255.999C512 224.685 506.368 194.689 496.077 166.956L256 144.695L15.923 166.956C5.632 194.689 0 224.685 0 255.999C0 287.313 5.632 317.309 15.923 345.042L256 367.303L496.077 345.042Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 511.999C366.07 511.999 459.906 442.527 496.076 345.042H15.922C52.094 442.527 145.928 511.999 256 511.999Z"
                fill="#338AF3"
            />
            <Path
                d="M256 -0.000976562C145.928 -0.000976562 52.094 69.471 15.922 166.956H496.077C459.906 69.471 366.07 -0.000976562 256 -0.000976562Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7280">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 -0.000976562)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgSl
