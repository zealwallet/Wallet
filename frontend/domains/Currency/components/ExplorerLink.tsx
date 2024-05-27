import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Currency } from '@zeal/domains/Currency'
import { getExplorerLink } from '@zeal/domains/Currency/helpers/getExplorerLink'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    currency: Currency | null
    networkMap: NetworkMap
}

export const ExplorerLink = ({ currency, networkMap }: Props) => {
    if (!currency) {
        return null
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return null

        case 'CryptoCurrency': {
            const explorerLink = getExplorerLink(currency, networkMap)
            return !explorerLink ? null : (
                <IconButton
                    variant="on_light"
                    onClick={() => openExternalURL(explorerLink)}
                    size="small"
                >
                    {({ color }) => <ExternalLink size={14} color={color} />}
                </IconButton>
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
