import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgBq = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7103)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M74.9798 74.98C20.1148 129.845 -4.63219 203.419 0.720809 275.165L275.164 0.722029C203.418 -4.63197 129.845 20.115 74.9798 74.98Z"
                fill="#FFDA44"
            />
            <Path
                d="M91.4102 452.071C191.991 536.693 342.35 531.688 437.02 437.019C531.69 342.35 536.695 191.99 452.072 91.4099L91.4102 452.071Z"
                fill="#0052B4"
            />
            <Path
                d="M255.087 245.689L277.148 233.739L255.087 221.789C249.936 188.328 223.498 161.889 190.037 156.739L178.086 134.677L166.136 156.738C132.676 161.888 106.238 188.327 101.086 221.788L79.0244 233.739L101.085 245.689C106.236 279.15 132.674 305.589 166.135 310.739L178.086 332.801L190.036 310.74C223.498 305.589 249.936 279.15 255.087 245.689ZM178.087 278.261C153.498 278.261 133.565 258.329 133.565 233.739C133.565 209.149 153.497 189.217 178.087 189.217C202.677 189.217 222.609 209.149 222.609 233.739C222.609 258.329 202.676 278.261 178.087 278.261Z"
                fill="black"
            />
            <Path
                d="M178.087 200.348L187.726 217.043H207.005L197.365 233.739L207.005 250.435H187.726L178.087 267.13L168.448 250.435H149.17L158.809 233.739L149.17 217.043H168.448L178.087 200.348Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7103">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgBq
