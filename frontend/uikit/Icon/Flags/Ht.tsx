import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgHt = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7174)">
            <Path
                d="M512 256C512 397.384 397.384 512 256 512C114.616 512 0 397.384 0 256C0 114.616 256 0 256 0C256 0 512 114.616 512 256Z"
                fill="#A2001D"
            />
            <Path
                d="M0 256C0 114.616 114.616 0 256 0C397.384 0 512 114.616 512 256"
                fill="#0052B4"
            />
            <Path
                d="M345.043 322.783L256 311.652L166.957 322.783V189.217H345.043V322.783Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 311.652C280.588 311.652 300.522 291.719 300.522 267.13C300.522 242.541 280.588 222.608 256 222.608C231.411 222.608 211.478 242.541 211.478 267.13C211.478 291.719 231.411 311.652 256 311.652Z"
                fill="#0052B4"
            />
            <Path
                d="M256 289.391C268.295 289.391 278.261 279.424 278.261 267.13C278.261 254.835 268.295 244.869 256 244.869C243.706 244.869 233.739 254.835 233.739 267.13C233.739 279.424 243.706 289.391 256 289.391Z"
                fill="#A2001D"
            />
            <Path
                d="M222.609 211.478H289.391L256 244.87L222.609 211.478Z"
                fill="#6DA544"
            />
            <Path
                d="M244.87 233.739H267.131V300.522H244.87V233.739Z"
                fill="#FFDA44"
            />
            <Path
                d="M291.617 293.843H220.381L166.957 322.783H345.043L291.617 293.843Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7174">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgHt
