export const usdcSwapEthereumForecastHugeFee: unknown = {
    type: 'FeesForecastResponseEip1559Fee',
    slow: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x49dbbd96',
        maxFeePerGas: '0x5387d0526a',
        baseFee: '0x533df494d4',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 90000,
        },
        priceInDefaultCurrency: {
            amount: '181354605649193951863',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '142924946132962890',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    normal: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x49dbbd96',
        maxFeePerGas: '0x5387d0526a',
        baseFee: '0x533df494d4',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 45000,
        },
        priceInDefaultCurrency: {
            amount: '181354605649193951863',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '142924946132962890',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    fast: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x49dbbd96',
        maxFeePerGas: '0x5387d0526a',
        baseFee: '0x533df494d4',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 30000,
        },
        priceInDefaultCurrency: {
            amount: '181354605649193951863',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '142924946132962890',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    custom: null,
    nonce: 2,
    networkState: {
        type: 'Eip1559NetworkState',
        durationMs: 3600000,
        minPriorityFee: '0xf4240',
        maxPriorityFee: '0x9140475ab',
        baseFee: '0x299efa4a6a',
    },
    balanceInNativeCurrency: {
        amount: '64643009544065550',
        currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
    },
    currencies: {
        'Ethereum|0x0000000000000000000000000000000000000000': {
            type: 'CryptoCurrency',
            id: 'Ethereum|0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            code: 'ETH',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png',
            name: 'ETH',
            address: '0x0000000000000000000000000000000000000000',
            network: 'Ethereum',
        },
        USD: {
            type: 'FiatCurrency',
            id: 'USD',
            symbol: '$',
            code: 'USD',
            fraction: 18,
            rateFraction: 18,
            icon: 'TODO',
            name: 'USD',
        },
    },
}
