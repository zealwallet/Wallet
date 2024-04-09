import React from 'react'
import { StyleSheet, View } from 'react-native'

export type Spacing = 0 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 30

export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        maxWidth: '100%',
    },

    noWidth: { flexBasis: '0%' },
    fullWidth: { flexBasis: '100%' },
    grow: { flexGrow: 1 },
    shrink: { flexShrink: 1 },

    wrap: { flexWrap: 'wrap' },

    XAlign_end: { justifyContent: 'flex-end' },
    XAlign_start: { justifyContent: 'flex-start' },
    XAlign_center: { justifyContent: 'center' },
    XAlign_stretch: { justifyContent: 'space-between' },
    XAlign_stretchCenter: { justifyContent: 'space-around' },

    YAlign_end: { alignItems: 'flex-end' },
    YAlign_start: { alignItems: 'flex-start' },
    YAlign_center: { alignItems: 'center' },
    YAlign_baseline: { alignItems: 'baseline' },
    YAlign_stretch: { alignItems: 'stretch' },
})

type Props = {
    spacing: Spacing
    children: React.ReactNode
    id?: string
    alignX?: AlignX
    alignY?: AlignY
    ignoreContentWidth?: true
    fullWidth?: true
    grow?: true
    shrink?: true
    wrap?: true
    wrapSpacing?: Spacing
    'aria-labelledby'?: string
    'aria-label'?: string
    'aria-describedby'?: string
}

type AlignX = 'center' | 'end' | 'start' | 'stretch' | 'stretchCenter'
type AlignY = 'center' | 'end' | 'start' | 'stretch' | 'baseline'

export const Row = ({
    id,
    spacing,
    children,
    alignX,
    alignY,
    ignoreContentWidth,
    fullWidth,
    grow,
    shrink,
    wrap,
    wrapSpacing,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    'aria-label': ariaLabel,
}: Props) => {
    return (
        <View
            id={id}
            aria-describedby={ariaDescribedBy}
            aria-labelledby={ariaLabelledBy}
            aria-label={ariaLabel}
            style={[
                styles.row,
                { columnGap: spacing },
                alignX && styles[`XAlign_${alignX}`],
                alignY && styles[`YAlign_${alignY}`],
                ignoreContentWidth && styles.noWidth,
                fullWidth && styles.fullWidth,
                grow && styles.grow,
                shrink && styles.shrink,
                wrap && styles.wrap,
                !!wrapSpacing && { rowGap: wrapSpacing },
            ]}
        >
            {children}
        </View>
    )
}
