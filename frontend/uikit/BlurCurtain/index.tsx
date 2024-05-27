import React, { ReactNode, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { BlurView } from 'expo-blur'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { colors } from '../colors'

export const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    blurBox: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    coverBox: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    coverBox_covered: {
        backgroundColor: colors.backgroundLight,
        borderWidth: 1,
        borderColor: colors.borderDefault,
    },
})

type Props = {
    unblurElement: ReactNode
    children: ReactNode
}

export const BlurCurtain = ({ unblurElement, children }: Props) => {
    const [blurred, setBlurred] = useState(true)

    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return (
                <Pressable
                    onPress={() => setBlurred((b) => !b)}
                    style={styles.container}
                >
                    {children}
                    <BlurBox blurred={blurred}>
                        {blurred && <View>{unblurElement}</View>}
                    </BlurBox>
                </Pressable>
            )

        case 'web':
            return (
                <Pressable
                    onHoverOut={() => setBlurred(true)}
                    onHoverIn={() => setBlurred(false)}
                    style={styles.container}
                >
                    {children}
                    {blurred && (
                        <BlurBox blurred={blurred}>
                            <View>{unblurElement}</View>
                        </BlurBox>
                    )}
                </Pressable>
            )

        default:
            return notReachable(ZealPlatform.OS)
    }
}

const BlurBox = ({
    children,
    blurred,
}: {
    children: ReactNode
    blurred: boolean
}) => {
    switch (ZealPlatform.OS) {
        case 'android':
            return (
                <View
                    style={[
                        styles.coverBox,
                        StyleSheet.absoluteFill,
                        blurred ? styles.coverBox_covered : null,
                    ]}
                >
                    {children}
                </View>
            )

        case 'ios':
        case 'web':
            return (
                <BlurView intensity={blurred ? 20 : 0} style={[styles.blurBox]}>
                    {children}
                </BlurView>
            )

        default:
            return notReachable(ZealPlatform.OS)
    }
}
