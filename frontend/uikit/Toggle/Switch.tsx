import React from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'

const styles = StyleSheet.create({
    track: {
        position: 'relative',
        backgroundColor: colors.iconDefault,
    },
    track_regular: { width: 40, height: 20, borderRadius: 20 },
    track_small: { width: 32, height: 16, borderRadius: 16 },
    trackOn: {
        backgroundColor: colors.iconAccent2,
    },
    trackDisabled: {},

    handle: {
        position: 'absolute',
        left: 2,
        bottom: 2,
        backgroundColor: colors.surfaceDefault,
        // @ts-ignore FIXME @resetko-zeal
        transition: '0.3s',
    },
    handle_regular: { height: 16, width: 16, borderRadius: 8 },
    handle_small: { height: 12, width: 12, borderRadius: 6 },
    handleOn_regular: {
        transform: [{ translateX: 20 }],
    },
    handleOn_small: {
        transform: [{ translateX: 16 }],
    },
    handleDisabled: {},
})

type Size = 'regular' | 'small'

type Props = {
    'aria-labelledby': string
    disabled?: boolean
    size: Size
    value: boolean
}

export const Switch = ({
    'aria-labelledby': labelledBy,
    disabled,
    value,
    size,
}: Props) => {
    return (
        <View
            role="switch"
            aria-labelledby={labelledBy}
            style={[
                styles.track,
                styles[`track_${size}`],
                value && styles.trackOn,
                disabled && styles.trackDisabled,
            ]}
        >
            <View
                style={[
                    styles.handle,
                    styles[`handle_${size}`],
                    value && styles[`handleOn_${size}`],
                    disabled && styles.handleDisabled,
                ]}
            />
        </View>
    )
}
