import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgBo = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7102)">
            <Path
                d="M512 256.001C512 224.687 506.368 194.69 496.077 166.958L256 155.827L15.923 166.957C5.632 194.69 0 224.687 0 256.001C0 287.315 5.632 317.312 15.923 345.044L256 356.175L496.077 345.045C506.368 317.312 512 287.315 512 256.001Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 512.001C366.071 512.001 459.906 442.529 496.077 345.044H15.9229C52.0939 442.529 145.929 512.001 256 512.001Z"
                fill="#6DA544"
            />
            <Path
                d="M15.9229 166.958H496.078C459.906 69.473 366.071 0.000976562 256 0.000976562C145.929 0.000976562 52.0939 69.473 15.9229 166.958Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7102">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 0.000976562)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgBo
