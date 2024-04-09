export const usdcApprovalBSCForecastCustom: unknown = {
    type: 'FeesForecastResponseLegacyFee',
    slow: {
        type: 'LegacyFee',
        gasPrice: '0x12a05f200',
        priceInDefaultCurrency: {
            amount: '146364523200000000',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '530460000000000',
            currencyId: 'BSC|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '146364523200000000',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '530460000000000',
            currencyId: 'BSC|0x0000000000000000000000000000000000000000',
        },
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 18000,
        },
    },
    normal: {
        type: 'LegacyFee',
        gasPrice: '0x12a05f200',
        priceInDefaultCurrency: {
            amount: '146364523200000000',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '530460000000000',
            currencyId: 'BSC|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '146364523200000000',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '530460000000000',
            currencyId: 'BSC|0x0000000000000000000000000000000000000000',
        },
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 9000,
        },
    },
    fast: {
        type: 'LegacyFee',
        gasPrice: '0x12a05f200',
        priceInDefaultCurrency: {
            amount: '146364523200000000',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '530460000000000',
            currencyId: 'BSC|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '146364523200000000',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '530460000000000',
            currencyId: 'BSC|0x0000000000000000000000000000000000000000',
        },
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 6000,
        },
    },
    custom: {
        type: 'LegacyFee',
        gasPrice: '0xb2d05e00',
        priceInDefaultCurrency: {
            amount: '87818713920000000',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '318276000000000',
            currencyId: 'BSC|0x0000000000000000000000000000000000000000',
        },
        maxPriceInDefaultCurrency: {
            amount: '146364523200000000',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '530460000000000',
            currencyId: 'BSC|0x0000000000000000000000000000000000000000',
        },
        forecastDuration: {
            type: 'OutsideOfForecast',
        },
    },
    nonce: 11,
    networkState: {
        type: 'LegacyNetworkState',
        durationMs: 3600000,
        minGasPrice: '0x3b9aca00',
        maxGasPrice: '0x91374b2c7',
    },
    balanceInNativeCurrency: {
        amount: '32550680438449222',
        currencyId: 'BSC|0x0000000000000000000000000000000000000000',
    },
    currencies: {
        'BSC|0x0000000000000000000000000000000000000000': {
            type: 'CryptoCurrency',
            id: 'BSC|0x0000000000000000000000000000000000000000',
            symbol: 'BNB',
            code: 'BNB',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/binance-smart-chain/0x0000000000000000000000000000000000000000.png',
            name: 'BNB',
            address: '0x0000000000000000000000000000000000000000',
            network: 'BSC',
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
