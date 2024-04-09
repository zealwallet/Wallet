import '@formatjs/intl-getcanonicallocales/polyfill'
import '@formatjs/intl-locale/polyfill'
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/en'
import { Buffer } from 'buffer'
import { TextEncoder } from 'text-encoding'

// 🪄🪄🪄 if you don't access fetch in mobile it is not available to domains and SvgUri is failed to fetch imgs 🪄🪄🪄
window.fetch = fetch

window.Buffer = global.Buffer = Buffer
window.TextEncoder = global.TextEncoder = TextEncoder

window.atob = global.atob = (encoded: string) => {
    if (typeof encoded !== 'string') {
        throw new Error('Invalid encoded string')
    }
    const decoded = Buffer.from(encoded, 'base64').toString('utf8')
    return decoded
}

window.btoa = global.btoa = (encoded: string) => {
    if (typeof encoded !== 'string') {
        throw new Error('Invalid encoded string')
    }

    const decoded = Buffer.from(encoded, 'utf8').toString('base64')
    return decoded
}

// eslint-disable-next-line no-extend-native
Array.prototype.toSorted = function (
    compareFn?: ((a: any, b: any) => number) | undefined
): any[] {
    const sorted = this.slice()
    sorted.sort(compareFn)
    return sorted
}
