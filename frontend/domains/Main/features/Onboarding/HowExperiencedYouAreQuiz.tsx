import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldGlasses } from '@zeal/uikit/Icon/BoldGlasses'
import { Question } from '@zeal/uikit/Icon/Question'
import { SolidFilesBook } from '@zeal/uikit/Icon/SolidFilesBook'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_used_web3_before_click' }
    | { type: 'on_new_to_web3_click' }
    | { type: 'close' }

export const HowExperiencedYouAreQuiz = ({ installationId, onMsg }: Props) => {
    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => {
                            onMsg({ type: 'close' })
                        }}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={24}>
                <Header
                    icon={({ color, size }) => (
                        <Question size={size} color={color} />
                    )}
                    title={
                        <FormattedMessage
                            id="main.onboarding.how_experienced_you_are.title"
                            defaultMessage="Have you used a self-custodial web3 wallet before?"
                        />
                    }
                />
                <Column spacing={8} alignX="center">
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            onClick={() => {
                                postUserEvent({
                                    type: 'UserSurveyAnsweredEvent',
                                    survey: 'how_experienced_you_are',
                                    answer: 'used_web3_before',
                                    installationId,
                                })
                                onMsg({ type: 'on_used_web3_before_click' })
                            }}
                            avatar={({ size }) => (
                                <BoldGlasses color="iconAccent2" size={size} />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="main.onboarding.how_experienced_you_are.used_web_3_before"
                                    defaultMessage="I’ve used web3 before"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="main.onboarding.how_experienced_you_are.learn_why"
                                    defaultMessage="Learn why Zeal is the better choice"
                                />
                            }
                        />
                    </Group>
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            onClick={() => {
                                postUserEvent({
                                    type: 'UserSurveyAnsweredEvent',
                                    survey: 'how_experienced_you_are',
                                    answer: 'new_to_web3',
                                    installationId,
                                })

                                onMsg({ type: 'on_new_to_web3_click' })
                            }}
                            avatar={({ size }) => (
                                <SolidFilesBook
                                    color="iconAccent2"
                                    size={size}
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="main.onboarding.how_experienced_you_are.new_to_web_3"
                                    defaultMessage="I’m new to web3"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="main.onboarding.how_experienced_you_are.learn_basics"
                                    defaultMessage="Learn the basics of web3"
                                />
                            }
                        />
                    </Group>
                </Column>
            </Column>
        </Screen>
    )
}
