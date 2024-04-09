import React from 'react'

import { components } from '@zeal/api/portfolio'

import { AlchemySafetyCheckSource } from '@zeal/uikit/Icon/AlchemySafetyCheckSource'
import { BlockAidSafetyCheckSource } from '@zeal/uikit/Icon/BlockAidSafetyCheckSource'
import { CoinGeckoSafetyCheckSource } from '@zeal/uikit/Icon/CoinGeckoSafetyCheckSource'
import { DappRadarSafetyCheckSource } from '@zeal/uikit/Icon/DappRadarSafetyCheckSource'
import { DefiLlamaSafetyCheckSource } from '@zeal/uikit/Icon/DefiLlamaSafetyCheckSource'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { RaribleSafetyCheckSource } from '@zeal/uikit/Icon/RaribleSafetyCheckSource'
import { TenderlySafetyCheckSource } from '@zeal/uikit/Icon/TenderlySafetyCheckSource'
import { ZealSafetyCheckSource } from '@zeal/uikit/Icon/ZealSafetyCheckSource'
import { Row } from '@zeal/uikit/Row'
import { TextButton } from '@zeal/uikit/TextButton'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

type Props = {
    checkSource: components['schemas']['SafetyCheckSource']
}
export const SafetyCheckSubtitleSource = ({ checkSource }: Props) => {
    const { url } = checkSource

    if (!url) {
        return <SourceIcon checkSource={checkSource} />
    }

    return (
        <TextButton onClick={() => openExternalURL(url)}>
            <Row spacing={4}>
                <SourceIcon checkSource={checkSource} />
                <ExternalLink size={14} />
            </Row>
        </TextButton>
    )
}

const SourceIcon = ({ checkSource }: Props) => {
    switch (checkSource.source) {
        case 'BlockAid':
            return <BlockAidSafetyCheckSource />
        case 'Tenderly':
            return <TenderlySafetyCheckSource />
        case 'Alchemy':
            return <AlchemySafetyCheckSource />
        case 'DappRadar':
            return <DappRadarSafetyCheckSource />
        case 'DefiLlama':
            return <DefiLlamaSafetyCheckSource />
        case 'Zeal':
            return <ZealSafetyCheckSource />
        case 'Rarible':
            return <RaribleSafetyCheckSource />
        case 'CoinGecko':
            return <CoinGeckoSafetyCheckSource />
        /* istanbul ignore next */
        default:
            return notReachable(checkSource.source)
    }
}
