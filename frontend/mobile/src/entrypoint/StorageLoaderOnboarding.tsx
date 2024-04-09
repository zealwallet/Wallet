import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { OnboardingPage } from '@zeal/domains/Main/features/Onboarding'
import { useReloadableStorage } from '@zeal/domains/Storage/hooks/useReloadableStorage'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof OnboardingPage>

export const StorageLoaderOnboarding = ({ onMsg }: Props) => {
    const [storage] = useReloadableStorage({
        type: 'loading',
        params: undefined,
    })

    switch (storage.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed': {
            return (
                <OnboardingPage
                    entryPoint={{ type: 'onboarding' }}
                    installationId={storage.data.installationId}
                    networkMap={storage.data.networkMap}
                    sessionPassword={storage.data.sessionPassword}
                    storage={storage.data.storage}
                    onMsg={onMsg}
                />
            )
        }
        case 'loading':
        case 'error':
            return null

        default:
            return notReachable(storage)
    }
}
