import { FormattedMessage } from 'react-intl'

import { Skeleton } from '@zeal/uikit/Skeleton'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { RpcTransaction } from '@zeal/domains/Transactions'

import { DetailItem } from './DetailItem'

type Props = {
    loadable: LoadableData<RpcTransaction, unknown>
}

export const Nonce = ({ loadable }: Props) => {
    switch (loadable.type) {
        case 'loading':
        case 'error':
            return (
                <DetailItem
                    label={
                        <FormattedMessage
                            id="activity.detail.general.nonce"
                            defaultMessage="Nonce"
                        />
                    }
                    value={
                        <Skeleton variant="default" width={40} height={16} />
                    }
                    explorerLink={null}
                />
            )
        case 'loaded':
            return (
                <DetailItem
                    label={
                        <FormattedMessage
                            id="activity.detail.general.nonce"
                            defaultMessage="Nonce"
                        />
                    }
                    value={loadable.data.nonce.toString()}
                    explorerLink={null}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
