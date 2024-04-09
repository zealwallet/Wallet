import React, { useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { noop } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'

import { colors } from '../colors'
import { Column } from '../Column'
import { Row } from '../Row'
import { Text } from '../Text'

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.surfaceDefault,
        borderColor: colors.surfaceDefault,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    buttonError: {
        borderColor: colors.borderError,
    },
})

type Props = {
    errored?: boolean

    right: React.ReactNode
    left: React.ReactNode

    message?: React.ReactNode
    sideMessage?: React.ReactNode
    ctaButton?: React.ReactNode
} & (
    | {
          disabled?: false
          onClick: () => void
      }
    | { disabled: true }
)

export const FeeInputButton = (props: Props) => {
    const { right, left } = props
    const [labelId] = useState(uuid())
    const [descriptionId] = useState(uuid())

    return (
        <Column spacing={8}>
            <Pressable
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                style={[styles.button, props.errored && styles.buttonError]}
                role="button"
                disabled={props.disabled}
                onPress={props.disabled ? noop : props.onClick}
            >
                <Row spacing={4} alignX="stretch">
                    <Row id={labelId} spacing={4}>
                        {left}
                    </Row>

                    <Row id={descriptionId} spacing={12}>
                        {right}
                    </Row>
                </Row>
            </Pressable>

            {(props.message || props.ctaButton) && (
                <Row spacing={4} alignX="stretch">
                    {props.message && (
                        <Text
                            variant="caption1"
                            weight="regular"
                            color={
                                props.errored ? 'textError' : 'textSecondary'
                            }
                        >
                            {props.message}
                        </Text>
                    )}

                    {props.ctaButton}
                </Row>
            )}
        </Column>
    )
}
