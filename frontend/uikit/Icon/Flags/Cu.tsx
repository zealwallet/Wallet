import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgCu = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7133)">
            <Path
                d="M0.001 44.522H0V467.478H0.001V256.001V44.522Z"
                fill="#FF9811"
            />
            <Path
                d="M255.999 511.999C397.383 511.999 511.998 397.384 511.998 256C511.998 114.616 397.383 0.000976562 255.999 0.000976562C114.615 0.000976562 0 114.616 0 256C0 397.384 114.615 511.999 255.999 511.999Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256.001 0.00201416C172.249 0.00201416 97.8954 40.225 51.1904 102.402H460.811C414.107 40.224 339.752 0.00201416 256.001 0.00201416Z"
                fill="#0052B4"
            />
            <Path
                d="M256.001 511.999C339.753 511.999 414.107 471.776 460.812 409.599H51.1904C97.8944 471.777 172.249 511.999 256.001 511.999Z"
                fill="#0052B4"
            />
            <Path
                d="M0.000976562 256.001C0.000976562 273.536 1.76898 290.658 5.12798 307.201H506.875C510.234 290.658 512.001 273.536 512.001 256.001C512.001 238.466 510.233 221.344 506.875 204.801H5.12798C1.76898 221.344 0.000976562 238.466 0.000976562 256.001Z"
                fill="#0052B4"
            />
            <Path
                d="M74.9807 74.982C-24.9923 174.955 -24.9923 337.046 74.9807 437.021C116.294 395.708 156.026 355.975 256 256.002L74.9807 74.982Z"
                fill="#D80027"
            />
            <Path
                d="M103.611 189.219L120.185 240.234H173.831L130.434 271.766L147.008 322.782L103.611 291.252L60.2116 322.782L76.7896 271.766L33.3916 240.234H87.0336L103.611 189.219Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7133">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgCu
