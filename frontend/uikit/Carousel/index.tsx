import React, { useEffect, useRef, useState } from 'react'
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { ArrowLeft2 } from '@zeal/uikit/Icon/ArrowLeft2'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Slide, SLIDE_WIDTH, SlideColorVariant, SlideData } from './Slide'

const styles = StyleSheet.create({
    carousel: {
        marginBottom: 16,
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        paddingRight: 16,
    },
    button: {
        backgroundColor: colors.actionSecondaryPressed,
        borderRadius: 24,
        padding: 4,
        margin: 0,
        position: 'absolute',
        top: '50%',
        transform: 'translate3d(0px, calc(-50% - 8px), 0)',
    },
    prevButton: {
        left: 16,
    },
    nextButton: {
        right: 16,
    },
    thumbnails: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    thumbnail: {
        backgroundColor: colors.backgroundDark,
        borderRadius: 16,
        width: 6,
        height: 6,
        opacity: 0.15,
    },
    activeThumbnail: {
        opacity: 1,
    },
})

export type Msg<T extends string> = MsgOf<typeof Slide<T>>
type Props<T extends string> = {
    slides: SlideData<T>[]
    onMsg: (msg: Msg<T>) => void
}

export const Carousel = <T extends string>({ slides, onMsg }: Props<T>) => {
    const [selectedSlide, setSelectedSlide] = useState<number>(0)
    const scrollViewRef = useRef<ScrollView>(null)
    if (!slides.length) {
        throw new Error('empty slides pass to Carousel') // Think of converting this to ImperativeError if occurs
    }

    const [firstSlideId] = useState<string>(slides[0].id)

    const { width: screenWidth } = Dimensions.get('window')
    const screenWidthLive = useLiveRef(screenWidth)

    useEffect(() => {
        const lastSlideRemoved = selectedSlide > slides.length - 1
        if (lastSlideRemoved) {
            const selectLastOne = slides.length - 1
            setSelectedSlide(selectLastOne)
        }
    }, [selectedSlide, slides.length])

    useEffect(() => {
        const offset = calculateScrollViewOffset(
            selectedSlide,
            screenWidthLive.current,
            slides.length
        )
        scrollViewRef.current?.scrollTo({ x: offset, animated: true })
    }, [selectedSlide, screenWidthLive, slides.length])

    const handleScrollEnd = (e: {
        nativeEvent: { contentOffset: { x: number } }
    }) => {
        const newIndex = Math.floor(e.nativeEvent.contentOffset.x / SLIDE_WIDTH)
        setSelectedSlide(newIndex)
    }

    return (
        <View style={styles.carousel}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={handleScrollEnd}
                style={styles.container}
            >
                {slides.map((slide, index) => (
                    <Slide
                        key={slide.id}
                        slide={slide}
                        isSelected={index === selectedSlide}
                        slideColorVariant={calculateFinalColorOfSlide(
                            slide,
                            firstSlideId
                        )}
                        onMsg={onMsg}
                    />
                ))}
            </ScrollView>
            <>
                {selectedSlide > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedSlide(selectedSlide - 1)
                        }}
                        style={[styles.button, styles.prevButton]}
                    >
                        <ArrowLeft2 size={20} color="textPrimary" />
                    </TouchableOpacity>
                )}
                {selectedSlide < slides.length - 1 && (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedSlide(selectedSlide + 1)
                        }}
                        style={[styles.button, styles.nextButton]}
                    >
                        <LightArrowRight2 size={20} color="textPrimary" />
                    </TouchableOpacity>
                )}
            </>
        </View>
    )
}

const calculateScrollViewOffset = (
    selectedSlide: number,
    screenWidth: number,
    totalNumberOfSlides: number
): number => {
    const isFirstSlide = selectedSlide === 0
    const isLastSlide = selectedSlide === totalNumberOfSlides - 1

    switch (true) {
        case isFirstSlide:
            return 0
        case isLastSlide:
            return Math.max(
                0,
                (totalNumberOfSlides - 1) * SLIDE_WIDTH -
                    (screenWidth - SLIDE_WIDTH) +
                    32
            )
        default:
            return (
                selectedSlide * SLIDE_WIDTH -
                (screenWidth / 2 - 16 - SLIDE_WIDTH / 2)
            )
    }
}

const calculateFinalColorOfSlide = <T extends string>(
    slide: SlideData<T>,
    firstSlideId: string
): SlideColorVariant => {
    switch (slide.variant) {
        case 'neutral':
            return slide.id === firstSlideId ? 'dark' : 'white'
        case 'warning':
            return 'warning'
        /* istanbul ignore next */
        default:
            return notReachable(slide.variant)
    }
}
