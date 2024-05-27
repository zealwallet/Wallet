import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgMu = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7219)">
            <Path
                d="M31.127 133.565L256 155.826L480.873 133.565C437.454 53.989 353.035 0 256 0C158.965 0 74.546 53.989 31.127 133.565Z"
                fill="#D80027"
            />
            <Path
                d="M31.127 378.435L256 400.696L480.873 378.435C500.717 342.064 512 300.35 512 256L256 233.739L0 256C0 300.35 11.283 342.064 31.127 378.435Z"
                fill="#FFDA44"
            />
            <Path
                d="M31.127 133.565C11.283 169.936 0 211.65 0 256H512C512 211.65 500.717 169.936 480.873 133.565H256H31.127Z"
                fill="#0052B4"
            />
            <Path
                d="M256 512C353.035 512 437.454 458.011 480.873 378.435H31.127C74.546 458.011 158.965 512 256 512Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7219">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgMu
