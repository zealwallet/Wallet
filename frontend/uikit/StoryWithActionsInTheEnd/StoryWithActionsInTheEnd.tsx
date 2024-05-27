import React, { memo, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Pressable, StyleSheet, View } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import LottieView from 'lottie-react-native'

import { Modal } from '@zeal/uikit/Modal'
import { Screen } from '@zeal/uikit/Screen'

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

const SafeTouchableDistanceMobile = 48

const styles = StyleSheet.create({
    artworkWr: {
        backgroundColor: colors.backgroundLight,
        position: 'relative',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        overflow: 'hidden',
        justifyContent: 'center',

        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return { minHeight: 360 }
                case 'web':
                    return {
                        minHeight: 320,
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
    artwork: {
        backgroundColor: colors.backgroundLight,
        flexGrow: 1,
    },
    actionBar: {
        position: 'absolute',
        top: 0,
        zIndex: 1,
        width: '100%',
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    container: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.surfaceDefault,
        width: '100%',
        left: 0,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return { marginTop: 28 + SafeTouchableDistanceMobile }
                case 'web':
                    return {
                        marginTop: 28,
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
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
        justifyContent: 'space-between',
        flexGrow: 1,
        flexShrink: 1,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return { paddingBottom: 0 }
                case 'web':
                    return { paddingBottom: 16 }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
    text: {
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
    buttonContainer: {
        width: 42,
        height: 42,
    },
})
export type Props = {
    stories: StoryWithActionsInTheEndPage[]
    mainCtaTitle: React.ReactNode
    onMsg: (msg: Msg) => void
}

type ArtworkSrc =
    | 'beta'
    | 'connectionStory1'
    | 'connectionStory2'
    | 'connectionStory3'
    | 'howToConnectToMetamask'
    | 'networks'
    | 'safety'
    | 'safe'
    | 'stables'
    | 'transfers'

export type StoryWithActionsInTheEndPage = {
    title: React.ReactNode
    subtitle?: React.ReactNode
    artworkSrc: ArtworkSrc
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
            <Screen
                padding="story"
                background="default"
                onNavigateBack={() => onMsg({ type: 'on_stories_dismissed' })}
            >
                <Overlay
                    onClick={() => {
                        onMsg({ type: 'on_stories_dismissed' })
                    }}
                />
                <View style={styles.container}>
                    <View style={styles.artworkWr}>
                        <View style={styles.actionBar}>
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
                        </View>
                        <LinearGradient
                            style={styles.shadow}
                            colors={[
                                'rgba(3, 6, 15, 0)',
                                'rgba(3, 6, 15, 0.03)',
                            ]}
                        />
                        <ArtworkPlayer
                            key={page.artworkSrc}
                            art={page.artworkSrc}
                        />
                    </View>
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
                                <Row spacing={0} grow shrink>
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_stories_completed',
                                            })
                                        }}
                                    >
                                        {mainCtaTitle}
                                    </Button>
                                </Row>
                            ) : (
                                <Row spacing={12} alignX="center">
                                    <Row
                                        grow
                                        shrink
                                        ignoreContentWidth
                                        fullWidth
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
                                    <View style={styles.buttonContainer}>
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
                                            <ForwardIcon
                                                size={16}
                                                color="iconDefaultOnDark"
                                            />
                                        </Button>
                                    </View>
                                </Row>
                            )}
                        </View>
                    </View>
                </View>
            </Screen>
        </Modal>
    )
}

const ArtworkPlayer = memo(({ art }: { art: ArtworkSrc }) => {
    const source = useMemo(() => {
        switch (art) {
            case 'beta':
                return require('./assets/beta.json')
            case 'connectionStory1':
                return require('./assets/connection_story_1.json')
            case 'connectionStory2':
                return require('./assets/connection_story_2.json')
            case 'connectionStory3':
                return require('./assets/connection_story_3.json')
            case 'howToConnectToMetamask':
                return require('./assets/how_to_connect_to_metamask.json')
            case 'networks':
                return require('./assets/networks.json')
            case 'safety':
                return require('./assets/safety.json')
            case 'safe':
                return require('./assets/safe.json')
            case 'stables':
                return require('./assets/stables.json')
            case 'transfers':
                return require('./assets/transfers.json')
            /* istanbul ignore next */
            default:
                return notReachable(art)
        }
    }, [art])
    return (
        <LottieView
            source={source}
            style={styles.artwork}
            webStyle={styles.artwork}
            autoPlay
            loop
        />
    )
})
