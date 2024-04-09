import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import {
    ImageBackground,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import { Modal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { ActionBar } from '../ActionBar'
import { Button } from '../Button'
import { colors } from '../colors'
import { BackIcon } from '../Icon/BackIcon'
import { CloseCross } from '../Icon/CloseCross'
import { ForwardIcon } from '../Icon/ForwardIcon'
import { IconButton } from '../IconButton'
import { Overlay } from '../Overlay'
import { ProgressThin } from '../ProgressThin'
import { Row } from '../Row'
import { Text } from '../Text'

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.surfaceDefault,
        marginTop: 28,
    },
    artwork: {
        height: 320,
        // @ts-ignore FIXME @resetko-zeal
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        padding: 16,
    },
    shadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 52,
    },
    textContainer: {
        padding: 16,
        flex: 1,
    },
    text: {
        flex: 1,
        rowGap: 12,
        padding: 8,
    },
    progressWrapper: {
        height: 48,
        justifyContent: 'center',
        flex: 1,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'pointer' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
})

export type Props = {
    stories: StoryWithActionsInTheEndPage[]
    mainCtaTitle: React.ReactNode
    onMsg: (msg: Msg) => void
}

export type StoryWithActionsInTheEndPage = {
    title: React.ReactNode
    subtitle?: React.ReactNode
    artworkSrc: ImageSourcePropType
}

export type Msg =
    | { type: 'on_stories_completed' }
    | { type: 'on_stories_dismissed' }
    | { type: 'on_next_click'; slide: number }

type CurrentStoryPageIndex = number

export const StoryWithActionsInTheEnd = ({
    stories,
    mainCtaTitle,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()

    const [currentStoryPageIndex, setCurrentStoryPageIndex] =
        useState<CurrentStoryPageIndex>(0)
    const page = stories[currentStoryPageIndex]
    const isFirstStory = currentStoryPageIndex === 0
    const isLastStory = currentStoryPageIndex === stories.length - 1

    return (
        <Modal>
            <View style={styles.wrapper}>
                <Overlay
                    onClick={() => {
                        onMsg({ type: 'on_stories_completed' })
                    }}
                />
                <View style={styles.container}>
                    <ImageBackground
                        source={page.artworkSrc}
                        style={[styles.artwork]}
                    >
                        <>
                            <ActionBar
                                left={
                                    isFirstStory ? null : (
                                        <IconButton
                                            variant="on_light"
                                            aria-label={formatMessage({
                                                id: 'onboarding.wallet_stories.previous',
                                                defaultMessage: 'Previous',
                                            })}
                                            onClick={() =>
                                                setCurrentStoryPageIndex(
                                                    (i) => i - 1
                                                )
                                            }
                                        >
                                            {({ color }) => (
                                                <BackIcon
                                                    size={24}
                                                    color={color}
                                                />
                                            )}
                                        </IconButton>
                                    )
                                }
                                right={
                                    <IconButton
                                        variant="on_light"
                                        aria-label={formatMessage({
                                            id: 'onboarding.wallet_stories.close',
                                            defaultMessage: 'Close',
                                        })}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_stories_dismissed',
                                            })
                                        }
                                    >
                                        {({ color }) => (
                                            <CloseCross
                                                size={24}
                                                color={color}
                                            />
                                        )}
                                    </IconButton>
                                }
                            />
                            <LinearGradient
                                style={styles.shadow}
                                colors={[
                                    'rgba(3, 6, 15, 0)',
                                    'rgba(3, 6, 15, 0.03)',
                                ]}
                            />
                        </>
                    </ImageBackground>
                    <View style={styles.textContainer}>
                        <View style={styles.text}>
                            <Text
                                variant="title2"
                                weight="bold"
                                color="textPrimary"
                            >
                                {page.title}
                            </Text>
                            <Text
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                {page.subtitle}
                            </Text>
                        </View>
                        <View>
                            {isLastStory ? (
                                <Button
                                    size="regular"
                                    variant="primary"
                                    onClick={() => {
                                        onMsg({ type: 'on_stories_completed' })
                                    }}
                                >
                                    {mainCtaTitle}
                                </Button>
                            ) : (
                                <Row spacing={12} alignX="center">
                                    <Row
                                        grow
                                        shrink
                                        ignoreContentWidth
                                        spacing={0}
                                    >
                                        {stories.map((story, index) => {
                                            const progress =
                                                index <= currentStoryPageIndex
                                                    ? 100
                                                    : 0

                                            return (
                                                <Pressable
                                                    key={index}
                                                    style={
                                                        styles.progressWrapper
                                                    }
                                                    onPress={() => {
                                                        setCurrentStoryPageIndex(
                                                            index
                                                        )
                                                    }}
                                                >
                                                    <ProgressThin
                                                        progress={progress}
                                                        initialProgress={
                                                            progress
                                                        }
                                                        animationTimeMs={0}
                                                        background="primary"
                                                    />
                                                </Pressable>
                                            )
                                        })}
                                    </Row>

                                    <View>
                                        <Button
                                            aria-label={formatMessage({
                                                id: 'actions.next',
                                                defaultMessage: 'Next',
                                            })}
                                            size="compressed"
                                            variant="primary"
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_next_click',
                                                    slide: currentStoryPageIndex,
                                                })
                                                setCurrentStoryPageIndex(
                                                    (i) => i + 1
                                                )
                                            }}
                                        >
                                            <ForwardIcon size={16} />
                                        </Button>
                                    </View>
                                </Row>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
