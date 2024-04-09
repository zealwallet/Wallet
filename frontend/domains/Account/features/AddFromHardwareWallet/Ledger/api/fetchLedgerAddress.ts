import Eth from '@ledgerhq/hw-app-eth'
import TransportWebHID from '@ledgerhq/hw-transport-webhid' // TODO: @resetko - cannot import @ledgerhq libraries on mobile. We probably need to mock native/expo things in webpack, and mock web stuff in native builds

import { Address } from '@zeal/domains/Address'

import { generatePaths, HDPath } from '../helpers/generatePaths'

export const fetchLedgerAddress = async ({
    offset,
    hdPath,
}: {
    offset: number
    hdPath: HDPath
}): Promise<{ address: Address; path: string }[]> => {
    const transport = await TransportWebHID.create()
    transport.on('disconnect', (e) => {
        // eslint-disable-next-line no-console
        console.error('ledger error', e)
    })
    try {
        const appEth = new Eth(transport)
        const paths = generatePaths(offset, 1, hdPath)
        const adrs: { address: Address; path: string }[] = []
        for (const path of paths) {
            const { address } = await appEth.getAddress(path)
            adrs.push({
                address,
                path,
            })
        }
        return adrs
    } finally {
        await transport.close()
    }
}
