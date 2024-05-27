import React, { ReactNode, useState } from 'react'
import { StyleSheet, Text as NativeText, View } from 'react-native'

import { Row } from '@zeal/uikit/Row'

import { uuid } from '@zeal/toolkit/Crypto'

import { colors } from '../colors'
import { Column } from '../Column'
import { styles as textStyles, Text } from '../Text'

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceDefault,
        overflow: 'hidden',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    containerRounded: {
        borderRadius: 12,
    },
    title_neutral: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusNeutralOnColor,
    },
    title_success: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusSuccessOnColor,
    },
    title_critical: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusCriticalOnColor,
    },
    title_warning: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusWarningOnColor,
    },
    background_neutral: {
        backgroundColor: colors.backgroundAlertNeutral,
    },
    background_success: {
        backgroundColor: colors.backgroundAlertSuccess,
    },
    background_critical: {
        backgroundColor: colors.backgroundAlertCritical,
    },
    background_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },
})

type Variant = 'neutral' | 'success' | 'critical' | 'warning'

type Props = {
    variant: Variant
    title: ReactNode
    subtitle?: ReactNode
    right?: ReactNode
    rounded?: boolean
}

export const BannerSolid = ({
    title,
    subtitle,
    variant,
    rounded,
    right,
}: Props) => {
    const [labelId] = useState(uuid())
    const [descriptionId] = useState(uuid())

    return (
        <View
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            style={[
                styles.container,
                styles[`background_${variant}`],
                rounded && styles.containerRounded,
            ]}
        >
            <View>
                <Column spacing={8}>
                    <Row spacing={0} alignX="stretch">
                        {title && (
                            <NativeText
                                id={labelId}
                                style={styles[`title_${variant}`]}
                            >
                                {title}
                            </NativeText>
                        )}
                        {right}
                    </Row>

                    {subtitle && (
                        <Text
                            id={descriptionId}
                            variant="paragraph"
                            weight="regular"
                            color="textPrimary"
                        >
                            {subtitle}
                        </Text>
                    )}
                </Column>
            </View>
        </View>
    )
}
