import React, { ReactNode } from 'react'
import { Role, StyleSheet, View } from 'react-native'

type Props = {
    'aria-labelledby'?: string
    role?: Role
    children: ReactNode
}

const styles = StyleSheet.create({
    section: {
        width: '100%',
        flexShrink: 1,
        flexGrow: 1,
        flexBasis: 'auto',
        rowGap: 0,
    },
})

export const Section = ({
    'aria-labelledby': ariaLabeledBy,
    role,
    children,
}: Props) => {
    return (
        <View
            role={role}
            aria-labelledby={ariaLabeledBy}
            style={styles.section}
        >
            {children}
        </View>
    )
}
