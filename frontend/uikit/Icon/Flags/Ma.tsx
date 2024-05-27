import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgMa = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7228)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M407.288 210.09H291.714L256 100.174L220.286 210.09H104.712L198.213 278.022L162.498 387.941L256 320.008L349.502 387.942L313.787 278.023L407.288 210.09ZM224.382 269.519L236.459 232.35H275.54L287.618 269.519V269.52L256 292.491L224.383 269.52L224.382 269.519ZM268.308 210.09H243.693L256 172.21L268.308 210.09ZM306.553 255.762L298.946 232.351H338.775L306.553 255.762ZM213.053 232.351L205.446 255.762L173.223 232.351H213.053ZM204.841 329.661L217.149 291.782L237.064 306.25L204.841 329.661ZM274.936 306.251L294.851 291.783L307.159 329.662L274.936 306.251Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7228">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgMa
