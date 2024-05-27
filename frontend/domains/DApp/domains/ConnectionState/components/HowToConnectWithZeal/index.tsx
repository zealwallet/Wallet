import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { StoryWithActionsInTheEnd } from '@zeal/uikit/StoryWithActionsInTheEnd'

import { notReachable } from '@zeal/toolkit'

import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const HowToConnectWithZeal = ({ installationId, onMsg }: Props) => {
    useEffect(() => {
        postUserEvent({
            type: 'StoryFlowStartedEvent',
            name: 'how_to_connect',
            installationId,
        })
    }, [installationId])
    return (
        <StoryWithActionsInTheEnd
            stories={[
                {
                    title: (
                        <FormattedMessage
                            id="connection.diconnected.page1.title"
                            defaultMessage="How to connect with Zeal?"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="connection.diconnected.page1.subtitle"
                            defaultMessage="Zeal works everywhere Metamask works. Simply connect as you would with Metamask"
                        />
                    ),
                    artworkSrc: 'connectionStory1',
                },
                {
                    title: (
                        <FormattedMessage
                            id="connection.diconnected.page2.title"
                            defaultMessage="Click Connect Wallet"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="connection.diconnected.page2.subtitle"
                            defaultMessage="You’ll see lot of options. Zeal might be one of them. If Zeal doesn’t appear..."
                        />
                    ),
                    artworkSrc: 'connectionStory2',
                },
                {
                    title: (
                        <FormattedMessage
                            id="connection.diconnected.page3.title"
                            defaultMessage="Choose Metamask"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="connection.diconnected.page3.subtitle"
                            defaultMessage="We’ll prompt a connection with Zeal. Browser or Injected should work as well. Try it!"
                        />
                    ),
                    artworkSrc: 'connectionStory3',
                },
            ]}
            mainCtaTitle={
                <FormattedMessage
                    id="connection.diconnected.got_it"
                    defaultMessage="Got it!"
                />
            }
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_next_click':
                        postUserEvent({
                            type: 'StoryFlowAdvancedEvent',
                            name: 'how_to_connect',
                            slideNumber: msg.slide,
                            installationId,
                        })
                        break

                    case 'on_stories_completed':
                        postUserEvent({
                            type: 'StoryFlowFinishedEvent',
                            name: 'how_to_connect',
                            installationId,
                        })
                        onMsg({ type: 'close' })
                        break
                    case 'on_stories_dismissed':
                        postUserEvent({
                            type: 'StoryFlowDismissedEvent',
                            name: 'how_to_connect',
                            installationId,
                        })
                        onMsg({ type: 'close' })
                        break
                    /* istanbul ignore next */
                    default:
                        notReachable(msg)
                }
            }}
        />
    )
}
