import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgCw = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7134)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 512C340 512 414.549 471.542 461.229 409.051H50.7715C97.4515 471.542 172 512 256 512Z"
                fill="#0052B4"
            />
            <Path
                d="M512 256C512 114.616 397.384 0 256 0C114.616 0 0 114.616 0 256C0 286.273 5.269 315.312 14.916 342.269H497.083C506.731 315.312 512 286.273 512 256Z"
                fill="#0052B4"
            />
            <Path
                d="M175.222 164.182L189.035 206.694H233.739L197.574 232.972L211.387 275.486L175.222 249.21L139.057 275.486L152.872 232.972L116.707 206.694H161.409L175.222 164.182Z"
                fill="#F0F0F0"
            />
            <Path
                d="M98.4537 119.66L106.742 145.168H133.565L111.866 160.934L120.154 186.443L98.4537 170.677L76.7547 186.443L85.0437 160.934L63.3457 145.168H90.1677L98.4537 119.66Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7134">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgCw
