export const ecr20TransactionSimulation: unknown = {
    transaction: {
        type: 'P2PTransaction',
        simulatedGas: {
            type: 'GasEstimate',
            gas: '0x7f52',
        },
        token: {
            direction: 'Send',
            amount: {
                amount: '1000000',
                currencyId:
                    'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            },
            priceInDefaultCurrency: {
                amount: '1000000000000000000',
                currencyId: 'USD',
            },
        },
        toAddress: '0x61640a8d48bca205ba91b16b0b7745e7abc61084',
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
            type: 'P2pReceiverTypeCheck',
            severity: 'Caution',
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
            currencyId: 'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
    ],
    currencies: {
        'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f': {
            type: 'CryptoCurrency',
            id: 'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            symbol: 'USDT',
            code: 'USDT',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            name: '(PoS) Tether USD',
            address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
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
