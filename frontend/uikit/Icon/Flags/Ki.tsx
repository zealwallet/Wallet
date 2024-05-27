import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgKi = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7195)">
            <Path
                d="M0 256C0 114.616 114.616 0 256 0C397.384 0 512 114.616 512 256"
                fill="#D80027"
            />
            <Path
                d="M345.043 238.078L308.658 255.191L328.034 290.43L288.525 282.871L283.519 322.783L256 293.428L228.48 322.783L223.475 282.871L183.966 290.428L203.341 255.191L166.957 238.078L203.341 220.962L183.966 185.727L223.474 193.283L228.481 153.373L256 182.726L283.52 153.373L288.525 193.283L328.035 185.727L308.661 220.965L345.043 238.078Z"
                fill="#FFDA44"
            />
            <Path
                d="M322.783 83.4782H272.696C272.696 74.2592 265.22 66.7822 256 66.7822C246.78 66.7822 239.304 74.2582 239.304 83.4782H189.217C189.217 92.6982 197.249 100.174 206.469 100.174H205.912C205.912 109.394 213.386 116.87 222.608 116.87C222.608 126.09 230.082 133.566 239.304 133.566H272.695C281.914 133.566 289.391 126.091 289.391 116.87C298.61 116.87 306.087 109.395 306.087 100.174H305.53C314.751 100.174 322.783 92.6992 322.783 83.4782Z"
                fill="#FFDA44"
            />
            <Path
                d="M512 256C512 397.384 397.384 512 256 512C114.616 512 0 397.384 0 256H512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 512C336.022 512 407.456 475.276 454.402 417.772C445.958 412.015 441.399 402.709 426.663 402.709C405.33 402.709 405.33 422.215 383.998 422.215C362.666 422.215 362.665 402.709 341.333 402.709C320 402.709 320 422.215 298.666 422.215C277.332 422.215 277.331 402.709 255.996 402.709C234.663 402.709 234.663 422.215 213.331 422.215C192.001 422.215 192.001 402.709 170.668 402.709C149.333 402.709 149.333 422.215 127.998 422.215C106.663 422.215 106.663 402.709 85.3277 402.709C70.5937 402.709 66.0347 412.013 57.5947 417.77C104.539 475.276 175.977 512 256 512Z"
                fill="#0052B4"
            />
            <Path
                d="M469.33 288.65C447.997 288.65 447.997 269.144 426.663 269.144C405.33 269.144 405.33 288.65 383.998 288.65C362.666 288.65 362.665 269.144 341.333 269.144C320 269.144 320 288.65 298.666 288.65C277.332 288.65 277.331 269.144 255.996 269.144C234.663 269.144 234.663 288.65 213.331 288.65C192.001 288.65 192.001 269.144 170.668 269.144C149.333 269.144 149.333 288.65 127.998 288.65C106.663 288.65 106.663 269.144 85.328 269.144C63.998 269.144 63.998 288.65 42.665 288.65C21.447 288.65 21.324 269.359 0.333008 269.153C0.924008 280.863 2.32201 292.359 4.43601 303.601C21.44 306.1 22.929 322.783 42.666 322.783C63.999 322.783 63.999 303.279 85.329 303.279C106.664 303.279 106.664 322.783 127.999 322.783C149.334 322.783 149.334 303.279 170.669 303.279C192.002 303.279 192.002 322.783 213.332 322.783C234.665 322.783 234.665 303.279 255.997 303.279C277.332 303.279 277.332 322.783 298.667 322.783C320.002 322.783 320.002 303.279 341.334 303.279C362.667 303.279 362.667 322.783 383.999 322.783C405.331 322.783 405.332 303.279 426.664 303.279C447.999 303.279 447.999 322.783 469.331 322.783C489.07 322.783 490.559 306.101 507.564 303.602C509.679 292.359 511.075 280.864 511.669 269.154C490.674 269.361 490.549 288.65 469.33 288.65Z"
                fill="#0052B4"
            />
            <Path
                d="M426.663 335.927C405.33 335.927 405.33 355.433 383.998 355.433C362.666 355.433 362.665 335.927 341.333 335.927C320 335.927 320 355.433 298.666 355.433C277.331 355.433 277.331 335.927 255.996 335.927C234.663 335.927 234.663 355.433 213.331 355.433C192.001 355.433 192.001 335.927 170.668 335.927C149.333 335.927 149.333 355.433 127.998 355.433C106.663 355.433 106.663 335.927 85.328 335.927C63.998 335.927 63.998 355.433 42.665 355.433C27.422 355.433 23.068 345.477 14.043 339.789C20.051 357.148 27.867 373.661 37.28 389.097C38.917 389.399 40.699 389.566 42.665 389.566C63.998 389.566 63.998 370.062 85.328 370.062C106.663 370.062 106.663 389.566 127.998 389.566C149.333 389.566 149.333 370.062 170.668 370.062C192.001 370.062 192.001 389.566 213.331 389.566C234.664 389.566 234.664 370.062 255.996 370.062C277.331 370.062 277.331 389.566 298.666 389.566C320.001 389.566 320.001 370.062 341.333 370.062C362.666 370.062 362.666 389.566 383.998 389.566C405.33 389.566 405.331 370.062 426.663 370.062C447.998 370.062 447.998 389.566 469.33 389.566C471.298 389.566 473.08 389.399 474.717 389.096C484.13 373.661 491.945 357.148 497.956 339.79C488.93 345.475 484.575 355.433 469.33 355.433C447.998 355.433 447.998 335.927 426.663 335.927Z"
                fill="#0052B4"
            />
            <Path
                d="M511.206 235.775C490.676 236.26 490.393 255.259 469.33 255.259C447.997 255.259 447.997 235.753 426.663 235.753C405.33 235.753 405.33 255.259 383.998 255.259C362.666 255.259 362.665 235.753 341.333 235.753C320 235.753 320 255.259 298.666 255.259C277.332 255.259 277.331 235.753 255.996 235.753C234.663 235.753 234.663 255.259 213.331 255.259C192.001 255.259 192.001 235.753 170.668 235.753C149.333 235.753 149.333 255.259 127.998 255.259C106.663 255.259 106.663 235.753 85.328 235.753C63.998 235.753 63.998 255.259 42.665 255.259C21.606 255.259 21.321 236.262 0.793 235.775C0.272 242.449 0 249.193 0 256C0 260.663 0.132 265.296 0.381 269.897C21.324 270.132 21.463 289.391 42.666 289.391C63.999 289.391 63.999 269.887 85.329 269.887C106.664 269.887 106.664 289.391 127.999 289.391C149.334 289.391 149.334 269.887 170.669 269.887C192.002 269.887 192.002 289.391 213.332 289.391C234.665 289.391 234.665 269.887 255.997 269.887C277.332 269.887 277.332 289.391 298.667 289.391C320.002 289.391 320.002 269.887 341.334 269.887C362.667 269.887 362.667 289.391 383.999 289.391C405.331 289.391 405.332 269.887 426.664 269.887C447.999 269.887 447.999 289.391 469.331 289.391C490.536 289.391 490.675 270.132 511.622 269.897C511.868 265.295 512 260.663 512 256C512 249.193 511.728 242.449 511.206 235.775Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7195">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgKi
