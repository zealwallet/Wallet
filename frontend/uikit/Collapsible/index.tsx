import React, { ReactNode, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'

import { colors } from '../colors'
import { BoldSetting } from '../Icon/BoldSetting'
import { LightArrowDown2 } from '../Icon/LightArrowDown2'
import { LightArrowUp2 } from '../Icon/LightArrowUp2'
import { Spacer } from '../Spacer'
import { Text } from '../Text'

const styles = StyleSheet.create({
    collapsible: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.borderDefault,
        borderRadius: 4,
    },
    container: {
        flexDirection: 'column',
        rowGap: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    collapsibleSelected: {
        borderColor: colors.actionPrimaryDefault,
    },
})

type Props = {
    title: NonNullable<ReactNode>
    initialState: State
    role: 'button' | 'radio'
    selected: boolean
    children: ReactNode
}

type State = 'expanded' | 'collapsed'

const getAriaExpanded = (state: State): boolean => {
    switch (state) {
        case 'expanded':
            return true

        case 'collapsed':
            return false

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

export const Collapsible = ({
    title,
    children,
    role,
    initialState,
    selected,
}: Props) => {
    const [regionId] = useState(uuid())
    const [labelId] = useState(uuid())
    const [state, setState] = useState<State>(initialState)

    return (
        <View
            style={[styles.collapsible, selected && styles.collapsibleSelected]}
            id={regionId}
            role="region"
            aria-labelledby={labelId}
        >
            <View style={styles.container}>
                <Pressable
                    aria-labelledby={labelId}
                    aria-selected={selected}
                    role={role}
                    aria-expanded={getAriaExpanded(state)}
                    onPress={() => {
                        setState((old) => {
                            switch (old) {
                                case 'expanded':
                                    return 'collapsed'
                                case 'collapsed':
                                    return 'expanded'
                                default:
                                    /* istanbul ignore next */
                                    return notReachable(old)
                            }
                        })
                    }}
                >
                    <View style={styles.header}>
                        <Text
                            id={labelId}
                            color="textSecondary"
                            variant="paragraph"
                            weight="regular"
                        >
                            {title}
                        </Text>
                        <BoldSetting size={16} color="iconDefault" />
                        <Spacer />
                        {(() => {
                            switch (state) {
                                case 'expanded':
                                    return (
                                        <LightArrowUp2
                                            size={16}
                                            color="iconDefault"
                                        />
                                    )
                                case 'collapsed':
                                    return (
                                        <LightArrowDown2
                                            size={16}
                                            color="iconDefault"
                                        />
                                    )

                                /* istanbul ignore next */
                                default:
                                    return notReachable(state)
                            }
                        })()}
                    </View>
                </Pressable>
                {(() => {
                    switch (state) {
                        case 'expanded':
                            return <>{children}</>

                        case 'collapsed':
                            return null

                        /* istanbul ignore next */
                        default:
                            return notReachable(state)
                    }
                })()}
            </View>
        </View>
    )
}
