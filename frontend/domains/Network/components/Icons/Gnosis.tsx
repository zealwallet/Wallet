import React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

type Props = {
    size: number
}

export const Gnosis = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Rect width="120" height="120" rx="60" fill="#04795B" />
            <G clipPath="url(#clip0_902_449)">
                <Path
                    d="M43.5269 65.4992C45.9156 65.4992 48.1206 64.7033 49.8969 63.3256L35.3193 48.7532C33.9411 50.4983 33.1449 52.7024 33.1449 55.121C33.1143 60.8458 37.7693 65.4992 43.5269 65.4992Z"
                    fill="white"
                />
                <Path
                    d="M86.8923 55.0903C86.8923 52.7025 86.096 50.4983 84.7179 48.7227L70.1402 63.2949C71.886 64.6726 74.091 65.4685 76.5104 65.4685C82.2372 65.4991 86.8923 60.8459 86.8923 55.0903Z"
                    fill="white"
                />
                <Path
                    d="M94.2424 39.2629L87.7804 45.7226C89.9242 48.2941 91.2105 51.5392 91.2105 55.1518C91.2105 63.2644 84.6261 69.8465 76.5103 69.8465C72.9271 69.8465 69.6502 68.5607 67.0777 66.4177L60.0032 73.4895L52.9287 66.4177C50.3563 68.5607 47.1099 69.8465 43.4962 69.8465C35.3804 69.8465 28.7959 63.2644 28.7959 55.1518C28.7959 51.5698 30.0822 48.2941 32.2261 45.7226L28.9185 42.4163L25.7641 39.2629C22.089 45.3246 19.9759 52.3965 19.9759 59.9888C19.9759 82.0922 37.8916 99.9708 59.9726 99.9708C82.0534 99.9708 99.9692 82.0616 99.9692 59.9888C100.031 52.3659 97.9174 45.294 94.2424 39.2629Z"
                    fill="white"
                />
                <Path
                    d="M88.9442 32.375C81.6861 24.7521 71.3959 19.9763 60.0033 19.9763C48.6106 19.9763 38.3512 24.7521 31.0624 32.375C30.0823 33.416 29.133 34.5181 28.2448 35.6508L59.9727 67.3669L91.7005 35.6201C90.9042 34.518 89.9549 33.3854 88.9442 32.375ZM60.0033 25.1807C69.3747 25.1807 78.0723 28.7932 84.5956 35.3753L60.0033 59.9585L35.4111 35.3753C41.9649 28.7932 50.632 25.1807 60.0033 25.1807Z"
                    fill="white"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_902_449">
                    <Rect
                        width="80"
                        height="80"
                        fill="white"
                        transform="translate(20 20)"
                    />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
