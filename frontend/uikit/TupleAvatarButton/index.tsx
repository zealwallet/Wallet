import React from 'react'
import {
    Pressable,
    PressableStateCallbackType,
    StyleSheet,
    View,
} from 'react-native'

import { AvatarSize } from '../Avatar'
import { BorderColor, Color, colors } from '../colors'

type RenderProps = {
    size: AvatarSize
    border: BorderColor | null
    backgroundColor: Color
}

type Props = {
    left: (_: RenderProps) => React.ReactNode
    right: (_: RenderProps) => React.ReactNode
    onClick: () => void
}

const AVATAR_SIZE: AvatarSize = 24
const PILL_SIZE = AVATAR_SIZE + 2

const styles = StyleSheet.create({
    fill: {
        width: '100%',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: PILL_SIZE,
        borderRadius: 50,
    },
    left_container: {},
    right_container: {
        position: 'relative',
        marginLeft: -4,
    },
    container_hovered: {
        backgroundColor: colors.borderSecondary,
    },
    container_pressed: {
        backgroundColor: colors.darkActionSecondaryDefault,
    },
})

const getAvatarBackground = ({
    pressed,
    hovered,
}: PressableStateCallbackType): Color => {
    if (pressed) {
        return 'darkActionSecondaryDefault'
    }

    if (hovered) {
        return 'borderSecondary'
    }

    return 'backgroundLight'
}

const getAvatarBorder = ({
    pressed,
    hovered,
}: PressableStateCallbackType): BorderColor | null => {
    if (pressed) {
        return 'borderSecondaryPressed'
    }

    if (hovered) {
        return 'borderSecondary'
    }

    return null
}

export const TupleAvatarButton = ({ left, right, onClick }: Props) => {
    return (
        <Pressable onPress={onClick}>
            {({ pressed, hovered }) => {
                return (
                    <>
                        <View
                            style={[
                                styles.container,
                                hovered && styles.container_hovered,
                                pressed && styles.container_pressed,
                            ]}
                        >
                            <View style={styles.left_container}>
                                {left({
                                    size: AVATAR_SIZE,
                                    backgroundColor: getAvatarBackground({
                                        hovered,
                                        pressed,
                                    }),
                                    border: getAvatarBorder({
                                        hovered,
                                        pressed,
                                    }),
                                })}
                            </View>

                            <View style={styles.right_container}>
                                {right({
                                    size: AVATAR_SIZE,
                                    backgroundColor: getAvatarBackground({
                                        hovered,
                                        pressed,
                                    }),
                                    border: getAvatarBorder({
                                        hovered,
                                        pressed,
                                    }),
                                })}
                            </View>
                        </View>
                    </>
                )
            }}
        </Pressable>
    )
}
