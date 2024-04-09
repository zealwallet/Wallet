import { openExternalURL } from '@zeal/toolkit/Window'

import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'

export const openExplorerLink = (bridgeSubmitted: BridgeSubmitted) =>
    openExternalURL(
        `https://socketscan.io/tx/${bridgeSubmitted.sourceTransactionHash}`
    )
