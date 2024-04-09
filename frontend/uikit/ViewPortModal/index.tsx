import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { Modal } from '@zeal/uikit/Modal'

type Props = {
    children: ReactNode
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 600,
        width: 360,
        borderRadius: 12,
        overflow: 'hidden',
    },
})

export const ViewPortModal = ({ children }: Props) => (
    <Modal>
        <View style={styles.container}>{children}</View>
    </Modal>
)
