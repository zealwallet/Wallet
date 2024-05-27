import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgCh = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7301)">
            <Path
                d="M256.578 512C397.963 512 512.578 397.385 512.578 256C512.578 114.615 397.963 0 256.578 0C115.193 0 0.578125 114.615 0.578125 256C0.578125 397.385 115.193 512 256.578 512Z"
                fill="#D80027"
            />
            <Path
                d="M390.143 211.479H301.1V122.435H212.056V211.479H123.013V300.522H212.056V389.565H301.1V300.522H390.143V211.479Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7301">
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
export default SvgCh
