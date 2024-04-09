export const usdcApprovalPloygonForecast: unknown = {
    type: 'FeesForecastResponseEip1559Fee',
    slow: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x732f53057',
        maxFeePerGas: '0x8bbb1f6f8',
        baseFee: '0x188bcc6a1',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 12000,
        },
        priceInDefaultCurrency: {
            amount: '4529362864869132',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '4932549457527424',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
        maxPriceInDefaultCurrency: {
            amount: '4629362864869132',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '5032549457527424',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
    },
    normal: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0x7c41ad6b1',
        maxFeePerGas: '0x94cd79d52',
        baseFee: '0x188bcc6a1',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 6000,
        },
        priceInDefaultCurrency: {
            amount: '4823420728531297',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '5252783229729376',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
        maxPriceInDefaultCurrency: {
            amount: '4923420728531297',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '5352783229729376',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
    },
    fast: {
        type: 'Eip1559Fee',
        maxPriorityFeePerGas: '0xaa4831d96',
        maxFeePerGas: '0xc2d3fe437',
        baseFee: '0x188bcc6a1',
        forecastDuration: {
            type: 'WithinForecast',
            durationMs: 4000,
        },
        priceInDefaultCurrency: {
            amount: '6315330743665099',
            currencyId: 'USD',
        },
        priceInNativeCurrency: {
            amount: '6877497379462352',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
        maxPriceInDefaultCurrency: {
            amount: '6415330743665099',
            currencyId: 'USD',
        },
        maxPriceInNativeCurrency: {
            amount: '6977497379462352',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
        },
    },
    custom: null,
    nonce: 127,
    networkState: {
        type: 'Eip1559NetworkState',
        durationMs: 3600000,
        minPriorityFee: '0x9502f900',
        maxPriorityFee: '0x47c3777a9f3e',
        baseFee: '0x135ca8003',
    },
    balanceInNativeCurrency: {
        amount: '959051660794787944',
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
            icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/polygon/0x0000000000000000000000000000000000001010.png',
            name: 'Matic Token',
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
