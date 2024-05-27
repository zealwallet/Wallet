import React from 'react'
import { StyleSheet, View } from 'react-native'

import { notReachable } from '@zeal/toolkit'

import { Animation } from '../Animation'
import { Column } from '../Column'
import { Screen } from '../Screen'
import { Text } from '../Text'

type Props = {
    title: React.ReactNode
    onAnimationComplete: () => void
}

const styles = StyleSheet.create({
    spacer: {
        flexShrink: 1,
        height: 142,
    },
})

export const SuccessLayout = ({ title, onAnimationComplete }: Props) => {
    return (
        <Screen padding="main" background="light" onNavigateBack={null}>
            <View style={styles.spacer} />

            <Column spacing={16} shrink alignX="center">
                <Animation
                    loop={false}
                    animation="success"
                    onAnimationEvent={(event) => {
                        switch (event) {
                            case 'complete':
                                onAnimationComplete()
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(event)
                        }
                    }}
                    size={100}
                />

                <Text variant="callout" weight="medium" color="textPrimary">
                    {title}
                </Text>
            </Column>
        </Screen>
    )
}
