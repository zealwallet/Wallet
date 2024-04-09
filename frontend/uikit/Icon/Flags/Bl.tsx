import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgBl = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7294)">
            <Path
                d="M255.79 511.581C397.059 511.581 511.58 397.06 511.58 255.791C511.58 114.522 397.059 0.000976562 255.79 0.000976562C114.521 0.000976562 0 114.522 0 255.791C0 397.06 114.521 511.581 255.79 511.581Z"
                fill="#F0F0F0"
            />
            <Path
                d="M456.714 205.745H372.563C372.563 190.39 360.115 177.942 344.76 177.942L322.517 222.427C322.517 222.427 346.243 289.155 345.501 289.155H373.304C388.66 289.155 401.107 276.708 401.107 261.352C416.463 261.352 428.91 248.905 428.91 233.549H427.984C443.339 233.548 456.714 221.101 456.714 205.745Z"
                fill="#ACABB1"
            />
            <Path
                d="M54.8652 205.745H139.016C139.016 190.39 151.464 177.942 166.819 177.942L189.062 222.427C189.062 222.427 165.336 289.155 166.078 289.155H138.275C122.919 289.155 110.472 276.708 110.472 261.352C95.1162 261.352 82.6692 248.905 82.6692 233.549H83.5952C68.2392 233.548 54.8652 221.101 54.8652 205.745Z"
                fill="#ACABB1"
            />
            <Path
                d="M344.76 355.882V367.003H166.819V355.882H122.334V400.367H166.819V411.488H344.76V400.367H389.245V355.882H344.76Z"
                fill="#FFDA44"
            />
            <Path
                d="M166.819 177.941V289.153C166.819 357.256 255.789 378.124 255.789 378.124C255.789 378.124 344.759 357.256 344.759 289.153V177.941L255.789 166.82L166.819 177.941Z"
                fill="#0052B4"
            />
            <Path
                d="M166.82 222.431H344.76V289.159H166.82V222.431Z"
                fill="#D80027"
            />
            <Path
                d="M300.274 122.335V139.017L289.153 144.578L278.032 133.456V100.092H233.547V133.456L222.426 144.578L211.304 139.017V122.335H166.819V177.941H344.76V122.335H300.274Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7294">
                <Rect
                    width={511.58}
                    height={511.58}
                    fill="white"
                    transform="translate(0 0.000976562)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgBl