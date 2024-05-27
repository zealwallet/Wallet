import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgTl = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7142)">
            <Path
                d="M256 512.001C397.385 512.001 512 397.386 512 256.001C512 114.616 397.385 0.000976562 256 0.000976562C114.615 0.000976562 0 114.616 0 256.001C0 397.386 114.615 512.001 256 512.001Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 0.000976562C193.323 0.000976562 135.917 22.538 91.415 59.935L367.304 256.001L91.415 452.067C135.917 489.464 193.323 512.001 256 512.001C397.384 512.001 512 397.385 512 256.001C512 114.617 397.384 0.000976562 256 0.000976562Z"
                fill="#D80027"
            />
            <Path
                d="M74.98 74.981C-24.994 174.955 -24.994 337.046 74.98 437.021C116.293 395.708 156.026 355.975 256 256.001L74.98 74.981Z"
                fill="black"
            />
            <Path
                d="M70.9792 197.356L109.939 234.228L157.047 208.564L134.022 257.014L172.983 293.887L119.789 286.959L96.7612 335.408L86.9142 282.676L33.7202 275.746L80.8262 250.085L70.9792 197.356Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7142">
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
export default SvgTl
