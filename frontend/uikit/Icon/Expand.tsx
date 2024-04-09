import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Expand = ({ color, size }: Props) => {
    return (
        <Svg
            width={size}
            height={size}
            style={{ flexShrink: 0 }}
            viewBox="0 0 20 20"
            fill="none"
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.08 20.5H5.91C2.38 20.5 0 18.229 0 14.84V6.17C0 2.78 2.38 0.5 5.91 0.5H14.08C17.62 0.5 20 2.78 20 6.17V14.84C20 18.229 17.62 20.5 14.08 20.5ZM15.7804 4.71967C15.9211 4.86032 16.0001 5.05109 16.0001 5.25V9C16.0001 9.19891 15.9211 9.38968 15.7804 9.53033C15.6398 9.67098 15.449 9.75 15.2501 9.75C15.0512 9.75 14.8604 9.67098 14.7198 9.53033C14.5791 9.38968 14.5001 9.19891 14.5001 9V7.065L12.0326 9.5325C11.9629 9.6028 11.8799 9.65859 11.7885 9.69667C11.6971 9.73475 11.5991 9.75435 11.5001 9.75435C11.4011 9.75435 11.3031 9.73475 11.2117 9.69667C11.1203 9.65859 11.0373 9.6028 10.9676 9.5325C10.8973 9.46278 10.8415 9.37983 10.8034 9.28843C10.7654 9.19704 10.7458 9.09901 10.7458 9C10.7458 8.90099 10.7654 8.80296 10.8034 8.71157C10.8415 8.62017 10.8973 8.53722 10.9676 8.4675L13.4276 6H11.5001C11.3012 6 11.1104 5.92098 10.9698 5.78033C10.8291 5.63968 10.7501 5.44891 10.7501 5.25C10.7501 5.05109 10.8291 4.86032 10.9698 4.71967C11.1104 4.57902 11.3012 4.5 11.5001 4.5H15.2501C15.449 4.5 15.6398 4.57902 15.7804 4.71967ZM8.78853 11.3033C8.87993 11.3414 8.96288 11.3972 9.0326 11.4675C9.1029 11.5372 9.15869 11.6202 9.19677 11.7116C9.23484 11.803 9.25445 11.901 9.25445 12C9.25445 12.099 9.23484 12.197 9.19677 12.2884C9.15869 12.3798 9.1029 12.4628 9.0326 12.5325L6.5651 15H8.5001C8.69901 15 8.88978 15.079 9.03043 15.2197C9.17108 15.3603 9.2501 15.5511 9.2501 15.75C9.2501 15.9489 9.17108 16.1397 9.03043 16.2803C8.88978 16.421 8.69901 16.5 8.5001 16.5H4.7501C4.55119 16.5 4.36042 16.421 4.21977 16.2803C4.07912 16.1397 4.0001 15.9489 4.0001 15.75V12C4.0001 11.8011 4.07912 11.6103 4.21977 11.4697C4.36042 11.329 4.55119 11.25 4.7501 11.25C4.94901 11.25 5.13978 11.329 5.28043 11.4697C5.42108 11.6103 5.5001 11.8011 5.5001 12V13.9275L7.9676 11.4675C8.03732 11.3972 8.12027 11.3414 8.21167 11.3033C8.30306 11.2653 8.40109 11.2457 8.5001 11.2457C8.59911 11.2457 8.69714 11.2653 8.78853 11.3033Z"
                fill="currentColor"
            />
        </Svg>
    )
}