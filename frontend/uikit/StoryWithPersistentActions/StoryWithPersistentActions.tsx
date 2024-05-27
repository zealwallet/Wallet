import React, { memo, useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import LottieView from 'lottie-react-native'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { colors } from '@zeal/uikit/colors'
import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { ProgressBar } from './ProgressBar'

type Props = {
    stories: StoryPage[]
    actions: {
        primary: {
            title: React.ReactNode
            onClick: () => void
        }
        secondary: {
            title: React.ReactNode
            onClick: () => void
        }
    }

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_stories_completed' }
    | { type: 'on_next_slide_shown'; currentSlide: number }

type Artwork =
    | 'safe'
    | 'networks'
    | 'portfolio'
    | 'safety'
    | 'transfers'
    | 'beta'
    | 'connectionStory1'
    | 'connectionStory2'
    | 'connectionStory3'
    | 'howToConnectToMetamask'
    | 'stables'

export type StoryPage = {
    artworkSrc: Artwork
    title: React.ReactNode
    subtitle?: React.ReactNode
}

const SHOW_SLIDE_FOR_MS = 6000

const styles = StyleSheet.create({
    container: {
        height: 260,
        padding: 16,
        backgroundColor: colors.surfaceDefault,
    },
    artwork: { flexGrow: 1, backgroundColor: colors.backgroundLight },
    storyNextPreviousButton: {
        position: 'absolute',
        height: '100%',
        width: '50%',
    },
    storyNextSlideButton: {
        right: 0,
    },
    storyPreviousSlideButton: {
        left: 0,
    },
    actionOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    },
    shadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 52,
    },
})

type State = number

export const StoryWithPersistentActions = ({
    actions,
    stories,
    onMsg,
}: Props) => {
    const [currentSlide, setCurrentSlide] = useState<State>(0)

    const page = stories[currentSlide]
    const isLastSlide = currentSlide === stories.length - 1
    const isFirstSlide = currentSlide === 0

    useEffect(() => {
        if (!isLastSlide) {
            const timeoutId = setTimeout(() => {
                setCurrentSlide(currentSlide + 1)
            }, SHOW_SLIDE_FOR_MS)
            return () => clearTimeout(timeoutId)
        }
    }, [currentSlide, isLastSlide])

    const liveRefOnMsg = React.useRef(onMsg)
    useEffect(() => {
        if (isLastSlide) {
            liveRefOnMsg.current({ type: 'on_stories_completed' })
        }

        liveRefOnMsg.current({ type: 'on_next_slide_shown', currentSlide })
    }, [liveRefOnMsg, currentSlide, isLastSlide])

    return (
        <Screen background="default" padding="story" onNavigateBack={null}>
            <Column spacing={0} fill shrink>
                <Player key={page.artworkSrc} art={page.artworkSrc} />
                <LinearGradient
                    style={styles.shadow}
                    colors={['rgba(11, 24, 33, 0)', 'rgba(11, 24, 33, 0.03)']}
                />
                {!isFirstSlide && (
                    <Pressable
                        style={[
                            styles.storyNextPreviousButton,
                            styles.storyPreviousSlideButton,
                        ]}
                        onPress={() => {
                            setCurrentSlide((state) => state - 1)
                        }}
                    >
                        {({ hovered }) => {
                            return (
                                hovered && (
                                    <LinearGradient
                                        start={{
                                            x: 0,
                                            y: 0.5,
                                        }}
                                        end={{
                                            x: 1,
                                            y: 0.5,
                                        }}
                                        style={[styles.actionOverlay]}
                                        colors={[
                                            'rgba(11, 24, 33, 0.15)',
                                            'rgba(11, 24, 33, 0)',
                                        ]}
                                    />
                                )
                            )
                        }}
                    </Pressable>
                )}
                {!isLastSlide && (
                    <Pressable
                        style={[
                            styles.storyNextPreviousButton,
                            styles.storyNextSlideButton,
                        ]}
                        onPress={() => {
                            setCurrentSlide((state) => state + 1)
                        }}
                    >
                        {({ hovered }) => {
                            return (
                                hovered && (
                                    <LinearGradient
                                        start={{
                                            x: 1,
                                            y: 0.5,
                                        }}
                                        end={{
                                            x: 0,
                                            y: 0.5,
                                        }}
                                        style={[styles.actionOverlay]}
                                        colors={[
                                            'rgba(11, 24, 33, 0.15)',
                                            'rgba(11, 24, 33, 0)',
                                        ]}
                                    />
                                )
                            )
                        }}
                    </Pressable>
                )}
            </Column>

            <View style={[styles.container]}>
                <Column spacing={32} fill>
                    <Column spacing={8} fill alignX="center">
                        <Column spacing={8} fill alignY="center">
                            <Text
                                align="center"
                                variant="title2"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                {page.title}
                            </Text>
                            {page.subtitle && (
                                <Text
                                    variant="footnote"
                                    color="textSecondary"
                                    align="center"
                                >
                                    {page.subtitle}
                                </Text>
                            )}
                        </Column>
                        {stories.length > 1 && (
                            <Row spacing={0} alignX="center">
                                <ProgressBar
                                    stories={stories}
                                    currentSlide={currentSlide}
                                    animationTimeMs={SHOW_SLIDE_FOR_MS}
                                    onMsg={(msg) => {
                                        switch (msg.type) {
                                            case 'on_progress_bar_clicked':
                                                setCurrentSlide(msg.step)
                                                break
                                            default:
                                                notReachable(msg.type)
                                        }
                                    }}
                                ></ProgressBar>
                            </Row>
                        )}
                    </Column>
                    <Actions variant="row">
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() => {
                                actions.secondary.onClick()
                            }}
                        >
                            {actions.secondary.title}
                        </Button>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                actions.primary.onClick()
                            }}
                        >
                            {actions.primary.title}
                        </Button>
                    </Actions>
                </Column>
            </View>
        </Screen>
    )
}

const Player = memo(({ art }: { art: Artwork }) => {
    const source = useMemo(() => {
        switch (art) {
            case 'safe':
                return require('./assets/safe.json')
            case 'networks':
                return require('./assets/networks.json')
            case 'portfolio':
                return require('./assets/portfolio.json')
            case 'safety':
                return require('./assets/safety.json')
            case 'transfers':
                return require('./assets/transfers.json')
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
            case 'stables':
                return require('./assets/stables.json')

            /* istanbul ignore next */
            default:
                return notReachable(art)
        }
    }, [art])
    return (
        <LottieView
            resizeMode="cover"
            source={source}
            style={[styles.artwork]}
            autoPlay
            loop
        />
    )
})
