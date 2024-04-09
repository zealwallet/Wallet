import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Avatar } from '../Avatar'
import { InfoCircle } from '../Icon/InfoCircle'
import { IconButton } from '../IconButton'
import { Row } from '../Row'
import { Text } from '../Text'

const styles = StyleSheet.create({
    layout: {
        alignItems: 'center',
        paddingTop: 12,
        rowGap: 16,
        width: '100%',
    },

    text: {
        alignItems: 'center',
        flexShrink: 1,
        rowGap: 8,
        width: '100%',
    },
})

type Props = {
    icon?: (_: { size: number; color: 'iconAccent2' }) => React.ReactNode
    title: React.ReactNode
    titleId?: string
    onInfoIconClick?: () => void
    subtitle?: React.ReactNode
    subtitleId?: string
}

export const Header = ({
    title,
    titleId,
    subtitle,
    subtitleId,
    onInfoIconClick,
    icon,
}: Props) => {
    return (
        <View style={styles.layout}>
            {icon && (
                <Avatar size={72} backgroundColor="backgroundLight">
                    {icon({ size: 48, color: 'iconAccent2' })}
                </Avatar>
            )}

            <View style={styles.text}>
                <Row spacing={4} alignY="start">
                    <Text
                        id={titleId}
                        variant="title2"
                        weight="bold"
                        color="textPrimary"
                        align="center"
                    >
                        {title}
                    </Text>

                    {onInfoIconClick && (
                        <IconButton
                            variant="on_light"
                            onClick={onInfoIconClick}
                        >
                            {({ color }) => (
                                <InfoCircle size={18} color={color} />
                            )}
                        </IconButton>
                    )}
                </Row>

                {subtitle && (
                    <Text
                        id={subtitleId}
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                        align="center"
                    >
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>
    )
}
