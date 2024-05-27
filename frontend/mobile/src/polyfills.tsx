import '@formatjs/intl-getcanonicallocales/polyfill'
import '@formatjs/intl-locale/polyfill'
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/en'
import { decode, encode } from 'base-64'
import { Buffer } from 'buffer'
import { TextEncoder } from 'text-encoding'

// 🪄🪄🪄 if you don't access fetch in mobile it is not available to domains and SvgUri is failed to fetch imgs 🪄🪄🪄
window.fetch = fetch

window.Buffer = global.Buffer = Buffer
window.TextEncoder = global.TextEncoder = TextEncoder

if (!global.btoa) {
    global.btoa = encode
}

if (!global.atob) {
    global.atob = decode
}

// eslint-disable-next-line no-extend-native
Array.prototype.toSorted = function (
    compareFn?: ((a: any, b: any) => number) | undefined
): any[] {
    const sorted = this.slice()
    sorted.sort(compareFn)
    return sorted
}
