export const initialHistory: unknown = {
    currencies: {
        'Polygon|0xa3fa99a148fa48d14ed51d610c367c61876997f1': {
            type: 'CryptoCurrency',
            id: 'Polygon|0xa3fa99a148fa48d14ed51d610c367c61876997f1',
            symbol: 'miMATIC',
            code: 'miMATIC',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0xa3fa99a148fa48d14ed51d610c367c61876997f1',
            name: 'miMATIC',
            address: '0xa3fa99a148fa48d14ed51d610c367c61876997f1',
            network: 'Polygon',
        },
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
        'Arbitrum|0x0000000000000000000000000000000000000000': {
            type: 'CryptoCurrency',
            id: 'Arbitrum|0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            code: 'ETH',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Arbitrum|0x0000000000000000000000000000000000000000',
            name: 'ETH',
            address: '0x0000000000000000000000000000000000000000',
            network: 'Arbitrum',
        },
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
        'Arbitrum|0xaf88d065e77c8cc2239327c5edb3a432268e5831': {
            type: 'CryptoCurrency',
            id: 'Arbitrum|0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            symbol: 'USDC',
            code: 'USDC',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Arbitrum|0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            name: 'USD Coin',
            address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            network: 'Arbitrum',
        },
        'Polygon|0x18e73a5333984549484348a94f4d219f4fab7b81': {
            type: 'CryptoCurrency',
            id: 'Polygon|0x18e73a5333984549484348a94f4d219f4fab7b81',
            symbol: 'DUCKIES',
            code: 'DUCKIES',
            fraction: 8,
            rateFraction: 8,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0x18e73a5333984549484348a94f4d219f4fab7b81',
            name: 'Yellow Duckies',
            address: '0x18e73a5333984549484348a94f4d219f4fab7b81',
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
    transactions: [
        {
            type: 'OutboundP2PNftActivityTransaction',
            nft: {
                nft: {
                    tokenId: '0x2f81',
                    name: 'Shiba Inu Head',
                    image: 'https://static.debank.com/image/matic_nft/local_url/5fe68aa25e8a232d296c9c78e961c4eb/89c9df7099fc93d34095b3a177e7b71c.png',
                    decimals: 18,
                    collectionInfo: {
                        name: 'Decentraland Wearables (Polygon)',
                        address: '0x30517529cb5c16f686c6d0b48faae5d250d43005',
                        network: 'Polygon',
                    },
                },
                direction: 'Send',
                amount: '1000000000000000000',
            },
            receiver: '0x2b5da0943d4bb11c6be776de3af9e9c31e24605c',
            network: 'Polygon',
            hash: '0xcd308cf650ed6e5947c944272d9babd9a9f315890ac26ce564c499bdec892b88',
            timestamp: 1694080539000,
            paidFee: {
                priceInNativeCurrency: {
                    amount: '15807453919441620',
                    currencyId:
                        'Polygon|0x0000000000000000000000000000000000001010',
                },
                priceInDefaultCurrency: {
                    amount: '8818804659663365',
                    currencyId: 'USD',
                },
            },
        },
        {
            type: 'SelfP2PActivityTransaction',
            network: 'Polygon',
            hash: '0x6857bdcc885c303de4d7a3df803ec9662bf925ba4f541be966397b90881f19c0',
            paidFee: {
                priceInNativeCurrency: {
                    amount: '4607700290256000',
                    currencyId:
                        'Polygon|0x0000000000000000000000000000000000001010',
                },
                priceInDefaultCurrency: {
                    amount: '2553389369747394',
                    currencyId: 'USD',
                },
            },
            timestamp: 1693845096000,
        },
        {
            type: 'Erc20ApprovalActivityTransaction',
            allowance: {
                amount: {
                    amount: '0',
                    currencyId:
                        'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                },
                type: 'Limited',
            },
            approveTo: {
                address: '0x3a23f943181408eac424116af7b7790c94cb97a5',
                network: 'Polygon',
                name: 'Socket',
                logo: null,
                website: null,
            },
            network: 'Polygon',
            hash: '0xeaff21d833ea027521a690afda122464a06752fe1b9af0e327fada2c102974dc',
            timestamp: 1693830208000,
            paidFee: {
                priceInNativeCurrency: {
                    amount: '5051657865351316',
                    currencyId:
                        'Polygon|0x0000000000000000000000000000000000001010',
                },
                priceInDefaultCurrency: {
                    amount: '2799411567689489',
                    currencyId: 'USD',
                },
            },
        },
        {
            type: 'InboundP2PActivityTransaction',
            tokens: [
                {
                    direction: 'Receive',
                    amount: {
                        amount: '285376530538942600',
                        currencyId:
                            'Polygon|0x0000000000000000000000000000000000001010',
                    },
                    priceInDefaultCurrency: null,
                },
            ],
            nfts: [],
            sender: '0x2c29e4feaa6b09fffdcc9847c81b94bebfd6b299',
            network: 'Polygon',
            hash: '0xf0f453d337875bc19510973bf996fb694ec43112a8db8384bb845792bdab660f',
            timestamp: 1694080539000,
        },
        {
            type: 'UnknownActivityTransaction',
            method: 'mintAndSwap',
            smartContract: {
                address: '0x8f5bbb2bb8c2ee94639e55d5f41de9b4839c1280',
                network: 'Polygon',
                name: null,
                logo: null,
                website: null,
            },
            tokens: [
                {
                    direction: 'Receive',
                    amount: {
                        amount: '499085',
                        currencyId:
                            'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    },
                    priceInDefaultCurrency: null,
                },
                {
                    direction: 'Send',
                    amount: {
                        amount: '499085',
                        currencyId:
                            'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    },
                    priceInDefaultCurrency: null,
                },
                {
                    direction: 'Send',
                    amount: {
                        amount: '499085',
                        currencyId:
                            'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    },
                    priceInDefaultCurrency: null,
                },
                {
                    direction: 'Send',
                    amount: {
                        amount: '421085000000000000',
                        currencyId:
                            'Arbitrum|0x0000000000000000000000000000000000000000',
                    },
                    priceInDefaultCurrency: null,
                },
                {
                    direction: 'Receive',
                    amount: {
                        amount: '250000000000000000',
                        currencyId:
                            'Polygon|0x0000000000000000000000000000000000001010',
                    },
                    priceInDefaultCurrency: null,
                },
            ],
            nfts: [],
            network: 'Polygon',
            hash: '0x3da51ef0c7d8ac983b3d5debe6e41a6e014d0a8f8b61dff02af706690e87a87c',
            timestamp: 1693648539000,
            paidFee: null,
        },
    ],
}
