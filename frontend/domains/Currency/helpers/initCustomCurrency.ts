import { Address } from '@zeal/domains/Address'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { NetworkHexId } from '@zeal/domains/Network'

export const initCustomCurrency = ({
    id,
    address,
    fraction,
    networkHexChainId,
    symbol,
    icon,
}: {
    id: string
    address: Address
    networkHexChainId: NetworkHexId
    symbol: string
    fraction: number
    icon: string | null
}): CryptoCurrency => {
    return {
        type: 'CryptoCurrency',
        address,
        code: symbol,
        fraction,
        networkHexChainId: networkHexChainId,
        symbol,
        icon: icon || 'TODO',
        name: symbol,
        id,
        rateFraction: fraction,
    }
}
