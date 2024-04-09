import React from 'react'
import { Circle, Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const QuestionCircle = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 32 32"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Circle cx="16" cy="16.0005" r="16" fill="currentColor" />
        <Path
            d="M14.5114 19.4159L13.8458 15.8063C14.5114 15.6357 15.1087 15.4479 15.6378 15.2431C16.1669 15.0213 16.6191 14.7909 16.9946 14.5519C17.3871 14.2959 17.7114 14.0229 17.9674 13.7327C18.2234 13.4426 18.4111 13.1354 18.5306 12.8111C18.6671 12.4698 18.7354 12.1114 18.7354 11.7359C18.7354 11.241 18.5989 10.7973 18.3258 10.4047C18.0698 10.0122 17.7114 9.70501 17.2506 9.48315C16.7898 9.26128 16.2693 9.15034 15.689 9.15034C15.0063 9.15034 14.3407 9.38928 13.6922 9.86714C13.0607 10.3279 12.5146 10.985 12.0538 11.8383L10.1338 10.2255C10.8677 9.09915 11.7381 8.22875 12.745 7.61434C13.769 6.98288 14.8357 6.66714 15.945 6.66714C17.0202 6.66714 17.9845 6.88901 18.8378 7.33275C19.6911 7.77648 20.3653 8.38235 20.8602 9.15034C21.3722 9.91835 21.6282 10.7802 21.6282 11.7359C21.6282 12.2991 21.5087 12.8538 21.2698 13.3999C21.0479 13.929 20.7237 14.4325 20.297 14.9103C19.8703 15.3882 19.3669 15.8149 18.7866 16.1903C18.2234 16.5658 17.6005 16.873 16.9178 17.1119L16.4826 19.4159H14.5114ZM13.6154 23.1791C13.6154 22.6159 13.7775 22.1551 14.1018 21.7967C14.4261 21.4383 14.8527 21.2591 15.3818 21.2591C15.945 21.2591 16.3802 21.4298 16.6874 21.7711C16.9946 22.0954 17.1482 22.5647 17.1482 23.1791C17.1482 23.7423 16.9861 24.2031 16.6618 24.5615C16.3375 24.9199 15.9109 25.0991 15.3818 25.0991C14.8186 25.0991 14.3834 24.937 14.0762 24.6127C13.769 24.2714 13.6154 23.7935 13.6154 23.1791Z"
            fill="white"
        />
        <Path
            d="M14.5114 19.4159L13.8458 15.8063C14.5114 15.6357 15.1087 15.4479 15.6378 15.2431C16.1669 15.0213 16.6191 14.7909 16.9946 14.5519C17.3871 14.2959 17.7114 14.0229 17.9674 13.7327C18.2234 13.4426 18.4111 13.1354 18.5306 12.8111C18.6671 12.4698 18.7354 12.1114 18.7354 11.7359C18.7354 11.241 18.5989 10.7973 18.3258 10.4047C18.0698 10.0122 17.7114 9.70501 17.2506 9.48315C16.7898 9.26128 16.2693 9.15034 15.689 9.15034C15.0063 9.15034 14.3407 9.38928 13.6922 9.86714C13.0607 10.3279 12.5146 10.985 12.0538 11.8383L10.1338 10.2255C10.8677 9.09915 11.7381 8.22875 12.745 7.61434C13.769 6.98288 14.8357 6.66714 15.945 6.66714C17.0202 6.66714 17.9845 6.88901 18.8378 7.33275C19.6911 7.77648 20.3653 8.38235 20.8602 9.15034C21.3722 9.91835 21.6282 10.7802 21.6282 11.7359C21.6282 12.2991 21.5087 12.8538 21.2698 13.3999C21.0479 13.929 20.7237 14.4325 20.297 14.9103C19.8703 15.3882 19.3669 15.8149 18.7866 16.1903C18.2234 16.5658 17.6005 16.873 16.9178 17.1119L16.4826 19.4159H14.5114ZM13.6154 23.1791C13.6154 22.6159 13.7775 22.1551 14.1018 21.7967C14.4261 21.4383 14.8527 21.2591 15.3818 21.2591C15.945 21.2591 16.3802 21.4298 16.6874 21.7711C16.9946 22.0954 17.1482 22.5647 17.1482 23.1791C17.1482 23.7423 16.9861 24.2031 16.6618 24.5615C16.3375 24.9199 15.9109 25.0991 15.3818 25.0991C14.8186 25.0991 14.3834 24.937 14.0762 24.6127C13.769 24.2714 13.6154 23.7935 13.6154 23.1791Z"
            fill="white"
        />
    </Svg>
)
