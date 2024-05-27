import React, { ReactNode } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

type Props = {
    contentFill?: boolean
    children: ReactNode
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fill: {
        flexGrow: 1,
    },
})

export const ScrollContainer = ({ contentFill, children }: Props) => (
    <ScrollView
        style={styles.container}
        contentContainerStyle={[contentFill && styles.fill]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
    >
        {children}
    </ScrollView>
)
