import { notReachable } from '@zeal/toolkit'

export type HDPath = 'bip44' | 'ledger_live' | 'legacy' | 'phantom'

export const generatePaths = (offset: number, limit: number, type: HDPath) => {
    const arr = new Array(limit).fill(0).map((_, index) => offset + index)

    switch (type) {
        case 'phantom':
            return arr.map((item) =>
                item === 0 ? `m/44'/60'` : `m/44'/60'/1'/0/${item - 1}`
            )

        case 'bip44':
            return arr.map((item) => `m/44'/60'/0'/0/${item}`)

        case 'ledger_live':
            return arr.map((item) => `m/44'/60'/${item}'/0/0`)

        case 'legacy':
            return arr.map((item) => `m/44'/60'/0'/${item}`)

        /* istanbul ignore next */
        default:
            return notReachable(type)
    }
}
