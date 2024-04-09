export const usdcSwapEthereumForecastCustom: unknown = {
    type: 'FeesForecastResponseEip1559Fee',
    slow: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x1d7f565d',
        maxFeePerGas: '0x6dea455a3',
        baseFee: '0x6c124ff46',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 90000,
        },
        priceInDefaultCurrency: {
            amount: '15095699913945917156',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '11754395460378675',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '16095699913945917156',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '12754395460378675',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    normal: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x591a205d',
        maxFeePerGas: '0x71a3f1fa3',
        baseFee: '0x6c124ff46',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 45000,
        },
        priceInDefaultCurrency: {
            amount: '15607329834045917156',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '12152780460378675',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '16607329834045917156',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '13152780460378675',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    fast: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x591a205d',
        maxFeePerGas: '0x71a3f1fa3',
        baseFee: '0x6c124ff46',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 30000,
        },
        priceInDefaultCurrency: {
            amount: '15607329834045917156',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '12152780460378675',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '16607329834045917156',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '13152780460378675',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    custom: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0xb2d05e00',
        maxFeePerGas: '0x773f55d46',
        baseFee: '0x6c124ff46',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 30000,
        },
        priceInDefaultCurrency: {
            amount: '16377391985191834311',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '12752395920757350',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '17377391985191834311',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '13752395920757350',
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
        },
    },
    nonce: 2,
    networkState: {
        type: 'Eip1559NetworkState',
        durationMs: 3600000,
        minPriorityFee: '0x5f5e100',
        maxPriorityFee: '0x77359400',
        baseFee: '0x360927fa3',
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
