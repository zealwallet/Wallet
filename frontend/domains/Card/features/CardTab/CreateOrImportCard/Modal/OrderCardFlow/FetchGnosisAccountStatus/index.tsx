import { useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { noop, notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import {
    GnosisPayAccountState,
    GnosisPayLoginSignature,
} from '@zeal/domains/Card'
import { fetchGnosisPayAccountState } from '@zeal/domains/Card/api/fetchGnosisPayAccountState'
import { login } from '@zeal/domains/Card/api/login'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'

import { CardImported } from './CardImported'
import { NoCardDetected } from './NoCardDetected'
import { OrderNewCard } from './OrderNewCard'

type Props = {
    gnosisPayLoginSignature: GnosisPayLoginSignature
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    userSelected: 'create' | 'import'
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_card_imported_success_animation_complete'; address: Address }
    | MsgOf<typeof OrderNewCard>
    | MsgOf<typeof NoCardDetected>

const fetch = async ({
    gnosisPayLoginSignature,
}: {
    gnosisPayLoginSignature: GnosisPayLoginSignature
}): Promise<GnosisPayAccountState> => {
    const gnosisPayLoginInfo = await login({ gnosisPayLoginSignature })

    return fetchGnosisPayAccountState({ gnosisPayLoginInfo })
}

export const FetchGnosisAccountStatus = ({
    gnosisPayLoginSignature,
    userSelected,
    account,
    accountsMap,
    keyStoreMap,
    installationId,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            gnosisPayLoginSignature,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    actionBar={
                        <ActionBar
                            left={
                                <IconButton
                                    variant="on_light"
                                    aria-label={formatMessage({
                                        id: 'actions.back',
                                        defaultMessage: 'Back',
                                    })}
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    {({ color }) => (
                                        <BackIcon size={24} color={color} />
                                    )}
                                </IconButton>
                            }
                        />
                    }
                    onClose={() => onMsg({ type: 'close' })}
                />
            )
        case 'loaded':
            switch (loadable.data.type) {
                case 'not_onboarded':
                    const state =
                        `${loadable.data.state}_${userSelected}` as const

                    switch (state) {
                        case 'kyc_not_started_create':
                            return (
                                <OrderNewCard
                                    accountsMap={accountsMap}
                                    keyStoreMap={keyStoreMap}
                                    onMsg={onMsg}
                                    account={account}
                                    installationId={installationId}
                                />
                            )
                        case 'kyc_not_started_import':
                            return <NoCardDetected onMsg={onMsg} />
                        case 'kyc_submitted_create':
                        case 'kyc_submitted_import':
                        case 'kyc_approved_create':
                        case 'kyc_approved_import':
                        case 'card_ready_to_be_shipped_create':
                        case 'card_ready_to_be_shipped_import':
                        case 'card_shipped_create':
                        case 'card_shipped_import':
                            return (
                                <CardImported
                                    installationId={installationId}
                                    account={account}
                                    accountsMap={accountsMap}
                                    keyStoreMap={keyStoreMap}
                                    onMsg={onMsg}
                                />
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(state)
                    }
                case 'onboarded':
                    return (
                        <CardImported
                            installationId={installationId}
                            account={account}
                            accountsMap={accountsMap}
                            keyStoreMap={keyStoreMap}
                            onMsg={onMsg}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(loadable.data)
            }

        case 'error':
            const error = parseAppError(loadable.error)
            return (
                <>
                    <LoadingLayout actionBar={null} onClose={noop} />
                    <AppErrorPopup
                        error={error}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break
                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
