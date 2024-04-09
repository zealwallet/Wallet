export const usdcSwapEthereum: unknown = {
    transaction: {
        type: 'UnknownTransaction',
        nonce: 2,
        method: 'multicall',
        tokens: [
            {
                direction: 'Send',
                amount: {
                    amount: '10000',
                    currencyId:
                        'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                },
                priceInDefaultCurrency: {
                    amount: '10010000000000000',
                    currencyId: 'USD',
                },
            },
            {
                direction: 'Receive',
                amount: {
                    amount: '8137028147430',
                    currencyId:
                        'Ethereum|0x0000000000000000000000000000000000000000',
                },
                priceInDefaultCurrency: {
                    amount: '10007486807679734',
                    currencyId: 'USD',
                },
            },
        ],
        nfts: [],
        simulatedGas: {
            type: 'GasEstimate',
            gas: '0x40c8c',
        },
    },
    fee: {
        type: 'Eip1559TransactionFees',
        standard: {
            type: 'Eip1559Fee',
            maxPriorityFeePerGas: '0x1ee4afcf',
            maxFeePerGas: '0x3b9aca000',
            baseFee: '0x0',
            forecastDuration: {
                type: 'OutsideOfForecast',
            },
            priceInDefaultCurrency: {
                amount: '5221654139520000000',
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
            maxPriorityFeePerGas: '0x5a7f79cf',
            maxFeePerGas: '0x3f5476a00',
            baseFee: '0x0',
            forecastDuration: {
                type: 'OutsideOfForecast',
            },
            priceInDefaultCurrency: {
                amount: '5548007523240000000',
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
            maxPriorityFeePerGas: '0x5a7f79cf',
            maxFeePerGas: '0x3f5476a00',
            baseFee: '0x0',
            forecastDuration: {
                type: 'OutsideOfForecast',
            },
            priceInDefaultCurrency: {
                amount: '5548007523240000000',
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
            currencyId: 'Ethereum|0x0000000000000000000000000000000000000000',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
        {
            type: 'TokenVerificationCheck',
            severity: 'Caution',
            state: 'Passed',
            currencyId: 'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
    ],
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
        'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
            type: 'CryptoCurrency',
            id: 'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            symbol: 'USDC',
            code: 'USDC',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
            name: 'USD Coin',
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
