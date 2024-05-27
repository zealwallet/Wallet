import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgTz = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7305)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#FFDA44"
            />
            <Path
                d="M74.9799 437.02C85.7189 447.759 97.1769 457.336 109.196 465.768L465.766 109.197C457.336 97.1779 447.758 85.7199 437.019 74.9809C426.279 64.2419 414.822 54.6659 402.803 46.2339L46.2339 402.805C54.6639 414.821 64.2419 426.28 74.9799 437.02Z"
                fill="black"
            />
            <Path
                d="M74.9799 74.9801C-5.78213 155.744 -21.2871 277.035 28.4359 373.378L373.378 28.4371C277.035 -21.2859 155.743 -5.77988 74.9799 74.9801Z"
                fill="#6DA544"
            />
            <Path
                d="M437.019 437.02C517.781 356.258 533.285 234.965 483.564 138.622L138.622 483.564C234.963 533.287 356.256 517.782 437.019 437.02Z"
                fill="#338AF3"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7305">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgTz
