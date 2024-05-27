import { useLayoutEffect, useState } from 'react'

import { ApplicationContainer } from '@zeal/uikit/ApplicationContainer'

import { notReachable } from '@zeal/toolkit'
import { isDevelopment, isProduction } from '@zeal/toolkit/Environment'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'
import { joinURL } from '@zeal/toolkit/URL/joinURL'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyId } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { EntryPoint } from '@zeal/domains/Main'
import { sendToActiveTabZWidget } from '@zeal/domains/Main/api/sendToActiveTabZWidget'
import { EXTENSION_URL } from '@zeal/domains/Main/constants'
import { Main } from '@zeal/domains/Main/features/Extension'
import { ZWidget } from '@zeal/domains/Main/features/ZWidget'
import {
    openAddAccountPageTab,
    openAddFromHardwareWallet,
    openCreateContactPage,
    openCreateSafePage,
    openOnboardingPageTab,
} from '@zeal/domains/Main/helpers/openEntrypoint'
import { parseEntrypoint } from '@zeal/domains/Main/parsers/parseEntrypoint'
import { Manifest } from '@zeal/domains/Manifest'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'

import { StorageLoader } from './StorageLoader'

type Props = {
    manifest: Manifest
}

export const WalletWidgetFork = ({ manifest }: Props) => {
    const applicationContainerVariant = (() => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'android':
                return 'mobile'
            case 'web':
                return 'extension'
            /* istanbul ignore next */
            default:
                return notReachable(ZealPlatform.OS)
        }
    })()

    const [entryPoint, setEntrypoint] = useState<EntryPoint>(() => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'android':
                return { type: 'extension', mode: 'fullscreen' }
            case 'web':
                const params = Object.fromEntries(
                    new URLSearchParams(window.location.search).entries()
                )

                return parseEntrypoint(params).getSuccessResultOrThrow(
                    'fail to parse entrypoint params'
                )
            /* istanbul ignore next */
            default:
                return notReachable(ZealPlatform.OS)
        }
    })

    useLayoutEffect(() => {
        switch (entryPoint.type) {
            case 'extension':
                switch (ZealPlatform.OS) {
                    case 'ios':
                    case 'android':
                        break
                    case 'web':
                        document.documentElement.style.minHeight = '600px'
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(ZealPlatform.OS)
                }
                break
            case 'bridge':
            case 'zwidget':
            case 'add_account':
            case 'send_nft':
            case 'send_erc20_token':
            case 'setup_recovery_kit':
            case 'onboarding':
            case 'create_contact':
            case 'swap':
            case 'add_from_hardware_wallet':
            case 'bank_transfer':
            case 'kyc_process':
            case 'create_safe':
                break
            /* istanbul ignore next */
            default:
                return notReachable(entryPoint)
        }
    }, [entryPoint])

    switch (entryPoint.type) {
        case 'add_account':
        case 'create_contact':
        case 'onboarding':
        case 'send_erc20_token':
        case 'send_nft':
        case 'setup_recovery_kit':
        case 'swap':
        case 'add_from_hardware_wallet':
        case 'bridge':
        case 'bank_transfer':
        case 'kyc_process':
        case 'create_safe':
            return (
                <ApplicationContainer variant={applicationContainerVariant}>
                    <StorageLoader
                        entryPoint={entryPoint}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'from_any_wallet_click':
                                    openTopUpDapp(msg.account)
                                    break

                                case 'add_wallet_clicked':
                                case 'import_keys_button_clicked':
                                    setEntrypoint({ type: 'add_account' })
                                    break

                                case 'track_wallet_clicked':
                                    setEntrypoint({
                                        type: 'create_contact',
                                    })
                                    break

                                case 'hardware_wallet_clicked':
                                    setEntrypoint({
                                        type: 'add_from_hardware_wallet',
                                    })
                                    break

                                case 'on_accounts_create_success_animation_finished':
                                case 'on_user_skipped_add_assets':
                                    switch (ZealPlatform.OS) {
                                        case 'ios':
                                        case 'android':
                                            break
                                        case 'web':
                                            // after navigating back to portfolio view we need to reset location to enable "refresh" button in browser
                                            window.parent.location.replace(
                                                joinURL(
                                                    EXTENSION_URL,
                                                    'page_entrypoint.html?type=extension&mode=fullscreen&celebrate=true'
                                                )
                                            )
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(ZealPlatform.OS)
                                    }

                                    setEntrypoint({
                                        type: 'extension',
                                        mode: 'fullscreen',
                                    })
                                    break

                                case 'on_secret_phrase_verified_success':
                                case 'on_google_drive_backup_success':
                                case 'lock_screen_close_click':
                                case 'close':
                                case 'on_all_transaction_success':
                                case 'bridge_completed':
                                case 'on_on_ramp_transfer_success_close_click':
                                    switch (ZealPlatform.OS) {
                                        case 'ios':
                                        case 'android':
                                            break
                                        case 'web':
                                            // after navigating back to portfolio view we need to reset location to enable "refresh" button in browser
                                            window.parent.location.replace(
                                                joinURL(
                                                    EXTENSION_URL,
                                                    'page_entrypoint.html?type=extension&mode=fullscreen'
                                                )
                                            )
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(ZealPlatform.OS)
                                    }

                                    setEntrypoint({
                                        type: 'extension',
                                        mode: 'fullscreen',
                                    })
                                    break

                                case 'bank_transfer_click':
                                case 'on_do_bank_transfer_clicked':
                                    setEntrypoint({
                                        type: 'bank_transfer',
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </ApplicationContainer>
            )

        case 'extension':
            return (
                <ApplicationContainer variant={applicationContainerVariant}>
                    <Main
                        mode={entryPoint.mode}
                        manifest={manifest}
                        onMsg={(msg) => {
                            switch (entryPoint.mode) {
                                case 'fullscreen':
                                    switch (msg.type) {
                                        case 'on_open_fullscreen_view_click':
                                            captureError(
                                                new ImperativeError(
                                                    'trying to open fullscreen mode in fullscreen mode'
                                                )
                                            )
                                            break

                                        case 'on_get_started_clicked':
                                            setEntrypoint({
                                                type: 'onboarding',
                                            })
                                            break

                                        case 'on_recovery_kit_setup':
                                            setEntrypoint({
                                                type: 'setup_recovery_kit',
                                                address: msg.address,
                                            })
                                            break

                                        case 'on_send_nft_click':
                                            setEntrypoint({
                                                type: 'send_nft',
                                                fromAddress: msg.fromAddress,
                                                nftId: encodeURIComponent(
                                                    msg.nft.tokenId
                                                ),
                                                mintAddress:
                                                    msg.collection.mintAddress,
                                                networkHexId:
                                                    msg.collection.networkHexId,
                                            })
                                            break

                                        case 'on_swap_clicked':
                                            setEntrypoint({
                                                type: 'swap',
                                                fromAddress: msg.fromAddress,
                                                fromCurrencyId: msg.currencyId,
                                            })
                                            break

                                        case 'on_bridge_clicked':
                                            setEntrypoint({
                                                type: 'bridge',
                                                fromAddress: msg.fromAddress,
                                                fromCurrencyId: msg.currencyId,
                                            })
                                            break

                                        case 'on_send_clicked':
                                            setEntrypoint({
                                                type: 'send_erc20_token',
                                                fromAddress: msg.fromAddress,
                                                tokenCurrencyId: msg.currencyId,
                                            })
                                            break

                                        case 'track_wallet_clicked':
                                            setEntrypoint({
                                                type: 'create_contact',
                                            })
                                            break

                                        case 'safe_wallet_clicked':
                                            setEntrypoint({
                                                type: 'create_safe',
                                            })
                                            break

                                        case 'hardware_wallet_clicked':
                                            setEntrypoint({
                                                type: 'add_from_hardware_wallet',
                                            })
                                            break

                                        case 'on_add_private_key_click':
                                        case 'add_wallet_clicked':
                                        case 'card_tab_choose_wallet_on_import_new_wallet_clicked':
                                            setEntrypoint({
                                                type: 'add_account',
                                            })
                                            break

                                        case 'on_bank_clicked':
                                        case 'on_bank_transfer_selected':
                                            setEntrypoint({
                                                type: 'bank_transfer',
                                            })
                                            break

                                        case 'on_kyc_try_again_clicked':
                                            setEntrypoint({
                                                type: 'kyc_process',
                                            })
                                            break
                                        case 'from_any_wallet_click':
                                            openTopUpDapp(msg.account)
                                            break

                                        case 'on_zwidget_expand_request':
                                            sendToActiveTabZWidget({
                                                type: 'extension_to_zwidget_expand_zwidget',
                                            })
                                            window.close()
                                            break

                                        case 'import_keys_button_clicked':
                                            setEntrypoint({
                                                type: 'add_account',
                                            })
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg)
                                    }
                                    break

                                case 'popup':
                                    switch (msg.type) {
                                        case 'on_open_fullscreen_view_click':
                                            openExtensionInFullScreen()
                                            break

                                        case 'on_get_started_clicked':
                                            openOnboardingPageTab()
                                            break

                                        case 'on_recovery_kit_setup':
                                            openRecoveryKitSetup(msg.address)
                                            break

                                        case 'on_send_nft_click':
                                            openSendNFT({
                                                collection: msg.collection,
                                                fromAddress: msg.fromAddress,
                                                nft: msg.nft,
                                            })
                                            break

                                        case 'on_swap_clicked':
                                            openSwap({
                                                fromAddress: msg.fromAddress,
                                                fromCurrencyId: msg.currencyId,
                                            })
                                            break
                                        case 'on_bridge_clicked':
                                            openBridge({
                                                fromAddress: msg.fromAddress,
                                                fromCurrencyId: msg.currencyId,
                                            })
                                            break
                                        case 'on_send_clicked':
                                            openSendERC20({
                                                currencyId: msg.currencyId,
                                                fromAddress: msg.fromAddress,
                                            })
                                            break

                                        case 'track_wallet_clicked':
                                            openCreateContactPage()
                                            break

                                        case 'safe_wallet_clicked':
                                            openCreateSafePage()
                                            break

                                        case 'hardware_wallet_clicked':
                                            openAddFromHardwareWallet()
                                            break

                                        case 'on_add_private_key_click':
                                        case 'add_wallet_clicked':
                                        case 'card_tab_choose_wallet_on_import_new_wallet_clicked':
                                            openAddAccountPageTab()
                                            break

                                        case 'on_bank_clicked':
                                        case 'on_bank_transfer_selected':
                                            openBankTransferPage()
                                            break

                                        case 'on_kyc_try_again_clicked':
                                            openKycProcessPage()
                                            break
                                        case 'from_any_wallet_click':
                                            openTopUpDapp(msg.account)
                                            break

                                        case 'on_zwidget_expand_request':
                                            sendToActiveTabZWidget({
                                                type: 'extension_to_zwidget_expand_zwidget',
                                            })
                                            window.close()
                                            break

                                        case 'import_keys_button_clicked':
                                            setEntrypoint({
                                                type: 'add_account',
                                            })
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg)
                                    }
                                    break

                                default:
                                    notReachable(entryPoint.mode)
                            }
                        }}
                    />
                </ApplicationContainer>
            )

        case 'zwidget':
            return (
                <ApplicationContainer variant="extension_zwidget">
                    <ZWidget dAppUrl={entryPoint.dAppUrl} />
                </ApplicationContainer>
            )

        /* istanbul ignore next */
        default:
            return notReachable(entryPoint)
    }
}

const openRecoveryKitSetup = (address: Address) => {
    const url = chrome.runtime.getURL(
        `page_entrypoint.html?type=setup_recovery_kit&address=${address}`
    )
    openExternalURL(url)
}

const openKycProcessPage = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=kyc_process`)
    openExternalURL(url)
}

const openBankTransferPage = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=bank_transfer`)
    openExternalURL(url)
}

const openExtensionInFullScreen = () => {
    const url = chrome.runtime.getURL(
        `page_entrypoint.html?type=extension&mode=fullscreen`
    )
    openExternalURL(url)
}

const openSwap = ({
    fromAddress,
    fromCurrencyId,
}: {
    fromAddress: Address
    fromCurrencyId: CurrencyId | null
}) => {
    const fromCurrencyIdEncoded =
        fromCurrencyId && encodeURIComponent(fromCurrencyId)
    const url = fromCurrencyId
        ? `page_entrypoint.html?type=swap&fromAddress=${fromAddress}&fromCurrencyId=${fromCurrencyIdEncoded}`
        : `page_entrypoint.html?type=swap&fromAddress=${fromAddress}`

    openExternalURL(chrome.runtime.getURL(url))
}

const openBridge = ({
    fromAddress,
    fromCurrencyId,
}: {
    fromAddress: Address
    fromCurrencyId: CurrencyId | null
}) => {
    const fromCurrencyIdEncoded =
        fromCurrencyId && encodeURIComponent(fromCurrencyId)
    const url = fromCurrencyId
        ? `page_entrypoint.html?type=bridge&fromAddress=${fromAddress}&fromCurrencyId=${fromCurrencyIdEncoded}`
        : `page_entrypoint.html?type=bridge&fromAddress=${fromAddress}`

    openExternalURL(chrome.runtime.getURL(url))
}

