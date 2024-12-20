import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgVc = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7296)">
            <Path
                d="M379.013 31.128C342.642 11.284 300.928 0.000976562 256.578 0.000976562C212.228 0.000976562 170.514 11.284 134.143 31.128L111.882 256.001L134.143 480.874C170.514 500.718 212.228 512.001 256.578 512.001C300.928 512.001 342.642 500.718 379.013 480.874L401.274 256.001L379.013 31.128Z"
                fill="#FFDA44"
            />
            <Path
                d="M134.143 480.872V31.127C54.5671 74.547 0.578125 158.966 0.578125 256.001C0.578125 353.036 54.5671 437.455 134.143 480.872Z"
                fill="#338AF3"
            />
            <Path
                d="M512.578 256.001C512.578 158.966 458.589 74.547 379.013 31.127V480.872C458.589 437.455 512.578 353.036 512.578 256.001Z"
                fill="#6DA544"
            />
            <Path
                d="M200.926 322.784L156.403 256.001L200.925 189.218L245.449 256.001L200.926 322.784Z"
                fill="#6DA544"
            />
            <Path
                d="M312.23 322.784L267.708 256.001L312.23 189.218L356.752 256.001L312.23 322.784Z"
                fill="#6DA544"
            />
            <Path
                d="M256.578 411.827L212.056 345.044L256.578 278.262L301.1 345.044L256.578 411.827Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7296">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0.578125 0.000976562)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgVc
