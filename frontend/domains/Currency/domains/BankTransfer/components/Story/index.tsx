import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { StoryWithActionsInTheEnd as UIStory } from '@zeal/uikit/StoryWithActionsInTheEnd'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof UIStory>

export const Story = ({ installationId, onMsg }: Props) => {
    useEffect(() => {
        postUserEvent({
            type: 'StoryFlowStartedEvent',
            name: 'bank_transfers',
            installationId,
        })
    }, [installationId])

    return (
        <UIStory
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
                    artworkSrc: require('./wallet_stories/bank_transfers_1.png'),
                },
            ]}
            mainCtaTitle={
                <FormattedMessage
                    id="bank_transfers.story_cta.get_started"
                    defaultMessage="Get started"
                />
            }
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_stories_completed':
                        postUserEvent({
                            type: 'StoryFlowFinishedEvent',
                            name: 'bank_transfers',
                            installationId,
                        })
                        break
                    case 'on_stories_dismissed':
                        postUserEvent({
                            type: 'StoryFlowDismissedEvent',
                            name: 'bank_transfers',
                            installationId,
                        })
                        break
                    case 'on_next_click':
                        postUserEvent({
                            type: 'StoryFlowAdvancedEvent',
                            name: 'bank_transfers',
                            slideNumber: msg.slide,
                            installationId,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }
                onMsg(msg)
            }}
        />
    )
}
