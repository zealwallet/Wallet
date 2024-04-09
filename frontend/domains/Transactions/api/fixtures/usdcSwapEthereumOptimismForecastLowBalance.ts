export const usdcSwapEthereumOptimismForecastLowBalance: unknown = {
    type: 'FeesForecastResponseLegacyFee',
    slow: {
        type: 'LegacyFee',
        gasPrice: '0xf4240',
        priceInDefaultCurrency: {
            amount: '379862526120000',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '303027000000',
            currencyId: 'Optimism|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '379862526120000',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '303027000000',
            currencyId: 'Optimism|0x0000000000000000000000000000000000000000',
        },
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 18000,
        },
    },
    normal: {
        type: 'LegacyFee',
        gasPrice: '0xf4240',
        priceInDefaultCurrency: {
            amount: '379862526120000',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '303027000000',
            currencyId: 'Optimism|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '379862526120000',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '303027000000',
            currencyId: 'Optimism|0x0000000000000000000000000000000000000000',
        },
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 9000,
        },
    },
    fast: {
        type: 'LegacyFee',
        gasPrice: '0xf4240',
        priceInDefaultCurrency: {
            amount: '379862526120000',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '303027000000',
            currencyId: 'Optimism|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '379862526120000',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '303027000000',
            currencyId: 'Optimism|0x0000000000000000000000000000000000000000',
        },
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 6000,
        },
    },
    custom: null,
    nonce: 7,
    networkState: {
        type: 'LegacyNetworkState',
        durationMs: 3600000,
        minGasPrice: '0xf4240',
        maxGasPrice: '0x5f5e100',
    },
    balanceInNativeCurrency: {
        amount: '100',
        currencyId: 'Optimism|0x0000000000000000000000000000000000000000',
    },
    currencies: {
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
        'Optimism|0x0000000000000000000000000000000000000000': {
            type: 'CryptoCurrency',
            id: 'Optimism|0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            code: 'ETH',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/optimism/0x0000000000000000000000000000000000000000.png',
            name: 'ETH',
            address: '0x0000000000000000000000000000000000000000',
            network: 'Optimism',
        },
    },
}
