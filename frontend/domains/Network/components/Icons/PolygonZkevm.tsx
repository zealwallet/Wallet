import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

type Props = {
    size: number
}

export const PolygonZkevm = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle cx="60" cy="60" r="60" fill="#F2F6FB" />
            <Path
                d="M78.0026 47.9496C76.7232 47.2136 75.0783 47.2136 73.6162 47.9496L63.3812 54.0208L56.436 57.8843L46.3838 63.9555C45.1044 64.6914 43.4595 64.6914 41.9974 63.9555L34.1384 59.1721C32.859 58.4362 31.9452 56.9644 31.9452 55.3086V46.1098C31.9452 44.638 32.6762 43.1662 34.1384 42.2463L41.9974 37.6469C43.2768 36.911 44.9217 36.911 46.3838 37.6469L54.2428 42.4303C55.5222 43.1662 56.436 44.638 56.436 46.2938V52.365L63.3812 48.3175V42.0623C63.3812 40.5905 62.6501 39.1187 61.188 38.1988L46.5666 29.5519C45.2872 28.816 43.6423 28.816 42.1802 29.5519L27.1932 38.3828C25.7311 39.1187 25 40.5905 25 42.0623V59.3561C25 60.8279 25.7311 62.2997 27.1932 63.2196L41.9974 71.8665C43.2768 72.6024 44.9217 72.6024 46.3838 71.8665L56.436 65.9792L63.3812 61.9318L73.4334 56.0445C74.7128 55.3086 76.3577 55.3086 77.8198 56.0445L85.6789 60.6439C86.9582 61.3798 87.8721 62.8516 87.8721 64.5074V73.7062C87.8721 75.178 87.141 76.6499 85.6789 77.5697L78.0026 82.1691C76.7232 82.905 75.0783 82.905 73.6162 82.1691L65.7572 77.5697C64.4778 76.8338 63.564 75.362 63.564 73.7062V67.819L56.6188 71.8665V77.9377C56.6188 79.4095 57.3499 80.8813 58.812 81.8012L73.6162 90.4481C74.8956 91.184 76.5405 91.184 78.0026 90.4481L92.8068 81.8012C94.0862 81.0653 95 79.5935 95 77.9377V60.4599C95 58.9881 94.2689 57.5163 92.8068 56.5964L78.0026 47.9496Z"
                fill="#8247E5"
            />
        </Svg>
    )
}
