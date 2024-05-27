import Svg, { Circle, Ellipse, Path } from 'react-native-svg'

type Props = {
    size: number
}

export const Linea = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle cx="60" cy="60" r="60" fill="#0B0B0B" />

            <Path
                fill="#fff"
                fillRule="evenodd"
                d="M41.927 38.49H31V91h49.172V80.136H41.928V38.49Z"
                clipRule="evenodd"
            />

            <Ellipse
                cx="79.92"
                cy="39.022"
                fill="#fff"
                rx="10.08"
                ry="10.022"
            />
        </Svg>
    )
}
