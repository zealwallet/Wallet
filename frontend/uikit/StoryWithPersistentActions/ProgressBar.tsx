import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { ProgressThin } from '@zeal/uikit/ProgressThin'
import { StoryPage } from '@zeal/uikit/StoryWithPersistentActions/StoryWithPersistentActions'

import { notReachable } from '@zeal/toolkit'
import { RangeInt } from '@zeal/toolkit/Range'

type Props = {
    stories: StoryPage[]
    currentSlide: number
    animationTimeMs: number
    onMsg: (msg: Msg) => void
}

export type Msg = {
    type: 'on_progress_bar_clicked'
    step: number
}

const styles = StyleSheet.create({
    progressContainer: {
        width: 46,
    },
})

export const ProgressBar = ({
    onMsg,
    stories,
    currentSlide,
    animationTimeMs,
}: Props) => {
    return (
        <>
            {stories.map((story, index) => {
                const currentSlideState = getCurrentSlideState(
                    index,
                    currentSlide
                )
                switch (currentSlideState) {
                    case 'completed_slide':
                        return (
                            <ProgressButton
                                key={`${story.title}${index}`}
                                onMsg={onMsg}
                                index={index}
                                animationTimeMs={animationTimeMs}
                                initialProgress={100}
                                progress={100}
                            ></ProgressButton>
                        )
                    case 'current_slide':
                        return (
                            <ProgressButton
                                key={`${story.title}${index}`}
                                onMsg={onMsg}
                                index={index}
                                animationTimeMs={animationTimeMs}
                                initialProgress={0}
                                progress={100}
                            ></ProgressButton>
                        )
                    case 'not_completed_slide':
                        return (
                            <ProgressButton
                                key={`${story.title}${index}`}
                                onMsg={onMsg}
                                index={index}
                                animationTimeMs={animationTimeMs}
                                initialProgress={0}
                                progress={0}
                            ></ProgressButton>
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(currentSlideState)
                }
            })}
        </>
    )
}

type CurrentSlideState =
    | 'completed_slide'
    | 'current_slide'
    | 'not_completed_slide'

const getCurrentSlideState = (
    currentIndex: number,
    currentSelectedItem: number
): CurrentSlideState => {
    switch (true) {
        case currentIndex < currentSelectedItem: {
            return 'completed_slide'
        }

        case currentIndex === currentSelectedItem: {
            return 'current_slide'
        }

        case currentIndex > currentSelectedItem: {
            return 'not_completed_slide'
        }

        /* istanbul ignore next */
        default:
            throw new Error('imposable state')
    }
}

type ProgressButtonProps = {
    onMsg: (msg: Msg) => void
    index: number
    animationTimeMs: number
    initialProgress: RangeInt<0, 100>
    progress: RangeInt<0, 100>
}

const ProgressButton = ({
    onMsg,
    index,
    animationTimeMs,
    initialProgress,
    progress,
}: ProgressButtonProps) => {
    return (
        <Pressable
            onPress={() => {
                onMsg({
                    type: 'on_progress_bar_clicked',
                    step: index,
                })
            }}
            key={index}
            style={[styles.progressContainer]}
        >
            <ProgressThin
                initialProgress={initialProgress}
                progress={progress}
                background="primary"
                animationTimeMs={animationTimeMs}
            />
        </Pressable>
    )
}
