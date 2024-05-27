import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgRw = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7267)">
            <Path
                d="M0 256C0 300.35 11.283 342.064 31.127 378.435L256 400.696L480.873 378.435C500.717 342.064 512 300.35 512 256L256 233.739L0 256Z"
                fill="#FFDA44"
            />
            <Path
                d="M480.873 133.565C437.454 53.989 353.035 0 256 0C158.965 0 74.546 53.989 31.127 133.565C11.283 169.936 0 211.65 0 256H512C512 211.65 500.717 169.936 480.873 133.565Z"
                fill="#338AF3"
            />
            <Path
                d="M256 512C353.035 512 437.454 458.011 480.873 378.435H31.127C74.546 458.011 158.965 512 256 512Z"
                fill="#496E2D"
            />
            <Path
                d="M289.391 149.821L320.657 164.528L304.008 194.808L337.958 188.314L342.26 222.609L365.906 197.385L389.554 222.609L393.855 188.314L427.805 194.806L411.157 164.527L442.421 149.821L411.156 135.116L427.805 104.836L393.856 111.33L389.553 77.035L365.906 102.259L342.259 77.035L337.958 111.33L304.007 104.836L320.656 135.117L289.391 149.821Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7267">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgRw
