import { openExternalURL } from '@zeal/toolkit/Window'

export const openCreateContactPage = () => {
    const url = chrome.runtime.getURL(
        `page_entrypoint.html?type=create_contact`
    )
    openExternalURL(url)
}

export const openCreateSafePage = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=create_safe`)
    openExternalURL(url)
}

export const openAddFromHardwareWallet = () => {
    const url = chrome.runtime.getURL(
        `page_entrypoint.html?type=add_from_hardware_wallet`
    )
    openExternalURL(url)
}

export const openAddAccountPageTab = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=add_account`)

    openExternalURL(url)
}

export const openOnboardingPageTab = () => {
    const url = chrome.runtime.getURL(`page_entrypoint.html?type=onboarding`)

    openExternalURL(url)
}
