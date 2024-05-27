import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgUg = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7318)">
            <Path
                d="M446.793 426.666C487.336 381.374 512 321.572 512 256C512 190.428 487.335 130.625 446.792 85.333L256 66.783L65.208 85.333C24.665 130.625 0 190.428 0 256C0 321.572 24.664 381.374 65.207 426.666L256 445.217L446.793 426.666Z"
                fill="#FFDA44"
            />
            <Path
                d="M65.208 85.333H446.793C399.918 32.966 331.813 0 256 0C180.187 0 112.082 32.966 65.208 85.333Z"
                fill="black"
            />
            <Path
                d="M0 256L256 278.261L512 256C512 226.076 506.849 197.358 497.412 170.666H14.588C5.151 197.358 0 226.076 0 256H0Z"
                fill="#D80027"
            />
            <Path
                d="M14.588 341.333H497.414C506.849 314.641 512 285.924 512 256H0C0 285.924 5.151 314.641 14.588 341.333Z"
                fill="black"
            />
            <Path
                d="M446.793 426.666H65.207C112.081 479.034 180.186 512 256 512C331.814 512 399.919 479.034 446.793 426.666Z"
                fill="#D80027"
            />
            <Path
                d="M341.426 256C341.426 303.183 303.183 341.426 256 341.426C208.817 341.426 170.574 303.183 170.574 256C170.574 208.817 208.817 170.574 256 170.574C303.183 170.574 341.426 208.817 341.426 256Z"
                fill="#F0F0F0"
            />
            <Path
                d="M287.295 260.356L256 246.795C256 246.795 263.322 222.492 263.712 220.829C263.997 219.614 264.149 218.347 264.149 217.045C264.149 212.434 262.28 208.26 259.258 205.24L267.128 197.37C262.093 192.335 255.136 189.22 247.452 189.22C239.768 189.22 232.811 192.334 227.776 197.37L235.646 205.24C232.624 208.261 230.756 212.435 230.756 217.045C230.756 218.731 231.011 220.356 231.476 221.891L219.627 233.739H241.163C241.163 233.739 232.259 247.113 227.398 258.096C222.537 269.078 227.465 282.485 238.699 287.479L245.195 290.366L256 300.522V311.652L244.87 322.782H267.131V300.521L277.288 290.364H298.296C298.397 290.155 298.503 289.951 298.599 289.737C303.59 278.504 298.53 265.348 287.295 260.356Z"
                fill="black"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7318">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgUg
