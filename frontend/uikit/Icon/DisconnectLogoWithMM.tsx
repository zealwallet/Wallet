import React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
}

export const DisconnectLogoWithMM = ({ size }: Props) => {
    return (
        <SvgIcon height={size} viewBox="0 0 48 48" width={size}>
            <Rect width="48" height="48" rx="5" fill="white" />
            <Path
                d="M11 37H37V25.3H16.2C13.3281 25.3 11 27.6281 11 30.5V37Z"
                fill="#ABB3BB"
            />
            <Path
                d="M37 11H11V22.7H31.8C34.6719 22.7 37 20.3719 37 17.5V11Z"
                fill="#ABB3BB"
            />
            <G clipPath="url(#clip0_1500_175578)">
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.1503 42.7377L34.5086 43.3635V42.5452L34.7011 42.3527H36.0487V43.9891H34.6048L32.8241 43.219L32.1503 42.7377Z"
                    fill="#CDBDB2"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M39.8501 42.7377L37.54 43.3635V42.5452L37.3475 42.3527H35.9999V43.9891H37.4437L39.2244 43.219L39.8501 42.7377Z"
                    fill="#CDBDB2"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M34.7006 40.9578L34.5081 42.546L34.7487 42.3535H37.2513L37.5401 42.546L37.3476 40.9578L36.9625 40.7171L35.0374 40.7653L34.7006 40.9578Z"
                    fill="#393939"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M33.4011 30.2247L34.5562 32.9199L35.0856 40.7648H36.9626L37.5401 32.9199L38.5989 30.2247H33.4011Z"
                    fill="#F89C35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M28.3478 36.1448L27.0002 40.0432L30.3692 39.8506H32.5349V38.1662L32.4387 34.701L31.9574 35.086L28.3478 36.1448Z"
                    fill="#F89D35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M30.8984 36.5775L34.8449 36.6737L34.4118 38.6951L32.5348 38.2138L30.8984 36.5775Z"
                    fill="#D87C30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M30.8984 36.6258L32.5348 38.1659V39.706L30.8984 36.6258Z"
                    fill="#EA8D3A"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.5345 38.214L34.4597 38.6953L35.0854 40.7648L34.6522 41.0054L32.5345 39.7541V38.214Z"
                    fill="#F89D35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.5353 39.7538L32.1503 42.7377L34.7011 40.957L32.5353 39.7538Z"
                    fill="#EB8F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M34.8453 36.6741L35.086 40.7651L34.364 38.6715L34.8453 36.6741Z"
                    fill="#EA8E3A"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M30.3208 39.802L32.5347 39.7538L32.1497 42.7377L30.3208 39.802Z"
                    fill="#D87C30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M28.0591 44.0374L32.1499 42.7379L30.321 39.8021L27.0002 40.0427L28.0591 44.0374Z"
                    fill="#EB8F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M34.5562 32.9194L32.4867 34.652L30.8984 36.5772L34.8449 36.7216L34.5562 32.9194Z"
                    fill="#E8821E"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.1503 42.7377L34.7011 40.957L34.5086 42.4971V43.3634L32.776 43.0265L32.1503 42.7377ZM39.8507 42.7377L37.3481 40.957L37.5406 42.4971V43.3634L39.2732 43.0265L39.8507 42.7377Z"
                    fill="#DFCEC3"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M33.7861 37.5399L34.3155 38.6468L32.4385 38.1656L33.7861 37.5399Z"
                    fill="#393939"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M28.011 27.9624L34.5564 32.9195L33.4495 30.2244L28.011 27.9624Z"
                    fill="#E88F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M28.0107 27.9624L27.1444 30.6094L27.6257 33.4971L27.2888 33.6896L27.7701 34.1228L27.3851 34.4596L27.9145 34.9409L27.5776 35.2297L28.3477 36.1922L31.9572 35.0853C33.7219 33.6736 34.5882 32.9516 34.5561 32.9195C34.524 32.8875 32.3422 31.2351 28.0107 27.9624Z"
                    fill="#8E5A30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M43.6522 36.1448L44.9998 40.0432L41.6308 39.8506H39.4651V38.1662L39.5613 34.701L40.0426 35.086L43.6522 36.1448Z"
                    fill="#F89D35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M41.1019 36.5775L37.1554 36.6737L37.5885 38.6951L39.4655 38.2138L41.1019 36.5775Z"
                    fill="#D87C30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M41.1014 36.6258L39.4651 38.1659V39.706L41.1014 36.6258Z"
                    fill="#EA8D3A"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M39.4654 38.214L37.5403 38.6953L36.9146 40.7648L37.3477 41.0054L39.4654 39.7541V38.214Z"
                    fill="#F89D35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M39.4653 39.7538L39.8503 42.7377L37.3477 41.0051L39.4653 39.7538Z"
                    fill="#EB8F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M37.1552 36.6741L36.9146 40.7651L37.6365 38.6715L37.1552 36.6741Z"
                    fill="#EA8E3A"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M41.679 39.802L39.4651 39.7538L39.8501 42.7377L41.679 39.802Z"
                    fill="#D87C30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M43.9409 44.0374L39.8501 42.7379L41.679 39.8021L44.9998 40.0427L43.9409 44.0374Z"
                    fill="#EB8F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M37.4442 32.9194L39.5136 34.652L41.1019 36.5772L37.1554 36.7216L37.4442 32.9194Z"
                    fill="#E8821E"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M38.2139 37.5399L37.6844 38.6468L39.5615 38.1656L38.2139 37.5399Z"
                    fill="#393939"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M43.989 27.9624L37.4436 32.9195L38.5505 30.2244L43.989 27.9624Z"
                    fill="#E88F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M43.9888 27.9624L44.8551 30.6094L44.3738 33.4971L44.7106 33.6896L44.2294 34.1228L44.6144 34.4596L44.085 34.9409L44.4219 35.2297L43.6518 36.1922L40.0423 35.0853C38.2776 33.6736 37.4113 32.9516 37.4434 32.9195C37.4754 32.8875 39.6573 31.2351 43.9888 27.9624Z"
                    fill="#8E5A30"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_1500_175578">
                    <Rect
                        width="18"
                        height="18"
                        fill="white"
                        transform="translate(27 27)"
                    />
                </ClipPath>
            </Defs>
        </SvgIcon>
    )
}
