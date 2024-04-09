import React from 'react'
import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native'
import { ImageBackground as RNImageBackground } from 'react-native'

import { ImageBackground as ExpoImageBackground } from 'expo-image'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    style?: StyleProp<ViewStyle>
    source: ImageSourcePropType
    children: React.ReactNode
}

export const ImageBackground = ({ children, source, style }: Props) => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return (
                <ExpoImageBackground
                    contentFit="cover"
                    contentPosition="center"
                    source={source}
                    style={style}
                >
                    {children}
                </ExpoImageBackground>
            )
        case 'web':
            return (
                <RNImageBackground
                    resizeMode="cover"
                    source={source}
                    style={style}
                >
                    {children}
                </RNImageBackground>
            )

        default:
            return notReachable(ZealPlatform.OS)
    }
}
