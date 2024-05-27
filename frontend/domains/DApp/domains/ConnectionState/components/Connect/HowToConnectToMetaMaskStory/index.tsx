import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { StoryWithActionsInTheEnd } from '@zeal/uikit/StoryWithActionsInTheEnd'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Modal, State as ModalState } from './Modal'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_how_to_connect_to_metamask_completed' }
    | Extract<
          MsgOf<typeof StoryWithActionsInTheEnd>,
          { type: 'on_stories_dismissed' }
      >

export const HowToConnectToMetaMaskStory = ({
    installationId,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
    useEffect(() => {
        postUserEvent({
            type: 'StoryFlowStartedEvent',
            name: 'how_to_connect_to_metamask',
            installationId,
        })
    }, [installationId])

    return (
        <>
            <Screen padding="main" background="light" onNavigateBack={null}>
                <StoryWithActionsInTheEnd
                    stories={[
                        {
                            title: (
                                <FormattedMessage
                                    id="how_to_connect_to_metamask.story.title"
                                    defaultMessage="Zeal works alongside other wallets"
                                />
                            ),
                            subtitle: (
                                <Column spacing={12}>
                                    <Text
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="how_to_connect_to_metamask.story.subtitle"
                                            defaultMessage="Easily switch between Zeal and other wallets anytime."
                                        />
                                    </Text>

                                    <Row spacing={0}>
                                        <Tertiary
                                            onClick={() =>
                                                setModalState({
                                                    type: 'show_why_switch',
                                                })
                                            }
                                            size="regular"
                                            color="on_light"
                                        >
                                            {({
                                                color,
                                                textVariant,
                                                textWeight,
                                            }) => (
                                                <>
                                                    <Text
                                                        color={color}
                                                        variant={textVariant}
                                                        weight={textWeight}
                                                    >
                                                        Learn more
                                                    </Text>
                                                    <LightArrowRight2
                                                        size={16}
                                                        color={color}
                                                    />
                                                </>
                                            )}
                                        </Tertiary>
                                    </Row>
                                </Column>
                            ),
                            artworkSrc: 'howToConnectToMetamask',
                        },
                    ]}
                    mainCtaTitle={
                        <FormattedMessage
                            id="action.continue"
                            defaultMessage="Continue"
                        />
                    }
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_next_click':
                                postUserEvent({
                                    type: 'StoryFlowAdvancedEvent',
                                    name: 'how_to_connect_to_metamask',
                                    slideNumber: msg.slide,
                                    installationId,
                                })
                                break

                            case 'on_stories_completed':
                                postUserEvent({
                                    type: 'StoryFlowFinishedEvent',
                                    name: 'how_to_connect_to_metamask',
                                    installationId,
                                })
                                onMsg({
                                    type: 'on_how_to_connect_to_metamask_completed',
                                })
                                break
                            case 'on_stories_dismissed':
                                postUserEvent({
                                    type: 'StoryFlowDismissedEvent',
                                    name: 'how_to_connect_to_metamask',
                                    installationId,
                                })
                                onMsg(msg)
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            </Screen>

            <Modal
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        default:
                            notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
