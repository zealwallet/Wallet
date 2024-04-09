import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Carousel, Msg as CarouselMsg } from '@zeal/uikit/Carousel'
import { SlideData } from '@zeal/uikit/Carousel/Slide'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    userMadeActionOnNextBestActionIds: string[]
    keystore: KeyStore
    account: Account
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg = CarouselMsg<NBAActions> & { account: Account }

const eoa = [
    'receiveTokens',
    'connectToDapp',
    'addRead-only',
    'onRamp',
    'setUpRecovery',
]
const smartWallet = [
    'receiveTokens',
    'connectToDapp',
    'addRead-only',
    'onRamp',
    'swap',
]
const readOnly = [
    'connectToDapp',
    'activateWallet',
    'swap',
    'createSmartWallet',
]

type NBAActions =
    | 'connectToDapp'
    | 'addRead-only'
    | 'onRamp'
    | 'swap'
    | 'activateWallet'
    | 'createSmartWallet'
    | 'receiveTokens'
    | 'setUpRecovery'

export const NextBestActionWidget = ({
    userMadeActionOnNextBestActionIds,
    onMsg,
    keystore,
    account,
    installationId,
}: Props) => {
    const slides: SlideData<NBAActions>[] = [
        {
            id: 'createSmartWallet' as const,
            title: (
                <FormattedMessage
                    id="slide.createSmartWallet.title"
                    defaultMessage="Create new Zeal Smart Wallet"
                />
            ),
            buttonText: (
                <FormattedMessage
                    id="slide.createSmartWallet.buttonText"
                    defaultMessage="Try the future of wallets"
                />
            ),
            variant: 'neutral' as const,
        },
        {
            id: 'receiveTokens' as const,
            title: (
                <FormattedMessage
                    id="slide.receiveTokens.title"
                    defaultMessage="Add assets to start using Zeal"
                />
            ),
            buttonText: (
                <FormattedMessage
                    id="slide.receiveTokens.buttonText"
                    defaultMessage="Add funds"
                />
            ),
            variant: 'neutral' as const,
        },
        {
            id: 'swap' as const,
            title: (
                <FormattedMessage
                    id="slide.swap.title"
                    defaultMessage="Swap at the best market rates"
                />
            ),
            buttonText: (
                <FormattedMessage
                    id="slide.swap.buttonText"
                    defaultMessage="Discover Zeal Swaps"
                />
            ),
            variant: 'neutral' as const,
        },
        {
            id: 'onRamp' as const,
            title: (
                <FormattedMessage
                    id="slide.onRamp.title"
                    defaultMessage="Free bank deposits and withdrawals"
                />
            ),
            variant: 'neutral' as const,

            buttonText: (
                <FormattedMessage
                    id="slide.onRamp.buttonText"
                    defaultMessage="Set up bank transfers"
                />
            ),
        },
        {
            id: 'setUpRecovery' as const,
            title: (
                <FormattedMessage
                    id="slide.setUpRecovery.title"
                    defaultMessage="Set up your Recovery Kit"
                />
            ),
            buttonText: (
                <FormattedMessage
                    id="slide.setUpRecovery.buttonText"
                    defaultMessage="Improve security"
                />
            ),
            variant: 'warning' as const,
        },
        {
            id: 'activateWallet' as const,
            title: (
                <FormattedMessage
                    id="slide.activateWallet.title"
                    defaultMessage="Enable transactions in Zeal"
                />
            ),
            buttonText: (
                <FormattedMessage
                    id="slide.activateWallet.buttonText"
                    defaultMessage="Import wallet"
                />
            ),
            variant: 'neutral' as const,
        },
        {
            id: 'connectToDapp' as const,
            title: (
                <FormattedMessage
                    id="slide.connectToDapp.title"
                    defaultMessage="Connect to Uniswap with Zeal"
                />
            ),
            buttonText: (
                <FormattedMessage
                    id="slide.connectToDapp.buttonText"
                    defaultMessage="Go to Uniswap"
                />
            ),
            variant: 'neutral' as const,
        },
        {
            id: 'addRead-only' as const,
            title: (
                <FormattedMessage
                    id="slide.addReadOnly.title"
                    defaultMessage="See the portfolio of any wallet"
                />
            ),
            buttonText: (
                <FormattedMessage
                    id="slide.addReadOnly.buttonText"
                    defaultMessage="Add read-only wallet"
                />
            ),
            variant: 'neutral' as const,
        },
    ].filter((slide) => !userMadeActionOnNextBestActionIds.includes(slide.id))

    const finalSlides = getSlidesForKeystores(slides, keystore)

    if (!finalSlides.length) {
        return null
    }

    return (
        <Carousel<NBAActions>
            slides={finalSlides}
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_nba_cta_click':
                        postUserEvent({
                            type: 'ActionBannerClickedEvent',
                            installationId,
                            action: msg.slide.id,
                        })
                        if (msg.slide.id === 'receiveTokens') {
                            postUserEvent({
                                type: 'ReceiveFlowEnteredEvent',
                                installationId,
                                location: 'nba',
                            })
                        }

                        onMsg({
                            ...msg,
                            account: account,
                        })
                        break

                    case 'on_nba_close_click':
                        postUserEvent({
                            type: 'ActionBannerDismissedEvent',
                            installationId,
                            action: msg.slide.id,
                        })
                        onMsg({
                            ...msg,
                            account: account,
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

const getSlidesForKeystores = (
    slides: SlideData<NBAActions>[],
    keystore: KeyStore
): SlideData<NBAActions>[] => {
    switch (keystore.type) {
        case 'track_only':
            return readOnly
                .map((id) => slides.find((s) => s.id === id))
                .filter((nba): nba is SlideData<NBAActions> => Boolean(nba))
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
            return eoa
                .map((id) => slides.find((s) => s.id === id))
                .filter((nba): nba is SlideData<NBAActions> => Boolean(nba))
        case 'safe_4337':
            return smartWallet
                .map((id) => slides.find((s) => s.id === id))
                .filter((nba): nba is SlideData<NBAActions> => Boolean(nba))
        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}
