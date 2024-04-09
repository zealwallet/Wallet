export const unknownSwapUSDCEtherOptimism: unknown = {
    transaction: {
        type: 'UnknownTransaction',
        nonce: 7,
        method: 'multicall',
        tokens: [
            {
                direction: 'Receive',
                amount: {
                    amount: '79991369361632',
                    currencyId:
                        'Optimism|0x0000000000000000000000000000000000000000',
                },
                priceInDefaultCurrency: {
                    amount: '100110798583469681',
                    currencyId: 'USD',
                },
            },
            {
                direction: 'Send',
                amount: {
                    amount: '100000',
                    currencyId:
                        'Optimism|0x7f5c764cbc14f9669b88837ca1490cca17c31607',
                },
                priceInDefaultCurrency: {
                    amount: '99963800000000000',
                    currencyId: 'USD',
                },
            },
        ],
        nfts: [],
        simulatedGas: {
            type: 'GasEstimate',
            gas: '0x31522',
        },
    },
    fee: {
        type: 'LegacyTransactionFees',
        standard: {
            type: 'LegacyFee',
            gasPrice: '0xf4240',
            priceInDefaultCurrency: {
                amount: '252829567360000',
                currencyId: 'USD',
            },
            priceInNativeCurrency: {
                amount: '0',
                currencyId:
                    'Ethereum|0x0000000000000000000000000000000000000000',
            },
            forecastDuration: {
                type: 'OutsideOfForecast',
            },
        },
        fast: {
            type: 'LegacyFee',
            gasPrice: '0xf4240',
            priceInDefaultCurrency: {
                amount: '252829567360000',
                currencyId: 'USD',
            },
            priceInNativeCurrency: {
                amount: '0',
                currencyId:
                    'Ethereum|0x0000000000000000000000000000000000000000',
            },
            forecastDuration: {
                type: 'OutsideOfForecast',
            },
        },
        instant: {
            type: 'LegacyFee',
            gasPrice: '0xf4240',
            priceInDefaultCurrency: {
                amount: '252829567360000',
                currencyId: 'USD',
            },
            priceInNativeCurrency: {
                amount: '0',
                currencyId:
                    'Ethereum|0x0000000000000000000000000000000000000000',
            },
            forecastDuration: {
                type: 'OutsideOfForecast',
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
            currencyId: 'Optimism|0x7f5c764cbc14f9669b88837ca1490cca17c31607',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
        {
            type: 'TokenVerificationCheck',
            severity: 'Caution',
            state: 'Passed',
            currencyId: 'Optimism|0x0000000000000000000000000000000000000000',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
    ],
    currencies: {
        'Optimism|0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
            type: 'CryptoCurrency',
            id: 'Optimism|0x7f5c764cbc14f9669b88837ca1490cca17c31607',
            symbol: 'USDC',
            code: 'USDC',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/optimism/0x7f5c764cbc14f9669b88837ca1490cca17c31607.png',
            name: 'USD Coin',
            address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
            network: 'Optimism',
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
