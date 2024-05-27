import { notReachable } from '@zeal/toolkit'
import { joinURL } from '@zeal/toolkit/URL/joinURL'

import { EXTENSION_URL } from '@zeal/domains/Main/constants'
import {
    parseProviderToZwidget,
    parseZwidgetToContentScript,
} from '@zeal/domains/Main/parsers/parseZwidgetContentMsgs'

import { addZealOptionToPancakeSwap } from './addZealOptionToPancakeSwap'
import { injectProvider } from './injectProvider'

export const initProviderConnection = (): void => {
    const LS_KEY = 'zeal_widget'

    const savedState = JSON.parse(localStorage.getItem(LS_KEY) || '{}')

    window.addEventListener('message', (e: MessageEvent<unknown>) => {
        const parsed = parseProviderToZwidget(e.data)
        switch (parsed.type) {
            case 'Failure':
                break
            case 'Success':
                const message = parsed.data
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage(message, '*')
                } else {
                    // eslint-disable-next-line no-console
                    console.error(
                        'provider try to send msg before handshake with zwidget',
                        message
                    )
                }

                break
            /* istanbul ignore next */
            default:
                return notReachable(parsed)
        }
    })

    injectProvider({ sendMsgTo: window, insertProviderInto: window })

    const iframe = document.createElement('iframe')

    const overlay = document.createElement('div')

    overlay.setAttribute(
        'style',
        `
      display: block !important;
      z-index: 999999999 !important;
      position: fixed !important;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgb(26, 54, 75, 0.8);
      backdrop-filter: blur(5px);
    `
    )

    const query = new URLSearchParams()
    query.append('dAppUrl', window.location.hostname)
    query.append('type', 'zwidget')

    iframe.allow = 'clipboard-write; hid; publickey-credentials-get *'

    iframe.src = joinURL(EXTENSION_URL, `zwidget.html?${query.toString()}`)

    iframe.width = '0px'
    iframe.height = '0px'

    iframe.setAttribute(
        'style',
        `display: block !important;
     z-index: 10000000000 !important;
     border: none !important;
     position: fixed !important;
     box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important;
     border-radius: 12px !important;
     pointer-events: auto !important;
`.trim()
    )

    iframe.style.width = '0px'
    iframe.style.height = '0px'

    iframe.style.top = `${savedState.top || 100}px`
    iframe.style.right = `${
        savedState.right ? window.innerWidth - savedState.right : 24
    }px`

    window.addEventListener('message', (message: MessageEvent<unknown>) => {
        if (message.source === iframe.contentWindow && iframe.contentWindow) {
            const parsed = parseZwidgetToContentScript(message.data)
            switch (parsed.type) {
                case 'Failure':
                    break
                case 'Success':
                    const msg = parsed.data
                    switch (msg.type) {
                        case 'drag':
                            iframe.style.top = `${
                                parseInt(iframe.style.top, 10) + msg.movement.y
                            }px`
                            iframe.style.right = `${
                                parseInt(iframe.style.right, 10) -
                                msg.movement.x
                            }px`
                            keepIframeInView(iframe)
                            localStorage.setItem(
                                LS_KEY,
                                JSON.stringify(iframe.getBoundingClientRect())
                            )
                            break
                        case 'change_iframe_size':
                            const size = {
                                width: iframe.width,
                                height: iframe.height,
                            }

                            overlay.remove()

                            switch (msg.size) {
                                case 'icon':
                                    size.width = '40px'
                                    size.height = '40px'
                                    break
                                case 'small':
                                    size.width = '360px'
                                    size.height = '200px'
                                    break
                                case 'large':
                                    size.width = '360px'
                                    size.height = '600px'
                                    break
                                case 'large_with_full_screen_takeover':
                                    size.width = '360px'
                                    size.height = '600px'

                                    window.document.body.append(overlay)

                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg.size)
                            }
                            iframe.width = size.width
                            iframe.height = size.height
                            iframe.style.width = size.width
                            iframe.style.height = size.height
                            keepIframeInView(iframe)

                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                    break
                /* istanbul ignore next */
                default:
                    return notReachable(parsed)
            }
        }
    })

    const keepIframeInView = (iframe: HTMLElement) => {
        const rect = iframe.getBoundingClientRect()
        if (rect.left < 0) {
            iframe.style.right = `${
                parseInt(iframe.style.right, 10) + rect.left - 20
            }px`
        }
        if (rect.bottom >= window.innerHeight) {
            iframe.style.top = `${
                parseInt(iframe.style.top, 10) -
                (rect.bottom - window.innerHeight) -
                20
            }px`
        }

        if (rect.top < 0) {
            iframe.style.top = '20px'
        }

        if (rect.right >= window.innerWidth) {
            iframe.style.right = '20px'
        }
    }

    const observer = new MutationObserver(function () {
        // While we need to insert script asap to compete for window.ethereum object
        // we want to insert iframe to body to have proper rendering
        if (document.body) {
            // It exists now
            document.body.append(iframe)
            keepIframeInView(iframe)
            observer.disconnect()

            setInterval(() => {
                if (!document.body.contains(iframe)) {
                    document.body.append(iframe)
                }
            }, 500)

            // Create new observer for guarding
            if (window.location.href.match(/quickswap.exchange/gi)) {
                const guardObserver = new MutationObserver((mutations) => {
                    const added = mutations
                        .map((mutation) => Array.from(mutation.addedNodes))
                        .flat()

                    const quickSwapModal = added
                        .filter(
                            (item): item is HTMLDivElement =>
                                item instanceof HTMLDivElement
                        )
                        .map((div) =>
                            div.querySelector('.MuiBox-root[tabindex="-1"]')
                        )
                        .find(Boolean)

                    if (quickSwapModal) {
                        quickSwapModal.removeAttribute('tabindex')
                    }
                })

                guardObserver.observe(document.body, { childList: true })
            }

            // PancakeSwap hack to show "Zeal" instead of "Injected" since they use the MetaMask wagmi connector
            if (window.location.href.match(/pancakeswap.finance/gi)) {
                const portalObserver = new MutationObserver(
                    addZealOptionToPancakeSwap
                )

                portalObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                })
            }
        }
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    })
}
