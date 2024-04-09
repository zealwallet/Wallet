import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Column } from '../Column'
import { Row, styles as rowStyles } from '../Row'
import { Spacer } from '../Spacer'
import { Text } from '../Text'

const styles = StyleSheet.create({
    container: {
        ...rowStyles.row,
        ...rowStyles.XAlign_stretch,
        columnGap: 8,
        paddingBottom: 12,
        width: '100%',
    },
})

type Props = {
    top?: React.ReactNode
    left?: React.ReactNode
    right?: React.ReactNode
    center?: React.ReactNode
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

export const ActionBar = ({ top, left, right, center }: Props) => {
    return (
        <Column spacing={12} alignX="stretch">
            {top}
            <View style={styles.container}>
                {left}
                {center || <Spacer />}
                <Row spacing={12}>{right}</Row>
            </View>
        </Column>
    )
}
ActionBar.Header = Header
