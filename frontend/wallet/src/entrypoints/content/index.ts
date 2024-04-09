import { findRootWindow } from '@zeal/toolkit/Window'

import { injectProvider } from 'src/entrypoints/content/injectProvider'

import { initProviderConnection } from './provider-connection'

const ignoredHosts = new Set<string>([
    'www.meiamaratonadoporto.com',
    'login.xero.com',
    'connect.trezor.io',
    'topup.zeal.app',
    'd1px4ezi2zradc.cloudfront.net', // zeal dApp dev
])

const urlObject = new URL(window.location.href)

switch (true) {
    case ignoredHosts.has(urlObject.host): {
        // ingore
        break
    }
    case window.parent !== window: {
        // in iframe
        injectProvider({
            insertProviderInto: window,
            sendMsgTo: findRootWindow(window),
        })
        break
    }

    default:
        initProviderConnection()
}
