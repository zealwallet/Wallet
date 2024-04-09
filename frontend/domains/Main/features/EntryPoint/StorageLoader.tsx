import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { PageEntrypoint } from '@zeal/domains/Main'
import { OnboardingPage } from '@zeal/domains/Main/features/Onboarding'
import { useReloadableStorage } from '@zeal/domains/Storage/hooks/useReloadableStorage'

import { StorageValidator } from './StorageValidator'

type Props = {
    entryPoint: PageEntrypoint
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof StorageValidator> | MsgOf<typeof OnboardingPage>

export const StorageLoader = ({ entryPoint, onMsg }: Props) => {
    const [loadable] = useReloadableStorage({
        type: 'loading',
        params: undefined,
    })

    switch (loadable.type) {
        case 'loading':
        case 'error':
            // errors should be handled by hook
            return null

        case 'loaded':
        case 'reloading':
        case 'subsequent_failed': {
            switch (entryPoint.type) {
                case 'bridge':
                case 'add_account':
                case 'create_contact':
                case 'send_erc20_token':
                case 'send_nft':
                case 'setup_recovery_kit':
                case 'swap':
                case 'add_from_hardware_wallet':
                case 'bank_transfer':
                case 'kyc_process':
                case 'create_safe':
                    return (
                        <StorageValidator
                            networkMap={loadable.data.networkMap}
                            installationId={loadable.data.installationId}
                            entryPoint={entryPoint}
                            sessionPassword={loadable.data.sessionPassword}
                            storage={loadable.data.storage}
                            onMsg={onMsg}
                        />
                    )

                case 'onboarding':
                    return (
                        <OnboardingPage
                            networkMap={loadable.data.networkMap}
                            installationId={loadable.data.installationId}
                            sessionPassword={loadable.data.sessionPassword}
                            storage={loadable.data.storage}
                            entryPoint={entryPoint}
                            onMsg={onMsg}
                        />
                    )

                default:
                    return notReachable(entryPoint)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
