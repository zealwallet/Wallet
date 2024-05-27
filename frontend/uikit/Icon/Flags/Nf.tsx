import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgNf = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7241)">
            <Path
                d="M368.292 25.402C334.636 9.128 296.879 0 256.988 0C217.097 0 179.34 9.128 145.684 25.402L123.423 256L145.684 486.598C179.34 502.872 217.097 512 256.988 512C296.879 512 334.636 502.872 368.292 486.598L390.553 256L368.292 25.402Z"
                fill="#F0F0F0"
            />
            <Path
                d="M145.684 25.4109C60.0533 66.8169 0.988281 154.506 0.988281 256C0.988281 357.494 60.0533 445.183 145.684 486.589V25.4109Z"
                fill="#6DA544"
            />
            <Path
                d="M368.292 25.4109V486.589C453.923 445.183 512.988 357.493 512.988 256C512.988 154.507 453.923 66.8169 368.292 25.4109Z"
                fill="#6DA544"
            />
            <Path
                d="M323.771 333.913L256.988 122.435L190.205 333.913H240.292V389.565H273.684V333.913H323.771Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7241">
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
export default SvgNf
