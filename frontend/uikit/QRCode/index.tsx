import React from 'react'
import { StyleSheet } from 'react-native'
import { QrCodeSvg } from 'react-native-qr-svg'

type Props = {
    value: string
    size: number
    avatar: React.ReactNode
}

const styles = StyleSheet.create({
    box: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})
export const QRCode = ({ value, size, avatar }: Props) => {
    return (
        <QrCodeSvg
            value={value}
            frameSize={size}
            contentCells={5}
            content={avatar}
            contentStyle={styles.box}
        />
    )
}
