import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Animation } from '../Animation'

type Props = {
    key: number
    size: number
    durationMs: number
}

const SPINNER_PADDING = 2

const styles = StyleSheet.create({
    container: {
        padding: SPINNER_PADDING,
    },
})

export const ProgressSpinner = ({ size, durationMs }: Props) => {
    return (
        <View style={styles.container}>
            <Animation
                animation="radial-progress"
                durationMs={durationMs}
                size={size - SPINNER_PADDING * 2}
                loop={false}
            />
        </View>
    )
}
