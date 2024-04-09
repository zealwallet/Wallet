import { Buffer } from 'buffer'

// @ts-ignore
window.Buffer = window.Buffer || Buffer

if (typeof Array.prototype.toSorted !== 'function') {
    try {
        // eslint-disable-next-line no-extend-native
        Array.prototype.toSorted = function (
            compareFn?: ((a: any, b: any) => number) | undefined
        ): any[] {
            const sorted = this.slice()
            sorted.sort(compareFn)
            return sorted
        }
    } catch (_error) {}
}
