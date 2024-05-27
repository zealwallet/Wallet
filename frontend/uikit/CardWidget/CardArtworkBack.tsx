import React from 'react'
import Svg, {
    ClipPath,
    Defs,
    G,
    LinearGradient,
    Path,
    Rect,
    Stop,
} from 'react-native-svg'

export const CardArtworkBack = () => {
    return (
        <Svg viewBox="0 0 359 200" fill="none">
            <G clipPath="url(#clip0_1224_79865)">
                <G clipPath="url(#clip1_1224_79865)">
                    <Rect
                        x="0.251953"
                        width="358"
                        height="200"
                        rx="20"
                        fill="url(#paint0_linear_1224_79865)"
                    />
                    <Rect
                        x="0.251953"
                        width="355"
                        height="200"
                        fill="url(#paint1_linear_1224_79865)"
                    />
                    <Rect
                        x="0.251953"
                        width="357.496"
                        height="64"
                        fill="black"
                    />
                </G>
                <Rect
                    x="0.751953"
                    y="0.5"
                    width="357"
                    height="199"
                    rx="19.5"
                    stroke="url(#paint2_linear_1224_79865)"
                />

                <Path
                    d="M307.638 166.32L300.332 183.728H295.566L291.972 169.834C291.753 168.979 291.565 168.666 290.9 168.306C289.816 167.718 288.026 167.168 286.452 166.824L286.559 166.32H294.232C294.733 166.32 295.218 166.499 295.599 166.824C295.98 167.149 296.233 167.6 296.31 168.095L298.21 178.169L302.902 166.32H307.638ZM326.314 178.046C326.333 173.45 319.953 173.197 319.997 171.144C320.011 170.519 320.606 169.855 321.908 169.685C323.434 169.541 324.971 169.81 326.356 170.466L327.147 166.773C325.798 166.267 324.37 166.005 322.929 166C318.472 166 315.336 168.369 315.308 171.757C315.28 174.263 317.547 175.658 319.256 176.494C321.013 177.347 321.604 177.895 321.595 178.656C321.583 179.827 320.195 180.34 318.898 180.361C316.631 180.396 315.317 179.75 314.266 179.263L313.45 183.076C314.503 183.559 316.447 183.981 318.463 184C323.199 184 326.298 181.664 326.314 178.046ZM338.081 183.728H342.252L338.614 166.32H334.763C334.352 166.317 333.949 166.436 333.606 166.664C333.264 166.892 332.998 167.217 332.843 167.598L326.079 183.728H330.813L331.755 181.127H337.539L338.081 183.728ZM333.052 177.56L335.424 171.023L336.791 177.56H333.052ZM314.08 166.32L310.353 183.728H305.843L309.574 166.32H314.08Z"
                    fill="white"
                />
            </G>
            <Defs>
                <LinearGradient
                    id="paint0_linear_1224_79865"
                    x1="358.252"
                    y1="99.5555"
                    x2="-6.74805"
                    y2="99.5555"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#333330" />
                    <Stop offset="1" stopColor="#010000" />
                </LinearGradient>
                <LinearGradient
                    id="paint1_linear_1224_79865"
                    x1="355.252"
                    y1="108.889"
                    x2="0.251987"
                    y2="108.889"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop
                        offset="0.198868"
                        stopColor="#141413"
                        stopOpacity="0"
                    />
                    <Stop offset="1" stopColor="#030202" />
                </LinearGradient>
                <LinearGradient
                    id="paint2_linear_1224_79865"
                    x1="0.251953"
                    y1="0"
                    x2="333.209"
                    y2="235.418"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#31312E" />
                    <Stop offset="0.51717" stopColor="#53534D" />
                    <Stop offset="1" stopColor="#31312E" />
                </LinearGradient>
                <ClipPath id="clip0_1224_79865">
                    <Rect
                        x="0.251953"
                        width="358"
                        height="200"
                        rx="20"
                        fill="white"
                    />
                </ClipPath>
                <ClipPath id="clip1_1224_79865">
                    <Rect
                        x="0.251953"
                        width="358"
                        height="200"
                        rx="20"
                        fill="white"
                    />
                </ClipPath>
                <ClipPath id="clip2_1224_79865">
                    <Rect
                        x="16.252"
                        y="112"
                        width="191"
                        height="20"
                        rx="5"
                        fill="white"
                    />
                </ClipPath>
                <ClipPath id="clip3_1224_79865">
                    <Rect
                        x="16.252"
                        y="164"
                        width="68"
                        height="20"
                        rx="5"
                        fill="white"
                    />
                </ClipPath>
                <ClipPath id="clip4_1224_79865">
                    <Rect
                        x="109.252"
                        y="164"
                        width="52"
                        height="20"
                        rx="5"
                        fill="white"
                    />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
