import React from 'react'
import { StyleSheet, View } from 'react-native'

export type Spacing = 0 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 28 | 30 | 32

type AlignX = 'start' | 'center' | 'end' | 'stretch'
type AlignY = 'start' | 'center' | 'end' | 'stretch'

type Props = {
    spacing: Spacing
    alignX?: AlignX
    alignY?: AlignY
    fill?: true
    shrink?: true
    children: React.ReactNode
    'aria-labelledby'?: string
    'aria-label'?: string
    testID?: string
}

export const styles = StyleSheet.create({
    column: {
        width: '100%',
        flexDirection: 'column',
    },
    alignX_start: { alignItems: 'flex-start' },
    alignX_center: { alignItems: 'center' },
    alignX_end: { alignItems: 'flex-end' },
    alignX_stretch: { alignItems: 'stretch' },
    alignY_start: { justifyContent: 'flex-start' },
    alignY_center: { justifyContent: 'center' },
    alignY_end: { justifyContent: 'flex-end' },
    alignY_stretch: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    shrink: {
        flexShrink: 1,
    },
    fill: {
        flexGrow: 1,
    },
})

export const Column = ({
    spacing,
    children,
    alignX,
    alignY,
    fill,
    shrink,
    'aria-labelledby': ariaLabelledby,
    'aria-label': ariaLabel,
    testID: dataTestid,
}: Props) => {
    return (
        <View
            style={[
                styles.column,
                alignX && styles[`alignX_${alignX}`],
                alignY && styles[`alignY_${alignY}`],
                fill && styles.fill,
                shrink && styles.shrink,
                { rowGap: spacing },
            ]}
            aria-labelledby={ariaLabelledby}
            aria-label={ariaLabel}
            testID={dataTestid}
        >
            {children}
        </View>
    )
}
