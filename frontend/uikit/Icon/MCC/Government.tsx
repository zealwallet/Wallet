import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Government = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 32 32"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0594 8.94368C15.2206 9.00357 15.5802 9.038 15.9985 9.03818C16.4202 9.038 16.7796 9.00357 16.9408 8.94368L16.9454 8.49245C17.0974 8.25943 17.2258 7.95962 17.3235 7.69807C17.5843 6.99975 17.1984 6.70475 16.5903 6.57627C16.5256 6.53024 16.1652 6.50945 16.1427 6.51129C16.2332 6.4619 16.2945 6.36634 16.2945 6.25653C16.2945 6.21033 16.2873 6 15.9985 6C15.7097 6 15.7097 6.21335 15.7097 6.25653C15.7097 6.36662 15.7714 6.46243 15.8623 6.51168C15.8384 6.5098 15.4744 6.53024 15.4097 6.57627C14.8017 6.70475 14.4157 6.99975 14.6765 7.69807C14.7742 7.95962 14.9026 8.25943 15.0545 8.49245L15.0594 8.94368ZM12.3974 13.7198C12.3974 13.7198 8.53703 9.29841 8.29131 8.72735C7.7679 8.98098 3.95097 18.7374 12.5698 18.7338C12.5698 18.7338 12.2902 18.1787 13.1305 17.6775C13.6643 18.8492 13.0347 19.2382 12.4588 19.594C12.2392 19.7297 12.0274 19.8606 11.8909 20.0281C11.3967 20.6352 11.4496 21.138 11.4496 21.138C11.7592 21.706 12.3367 21.8981 12.8822 21.9364C12.6266 22.0496 11.9837 22.3291 11.7997 22.3591C11.6234 22.3879 11.3051 22.2794 11.2298 22.0278C11.1546 21.7768 10.6359 21.7989 10.5922 21.8735L8.96043 18.1047C8.91826 18.0073 8.80732 17.9598 8.70772 17.9966L8.62475 18.0271C8.5193 18.066 8.46602 18.1828 8.50746 18.2872C8.8227 19.0821 10.0241 22.1137 10.0361 22.1807C10.0182 22.2039 9.99518 22.2216 9.97118 22.2401C9.8888 22.3034 9.79527 22.3752 9.86164 22.7094C9.94823 23.1454 10.3304 23.5304 10.6934 23.8077C10.9962 24.039 11.389 23.7921 11.3598 23.4122C11.3538 23.3343 11.3484 23.2788 11.3445 23.2642C11.6225 22.9165 12.8322 22.4648 13.4531 22.4648L13.483 22.4648C13.6871 22.4653 14.0207 22.4662 14.1344 22.2799C14.2166 22.1452 14.0629 21.9555 13.9592 21.8504C14.1047 21.8195 14.1926 21.7929 14.1926 21.7929C14.1926 21.7929 13.9168 21.5677 13.8679 21.1631C13.8249 20.8075 14.1409 20.513 14.6162 20.6352C14.957 20.7228 15.1272 21.0739 14.9974 21.7364C14.8677 22.3988 14.1709 23.1348 12.5698 23.514C12.5698 25.6052 14.84 25.8572 15.6931 25.9519L15.6932 25.9519L15.6933 25.9519L15.6934 25.9519C15.8543 25.9698 15.9648 25.982 16 26C16.0352 25.982 16.1457 25.9698 16.3066 25.9519L16.3067 25.9519L16.3068 25.9519L16.3069 25.9519C17.16 25.8572 19.4302 25.6052 19.4302 23.514C17.8291 23.1348 17.1323 22.3988 17.0026 21.7364C16.8728 21.0739 17.043 20.7228 17.3838 20.6352C17.8591 20.513 18.1751 20.8075 18.1321 21.1631C18.0832 21.5677 17.8074 21.7929 17.8074 21.7929C17.8074 21.7929 17.9529 21.837 18.1794 21.8776C18.1766 21.8791 18.1751 21.8808 18.1749 21.8826C18.1581 22.0349 18.0925 22.0786 18.0401 22.1135C17.9746 22.1572 17.9298 22.187 18.0275 22.3988C18.1135 22.5854 18.6422 22.675 19.2951 22.7855C19.9754 22.9007 20.7906 23.0388 21.3808 23.3333C22.3836 23.5028 22.6981 22.905 22.767 22.6542C23.1091 22.433 23.3352 22.0498 23.3352 21.6142C23.3352 21.1033 23.0241 20.6645 22.5797 20.4745C22.6213 20.397 22.6448 20.3087 22.6448 20.2149C22.6448 19.9081 22.393 19.6593 22.0823 19.6593C21.7716 19.6593 21.5198 19.9081 21.5198 20.2149C21.5198 20.3098 21.5439 20.3992 21.5864 20.4774C21.1457 20.6689 20.8377 21.1058 20.8377 21.6142C20.8377 21.8584 20.9088 22.0862 21.0315 22.2781C20.964 22.3996 20.8115 22.4742 20.7731 22.4797C19.988 22.5932 19.2756 22.1102 19.1364 21.935C19.6764 21.8937 20.2443 21.6995 20.5504 21.138C20.5504 21.138 20.6033 20.6352 20.1091 20.0281C19.9726 19.8606 19.7608 19.7297 19.5412 19.594C18.9653 19.2382 18.3357 18.8492 18.8695 17.6775C19.7098 18.1787 19.4302 18.7338 19.4302 18.7338C28.049 18.7374 24.2321 8.98098 23.7087 8.72735C23.463 9.29841 19.6026 13.7198 19.6026 13.7198C19.6026 13.7198 19.3835 14.3179 19.6855 14.6069L19.6894 14.6107C19.8107 14.7266 20.0386 14.9446 19.8385 15.2363C19.5142 15.7091 18.7936 15.6912 18.5841 15.2847C17.3838 13.7094 18.0975 12.0732 18.3281 11.8974C18.332 11.9034 18.3551 11.8834 18.396 11.8481C18.6164 11.658 19.352 11.0231 20.3775 11.5997C20.4916 11.504 20.5689 11.4167 20.6033 11.2186C20.6946 10.6993 20.2957 10.428 19.8549 10.428L19.5587 10.1457H19.4676L19.467 9.99247C19.5435 9.85578 19.609 9.69604 19.6607 9.55379C19.8278 9.09442 19.5769 8.89892 19.1952 8.81538C19.1512 8.78434 18.4899 8.78434 18.446 8.81538C18.0642 8.89892 17.8133 9.09442 17.9804 9.55379C18.0322 9.69624 18.0978 9.85628 18.1744 9.99307L18.1753 10.1457H17.8211C17.4787 10.1457 16.8765 10.118 16.805 10.0325C16.8175 10.2486 17.281 10.4972 17.5842 10.5603C17.3358 10.5856 16 11.8974 16 13.3586C16 11.8974 14.6642 10.5856 14.4158 10.5603C14.719 10.4972 15.1825 10.2486 15.195 10.0325C15.1235 10.118 14.5213 10.1457 14.1789 10.1457H13.8247L13.8256 9.99307C13.9022 9.85628 13.9678 9.69624 14.0196 9.55379C14.1867 9.09442 13.9358 8.89892 13.554 8.81538C13.5101 8.78434 12.8488 8.78434 12.8048 8.81538C12.4231 8.89892 12.1722 9.09442 12.3393 9.55379C12.391 9.69604 12.4565 9.85578 12.533 9.99247L12.5324 10.1457H12.4413L12.1451 10.428C11.7043 10.428 11.3054 10.6993 11.3967 11.2186C11.4311 11.4167 11.5084 11.504 11.6225 11.5997C12.648 11.0231 13.3836 11.658 13.604 11.8481C13.6449 11.8834 13.668 11.9034 13.6719 11.8974C13.9025 12.0732 14.6162 13.7094 13.4159 15.2847C13.2064 15.6912 12.4858 15.7091 12.1615 15.2363C11.9614 14.9446 12.1893 14.7266 12.3106 14.6107L12.3145 14.6069C12.6165 14.3179 12.3974 13.7198 12.3974 13.7198Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
