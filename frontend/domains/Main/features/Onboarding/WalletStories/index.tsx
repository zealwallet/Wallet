import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import {
    StoryPage,
    StoryWithPersistentActions,
} from '@zeal/uikit/StoryWithPersistentActions'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { SelectTypeOfAccountToAdd } from '@zeal/domains/Account/components/SelectTypeOfAccountToAdd'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Modal, State as ModalState } from './Modal'

import { HowExperiencedYouAreQuiz } from '../HowExperiencedYouAreQuiz'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

export const STORY_SLIDES: StoryPage[] = [
    {
        title: (
            <FormattedMessage
                id="onboarding.story.multi_network_wallet.title"
                defaultMessage="Zeal is a wallet for all Ethereum-based networks, and it works everywhere"
            />
        ),
        artworkSrc: 'networks',
    },
    {
        title: (
            <FormattedMessage
                id="onboarding.story.smart_portfolio.title"
                defaultMessage="See your entire portfolio. Tokens, DeFi and NFTs"
            />
        ),
        artworkSrc: 'portfolio',
    },
    {
        title: (
            <FormattedMessage
                id="onboarding.story.safety_checks.title"
                defaultMessage="Protect against scams, and preview every transaction"
            />
        ),
        artworkSrc: 'safe',
    },
    {
        title: (
            <FormattedMessage
                id="onboarding.story.bank_tranasfers.title"
                defaultMessage="Free and instant bank transfers"
            />
        ),
        artworkSrc: 'transfers',
    },
]

export type NextAction = Exclude<
    | MsgOf<typeof SelectTypeOfAccountToAdd>
    | MsgOf<typeof HowExperiencedYouAreQuiz>,
    { type: 'close' }
>

type Msg = {
    type: 'story_completed'
    nextAction: NextAction
}

export const WalletStories = ({ installationId, onMsg }: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    useEffect(() => {
        postUserEvent({
            type: 'StoryFlowStartedEvent',
            name: 'onboarding',
            installationId,
        })
    }, [installationId])

    return (
        <>
            <StoryWithPersistentActions
                stories={STORY_SLIDES}
                actions={{
                    primary: {
                        title: <PrimaryCTA />,
                        onClick: () => {
                            switch (ZealPlatform.OS) {
                                case 'ios':
                                case 'android':
                                    onMsg({
                                        type: 'story_completed',
                                        nextAction: {
                                            type: 'safe_wallet_clicked',
                                        },
                                    })
                                    break
                                case 'web':
                                    setState({
                                        type: 'how_experienced_you_are',
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(ZealPlatform.OS)
                            }
                        },
                    },
                    secondary: {
                        title: (
                            <FormattedMessage
                                id="main.onboarding.story.secondary_cta.title"
                                defaultMessage="Existing wallet"
                            />
                        ),
                        onClick: () => {
                            setState({ type: 'choose_wallet_to_add' })
                            postUserEvent({
                                type: 'ExistingWalletFlowEnteredEvent',
                                name: 'onboarding',
                                installationId,
                            })
                        },
                    },
                }}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_stories_completed':
                            postUserEvent({
                                type: 'StoryFlowFinishedEvent',
                                name: 'onboarding',
                                installationId,
                            })
                            break
                        case 'on_next_slide_shown':
                            postUserEvent({
                                type: 'StoryFlowAdvancedEvent',
                                name: 'onboarding',
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
            <Modal
                state={state}
                installationId={installationId}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_used_web3_before_click':
                        case 'on_new_to_web3_click':
                        case 'create_clicked':
                        case 'hardware_wallet_clicked':
                        case 'safe_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'track_wallet_clicked':
                            setState({ type: 'closed' })
                            onMsg({ type: 'story_completed', nextAction: msg })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}

const PrimaryCTA = () => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return (
                <FormattedMessage
                    id="main.onboarding.story.primary_cta.title.mobile"
                    defaultMessage="Create wallet"
                />
            )
        case 'web':
            return (
                <FormattedMessage
                    id="main.onboarding.story.primary_cta.title"
                    defaultMessage="Get started"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