const openSendERC20 = ({
    fromAddress,
    currencyId,
}: {
    fromAddress: Address
    currencyId: CurrencyId | null
}) => {
    const currencyIdEncoded = currencyId && encodeURIComponent(currencyId)
    const url = currencyId
        ? `page_entrypoint.html?type=send_erc20_token&fromAddress=${fromAddress}&tokenCurrencyId=${currencyIdEncoded}`
        : `page_entrypoint.html?type=send_erc20_token&fromAddress=${fromAddress}`

    openExternalURL(chrome.runtime.getURL(url))
}

const openSendNFT = ({
    fromAddress,
    collection,
    nft,
}: {
    fromAddress: Address
    nft: PortfolioNFT
    collection: PortfolioNFTCollection
}) => {
    const nftId = encodeURIComponent(nft.tokenId)
    const { mintAddress, networkHexId } = collection

    const url = `page_entrypoint.html?type=send_nft&fromAddress=${fromAddress}&nftId=${nftId}&mintAddress=${mintAddress}&networkHexId=${networkHexId}`

    openExternalURL(chrome.runtime.getURL(url))
}

const openTopUpDapp = (account: Account) => {
    const baseUrl = isProduction()
        ? 'https://topup.zeal.app'
        : isDevelopment()
        ? 'https://d1px4ezi2zradc.cloudfront.net'
        : 'http://localhost:3001'

    const encodedAddress = encodeURIComponent(account.address)
    const encodedLabel = encodeURIComponent(account.label)

    const url = `${baseUrl}?address=${encodedAddress}&label=${encodedLabel}&type=send_crypto_currency`
    openExternalURL(url)
}
