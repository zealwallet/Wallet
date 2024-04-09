export const nftCollectionApproval: unknown = {
    transaction: {
        type: 'NftCollectionApprovalTransaction',
        nonce: 117,
        simulatedGas: {
            type: 'GasEstimate',
            gas: '0x903f',
        },
        nftCollectionInfo: {
            name: 'OpenSea Collections',
            address: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
            network: 'Polygon',
        },
        approveTo: {
            address: '0x1e0049783f008a0085193e00003d00cd54003c71',
            network: 'Polygon',
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
