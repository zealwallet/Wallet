import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgIr = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7182)">
            <Path
                d="M256 512.001C397.385 512.001 512 397.386 512 256.001C512 114.616 397.385 0.000976562 256 0.000976562C114.615 0.000976562 0 114.616 0 256.001C0 397.386 114.615 512.001 256 512.001Z"
                fill="#F0F0F0"
            />
            <Path
                d="M339.147 189.218H305.653C305.93 192.899 306.087 196.613 306.087 200.348C306.087 225.112 299.897 249.115 289.106 266.201C285.777 271.471 280.183 278.913 272.695 283.933V189.217H239.304V283.933C231.817 278.913 226.222 271.472 222.893 266.201C212.101 249.115 205.912 225.112 205.912 200.348C205.912 196.613 206.07 192.898 206.346 189.218H172.852C172.637 192.881 172.52 196.591 172.52 200.348C172.52 269.004 209.188 322.783 255.998 322.783C302.808 322.783 339.476 269.004 339.476 200.348C339.478 196.591 339.361 192.881 339.147 189.218Z"
                fill="#D80027"
            />
            <Path
                d="M105.739 122.436H139.13V144.697H172.521V122.436H205.912V144.697H239.303V122.436H272.694V144.697H306.085V122.436H339.476V144.697H372.867V122.436H406.258V144.697H486.595C445.19 59.066 357.493 0.000976562 256 0.000976562C154.507 0.000976562 66.8099 59.066 25.4019 144.697H105.739V122.436Z"
                fill="#6DA544"
            />
            <Path
                d="M406.261 367.305V389.566H372.87V367.305H339.479V389.566H306.088V367.305H272.697V389.566H239.306V367.305H205.915V389.566H172.524V367.305H139.13V389.566H105.739V367.305H25.4019C66.8099 452.936 154.506 512.001 256 512.001C357.494 512.001 445.19 452.936 486.598 367.305H406.261Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7182">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 0.000976562)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgIr