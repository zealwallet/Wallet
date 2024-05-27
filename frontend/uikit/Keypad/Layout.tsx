import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flexGrow: 1,
        flexShrink: 0,
    },
    content: {
        flexDirection: 'column',
        flexGrow: 1,
        flexBasis: 0,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 32,
    },
    halfView: {
        flexGrow: 1,
        flexShrink: 0,
    },
})

export const Layout = ({
    keyPad,
    children,
}: {
    keyPad: ReactNode
    children: ReactNode
}) => (
    <View style={styles.container}>
        <View style={styles.halfView}>{children}</View>
        <View style={styles.halfView}>{keyPad}</View>
    </View>
)

export const Content = ({ children }: { children: ReactNode }) => (
    <View style={styles.content}>{children}</View>
)
