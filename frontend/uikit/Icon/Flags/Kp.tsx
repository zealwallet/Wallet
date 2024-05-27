import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgKp = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7242)">
            <Path
                d="M256.988 512C398.373 512 512.988 397.385 512.988 256C512.988 114.615 398.373 0 256.988 0C115.603 0 0.988281 114.615 0.988281 256C0.988281 397.385 115.603 512 256.988 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256.988 0C179.397 0 109.874 34.524 62.9272 89.043H451.048C404.102 34.524 334.579 0 256.988 0Z"
                fill="#0052B4"
            />
            <Path
                d="M451.049 422.957H62.9272C109.874 477.476 179.397 512 256.988 512C334.579 512 404.102 477.476 451.049 422.957Z"
                fill="#0052B4"
            />
            <Path
                d="M475.414 122.435H38.5623C14.7333 161.32 0.988281 207.053 0.988281 256C0.988281 304.947 14.7333 350.681 38.5623 389.565H475.414C499.243 350.681 512.988 304.947 512.988 256C512.988 207.053 499.243 161.32 475.414 122.435Z"
                fill="#D80027"
            />
            <Path
                d="M158.484 354.504C212.886 354.504 256.988 310.402 256.988 256C256.988 201.598 212.886 157.496 158.484 157.496C104.082 157.496 59.9802 201.598 59.9802 256C59.9802 310.402 104.082 354.504 158.484 354.504Z"
                fill="#F0F0F0"
            />
            <Path
                d="M158.484 157.496L180.585 225.517H252.223L194.246 267.559L216.52 335.783L158.484 293.541L100.536 335.704L122.722 267.559L64.7972 225.517H136.382L158.484 157.496Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7242">
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
export default SvgKp
