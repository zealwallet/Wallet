export const ecr20TransactionFeeForecast: unknown = {
    type: 'FeesForecastResponseEip1559Fee',
    slow: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x77841cbb1',
        maxFeePerGas: '0x37d41696f5',
        baseFee: '0x305bd4cb44',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 12000,
        },
        priceInDefaultCurrency: {
            amount: '1939977125787619',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '7553115722533500',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
        maxPriceInDefaultCurrency: {
            amount: '1949977125787619',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '7653115722533500',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
    },
    normal: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0xd69a68425',
        maxFeePerGas: '0x3dc57b4f69',
        baseFee: '0x305bd4cb44',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 6000,
        },
        priceInDefaultCurrency: {
            amount: '2304258239960603',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '8357145232747500',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
        maxPriceInDefaultCurrency: {
            amount: '2404258239960603',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '8457145232747500',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
    },
    fast: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x12a05f2000',
        maxFeePerGas: '0x42fc33eb44',
        baseFee: '0x305bd4cb44',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 4000,
        },
        priceInDefaultCurrency: {
            amount: '2623842699210152',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '9062521729758000',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
        maxPriceInDefaultCurrency: {
            amount: '2723842699210152',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '9162521729758000',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
    },
    custom: null,
    nonce: 398,
    networkState: {
        type: 'Eip1559NetworkState',
        durationMs: 3600000,
        minPriorityFee: '0x1dcd6500',
        maxPriorityFee: '0x2befd47d1a4',
        baseFee: '0x182dea65a2',
    },
    balanceInNativeCurrency: {
        amount: '14130012906844150000',
        currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
    },
    currencies: {
        'Polygon|0x0000000000000000000000000000000000001010': {
            type: 'CryptoCurrency',
            id: 'Polygon|0x0000000000000000000000000000000000001010',
            symbol: 'MATIC',
            code: 'MATIC',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0x0000000000000000000000000000000000001010',
            name: 'MATIC',
            address: '0x0000000000000000000000000000000000001010',
            network: 'Polygon',
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
