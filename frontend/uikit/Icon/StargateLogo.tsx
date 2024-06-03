import React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const StargateLogo = ({ size, color }: Props) => {
    return (
        <SvgIcon viewBox="0 0 120 120" width={size} height={size} fill="none">
            <Rect width="120" height="120" fill="black" />
            <G clipPath="url(#clip0_1060_517)">
                <Path
                    d="M68.7319 19.5017L71.0743 24.9867C75.671 35.7561 84.2492 44.3342 95.0186 48.931L100.504 51.2734C101.94 51.8861 103.105 52.7628 104.005 53.8086C101.275 34.2216 85.7836 18.7306 66.1967 16C67.2398 16.8979 68.1192 18.0651 68.7319 19.5017ZM19.5017 51.2734L24.9867 48.931C35.7566 44.3341 44.3356 35.7561 48.9336 24.9867L51.2734 19.5017C51.8384 18.1553 52.7058 16.9571 53.8086 16C34.2216 18.7306 18.7306 34.2216 16 53.8086C16.8979 52.7628 18.0651 51.8861 19.5017 51.2734ZM100.506 68.7239L95.0186 71.0663C84.2487 75.6637 75.6705 84.2429 71.0743 95.0133L68.7319 100.496C68.1674 101.843 67.2998 103.042 66.1967 104C85.7836 101.267 101.275 85.7757 104.005 66.1888C103.107 67.2345 101.94 68.1113 100.504 68.7239H100.506ZM51.2734 100.498L48.9336 95.0133C44.3359 84.243 35.757 75.6641 24.9867 71.0663L19.5017 68.7239C18.1547 68.1601 16.9562 67.2924 16 66.1888C18.7306 85.7757 34.2216 101.269 53.8086 104C52.7065 103.042 51.8392 101.844 51.2734 100.498Z"
                    fill="#999999"
                />
                <Path
                    d="M40.0393 55.6996L42.7409 54.5455C48.0484 52.2804 52.2763 48.0534 54.5427 42.7463L55.6941 40.0448C57.3102 36.2579 62.679 36.2579 64.2952 40.0448L65.4466 42.7463C67.7129 48.0534 71.9409 52.2804 77.2484 54.5455L79.9526 55.6996C83.7369 57.3157 83.7369 62.6819 79.9526 64.2981L77.2484 65.4521C71.9401 67.7174 67.7119 71.9456 65.4466 77.2539L64.2952 79.9555C62.679 83.7398 57.3102 83.7398 55.6941 79.9555L54.5427 77.2539C52.2774 71.9456 48.0492 67.7174 42.7409 65.4521L40.0393 64.2981C36.2524 62.6819 36.2524 57.3157 40.0393 55.6996Z"
                    fill="white"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_1060_517">
                    <Rect
                        width="88"
                        height="88"
                        fill="white"
                        transform="translate(16 16)"
                    />
                </ClipPath>
            </Defs>
        </SvgIcon>
    )
}