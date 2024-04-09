import { FormattedMessage } from 'react-intl'

import { StoryWithActionsInTheEnd } from '@zeal/uikit/StoryWithActionsInTheEnd'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof StoryWithActionsInTheEnd>,
    { type: 'on_stories_completed' | 'on_stories_dismissed' }
>

export const Stories = ({ onMsg, installationId }: Props) => {
    return (
        <StoryWithActionsInTheEnd
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
                    artworkSrc: require('./wallet_stories/1_gas_abstraction.webp'),
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
                    artworkSrc: require('./wallet_stories/2_safe_brand.webp'),
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
                            defaultMessage="Smart wallets work in only some networks for now.{br}{br}Check the supported networks before sending assets."
                            values={{
                                br: '\n',
                            }}
                        />
                    ),
                    artworkSrc: require('./wallet_stories/3_supported_networks.webp'),
                },
                {
                    title: (
                        <FormattedMessage
                            id="passkey-story_4.title"
                            defaultMessage="We’re in test mode.{br}Use with caution"
                            values={{
                                br: '\n',
                            }}
                        />
                    ),
                    subtitle: (
                        <FormattedMessage
                            id="passkey-story_4.subtitle"
                            defaultMessage="This is new experimental technology at the forefront of wallet security.{br}{br}We recommend only using Smart Wallets for testing until our official launch."
                            values={{
                                br: '\n',
                            }}
                        />
                    ),
                    artworkSrc: require('./wallet_stories/4_take_caution.webp'),
                },
            ]}
            mainCtaTitle={
                <FormattedMessage
                    id="actions.continue"
                    defaultMessage="Continue"
                />
            }
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_next_click':
                        postUserEvent({
                            type: 'StoryFlowAdvancedEvent',
                            name: 'safe',
                            slideNumber: msg.slide,
                            installationId,
                        })
                        break

                    case 'on_stories_completed':
                        postUserEvent({
                            type: 'StoryFlowFinishedEvent',
                            name: 'safe',
                            installationId,
                        })
                        onMsg(msg)
                        break
                    case 'on_stories_dismissed':
                        postUserEvent({
                            type: 'StoryFlowDismissedEvent',
                            name: 'safe',
                            installationId,
                        })
                        onMsg(msg)
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }
            }}
        />
    )
}
