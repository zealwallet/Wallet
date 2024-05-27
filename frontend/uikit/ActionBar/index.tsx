import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Extractor } from '@zeal/uikit/Extractor'

import { Column } from '../Column'
import { Row, styles as rowStyles } from '../Row'
import { Spacer } from '../Spacer'
import { Text } from '../Text'

const styles = StyleSheet.create({
    container: {
        ...rowStyles.row,
        ...rowStyles.XAlign_stretch,
        columnGap: 8,
        paddingBottom: 0,
        width: '100%',
        alignItems: 'center',
    },
    size_default: {
        minHeight: 40,
    },
    size_small: {
        minHeight: 0,
    },
})

type Size = Extractor<keyof typeof styles, 'size'>

type Props = {
    top?: React.ReactNode
    left?: React.ReactNode
    right?: React.ReactNode
    center?: React.ReactNode
    size?: Size
}

const Header = ({
    children,
    id,
}: {
    children: React.ReactNode
    id?: string
}) => {
    return (
        <Text variant="title3" weight="semi_bold" color="textPrimary" id={id}>
            {children}
        </Text>
    )
}

export const ActionBar = ({
    top,
    left,
    right,
    center,
    size = 'default',
}: Props) => {
    return (
        <Column spacing={0} alignX="stretch">
            {top}
            <View style={[styles.container, styles[`size_${size}`]]}>
                {left}
                {center || <Spacer />}
                <Row spacing={12}>{right}</Row>
            </View>
        </Column>
    )
}
ActionBar.Header = Header
