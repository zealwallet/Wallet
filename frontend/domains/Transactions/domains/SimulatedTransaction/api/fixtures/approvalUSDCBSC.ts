export const approvalUSDCBSC: unknown = {
    transaction: {
        type: 'ApprovalTransaction',
        nonce: 11,
        amount: {
            amount: {
                amount: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
                currencyId: 'BSC|0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
            },
            type: 'Unlimited',
        },
        simulatedGas: {
            type: 'GasEstimate',
            gas: '0x11448',
        },
        approveTo: {
            address: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
            network: 'BSC',
        },
    },
    fee: {
        type: 'LegacyTransactionFees',
        standard: {
            type: 'LegacyFee',
            gasPrice: '0x12a05f200',
            priceInDefaultCurrency: {
                amount: '97848651600000000',
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
            gasPrice: '0x12a05f200',
            priceInDefaultCurrency: {
                amount: '97848651600000000',
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
            gasPrice: '0x12a05f200',
            priceInDefaultCurrency: {
                amount: '97848651600000000',
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
            currencyId: 'BSC|0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
    ],
    currencies: {
        'BSC|0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': {
            type: 'CryptoCurrency',
            id: 'BSC|0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
            symbol: 'USDC',
            code: 'USDC',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/binance-smart-chain/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d.png',
            name: 'USD Coin',
            address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
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
