import { notReachable } from '@zeal/toolkit'

import { useReloadableStorage } from '@zeal/domains/Storage/hooks/useReloadableStorage'

import { NotOnboarded } from './NotOnboarded'
import { ZWidget } from './ZWidget'

type Props = {
    dAppUrl: string
}

export const StorageLoader = ({ dAppUrl }: Props) => {
    const [loadable] = useReloadableStorage({
        type: 'loading',
        params: undefined,
    })

    switch (loadable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed': {
            if (
                !loadable.data.storage ||
                !loadable.data.storage.selectedAddress
            ) {
                return <NotOnboarded />
            } else {
                return (
                    <ZWidget
                        networkMap={loadable.data.networkMap}
                        installationId={loadable.data.installationId}
                        selectedAddress={loadable.data.storage.selectedAddress}
                        dAppUrl={dAppUrl}
                        sessionPassword={loadable.data.sessionPassword}
                        storage={loadable.data.storage}
                    />
                )
            }
        }

        case 'loading':
        case 'error':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
