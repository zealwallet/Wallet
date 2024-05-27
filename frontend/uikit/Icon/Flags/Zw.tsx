import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgZw = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7334)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M487.497 146.603C474.491 119.129 456.74 94.346 435.3 73.301L256 55.652L76.6999 73.302C76.1279 73.863 75.5699 74.437 75.0039 75.004L146.604 146.604L256 149.945L487.497 146.603Z"
                fill="#FFDA44"
            />
            <Path
                d="M75.001 436.999C75.943 437.941 76.883 438.884 77.839 439.812L256 456.348L434.159 439.812C455.82 418.812 473.788 394.027 486.977 366.51L155.825 356.174C127.332 384.668 94.468 417.53 75.001 436.999Z"
                fill="#FFDA44"
            />
            <Path
                d="M509.454 219.905L211.478 211.478L256 256C242.813 269.187 223.127 288.873 211.478 300.522L509.298 293.208C511.068 281.059 512 268.639 512 256C512 243.746 511.12 231.7 509.454 219.905Z"
                fill="black"
            />
            <Path
                d="M256 0C186.172 0 122.886 27.97 76.7002 73.302H435.3C389.114 27.97 325.828 0 256 0Z"
                fill="#6DA544"
            />
            <Path
                d="M219.906 219.905H509.455C505.802 194.026 498.286 169.392 487.498 146.603H146.604L219.906 219.905Z"
                fill="#D80027"
            />
            <Path
                d="M145.49 366.51H486.978C497.892 343.738 505.528 319.101 509.299 293.208H218.792C190.405 321.595 166.347 345.653 145.49 366.51Z"
                fill="#D80027"
            />
            <Path
                d="M256 512C325.255 512 388.075 484.488 434.159 439.811H77.8408C123.925 484.488 186.745 512 256 512Z"
                fill="#6DA544"
            />
            <Path
                d="M91.4155 59.934C85.7245 64.716 80.2335 69.729 74.9805 74.98L256 256L74.9805 437.02C80.2325 442.272 85.7245 447.284 91.4155 452.066L287.481 256L91.4155 59.934Z"
                fill="black"
            />
            <Path
                d="M102.925 189.217L119.5 240.233H173.145L129.747 271.765L146.323 322.783L102.925 291.252L59.526 322.783L76.104 271.765L32.707 240.233H86.349L102.925 189.217Z"
                fill="#D80027"
            />
            <Path
                d="M148.519 260.174L105.321 244.87C105.321 244.87 102.129 214.927 101.936 213.912C100.47 206.189 93.683 200.348 85.533 200.348C76.313 200.348 68.837 207.823 68.837 217.044C68.837 218.573 69.06 220.046 69.445 221.454L57.333 233.647H78.869C78.869 256 62.189 256 62.189 278.261L71.442 300.522H127.094L136.37 278.261H136.366C137.295 276.125 137.859 273.922 138.092 271.721C146.088 268.487 148.519 260.174 148.519 260.174Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7334">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgZw
