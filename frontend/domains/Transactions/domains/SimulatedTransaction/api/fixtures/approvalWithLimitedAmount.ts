export const approvalWithLimitedAmount: unknown = {
    transaction: {
        type: 'ApprovalTransaction',
        amount: {
            amount: {
                amount: '10000000',
                currencyId:
                    'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            },
            type: 'Limited',
            priceInDefaultCurrency: null,
        },
        simulatedGas: {
            type: 'GasEstimate',
            gas: '0xe2b6',
        },
        approveTo: {
            address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
            network: 'Polygon',
            name: 'Uniswap V3',
            logo: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/dapp/6bbfca1d-82ef-4d7d-8646-dad14d696ee4',
            website: 'https://app.uniswap.org/#/swap',
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
            type: 'ApprovalSpenderTypeCheck',
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
            currencyId: 'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
    ],
    currencies: {
        'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174': {
            type: 'CryptoCurrency',
            id: 'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            symbol: 'USDC',
            code: 'USDC',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
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
