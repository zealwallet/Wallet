import React from 'react'
import { FormattedMessage } from 'react-intl'

import { StoryWithPersistentActions } from '@zeal/uikit/StoryWithPersistentActions'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof StoryWithPersistentActions>,
          { type: 'on_stories_completed' }
      >
    | { type: 'on_stories_dismissed' }

export const Stories = ({ onMsg, installationId }: Props) => {
    return (
        <StoryWithPersistentActions
            stories={[
                {
                    title: (
                        <FormattedMessage
                            id="passkey-story_1.title"
                            defaultMessage="Pay network fees with stablecoins and tokens"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="passkey-story_1.subtitle"
                            defaultMessage="Forget native tokens to pay network fees. Pay fees with various tokens and forget about bridging ETH around."
                        />
                    ),
                    artworkSrc: 'stables',
                },
                {
                    title: (
                        <FormattedMessage
                            id="passkey-story_2.title"
                            defaultMessage="Powered by Safe"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="passkey-story_2.subtitle"
                            defaultMessage="The industry-leading Safe smart contracts are battle-tested and secure more than $65 billion in more than 20 million wallets."
                        />
                    ),
                    artworkSrc: 'safe',
                },
                {
                    title: (
                        <FormattedMessage
                            id="passkey-story_3.title"
                            defaultMessage="Major EVM networks supported"
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="passkey-story_3.subtitle"
                            defaultMessage="Smart wallets work in only some networks for now. Check the supported networks before sending assets."
                        />
                    ),
                    artworkSrc: 'networks',
                },
            ]}
            actions={{
                primary: {
                    title: (
                        <FormattedMessage
                            id="actions.continue"
                            defaultMessage="Continue"
                        />
                    ),
                    onClick: () => onMsg({ type: 'on_stories_completed' }),
                },
                secondary: {
                    title: (
                        <FormattedMessage
                            id="actions.back"
                            defaultMessage="Back"
                        />
                    ),
                    onClick: () => {
                        postUserEvent({
                            type: 'StoryFlowDismissedEvent',
                            name: 'safe',
                            installationId,
                        })
                        onMsg({ type: 'on_stories_dismissed' })
                    },
                },
            }}
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_next_slide_shown':
                        postUserEvent({
                            type: 'StoryFlowAdvancedEvent',
                            name: 'safe',
                            slideNumber: msg.currentSlide,
                            installationId,
                        })
                        break

                    case 'on_stories_completed':
                        postUserEvent({
                            type: 'StoryFlowFinishedEvent',
                            name: 'safe',
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
