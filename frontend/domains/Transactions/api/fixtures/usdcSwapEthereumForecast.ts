export const usdcSwapEthereumForecast: unknown = {
    type: 'FeesForecastResponseEip1559Fee',
    slow: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x1b252a17',
        maxFeePerGas: '0x7583415e9',
        baseFee: '0x73d0eebd2',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 90000,
        },
        priceInDefaultCurrency: {
            amount: '16136511674043557189',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '12566887328408985',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '17136511674043557189',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '13566887328408985',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    normal: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x56bff417',
        maxFeePerGas: '0x793cedfe9',
        baseFee: '0x73d0eebd2',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 45000,
        },
        priceInDefaultCurrency: {
            amount: '16648057933293557189',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '12965272328408985',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '17648057933293557189',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '13965272328408985',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    fast: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x925abe17',
        maxFeePerGas: '0x7cf69a9e9',
        baseFee: '0x73d0eebd2',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 30000,
        },
        priceInDefaultCurrency: {
            amount: '17159604192543557189',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '13363657328408985',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '18159604192543557189',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '14363657328408985',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    custom: null,
    nonce: 2,
    networkState: {
        type: 'Eip1559NetworkState',
        durationMs: 3600000,
        minPriorityFee: '0x5f5e100',
        maxPriorityFee: '0x77359400',
        baseFee: '0x39e8775e9',
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
