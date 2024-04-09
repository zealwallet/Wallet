import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgMp = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7244)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#338AF3"
            />
            <Path
                d="M247.93 417.19C241.029 416.856 235.319 412.371 233.082 406.282C229.131 411.435 222.341 414.029 215.652 412.304C208.951 410.579 204.266 405.036 203.297 398.602C198.377 402.853 191.209 404.01 185.01 400.973C178.799 397.923 175.327 391.544 175.683 385.055C170.018 388.238 162.761 387.927 157.296 383.697C151.842 379.467 149.716 372.533 151.363 366.244C145.174 368.225 138.14 366.467 133.632 361.224C129.124 355.993 128.433 348.769 131.306 342.948C124.85 343.637 118.306 340.499 114.944 334.467C111.571 328.434 112.351 321.211 116.346 316.078C109.879 315.455 104.091 311.058 102.021 304.469C99.9402 297.88 102.166 290.957 107.119 286.738C100.908 284.822 96.1442 279.346 95.4432 272.48C94.7422 265.613 98.3042 259.302 103.991 256.163C98.3031 253.046 94.7192 246.736 95.3982 239.879H95.4091C96.0881 233 100.852 227.514 107.051 225.576C102.098 221.369 99.8501 214.457 101.909 207.867C103.968 201.267 109.744 196.859 116.212 196.213C112.216 191.093 111.415 183.868 114.765 177.826C118.115 171.793 124.66 168.643 131.127 169.322C128.233 163.501 128.912 156.277 133.409 151.024C137.895 145.782 144.929 144.012 151.129 145.971C149.459 139.693 151.574 132.748 157.028 128.508C162.471 124.266 169.728 123.943 175.393 127.104C175.026 120.616 178.487 114.237 184.687 111.176C190.876 108.126 198.055 109.262 202.985 113.513C203.931 107.081 208.617 101.516 215.306 99.778C221.984 98.042 228.774 100.613 232.736 105.755C234.973 99.667 240.672 95.17 247.573 94.825C254.463 94.47 260.584 98.342 263.434 104.165C266.84 98.644 273.318 95.372 280.141 96.407C286.975 97.431 292.218 102.461 293.843 108.751C298.295 104.008 305.307 102.128 311.785 104.509C318.274 106.902 322.392 112.89 322.704 119.39C328.013 115.651 335.27 115.216 341.136 118.867C347.002 122.507 349.818 129.196 348.816 135.618C354.771 133.025 361.961 134.06 366.97 138.801C371.979 143.554 373.403 150.666 371.133 156.754C377.488 155.407 384.323 157.856 388.285 163.521C392.247 169.175 392.214 176.432 388.775 181.942C395.264 181.897 401.464 185.682 404.213 192.015C406.951 198.359 405.448 205.472 400.963 210.18C407.341 211.449 412.65 216.402 414.052 223.169C415.443 229.936 412.538 236.581 407.207 240.288C413.173 242.816 417.38 248.725 417.391 255.626V255.849V255.994C417.391 262.894 413.206 268.816 407.24 271.365C412.583 275.05 415.51 281.694 414.119 288.461C412.739 295.228 407.441 300.193 401.063 301.484C405.56 306.181 407.085 313.282 404.358 319.638C401.631 325.982 395.431 329.778 388.931 329.744C392.381 335.254 392.437 342.511 388.486 348.176C384.535 353.843 377.712 356.313 371.356 354.977C373.638 361.054 372.224 368.178 367.227 372.942C362.218 377.696 355.039 378.741 349.084 376.17C350.097 382.581 347.292 389.282 341.437 392.944C335.582 396.606 328.325 396.182 323.005 392.454C322.704 398.954 318.608 404.954 312.131 407.358C305.654 409.762 312.131 407.358 312.12 407.358C305.642 409.751 298.63 407.882 294.167 403.152C292.564 409.452 287.333 414.493 280.499 415.54C273.676 416.575 267.187 413.325 263.77 407.804C261.054 413.403 255.311 417.209 248.766 417.209C248.487 417.213 248.209 417.202 247.93 417.19Z"
                fill="#F3F3F3"
            />
            <Path
                d="M256 367.304C317.471 367.304 367.304 317.472 367.304 256C367.304 194.529 317.471 144.696 256 144.696C194.528 144.696 144.696 194.529 144.696 256C144.696 317.472 194.528 367.304 256 367.304Z"
                fill="#338AF3"
            />
            <Path
                d="M280.363 218.219C285.831 214.163 289.391 207.68 289.391 200.348V189.218C289.391 176.923 279.425 166.957 267.13 166.957H244.87C232.575 166.957 222.609 176.923 222.609 189.218V200.348C222.609 207.68 226.169 214.163 231.637 218.219L211.479 422.956C211.479 422.956 222.609 434.088 256.001 434.088C289.393 434.088 300.523 422.956 300.523 422.956L280.363 218.219Z"
                fill="#BDBCC1"
            />
            <Path
                d="M255.999 166.957L275.337 226.475H337.922L287.292 263.263L306.629 322.783L255.999 285.998L205.367 322.783L224.708 263.263L174.077 226.475H236.66L255.999 166.957Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7244">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgMp
