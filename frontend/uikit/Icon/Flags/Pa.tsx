import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgPa = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7252)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M0 256C0 397.384 114.616 512 256 512C256 414.645 256 256 256 256C256 256 89.043 256 0 256Z"
                fill="#0052B4"
            />
            <Path
                d="M256 0C397.384 0 512 114.616 512 256C414.645 256 256 256 256 256C256 256 256 89.043 256 0Z"
                fill="#D80027"
            />
            <Path
                d="M152.389 89.043L168.966 140.061H222.609L179.211 171.591L195.787 222.609L152.389 191.078L108.991 222.609L125.567 171.591L82.1689 140.061H135.812L152.389 89.043Z"
                fill="#0052B4"
            />
            <Path
                d="M359.611 289.391L376.188 340.409H429.831L386.432 371.939L403.009 422.957L359.611 391.426L316.213 422.957L332.789 371.939L289.391 340.409H343.034L359.611 289.391Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7252">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgPa
