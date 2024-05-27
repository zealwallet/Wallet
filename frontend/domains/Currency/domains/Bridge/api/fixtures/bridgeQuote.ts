export const bridgeQuoteArbitrumUSDCEBaseUSDbC: unknown = {
    success: true,
    result: {
        routes: [
            {
                routeId: '6468675a-591c-4267-9dea-c96e5c54c974',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '99758457',
                usedBridgeNames: ['across'],
                minimumGasBalances: {
                    '8453': '1800000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '8453': {
                        minGasBalance: '1800000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                recipient: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                totalGasFeesInUsd: 0.031100115356600004,
                receivedValueInUsd: 99.7123898846434,
                inputValueInUsd: 99.814,
                outputValueInUsd: 99.74349,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 42161,
                        toAmount: '99758457',
                        toAsset: {
                            chainId: 8453,
                            address:
                                '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
                            symbol: 'USDBC',
                            name: 'USD Base Coin',
                            decimals: 6,
                            icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                            logoURI:
                                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                            chainAgnosticId: 'USDBC',
                        },
                        stepCount: 2,
                        routePath: '407-388',
                        sender: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'zerox',
                                    displayName: '0x',
                                    icon: 'https://media.socket.tech/dexes/0x.svg',
                                },
                                chainId: 42161,
                                fromAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                                    symbol: 'USDC.E',
                                    name: 'Bridged USDC',
                                    decimals: 6,
                                    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                    logoURI:
                                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                    chainAgnosticId: 'USDC',
                                },
                                fromAmount: '100000000',
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
                                    symbol: 'USDC',
                                    name: 'USD Coin',
                                    decimals: 6,
                                    icon: 'https://assets.polygon.technology/tokenAssets/usdc.svg',
                                    logoURI:
                                        'https://assets.polygon.technology/tokenAssets/usdc.svg',
                                    chainAgnosticId: null,
                                },
                                toAmount: '99843732',
                                swapSlippage: 0.5,
                                minAmountOut: '99344513',
                                gasFees: {
                                    gasAmount: '4778980000000',
                                    gasLimit: 477898,
                                    asset: {
                                        chainId: 42161,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://assets.polygon.technology/tokenAssets/eth.svg',
                                        logoURI:
                                            'https://assets.polygon.technology/tokenAssets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.0142158884366,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'across',
                                    displayName: 'Across',
                                    icon: 'https://miro.medium.com/max/800/1*PN_F5yW4VMBgs_xX-fsyzQ.png',
                                    securityScore: 3,
                                    robustnessScore: 4,
                                },
                                fromChainId: 42161,
                                fromAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
                                    symbol: 'USDC',
                                    name: 'USD Coin',
                                    decimals: 6,
                                    icon: 'https://assets.polygon.technology/tokenAssets/usdc.svg',
                                    logoURI:
                                        'https://assets.polygon.technology/tokenAssets/usdc.svg',
                                    chainAgnosticId: null,
                                },
                                fromAmount: '99843732',
                                toChainId: 8453,
                                toAsset: {
                                    chainId: 8453,
                                    address:
                                        '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
                                    symbol: 'USDBC',
                                    name: 'USD Base Coin',
                                    decimals: 6,
                                    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                    logoURI:
                                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                    chainAgnosticId: 'USDBC',
                                },
                                toAmount: '99758457',
                                bridgeSlippage: 0,
                                minAmountOut: '99259238',
                                protocolFees: {
                                    amount: '85275',
                                    asset: {
                                        chainId: 42161,
                                        address:
                                            '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
                                        symbol: 'USDC',
                                        name: 'USD Coin',
                                        decimals: 6,
                                        icon: 'https://assets.polygon.technology/tokenAssets/usdc.svg',
                                        logoURI:
                                            'https://assets.polygon.technology/tokenAssets/usdc.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.085275,
                                },
                                gasFees: {
                                    gasLimit: 567600,
                                    asset: {
                                        chainId: 42161,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://assets.polygon.technology/tokenAssets/eth.svg',
                                        logoURI:
                                            'https://assets.polygon.technology/tokenAssets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasAmount: '5676000000000',
                                    feesInUsd: 0.016884226920000002,
                                },
                                serviceTime: 60,
                                maxServiceTime: 18000,
                                extraData: {
                                    rewards: [],
                                },
                            },
                        ],
                        gasFees: {
                            gasAmount: '10454980000000',
                            feesInUsd: 0.031100115356600004,
                            asset: {
                                chainId: 42161,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://assets.polygon.technology/tokenAssets/eth.svg',
                                logoURI:
                                    'https://assets.polygon.technology/tokenAssets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 1045498,
                        },
                        serviceTime: 60,
                        recipient: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                        maxServiceTime: 18000,
                        bridgeSlippage: 0,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 60,
                maxServiceTime: 18000,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 42161,
                        address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                        symbol: 'USDC.E',
                        name: 'Bridged USDC',
                        decimals: 6,
                        icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                        logoURI:
                            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                        chainAgnosticId: 'USDC',
                    },
                },
                extraData: {
                    rewards: [],
                },
            },
            {
                routeId: '036fbccf-26ca-453a-aa85-981e1b79a97f',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '98778314',
                usedBridgeNames: ['stargate'],
                minimumGasBalances: {
                    '8453': '1800000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '8453': {
                        minGasBalance: '1800000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                recipient: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                totalGasFeesInUsd: 0.0496104158854,
                receivedValueInUsd: 98.71387958411461,
                inputValueInUsd: 99.814,
                outputValueInUsd: 98.76349,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 42161,
                        toAmount: '98778314',
                        toAsset: {
                            chainId: 8453,
                            address:
                                '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
                            symbol: 'USDBC',
                            name: 'USD Base Coin',
                            decimals: 6,
                            icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                            logoURI:
                                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                            chainAgnosticId: 'USDBC',
                        },
                        stepCount: 1,
                        routePath: '0-408',
                        sender: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                        },
                        steps: [
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'stargate',
                                    displayName: 'Stargate',
                                    icon: 'https://s2.coinmarketcap.com/static/img/coins/128x128/18934.png',
                                    securityScore: 2,
                                    robustnessScore: 3,
                                },
                                bridgeSlippage: 0.5,
                                fromChainId: 42161,
                                fromAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                                    symbol: 'USDC.E',
                                    name: 'Bridged USDC',
                                    decimals: 6,
                                    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                    logoURI:
                                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                    chainAgnosticId: 'USDC',
                                },
                                fromAmount: '100000000',
                                toChainId: 8453,
                                toAsset: {
                                    chainId: 8453,
                                    address:
                                        '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
                                    symbol: 'USDBC',
                                    name: 'USD Base Coin',
                                    decimals: 6,
                                    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                    logoURI:
                                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                    chainAgnosticId: 'USDBC',
                                },
                                minAmountOut: '98284422',
                                toAmount: '98778314',
                                protocolFees: {
                                    asset: {
                                        chainId: 42161,
                                        address:
                                            '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                                        symbol: 'USDC.E',
                                        name: 'Bridged USDC',
                                        decimals: 6,
                                        icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                        logoURI:
                                            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                                        chainAgnosticId: 'USDC',
                                    },
                                    feesInUsd: 1.222415,
                                    amount: '1224686',
                                },
                                gasFees: {
                                    gasAmount: '16677620000000',
                                    asset: {
                                        chainId: 42161,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://assets.polygon.technology/tokenAssets/eth.svg',
                                        logoURI:
                                            'https://assets.polygon.technology/tokenAssets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 1000000,
                                    feesInUsd: 0.0496104158854,
                                },
                                serviceTime: 60,
                                maxServiceTime: 7200,
                                extraData: {
                                    rewards: [],
                                },
                            },
                        ],
                        gasFees: {
                            gasAmount: '16677620000000',
                            feesInUsd: 0.0496104158854,
                            asset: {
                                chainId: 42161,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://assets.polygon.technology/tokenAssets/eth.svg',
                                logoURI:
                                    'https://assets.polygon.technology/tokenAssets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 1000000,
                        },
                        serviceTime: 60,
                        recipient: '0x40fcdd8c164ea13cfd85a871e8755e977d885da4',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 60,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 42161,
                        address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                        symbol: 'USDC.E',
                        name: 'Bridged USDC',
                        decimals: 6,
                        icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                        logoURI:
                            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                        chainAgnosticId: 'USDC',
                    },
                },
                extraData: {
                    rewards: [],
                },
            },
        ],
        socketRoute: null,
        destinationCallData: {},
        fromChainId: 42161,
        fromAsset: {
            chainId: 42161,
            address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            symbol: 'USDC.E',
            name: 'Bridged USDC',
            decimals: 6,
            icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            chainAgnosticId: 'USDC',
        },
        toChainId: 8453,
        toAsset: {
            chainId: 8453,
            address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
            symbol: 'USDBC',
            name: 'USD Base Coin',
            decimals: 6,
            icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            chainAgnosticId: 'USDBC',
        },
        bridgeRouteErrors: {
            'polygon-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            hyphen: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'arbitrum-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'anyswap-router-v4': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'anyswap-router-v6': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            hop: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            hopCctp: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            celer: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'refuel-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'optimism-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            cctp: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            connext: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            synapse: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'base-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'zora-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'zksync-native': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            symbiosis: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'gnosis-native-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'mantle-native-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'scroll-native-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
        },
    },
}

export const bridgeQuotePolygonUSDCArbitrumUSDT: unknown = {
    success: true,
    result: {
        routes: [
            {
                routeId: 'aa7c5f10-c3ca-4df8-84d2-fab073622b09',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '156799693',
                usedBridgeNames: ['across'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.06414042949665955,
                receivedValueInUsd: 157.04914957050335,
                inputValueInUsd: 157.37896,
                outputValueInUsd: 157.11329,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '156799693',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 2,
                        routePath: '9-392',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'oneinch',
                                    displayName: '1Inch',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                                },
                                chainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '157223311',
                                toAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '157188751',
                                minAmountOut: '156402807',
                                gasFees: {
                                    gasAmount: '73371848304378072',
                                    gasLimit: 376962,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.04677037109868767,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'across',
                                    displayName: 'Across',
                                    icon: 'https://miro.medium.com/max/800/1*PN_F5yW4VMBgs_xX-fsyzQ.png',
                                    securityScore: 3,
                                    robustnessScore: 4,
                                },
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '157188751',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '156799693',
                                bridgeSlippage: 0,
                                minAmountOut: '156013749',
                                protocolFees: {
                                    amount: '389058',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0,
                                },
                                gasFees: {
                                    gasLimit: 140000,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasAmount: '27249586861840000',
                                    feesInUsd: 0.017370058397971875,
                                },
                                serviceTime: 120,
                                maxServiceTime: 18000,
                            },
                        ],
                        gasFees: {
                            gasAmount: '100621435166218072',
                            feesInUsd: 0.06414042949665955,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 516962,
                        },
                        serviceTime: 120,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 18000,
                        bridgeSlippage: 0,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 120,
                maxServiceTime: 18000,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: 'fe24e4cb-6b81-4676-8d4a-023ce802a9ae',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '157299386',
                usedBridgeNames: ['stargate'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.7683044274556793,
                receivedValueInUsd: 156.8456755725443,
                inputValueInUsd: 157.37896,
                outputValueInUsd: 157.61398,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '157299386',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 1,
                        routePath: '0-5',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'stargate',
                                    displayName: 'Stargate',
                                    icon: 'https://s2.coinmarketcap.com/static/img/coins/128x128/18934.png',
                                    securityScore: 2,
                                    robustnessScore: 3,
                                },
                                bridgeSlippage: 0.5,
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                fromAmount: '157223311',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                minAmountOut: '156512889',
                                toAmount: '157299386',
                                protocolFees: {
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                        symbol: 'USDC',
                                        name: 'USDCoin',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                        chainAgnosticId: 'USDC',
                                    },
                                    feesInUsd: 0,
                                    amount: '35598',
                                },
                                gasFees: {
                                    gasAmount: '1205291182828392945',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 450772,
                                    feesInUsd: 0.7683044274556793,
                                },
                                serviceTime: 3000,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '1205291182828392945',
                            feesInUsd: 0.7683044274556793,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 450772,
                        },
                        serviceTime: 3000,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 3000,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: 'eab79764-1c58-44c1-bc2a-1474eb8f5d22',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '157224623',
                usedBridgeNames: ['stargate'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.8135623627552864,
                receivedValueInUsd: 156.72550763724473,
                inputValueInUsd: 157.37896,
                outputValueInUsd: 157.53907,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '157224623',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 2,
                        routePath: '9-5',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'oneinch',
                                    displayName: '1Inch',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                                },
                                chainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '157223311',
                                toAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '157188751',
                                minAmountOut: '156402807',
                                gasFees: {
                                    gasAmount: '73371848304378072',
                                    gasLimit: 376962,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.04677037109868767,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'stargate',
                                    displayName: 'Stargate',
                                    icon: 'https://s2.coinmarketcap.com/static/img/coins/128x128/18934.png',
                                    securityScore: 2,
                                    robustnessScore: 3,
                                },
                                bridgeSlippage: 0.5,
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '157188751',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                minAmountOut: '155652555',
                                toAmount: '157224623',
                                protocolFees: {
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0,
                                    amount: '78803',
                                },
                                gasFees: {
                                    gasAmount: '1202918522372351305',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 438582,
                                    feesInUsd: 0.7667919916565987,
                                },
                                serviceTime: 3000,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '1276290370676729377',
                            feesInUsd: 0.8135623627552864,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 815544,
                        },
                        serviceTime: 3000,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0.5,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 3000,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: '524376c4-bb82-4b6b-866a-fd17bfb7432c',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '152612557',
                usedBridgeNames: ['celer'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.06709482828646315,
                receivedValueInUsd: 152.85068517171354,
                inputValueInUsd: 157.37896,
                outputValueInUsd: 152.91778,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '152612557',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 2,
                        routePath: '9-17',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'oneinch',
                                    displayName: '1Inch',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                                },
                                chainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '157223311',
                                toAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '157188751',
                                minAmountOut: '156402807',
                                gasFees: {
                                    gasAmount: '73371848304378072',
                                    gasLimit: 376962,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.04677037109868767,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'celer',
                                    displayName: 'Celer',
                                    icon: 'https://socketicons.s3.amazonaws.com/Celer+Light.png',
                                    securityScore: 3,
                                    robustnessScore: 3,
                                },
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '157188751',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '152612557',
                                minAmountOut: '151063550',
                                gasFees: {
                                    gasAmount: '31884352307226672',
                                    gasLimit: 163812,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.02032445718777549,
                                },
                                bridgeSlippage: 0.5,
                                protocolFees: {
                                    asset: {
                                        chainId: 42161,
                                        address:
                                            '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0,
                                    amount: '4576147',
                                },
                                serviceTime: 600,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '105256200611604744',
                            feesInUsd: 0.06709482828646315,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 540774,
                        },
                        serviceTime: 600,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0.5,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 600,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
        ],
        destinationCallData: {},
        fromChainId: 137,
        fromAsset: {
            chainId: 137,
            address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            symbol: 'USDC',
            name: 'USDCoin',
            decimals: 6,
            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
            logoURI:
                'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
            chainAgnosticId: 'USDC',
        },
        toChainId: 42161,
        toAsset: {
            chainId: 42161,
            address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
            symbol: 'USDT',
            name: 'Tether USD',
            decimals: 6,
            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            logoURI:
                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            chainAgnosticId: 'USDT',
        },
        bridgeRouteErrors: {
            'anyswap-router-v4': {
                status: 'INSUFFICIENT_LIQUIDITY',
                availableLiquidity: '6400',
            },
            'polygon-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            hyphen: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'arbitrum-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'anyswap-router-v6': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            hop: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'refuel-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'optimism-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            cctp: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            connext: {
                status: 'ASSET_NOT_SUPPORTED',
            },
        },
    },
}

export const bridgeQuotePolygonUSDCArbitrumUSDTRefuel: unknown = {
    success: true,
    result: {
        routes: [
            {
                routeId: 'c48882c5-8fc6-402e-a831-916e1eeb387d',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '156857480',
                usedBridgeNames: ['across'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.06598072489878527,
                receivedValueInUsd: 156.71306927510122,
                inputValueInUsd: 157.13212,
                outputValueInUsd: 156.77905,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '156857480',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 2,
                        routePath: '9-392',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'oneinch',
                                    displayName: '1Inch',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                                },
                                chainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '157223311',
                                toAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '157215455',
                                minAmountOut: '156429377',
                                gasFees: {
                                    gasAmount: '70531904407414200',
                                    gasLimit: 376962,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.04555669812055765,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'across',
                                    displayName: 'Across',
                                    icon: 'https://miro.medium.com/max/800/1*PN_F5yW4VMBgs_xX-fsyzQ.png',
                                    securityScore: 3,
                                    robustnessScore: 4,
                                },
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '157215455',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '156857480',
                                bridgeSlippage: 0,
                                minAmountOut: '156071402',
                                protocolFees: {
                                    amount: '357975',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0,
                                },
                                gasFees: {
                                    gasLimit: 140000,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasAmount: '26194859474000000',
                                    feesInUsd: 0.016919312123975547,
                                },
                                serviceTime: 180,
                                maxServiceTime: 18000,
                            },
                        ],
                        gasFees: {
                            gasAmount: '96726763881414200',
                            feesInUsd: 0.0624760102445332,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 516962,
                        },
                        serviceTime: 180,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 18000,
                        bridgeSlippage: 0,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 180,
                maxServiceTime: 18000,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: '5bb2e55b-1353-42eb-9c51-46f8f793cc99',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '157288469',
                usedBridgeNames: ['stargate'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.7236475584882489,
                receivedValueInUsd: 156.48617244151177,
                inputValueInUsd: 157.13212,
                outputValueInUsd: 157.20982,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '157288469',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 1,
                        routePath: '0-5',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'stargate',
                                    displayName: 'Stargate',
                                    icon: 'https://s2.coinmarketcap.com/static/img/coins/128x128/18934.png',
                                    securityScore: 2,
                                    robustnessScore: 3,
                                },
                                bridgeSlippage: 0.5,
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                fromAmount: '157223311',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                minAmountOut: '156502026',
                                toAmount: '157288469',
                                protocolFees: {
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                        symbol: 'USDC',
                                        name: 'USDCoin',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                        chainAgnosticId: 'USDC',
                                    },
                                    feesInUsd: 0.031876,
                                    amount: '31876',
                                },
                                gasFees: {
                                    gasAmount: '1114941343785894671',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 445978,
                                    feesInUsd: 0.7201428438339968,
                                },
                                serviceTime: 3000,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '1114941343785894671',
                            feesInUsd: 0.7201428438339968,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 445978,
                        },
                        serviceTime: 3000,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 3000,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: 'f8b32e9d-6750-4d49-8694-e4a4bbe4cda6',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '157301543',
                usedBridgeNames: ['stargate'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.7683104335197428,
                receivedValueInUsd: 156.45457956648028,
                inputValueInUsd: 157.13212,
                outputValueInUsd: 157.22289,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '157301543',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 2,
                        routePath: '9-5',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'oneinch',
                                    displayName: '1Inch',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                                },
                                chainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '157223311',
                                toAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '157215455',
                                minAmountOut: '156429377',
                                gasFees: {
                                    gasAmount: '70531904407414200',
                                    gasLimit: 376962,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.04555669812055765,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'stargate',
                                    displayName: 'Stargate',
                                    icon: 'https://s2.coinmarketcap.com/static/img/coins/128x128/18934.png',
                                    securityScore: 2,
                                    robustnessScore: 3,
                                },
                                bridgeSlippage: 0.5,
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '157215455',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                minAmountOut: '155728957',
                                toAmount: '157301543',
                                protocolFees: {
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0.036139,
                                    amount: '36158',
                                },
                                gasFees: {
                                    gasAmount: '1113557506781111071',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 438582,
                                    feesInUsd: 0.7192490207449331,
                                },
                                serviceTime: 3000,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '1184089411188525271',
                            feesInUsd: 0.7648057188654908,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 815544,
                        },
                        serviceTime: 3000,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0.5,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 3000,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: '4bb4c293-9c2b-4a96-99d3-8dc7a2c74693',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '155162260',
                usedBridgeNames: ['synapse'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.028110228571690807,
                receivedValueInUsd: 155.0565597714283,
                inputValueInUsd: 157.13212,
                outputValueInUsd: 155.08467,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '155162260',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 1,
                        routePath: '0-393',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'synapse',
                                    displayName: 'Synapse',
                                    icon: 'https://307049640-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhQGEw0SsziyZOw9Bjh%2Fuploads%2FSzVM9wfRXcQqGEqnUlbV%2Fsynapse_social_icon.png?alt=media&token=15f2bcc2-da1e-4671-8f0a-fd5c8bd35569',
                                    securityScore: 3,
                                    robustnessScore: 3,
                                },
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                fromAmount: '157223311',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                minAmountOut: '154386448',
                                toAmount: '155162260',
                                bridgeSlippage: 0,
                                protocolFees: {
                                    amount: '2061051',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                        symbol: 'USDC',
                                        name: 'USDCoin',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                        chainAgnosticId: 'USDC',
                                    },
                                    feesInUsd: 0,
                                },
                                gasFees: {
                                    gasAmount: '38094809920760000',
                                    gasLimit: 203600,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.024605513917438728,
                                },
                                serviceTime: 90000,
                                maxServiceTime: 720,
                            },
                        ],
                        gasFees: {
                            gasAmount: '38094809920760000',
                            feesInUsd: 0.024605513917438728,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 203600,
                        },
                        serviceTime: 90000,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 720,
                        bridgeSlippage: 0,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 90000,
                maxServiceTime: 720,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: '25de17f9-d483-4562-8b8f-220ed1ec0df3',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '155166297',
                usedBridgeNames: ['synapse'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.07366692669224845,
                receivedValueInUsd: 155.01504307330774,
                inputValueInUsd: 157.13212,
                outputValueInUsd: 155.08871,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '155166297',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 2,
                        routePath: '9-393',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'oneinch',
                                    displayName: '1Inch',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                                },
                                chainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '157223311',
                                toAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '157215455',
                                minAmountOut: '156429377',
                                gasFees: {
                                    gasAmount: '70531904407414200',
                                    gasLimit: 376962,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.04555669812055765,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'synapse',
                                    displayName: 'Synapse',
                                    icon: 'https://307049640-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhQGEw0SsziyZOw9Bjh%2Fuploads%2FSzVM9wfRXcQqGEqnUlbV%2Fsynapse_social_icon.png?alt=media&token=15f2bcc2-da1e-4671-8f0a-fd5c8bd35569',
                                    securityScore: 3,
                                    robustnessScore: 3,
                                },
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '157215455',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                minAmountOut: '153604387',
                                toAmount: '155166297',
                                bridgeSlippage: 0,
                                protocolFees: {
                                    amount: '2049158',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0,
                                },
                                gasFees: {
                                    gasAmount: '38094809920760000',
                                    gasLimit: 203600,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.024605513917438728,
                                },
                                serviceTime: 90000,
                                maxServiceTime: 720,
                            },
                        ],
                        gasFees: {
                            gasAmount: '108626714328174200',
                            feesInUsd: 0.07016221203799637,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 580562,
                        },
                        serviceTime: 90000,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 720,
                        bridgeSlippage: 0,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 90000,
                maxServiceTime: 720,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: 'bb5ad7a2-3cd0-4fbf-88cb-84bac99c4c62',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '155146879',
                usedBridgeNames: ['synapse'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.0730626655449636,
                receivedValueInUsd: 154.99623733445503,
                inputValueInUsd: 157.13212,
                outputValueInUsd: 155.0693,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '155146879',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 2,
                        routePath: '9-393',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'oneinch',
                                    displayName: '1Inch',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                                },
                                chainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '157223311',
                                toAsset: {
                                    chainId: 137,
                                    address:
                                        '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
                                    symbol: 'DAI',
                                    name: 'Dai Stablecoin',
                                    decimals: 18,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/dai.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/dai.svg',
                                    chainAgnosticId: 'DAI',
                                },
                                toAmount: '157230592461015562650',
                                minAmountOut: '156444439498710484836',
                                gasFees: {
                                    gasAmount: '69596373711914200',
                                    gasLimit: 371962,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.0449524369732728,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'synapse',
                                    displayName: 'Synapse',
                                    icon: 'https://307049640-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhQGEw0SsziyZOw9Bjh%2Fuploads%2FSzVM9wfRXcQqGEqnUlbV%2Fsynapse_social_icon.png?alt=media&token=15f2bcc2-da1e-4671-8f0a-fd5c8bd35569',
                                    securityScore: 3,
                                    robustnessScore: 3,
                                },
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
                                    symbol: 'DAI',
                                    name: 'Dai Stablecoin',
                                    decimals: 18,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/dai.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/dai.svg',
                                    chainAgnosticId: 'DAI',
                                },
                                fromAmount: '157230592461015562650',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                minAmountOut: '153584992',
                                toAmount: '155146879',
                                bridgeSlippage: 0,
                                protocolFees: {
                                    amount: '2083713461015562650',
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
                                        symbol: 'DAI',
                                        name: 'Dai Stablecoin',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/dai.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/dai.svg',
                                        chainAgnosticId: 'DAI',
                                    },
                                    feesInUsd: 0,
                                },
                                gasFees: {
                                    gasAmount: '38094809920760000',
                                    gasLimit: 203600,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.024605513917438728,
                                },
                                serviceTime: 90000,
                                maxServiceTime: 720,
                            },
                        ],
                        gasFees: {
                            gasAmount: '107691183632674200',
                            feesInUsd: 0.06955795089071153,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 575562,
                        },
                        serviceTime: 90000,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 720,
                        bridgeSlippage: 0,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 90000,
                maxServiceTime: 720,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
            {
                routeId: '8725dabc-ae2d-499c-be98-328586617d8c',
                isOnlySwapRoute: false,
                fromAmount: '157223311',
                toAmount: '152606730',
                usedBridgeNames: ['celer'],
                minimumGasBalances: {
                    '137': '60000000000000000',
                    '42161': '2800000000000000',
                },
                chainGasBalances: {
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                    '42161': {
                        minGasBalance: '2800000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 0.0688584581866146,
                receivedValueInUsd: 152.46156154181338,
                inputValueInUsd: 157.13212,
                outputValueInUsd: 152.53042,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 137,
                        toAmount: '152606730',
                        toAsset: {
                            chainId: 42161,
                            address:
                                '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                            symbol: 'USDT',
                            name: 'Tether USD',
                            decimals: 6,
                            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            logoURI:
                                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                            chainAgnosticId: 'USDT',
                        },
                        stepCount: 2,
                        routePath: '9-17',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        steps: [
                            {
                                type: 'middleware',
                                protocol: {
                                    name: 'oneinch',
                                    displayName: '1Inch',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                                },
                                chainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '157223311',
                                toAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '157215455',
                                minAmountOut: '156429377',
                                gasFees: {
                                    gasAmount: '70531904407414200',
                                    gasLimit: 376962,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.04555669812055765,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'celer',
                                    displayName: 'Celer',
                                    icon: 'https://socketicons.s3.amazonaws.com/Celer+Light.png',
                                    securityScore: 3,
                                    robustnessScore: 3,
                                },
                                fromChainId: 137,
                                fromAsset: {
                                    chainId: 137,
                                    address:
                                        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '157215455',
                                toChainId: 42161,
                                toAsset: {
                                    chainId: 42161,
                                    address:
                                        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '152606730',
                                minAmountOut: '151057618',
                                gasFees: {
                                    gasAmount: '30650230858249200',
                                    gasLimit: 163812,
                                    asset: {
                                        chainId: 137,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'MATIC',
                                        name: 'MATIC',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 0.019797045411804874,
                                },
                                bridgeSlippage: 0.5,
                                protocolFees: {
                                    asset: {
                                        chainId: 42161,
                                        address:
                                            '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0,
                                    amount: '4608779',
                                },
                                serviceTime: 540,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '101182135265663400',
                            feesInUsd: 0.06535374353236252,
                            asset: {
                                chainId: 137,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'MATIC',
                                name: 'MATIC',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 540774,
                        },
                        serviceTime: 540,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0.5,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 540,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 137,
                        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                        symbol: 'USDC',
                        name: 'USDCoin',
                        decimals: 6,
                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        logoURI:
                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                        chainAgnosticId: 'USDC',
                    },
                },
            },
        ],
        refuel: {
            fromAmount: '8701207697304016000',
            toAmount: '3053246799776329',
            gasFees: {
                gasAmount: '5426078033900000',
                gasLimit: 29000,
                asset: {
                    chainId: 137,
                    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                    symbol: 'MATIC',
                    name: 'MATIC',
                    decimals: 18,
                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                    logoURI:
                        'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                    chainAgnosticId: null,
                },
                feesInUsd: 0.0035047146542520778,
            },
            recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
            serviceTime: 600000,
            fromAsset: {
                chainId: 137,
                address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                symbol: 'MATIC',
                name: 'MATIC',
                decimals: 18,
                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                logoURI:
                    'https://maticnetwork.github.io/polygon-token-assets/assets/matic.svg',
                chainAgnosticId: null,
            },
            toAsset: {
                chainId: 42161,
                address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                symbol: 'ETH',
                name: 'Ethereum',
                decimals: 18,
                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                logoURI:
                    'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                chainAgnosticId: null,
            },
            fromChainId: 137,
            toChainId: 42161,
        },
        destinationCallData: {},
        fromChainId: 137,
        fromAsset: {
            chainId: 137,
            address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            symbol: 'USDC',
            name: 'USDCoin',
            decimals: 6,
            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
            logoURI:
                'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
            chainAgnosticId: 'USDC',
        },
        toChainId: 42161,
        toAsset: {
            chainId: 42161,
            address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
            symbol: 'USDT',
            name: 'Tether USD',
            decimals: 6,
            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            logoURI:
                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            chainAgnosticId: 'USDT',
        },
        bridgeRouteErrors: {
            'anyswap-router-v4': {
                status: 'SOCKET_INTERNAL_SERVER_ERROR',
            },
            hyphen: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'arbitrum-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'anyswap-router-v6': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            hop: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'optimism-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            cctp: {
                status: 'ASSET_NOT_SUPPORTED',
            },
            connext: {
                status: 'ASSET_NOT_SUPPORTED',
            },
        },
    },
}
