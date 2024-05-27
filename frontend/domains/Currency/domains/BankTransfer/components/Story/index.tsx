import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { StoryWithPersistentActions } from '@zeal/uikit/StoryWithPersistentActions'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof StoryWithPersistentActions>
    | { type: 'on_stories_dismissed' }

export const Story = ({ installationId, onMsg }: Props) => {
    useEffect(() => {
        postUserEvent({
            type: 'StoryFlowStartedEvent',
            name: 'bank_transfers',
            installationId,
        })
    }, [installationId])

    return (
        <StoryWithPersistentActions
            stories={[
                {
                    title: (
                        <FormattedMessage
                            id="bank_transfers.story.free_fast_bank_transfers"
                            defaultMessage="Free, fast bank transfers"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="bank_transfers.story_cta.transfer_between_your_local_currency"
                            defaultMessage="Transfer between your local currency & USDC"
                        />
                    ),
                    artworkSrc: 'transfers',
                },
            ]}
            actions={{
                primary: {
                    title: (
                        <FormattedMessage
                            id="bank_transfers.story_cta.get_started"
                            defaultMessage="Get started"
                        />
                    ),
                    onClick: () => onMsg({ type: 'on_stories_completed' }),
                },
                secondary: {
                    title: (
                        <FormattedMessage
                            id="bank_transfers.story_cta.back"
                            defaultMessage="Back"
                        />
                    ),
                    onClick: () => {
                        postUserEvent({
                            type: 'StoryFlowDismissedEvent',
                            name: 'bank_transfers',
                            installationId,
                        })
                        onMsg({ type: 'on_stories_dismissed' })
                    },
                },
            }}
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_stories_completed':
                        postUserEvent({
                            type: 'StoryFlowFinishedEvent',
                            name: 'bank_transfers',
                            installationId,
                        })
                        break
                    case 'on_next_slide_shown':
                        postUserEvent({
                            type: 'StoryFlowAdvancedEvent',
                            name: 'bank_transfers',
                            slideNumber: msg.currentSlide,
                            installationId,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }
            }}
        />
    )
}
