import React, { ReactNode, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { BlurView } from 'expo-blur'

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
})

type Props = {
    unblurElement: ReactNode
    children: ReactNode
}

export const BlurCurtain = ({ unblurElement, children }: Props) => {
    const [blurred, setBlurred] = useState(true)

    return (
        <Pressable
            onHoverOut={() => setBlurred(true)}
            onHoverIn={() => setBlurred(false)}
            onPress={() => setBlurred((b) => !b)}
        >
            <StatelessBlurCurtain
                blurred={blurred}
                unblurElement={unblurElement}
            >
                {children}
            </StatelessBlurCurtain>
        </Pressable>
    )
}

type StatelessProps = Props & { blurred: boolean }

export const StatelessBlurCurtain = ({
    blurred,
    unblurElement,
    children,
}: StatelessProps) => {
    return (
        <View style={styles.container}>
            {children}
            <BlurView intensity={blurred ? 25 : 0} style={[styles.blurBox]}>
                {blurred && <View>{unblurElement}</View>}
            </BlurView>
        </View>
    )
}
