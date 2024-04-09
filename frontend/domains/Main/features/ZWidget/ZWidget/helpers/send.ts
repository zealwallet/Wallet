import { ZwidgetToContentScript, ZwidgetToProvider } from '@zeal/domains/Main'

export const send = (msg: ZwidgetToContentScript | ZwidgetToProvider): void => {
    window.parent.postMessage(msg, '*')
}
