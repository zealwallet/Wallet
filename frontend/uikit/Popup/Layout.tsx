import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { colors } from '../colors'
import { Extractor } from '../Extractor'
import { Modal } from '../Modal'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
        flexGrow: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.backgroundOverlay,
    },
    fixedViewPort: {
        position: 'absolute',
        width: 360,
        height: 600,
        borderRadius: 12,
    },
    stopper: {
        minHeight: 56,
        flexShrink: 0,
        flexGrow: 1,
        width: '100%',
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'auto' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
    dynamic: {
        flexDirection: 'column',
        overflow: 'hidden',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 16,
        flexShrink: 1,
    },
    contentContainer: {
        flexDirection: 'column',
        rowGap: 24,
    },
    background_surfaceDefault: {
        backgroundColor: colors.surfaceDefault,
    },
    background_backgroundLight: {
        backgroundColor: colors.backgroundLight,
    },
})

type Props = {
    children: React.ReactNode
    background?: Extractor<keyof typeof styles, 'background'>
    'aria-labelledby'?: string
    'aria-describedby'?: string
    fixedViewPort?: boolean
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const Layout = ({
    children,
    background = 'backgroundLight',
    onMsg,
    fixedViewPort,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
}: Props) => {
    const inset = useSafeAreaInsets()
    return (
        <Modal
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
        >
            <View
                style={[
                    styles.container,
                    fixedViewPort && styles.fixedViewPort,
                ]}
            >
                <Pressable
                    style={styles.stopper}
                    onPress={() => onMsg({ type: 'close' })}
                />
                <View
                    style={[
                        styles.dynamic,
                        inset.bottom > 0 && { paddingBottom: inset.bottom },
                        background && styles[`background_${background}`],
                    ]}
                >
                    <View style={styles.contentContainer}>{children}</View>
                </View>
            </View>
        </Modal>
    )
}
