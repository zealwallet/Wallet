import { useEffect } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    BankTransferCurrencies,
    fetchBankTransferCurrencies,
} from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchLastUnfinishedOnRamp } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastUnfinishedOnRamp'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Widget } from './Widget'

type Props = {
    bankTransferInfo: BankTransferUnblockUserCreated
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Widget>

const fetch = async ({
    bankTransferInfo,
    signal,
}: {
    bankTransferInfo: BankTransferUnblockUserCreated
    signal?: AbortSignal
}): Promise<{
    event: OnRampTransactionEvent | null
    bankTransferCurrencies: BankTransferCurrencies
}> => {
    const bankTransferCurrencies = await fetchBankTransferCurrencies()
    const event = await fetchLastUnfinishedOnRamp({
        bankTransferInfo,
        bankTransferCurrencies,
        signal,
    })

    return { event, bankTransferCurrencies }
}

export const Flow = ({ bankTransferInfo, networkMap, onMsg }: Props) => {
    const [loadable] = useLoadableData(fetch, {
        type: 'loading',
        params: { bankTransferInfo },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'loaded':
                break
            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    switch (loadable.type) {
        case 'loading':
        case 'error':
            return null
        case 'loaded': {
            if (!loadable.data.event) {
                return null
            }
            return (
                <Widget
                    event={loadable.data.event}
                    networkMap={networkMap}
                    bankTransferCurrencies={
                        loadable.data.bankTransferCurrencies
                    }
                    bankTransferInfo={bankTransferInfo}
                    onMsg={onMsg}
                />
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
