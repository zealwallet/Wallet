import React from 'react'

import { BoldSubtract } from '@zeal/uikit/Icon/BoldSubtract'
import { Spam } from '@zeal/uikit/Icon/Spam'
import { IconButton } from '@zeal/uikit/IconButton'

import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { Token } from '@zeal/domains/Token'

type Props = {
    token: Token
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_token_hide_click'; token: Token }
    | { type: 'on_token_un_hide_click'; token: Token }

export const Layout = ({ token, currencyHiddenMap, onMsg }: Props) => {
    const isHidden =
        currencyHiddenMap[token.balance.currencyId] === undefined
            ? token.scam
            : currencyHiddenMap[token.balance.currencyId]

    return isHidden ? (
        <IconButton
            variant="on_light"
            onClick={() => {
                onMsg({
                    type: 'on_token_un_hide_click',
                    token,
                })
            }}
        >
            {() => <Spam size={24} color="iconStatusCritical" />}
        </IconButton>
    ) : (
        <IconButton
            variant="on_light"
            onClick={() => {
                onMsg({
                    type: 'on_token_hide_click',
                    token,
                })
            }}
        >
            {({ color }) => <BoldSubtract size={24} color={color} />}
        </IconButton>
    )
}
