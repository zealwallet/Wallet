import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Avatar } from '../Avatar'
import { LightArrowDown3 } from '../Icon/LightArrowDown3'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 0,
        zIndex: 1,
    },
})

export const NextStepSeparator = () => {
    return (
        <View style={styles.container}>
            <Avatar
                backgroundColor="surfaceDefault"
                border="borderSecondary"
                size={28}
            >
                <LightArrowDown3 color="iconDefault" size={16} />
            </Avatar>
        </View>
    )
}
