import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgGr = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7165)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 189.217H503.181C496.762 165.403 487.006 142.962 474.426 122.434H256V189.217Z"
                fill="#338AF3"
            />
            <Path
                d="M96.6432 456.348H415.356C438.719 437.74 458.755 415.138 474.425 389.565H37.5742C53.2452 415.137 73.2812 437.74 96.6432 456.348Z"
                fill="#338AF3"
            />
            <Path
                d="M89.0432 61.939C68.9172 79.27 51.5182 99.679 37.5742 122.435H89.0432V61.939Z"
                fill="#338AF3"
            />
            <Path
                d="M256 256C256 229.924 256 208.101 256 189.217H155.826V256H89.043V189.217H8.819C3.08 210.511 0 232.893 0 256C0 279.107 3.08 301.489 8.819 322.783H503.182C508.92 301.489 512 279.107 512 256H256Z"
                fill="#338AF3"
            />
            <Path
                d="M256 0C220.451 0 186.596 7.253 155.826 20.348V122.435H256C256 99.123 256 79.296 256 55.652H415.357C371.626 20.824 316.249 0 256 0Z"
                fill="#338AF3"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7165">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgGr
