import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { noop, notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { Address } from '@zeal/domains/Address'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { ErrorPopup } from '@zeal/domains/Error/domains/Ledger/components/ErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'

import { fetchLedgerAddress } from './api/fetchLedgerAddress'
import { Connect } from './components/Connect'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'leger_connected_success'
          addresses: { path: string; address: Address }[]
      }
    | { type: 'close' }

export const ConnectToLedger = ({ onMsg }: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(fetchLedgerAddress, {
        type: 'not_asked',
    })

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Connect
                    isLoading={false}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_connect_button_click':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        offset: 0,
                                        hdPath: 'ledger_live',
                                    },
                                })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'loading':
            return <Connect isLoading={true} onMsg={noop} />
        case 'loaded':
            return (
                <SuccessLayout
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'leger_connected_success',
                            addresses: loadable.data,
                        })
                    }
                    title={
                        <FormattedMessage
                            id="ledger.add.success.title"
                            defaultMessage="Ledger successfully connected 🎉"
                        />
                    }
                />
            )

        case 'error': {
            const error = parseAppError(loadable.error)
            return (
                <>
                    <Connect isLoading={true} onMsg={noop} />
                    {(() => {
                        switch (error.type) {
                            case 'hardware_wallet_failed_to_open_device':
                            case 'ledger_not_running_any_app':
                            case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
                            case 'ledger_running_non_eth_app':
                            case 'ledger_is_locked':
                                return (
                                    <ErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'on_ledger_error_close':
                                                    setLoadable({
                                                        type: 'not_asked',
                                                    })
                                                    break
                                                case 'on_sync_ledger_click':
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
                                )
                            /* istanbul ignore next */
                            default:
                                return (
                                    <AppErrorPopup
                                        error={parseAppError(loadable.error)}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    setLoadable({
                                                        type: 'not_asked',
                                                    })
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
                                )
                        }
                    })()}
                </>
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
