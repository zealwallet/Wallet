import React, { ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { notReachable } from '@zeal/toolkit'

import { Animation } from '../Animation'
import { colors } from '../colors'
import { Column } from '../Column'
import { Divider } from '../Divider'
import { BoldCrossOctagon } from '../Icon/BoldCrossOctagon'
import { BoldDangerTriangle } from '../Icon/BoldDangerTriangle'
import { BoldSend } from '../Icon/BoldSend'
import { Spacer } from '../Spacer'
import { Spinner } from '../Spinner'
import { Text } from '../Text'

const contentStyles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: 'hidden',
        flexGrow: 1,
        flexBasis: 0,
    },
    content: {
        backgroundColor: colors.surfaceDefault,
        flexGrow: 1,
        flexBasis: 0,
    },
    scrollableContent: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        minHeight: '100%',
    },
    footer: {
        backgroundColor: colors.surfaceDefault,
    },
})

type Props = {
    header?: ReactNode
    footer?: ReactNode
    children: ReactNode
}

export const Content = ({ header, children, footer }: Props) => {
    return (
        <View style={contentStyles.container}>
            {header}
            <View style={contentStyles.content}>
                <ScrollView
                    contentContainerStyle={contentStyles.scrollableContent}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </View>
            {footer && (
                <View>
                    <Divider variant="default" />
                    <View style={contentStyles.footer}>{footer}</View>
                </View>
            )}
        </View>
    )
}

const headerStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.surfaceDefault,
    },
})

Content.Header = ({
    title,
    titleId,
    subtitle,
}: {
    title: ReactNode
    titleId?: string
    subtitle?: ReactNode
}) => {
    return (
        <>
            <View style={headerStyles.container}>
                <Column spacing={6}>
                    <Text
                        id={titleId}
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        {title}
                    </Text>

                    {subtitle && (
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            {subtitle}
                        </Text>
                    )}
                </Column>
            </View>
            <Divider variant="default" />
        </>
    )
}

const splashStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        rowGap: 16,
        alignItems: 'center',
    },
})

Content.Splash = ({
    title,
    variant,
    onAnimationComplete,
}: {
    title: React.ReactNode
    variant:
        | 'spinner'
        | 'success'
        | 'error'
        | 'stop'
        | 'paper-plane'
        | 'warning'
    onAnimationComplete: (() => void) | null
}) => {
    // TODO This component break footer if too much content
    return (
        <View style={splashStyles.container}>
            <Spacer />

            {(() => {
                switch (variant) {
                    case 'spinner':
                        return <Spinner size={72} color="iconStatusNeutral" />

                    case 'success':
                        return (
                            <Animation
                                animation="success"
                                size={72}
                                loop={false}
                                onAnimationEvent={(event) => {
                                    switch (event) {
                                        case 'complete':
                                            onAnimationComplete?.()
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(event)
                                    }
                                }}
                            />
                        )
                    case 'warning':
                        return (
                            <BoldDangerTriangle
                                color="iconStatusWarning"
                                size={72}
                            />
                        )
                    case 'error':
                        return (
                            <BoldDangerTriangle
                                color="iconStatusCritical"
                                size={72}
                            />
                        )

                    case 'stop':
                        return (
                            <BoldCrossOctagon
                                color="iconStatusNeutral"
                                size={72}
                            />
                        )

                    case 'paper-plane':
                        return <BoldSend color="iconStatusNeutral" size={72} />

                    /* istanbul ignore next */
                    default:
                        notReachable(variant)
                }
            })()}

            <Text
                variant="title2"
                weight="bold"
                color="textPrimary"
                align="center"
            >
                {title}
            </Text>

            <Spacer />
        </View>
    )
}
