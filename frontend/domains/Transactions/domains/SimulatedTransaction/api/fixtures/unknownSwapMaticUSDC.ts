export const unknownSwapMaticUSDC: unknown = {
    transaction: {
        type: 'UnknownTransaction',
        nonce: 117,
        method: 'multicall',
        tokens: [
            {
                direction: 'Send',
                amount: {
                    amount: '10000000000000000',
                    currencyId:
                        'Polygon|0x0000000000000000000000000000000000001010',
                },
                priceInDefaultCurrency: {
                    amount: '10770000000000000',
                    currencyId: 'USD',
                },
            },
            {
                direction: 'Receive',
                amount: {
                    amount: '10610',
                    currencyId:
                        'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                },
                priceInDefaultCurrency: {
                    amount: '10716100000000000',
                    currencyId: 'USD',
                },
            },
        ],
        nfts: [],
        simulatedGas: {
            type: 'GasEstimate',
            gas: '0x2ba74',
        },
    },
    fee: {
        type: 'Eip1559TransactionFees',
        standard: {
            type: 'Eip1559Fee',
            maxPriorityFeePerGas: '0x706829886',
            maxFeePerGas: '0xb1ef5a2f8',
            baseFee: '0x0',
            forecastDuration: {
                type: 'OutsideOfForecast',
            },
            priceInDefaultCurrency: {
                amount: '3845515135435777',
                currencyId: 'USD',
            },
            priceInNativeCurrency: {
                amount: '0',
                currencyId:
                    'Ethereum|0x0000000000000000000000000000000000000000',
            },
        },
        fast: {
            type: 'Eip1559Fee',
            maxPriorityFeePerGas: '0x7fc086958',
            maxFeePerGas: '0xc147b73ca',
            baseFee: '0x0',
            forecastDuration: {
                type: 'OutsideOfForecast',
            },
            priceInDefaultCurrency: {
                amount: '4177153615242200',
                currencyId: 'USD',
            },
            priceInNativeCurrency: {
                amount: '0',
                currencyId:
                    'Ethereum|0x0000000000000000000000000000000000000000',
            },
        },
        instant: {
            type: 'Eip1559Fee',
            maxPriorityFeePerGas: '0xcb9e579e0',
            maxFeePerGas: '0x10d2588452',
            baseFee: '0x0',
            forecastDuration: {
                type: 'OutsideOfForecast',
            },
            priceInDefaultCurrency: {
                amount: '5816773202726696',
                currencyId: 'USD',
            },
            priceInNativeCurrency: {
                amount: '0',
                currencyId:
                    'Ethereum|0x0000000000000000000000000000000000000000',
            },
        },
    },
    checks: [
        {
            type: 'TransactionSimulationCheck',
            severity: 'Danger',
            state: 'Passed',
            simulationUrl: 'http://localhost/simulation-url',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
        {
            type: 'SmartContractBlacklistCheck',
            severity: 'Danger',
            state: 'Passed',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
        {
            type: 'TokenVerificationCheck',
            severity: 'Caution',
            state: 'Passed',
            currencyId: 'Polygon|0x0000000000000000000000000000000000001010',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
        {
            type: 'TokenVerificationCheck',
            severity: 'Caution',
            state: 'Passed',
            currencyId: 'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
    ],
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
        'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174': {
            type: 'CryptoCurrency',
            id: 'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            symbol: 'USDC',
            code: 'USDC',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/polygon/0x2791bca1f2de4661ed88a30c99a7a9449aa84174.png',
            name: 'USD Coin (PoS)',
            address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
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
