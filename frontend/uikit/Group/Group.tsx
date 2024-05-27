import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'

type Variant = 'compressed' | 'default' | 'widget'

type GroupProps = {
    'aria-labelledby'?: string
    'aria-label'?: string
    id?: string
    fill?: boolean
    variant: Variant
    scroll?: true
    children: ReactNode
}

export const styles = StyleSheet.create({
    group: {
        backgroundColor: colors.surfaceDefault,
        flexShrink: 1,
        width: '100%',
        borderRadius: 8,
    },
    variant_compressed: {
        rowGap: 0,
        padding: 0,
    },
    variant_default: {
        padding: 8,
        rowGap: 8,
    },
    variant_widget: {
        borderRadius: 16,
        padding: 8,
        paddingTop: 4,
        rowGap: 0,
    },
    scroll: {
        // @ts-ignore
        overflow: 'auto',
    },
})

// TODO @resetko-zeal check usages for group and make sure GorupList is used for lists. This may mean that we can remove this one in favor of GroupList, because it's purpose was to wrap list items.
export const Group = ({
    'aria-labelledby': ariaLabelledby,
    'aria-label': ariaLabel,
    id,
    variant,
    scroll,
    fill,
    children,
}: GroupProps) => {
    return (
        <View
            id={id}
            style={[
                styles.group,
                styles[`variant_${variant}`],
                scroll && styles.scroll,
                !!fill && { flexGrow: 1 },
            ]}
            aria-labelledby={ariaLabelledby}
            aria-label={ariaLabel}
        >
            {children}
        </View>
    )
}
