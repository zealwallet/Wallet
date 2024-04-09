import React from 'react'
import {
    Defs,
    G,
    LinearGradient,
    Mask,
    Path,
    Stop,
    Svg,
} from 'react-native-svg'

type Props = {
    size: number
}

export const BrowserWallet = ({ size }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 28 28"
        width={size}
        height={size}
    >
        <Path
            d="M9.9165 1.16699H4.08317C2.47234 1.16699 1.1665 2.47283 1.1665 4.08366V9.91699C1.1665 11.5278 2.47234 12.8337 4.08317 12.8337H9.9165C11.5273 12.8337 12.8332 11.5278 12.8332 9.91699V4.08366C12.8332 2.47283 11.5273 1.16699 9.9165 1.16699Z"
            fill="#FFF0E1"
        />
        <Mask
            id="mask0_1042_11195"
            maskUnits="userSpaceOnUse"
            x="2"
            y="2"
            width="10"
            height="10"
        >
            <Path
                d="M11.6663 2.33398H2.33301V11.6673H11.6663V2.33398Z"
                fill="white"
            />
        </Mask>
        <G mask="url(#mask0_1042_11195)">
            <Mask
                id="mask1_1042_11195"
                maskUnits="userSpaceOnUse"
                x="2"
                y="2"
                width="10"
                height="10"
            >
                <Path
                    d="M2.33317 2.625H11.6665V11.0833H2.33317V2.625Z"
                    fill="white"
                />
            </Mask>
            <G mask="url(#mask1_1042_11195)">
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.99593 10.3989L7.77161 10.7275V10.2953L7.67402 10.1963H6.97314V10.7005V11.0561H7.72282L8.64549 10.6509L8.99593 10.3989Z"
                    fill="#CDBDB2"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.00342 10.3989L6.20113 10.7275V10.2953L6.30315 10.1963H6.9996V10.7005V11.0561H6.24992L5.32725 10.6509L5.00342 10.3989Z"
                    fill="#CDBDB2"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.67439 9.46296L7.77198 10.2957L7.64778 10.1967H6.35248L6.20166 10.2957L6.30369 9.46296L6.5033 9.33691L7.50139 9.35942L7.67439 9.46296Z"
                    fill="#393939"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.34891 3.81348L7.75006 5.23146L7.47503 9.35933H6.50356L6.20192 5.23146L5.65186 3.81348H8.34891Z"
                    fill="#F89C35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.9656 6.92812L11.6664 8.98081L9.91868 8.87727H8.79639V7.99047L8.84519 6.17188L9.09804 6.36994L10.9656 6.92812Z"
                    fill="#F89D35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.64311 7.1582L7.59814 7.20772L7.82438 8.27007L8.79586 8.01799L9.64311 7.1582Z"
                    fill="#D87C30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.64316 7.18066L8.7959 7.99094V8.80121L9.64316 7.18066Z"
                    fill="#EA8D3A"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.79505 8.01758L7.79696 8.26967L7.47314 9.35903L7.69937 9.48507L8.79505 8.82785V8.01758Z"
                    fill="#F89D35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.79613 8.82812L8.99574 10.3992L7.67383 9.46284L8.79613 8.82812Z"
                    fill="#EB8F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.59917 7.20801L7.4751 9.35973L7.84733 8.26136L7.59917 7.20801Z"
                    fill="#EA8E3A"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.94627 8.85513L8.79736 8.82812L8.99698 10.3992L9.94627 8.85513Z"
                    fill="#D87C30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.1165 11.0837L8.99609 10.3995L9.94539 8.85547L11.6665 8.9815L11.1165 11.0837Z"
                    fill="#EB8F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.74897 5.23145L8.82247 6.14525L9.64311 7.15809L7.59814 7.23461L7.74897 5.23145Z"
                    fill="#E8821E"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.99574 10.3992L7.67383 9.46289L7.77142 10.2732V10.7278L8.67191 10.5523L8.99574 10.3992Z"
                    fill="#DFCEC3"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.00244 10.3992L6.30217 9.46289L6.20014 10.2732V10.7278L5.30408 10.5523L5.00244 10.3992Z"
                    fill="#DFCEC3"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.14905 7.66211L7.87402 8.24731L8.8455 7.99072L8.14905 7.66211Z"
                    fill="#393939"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.1445 2.625L7.75098 5.23137L8.32321 3.8134L11.1445 2.625Z"
                    fill="#E88F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.1431 2.625L11.5911 4.01597L11.3427 5.53748L11.5157 5.6365L11.2673 5.86608L11.4669 6.04164L11.1919 6.29372L11.3649 6.44678L10.9656 6.95094L9.09366 6.37026C8.17985 5.6275 7.72739 5.24938 7.74513 5.23137C7.76288 5.21337 8.89847 4.34457 11.1431 2.625Z"
                    fill="#8E5A30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.03388 6.92812L2.33301 8.98081L4.08077 8.87727H5.20307V7.99047L5.15426 6.17188L4.90586 6.36994L3.03388 6.92812Z"
                    fill="#F89D35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.35645 7.1582L6.40141 7.20772L6.17961 8.27007L5.2037 8.01799L4.35645 7.1582Z"
                    fill="#D87C30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.35645 7.18066L5.2037 7.99094V8.80121L4.35645 7.18066Z"
                    fill="#EA8D3A"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.2041 8.01758L6.20219 8.26967L6.526 9.35903L6.30421 9.48507L5.2041 8.82785V8.01758Z"
                    fill="#F89D35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.20303 8.82812L5.00342 10.3992L6.30315 9.48536L5.20303 8.82812Z"
                    fill="#EB8F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.40002 7.20801L6.52409 9.35973L6.15186 8.26136L6.40002 7.20801Z"
                    fill="#EA8E3A"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.05566 8.85513L5.20457 8.82812L5.00496 10.3992L4.05566 8.85513Z"
                    fill="#D87C30"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.88307 11.0837L5.00345 10.3995L4.05416 8.85547L2.33301 8.9815L2.88307 11.0837Z"
                    fill="#EB8F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.25059 5.23145L5.17709 6.14525L4.35645 7.15809L6.40141 7.23461L6.25059 5.23145Z"
                    fill="#E8821E"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.85025 7.66211L6.12528 8.24731L5.15381 7.99072L5.85025 7.66211Z"
                    fill="#393939"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.85693 2.625L6.25043 5.23137L5.67819 3.8134L2.85693 2.625Z"
                    fill="#E88F35"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.85624 2.625L2.4082 4.01597L2.65662 5.53748L2.48362 5.6365L2.73203 5.86608L2.53242 6.04164L2.80744 6.29372L2.63444 6.44678L3.03368 6.95094L4.90564 6.37026C5.81944 5.6275 6.27191 5.24938 6.25417 5.23137C6.23642 5.21337 5.10526 4.34457 2.85624 2.625Z"
                    fill="#8E5A30"
                />
            </G>
        </G>
        <Path
            d="M23.9165 1.16699H18.0832C16.4723 1.16699 15.1665 2.47283 15.1665 4.08366V9.91699C15.1665 11.5278 16.4723 12.8337 18.0832 12.8337H23.9165C25.5273 12.8337 26.8332 11.5278 26.8332 9.91699V4.08366C26.8332 2.47283 25.5273 1.16699 23.9165 1.16699Z"
            fill="#FFD5C0"
        />
        <Mask
            id="mask2_1042_11195"
            maskUnits="userSpaceOnUse"
            x="16"
            y="2"
            width="10"
            height="10"
        >
            <Path
                d="M25.6663 2.33398H16.333V11.6673H25.6663V2.33398Z"
                fill="white"
            />
        </Mask>
        <G mask="url(#mask2_1042_11195)">
            <Path
                d="M24.6851 4.57002L24.9045 4.03224C24.9045 4.03224 24.6284 3.73505 24.2888 3.39539C23.9492 3.05574 23.2345 3.25388 23.2345 3.25388L22.4207 2.33398H20.9913H19.5549L18.7412 3.26095C18.7412 3.26095 18.0265 3.06282 17.6869 3.40248C17.3471 3.74212 17.0712 4.03931 17.0712 4.03931L17.2906 4.5771L17.0146 5.36962C17.0146 5.36962 17.8354 8.46894 17.9274 8.85104C18.1185 9.59403 18.2458 9.88415 18.7837 10.2663C19.3214 10.6484 20.2909 11.2994 20.4536 11.3984C20.6093 11.4975 20.8145 11.6673 20.9913 11.6673C21.1683 11.6673 21.3664 11.4975 21.5292 11.3984C21.6848 11.2994 22.6613 10.6413 23.1991 10.2663C23.7369 9.89122 23.8643 9.6011 24.0554 8.85104C24.1544 8.46894 24.9682 5.36962 24.9682 5.36962L24.6851 4.57002Z"
                fill="url(#paint0_linear_1042_11195)"
            />
            <Path
                d="M23.0088 3.84761C23.0088 3.84761 24.0561 5.11422 24.0561 5.39018C24.0561 5.66616 23.9216 5.72984 23.7872 5.87136C23.6527 6.01288 23.0725 6.6285 23.0017 6.70634C22.9239 6.78418 22.7754 6.90447 22.8602 7.12383C22.9522 7.3361 23.0866 7.61208 22.938 7.89511C22.7895 8.17108 22.5347 8.36214 22.3719 8.32675C22.2092 8.29845 21.82 8.09325 21.6785 8.00125C21.537 7.90927 21.0912 7.54131 21.0912 7.39979C21.0912 7.25827 21.5582 7.00353 21.6431 6.94693C21.7281 6.89032 22.1173 6.66388 22.1244 6.57897C22.1314 6.49406 22.1314 6.46575 22.0111 6.24639C21.8979 6.02703 21.6856 5.73692 21.7209 5.54586C21.7564 5.35481 22.0889 5.25575 22.3295 5.16376C22.5702 5.07177 23.0301 4.90195 23.0866 4.87363C23.1432 4.84533 23.1291 4.82411 22.9522 4.80287C22.7754 4.78872 22.2871 4.71796 22.0607 4.78165C21.8342 4.84533 21.4591 4.93732 21.4238 4.98686C21.3954 5.03638 21.3672 5.03638 21.3954 5.21328C21.4238 5.38311 21.5937 6.21809 21.6078 6.36668C21.6219 6.51528 21.6572 6.61434 21.4945 6.64973C21.3389 6.68511 21.0699 6.74879 20.978 6.74879C20.886 6.74879 20.6172 6.68511 20.4614 6.64973C20.3058 6.61434 20.3341 6.51528 20.3482 6.36668C20.3624 6.21809 20.5251 5.39018 20.5605 5.21328C20.5888 5.04346 20.5676 5.03638 20.5322 4.98686C20.5039 4.93732 20.1218 4.84533 19.8953 4.78165C19.6689 4.71796 19.1806 4.78165 19.0038 4.80287C18.8269 4.81702 18.8127 4.84533 18.8694 4.87363C18.926 4.90195 19.3859 5.07177 19.6264 5.16376C19.8671 5.25575 20.1996 5.35481 20.235 5.54586C20.2704 5.73692 20.0652 6.02703 19.9449 6.24639C19.8316 6.46575 19.8246 6.48698 19.8316 6.57897C19.8388 6.66388 20.228 6.89032 20.3129 6.94693C20.3977 7.00353 20.8647 7.25827 20.8647 7.39979C20.8647 7.54131 20.4189 7.90927 20.2774 8.00125C20.1359 8.09325 19.7538 8.29138 19.584 8.32675C19.4212 8.35506 19.1665 8.17108 19.0179 7.89511C18.8694 7.61915 19.0038 7.34318 19.0957 7.12383C19.1878 6.91154 19.0321 6.79125 18.9542 6.70634C18.8976 6.62143 18.3244 6.00581 18.19 5.87136C18.0556 5.72984 17.9282 5.65908 17.9282 5.39018C17.9282 5.1213 18.9754 3.84761 18.9754 3.84761C18.9754 3.84761 19.86 4.01743 19.9803 4.01743C20.1006 4.01743 20.3554 3.91836 20.5959 3.84052C20.8365 3.7627 20.9921 3.7627 20.9921 3.7627C20.9921 3.7627 21.1479 3.7627 21.3884 3.84052C21.629 3.91836 21.8837 4.01743 22.004 4.01743C22.1244 4.01743 23.0088 3.84761 23.0088 3.84761ZM22.2234 8.69471C22.2871 8.73716 22.2517 8.815 22.188 8.85039C22.1314 8.89284 21.3317 9.50846 21.261 9.57922C21.1832 9.64997 21.0699 9.75612 20.9921 9.75612C20.9143 9.75612 20.8011 9.6429 20.7232 9.57922C20.6454 9.50846 19.8529 8.89284 19.7963 8.85039C19.7397 8.80793 19.6972 8.73009 19.7609 8.69471C19.8246 8.65225 20.0299 8.55319 20.3058 8.40459C20.5888 8.25599 20.9355 8.1357 20.9921 8.1357C21.0487 8.1357 21.3954 8.25599 21.6785 8.40459C21.9545 8.55319 22.1526 8.65934 22.2234 8.69471Z"
                fill="white"
            />
        </G>
        <Mask
            id="mask3_1042_11195"
            maskUnits="userSpaceOnUse"
            x="15"
            y="15"
            width="12"
            height="12"
        >
            <Path
                d="M26.8337 15.166H15.167V26.8327H26.8337V15.166Z"
                fill="white"
            />
        </Mask>
        <G mask="url(#mask3_1042_11195)">
            <Path
                d="M23.917 15.166H18.0837C16.4728 15.166 15.167 16.4719 15.167 18.0827V23.916C15.167 25.5268 16.4728 26.8327 18.0837 26.8327H23.917C25.5278 26.8327 26.8337 25.5268 26.8337 23.916V18.0827C26.8337 16.4719 25.5278 15.166 23.917 15.166Z"
                fill="#AB9FF2"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.2383 22.6536C19.8037 23.3194 19.0757 24.162 18.1068 24.162C17.6489 24.162 17.2085 23.9735 17.2085 23.1545C17.2085 21.0687 20.0562 17.8398 22.6985 17.8398C24.2017 17.8398 24.8006 18.8827 24.8006 20.067C24.8006 21.5872 23.8142 23.3254 22.8336 23.3254C22.5224 23.3254 22.3697 23.1545 22.3697 22.8835C22.3697 22.8128 22.3815 22.7361 22.4049 22.6536C22.0702 23.2252 21.4244 23.7554 20.8196 23.7554C20.3793 23.7554 20.1561 23.4786 20.1561 23.0897C20.1561 22.9483 20.1855 22.801 20.2383 22.6536ZM22.5144 20.0259C22.5144 20.371 22.3108 20.5436 22.0829 20.5436C21.8518 20.5436 21.6516 20.371 21.6516 20.0259C21.6516 19.6808 21.8518 19.5083 22.0829 19.5083C22.3108 19.5083 22.5144 19.6808 22.5144 20.0259ZM23.8083 20.0259C23.8083 20.371 23.6047 20.5436 23.377 20.5436C23.1458 20.5436 22.9456 20.371 22.9456 20.0259C22.9456 19.681 23.1458 19.5084 23.377 19.5084C23.6047 19.5084 23.8083 19.681 23.8083 20.0259Z"
                fill="#FFFDF8"
            />
        </G>
        <Mask
            id="mask4_1042_11195"
            maskUnits="userSpaceOnUse"
            x="1"
            y="15"
            width="12"
            height="12"
        >
            <Path
                d="M12.8337 15.166H1.16699V26.8327H12.8337V15.166Z"
                fill="white"
            />
        </Mask>
        <G mask="url(#mask4_1042_11195)">
            <Path
                d="M9.91699 15.166H4.08366C2.47283 15.166 1.16699 16.4719 1.16699 18.0827V23.916C1.16699 25.5268 2.47283 26.8327 4.08366 26.8327H9.91699C11.5278 26.8327 12.8337 25.5268 12.8337 23.916V18.0827C12.8337 16.4719 11.5278 15.166 9.91699 15.166Z"
                fill="#797CFF"
            />
            <Path
                d="M10.8828 21.4341C11.1973 20.7364 9.64263 18.7873 8.15738 17.9751C7.22119 17.3461 6.24568 17.4325 6.04809 17.7087C5.61451 18.3149 7.48384 18.8286 8.73402 19.428C8.46529 19.5438 8.21204 19.7519 8.0631 20.0179C7.59704 19.5126 6.57407 19.0774 5.37371 19.428C4.56482 19.6641 3.89257 20.221 3.63274 21.0621C3.56961 21.0343 3.49972 21.0187 3.42617 21.0187C3.14496 21.0187 2.91699 21.2452 2.91699 21.5244C2.91699 21.8037 3.14496 22.03 3.42617 22.03C3.4783 22.03 3.64128 21.9954 3.64128 21.9954L6.24568 22.0141C5.20411 23.6549 4.381 23.8948 4.381 24.1791C4.381 24.4634 5.16858 24.3863 5.46429 24.2804C6.87994 23.7731 8.40041 22.1922 8.66131 21.7372C9.75698 21.8729 10.6778 21.889 10.8828 21.4341Z"
                fill="url(#paint1_linear_1042_11195)"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.73321 19.4278C8.79115 19.4051 8.78198 19.3202 8.76607 19.2535C8.72949 19.1 8.09847 18.4812 7.50593 18.204C6.69855 17.8264 6.10402 17.8459 6.01611 18.0199C6.18053 18.3547 6.94305 18.669 7.73944 18.9973C8.0792 19.1373 8.42494 19.2799 8.73321 19.4278Z"
                fill="url(#paint2_linear_1042_11195)"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.70917 22.7982C7.54588 22.7363 7.36143 22.6794 7.15173 22.6278C7.37532 22.2305 7.42223 21.6423 7.21107 21.2703C6.91469 20.7485 6.54268 20.4707 5.67819 20.4707C5.2027 20.4707 3.92254 20.6297 3.89982 21.6909C3.89743 21.8023 3.89976 21.9044 3.90788 21.9982L6.24558 22.015C5.9304 22.5116 5.63525 22.8798 5.37684 23.1598C5.6871 23.2387 5.94313 23.305 6.1782 23.3659C6.40121 23.4237 6.60538 23.4765 6.81903 23.5306C7.14137 23.2974 7.44437 23.0431 7.70917 22.7982Z"
                fill="url(#paint3_linear_1042_11195)"
            />
            <Path
                d="M3.60143 21.8885C3.69692 22.6947 4.15829 23.0106 5.10106 23.104C6.04383 23.1976 6.5846 23.1348 7.30457 23.1999C7.90588 23.2542 8.44279 23.5586 8.64196 23.4533C8.82122 23.3587 8.72093 23.0168 8.48106 22.7974C8.17016 22.5131 7.73985 22.3154 6.98268 22.2453C7.13358 21.8349 7.0913 21.2597 6.85694 20.9468C6.51809 20.4941 5.89263 20.2896 5.10106 20.3789C4.27403 20.4724 3.48157 20.8766 3.60143 21.8885Z"
                fill="url(#paint4_linear_1042_11195)"
            />
        </G>
        <Defs>
            <LinearGradient
                id="paint0_linear_1042_11195"
                x1="17.0145"
                y1="7.00041"
                x2="24.9682"
                y2="7.00041"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FF5500" />
                <Stop offset="0.4099" stopColor="#FF5500" />
                <Stop offset="0.582" stopColor="#FF2000" />
                <Stop offset="1" stopColor="#FF2000" />
            </LinearGradient>
            <LinearGradient
                id="paint1_linear_1042_11195"
                x1="5.27952"
                y1="20.8162"
                x2="10.8094"
                y2="22.3953"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="white" />
                <Stop offset="1" stopColor="white" />
            </LinearGradient>
            <LinearGradient
                id="paint2_linear_1042_11195"
                x1="9.88228"
                y1="20.7114"
                x2="5.9159"
                y2="16.7077"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#8697FF" />
                <Stop offset="1" stopColor="#8697FF" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient
                id="paint3_linear_1042_11195"
                x1="7.82028"
                y1="22.9367"
                x2="3.99674"
                y2="20.7232"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#8697FF" />
                <Stop offset="1" stopColor="#8697FF" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient
                id="paint4_linear_1042_11195"
                x1="5.60987"
                y1="20.7755"
                x2="8.18109"
                y2="24.0653"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="white" />
                <Stop offset="0.983895" stopColor="#D1D8FF" />
            </LinearGradient>
        </Defs>
    </Svg>
)