import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgPr = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7260)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0C172.248 0 97.893 40.223 51.189 102.4H460.811C414.107 40.223 339.752 0 256 0Z"
                fill="#D80027"
            />
            <Path
                d="M256 512C339.752 512 414.107 471.777 460.811 409.6H51.189C97.893 471.777 172.248 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M0 256C0 273.535 1.768 290.657 5.127 307.2H506.875C510.234 290.657 512 273.535 512 256C512 238.465 510.232 221.343 506.874 204.8H5.127C1.768 221.343 0 238.465 0 256H0Z"
                fill="#D80027"
            />
            <Path
                d="M74.98 74.98C-24.994 174.954 -24.994 337.045 74.98 437.02C116.293 395.707 156.026 355.974 256 256L74.98 74.98Z"
                fill="#0052B4"
            />
            <Path
                d="M103.61 189.217L120.185 240.233H173.831L130.433 271.765L147.007 322.783L103.61 291.252L60.211 322.783L76.789 271.765L33.391 240.233H87.033L103.61 189.217Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7260">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgPr
