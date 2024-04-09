export const bridgeQuoteEthereumUSDCPolygonUSDT: unknown = {
    success: true,
    result: {
        routes: [
            {
                routeId: '54af6dc6-8fa0-43c9-888e-7f32083a7370',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '99542004',
                usedBridgeNames: ['across'],
                minimumGasBalances: {
                    '1': '30000000000000000',
                    '137': '60000000000000000',
                },
                chainGasBalances: {
                    '1': {
                        minGasBalance: '30000000000000000',
                        hasGasBalance: false,
                    },
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 9.814728839954673,
                receivedValueInUsd: 89.72229116004533,
                inputValueInUsd: 99.914,
                outputValueInUsd: 99.53702,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 1,
                        toAmount: '99542004',
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
                        stepCount: 2,
                        routePath: '12-388',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                                chainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '100000000',
                                toAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '99678961',
                                minAmountOut: '99180566',
                                gasFees: {
                                    gasAmount: '3494937852150000',
                                    gasLimit: 223000,
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 6.05277801800302,
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
                                fromChainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '99678961',
                                toChainId: 137,
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
                                toAmount: '99542004',
                                bridgeSlippage: 0,
                                minAmountOut: '99043609',
                                protocolFees: {
                                    amount: '136957',
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xdac17f958d2ee523a2206206994597c13d831ec7',
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
                                    gasLimit: 138600,
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasAmount: '2172190073130000',
                                    feesInUsd: 3.7619508219516526,
                                },
                                serviceTime: 60,
                                maxServiceTime: 18000,
                            },
                        ],
                        gasFees: {
                            gasAmount: '5667127925280000',
                            feesInUsd: 9.814728839954673,
                            asset: {
                                chainId: 1,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 361600,
                        },
                        serviceTime: 60,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
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
                        chainId: 1,
                        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                routeId: '4e6f978e-a61c-43d8-a8c5-21cccaa83250',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '99678961',
                usedBridgeNames: ['polygon-bridge'],
                minimumGasBalances: {
                    '1': '30000000000000000',
                    '137': '60000000000000000',
                },
                chainGasBalances: {
                    '1': {
                        minGasBalance: '30000000000000000',
                        hasGasBalance: false,
                    },
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 10.289044068047062,
                receivedValueInUsd: 89.38492593195294,
                inputValueInUsd: 99.914,
                outputValueInUsd: 99.67397,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 1,
                        toAmount: '99678961',
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
                        stepCount: 2,
                        routePath: '12-2',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                                chainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '100000000',
                                toAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '99678961',
                                minAmountOut: '99180566',
                                gasFees: {
                                    gasAmount: '3494937852150000',
                                    gasLimit: 223000,
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 6.05277801800302,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'polygon-bridge',
                                    displayName: 'Polygon POS',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/polygon-bridge.png',
                                    securityScore: 5,
                                    robustnessScore: 5,
                                },
                                bridgeSlippage: 0,
                                fromChainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '99678961',
                                toChainId: 137,
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
                                toAmount: '99678961',
                                minAmountOut: '99180566',
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
                                    amount: '0',
                                },
                                gasFees: {
                                    gasAmount: '2446064687328750',
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 156075,
                                    feesInUsd: 4.236266050044041,
                                },
                                serviceTime: 1260,
                                maxServiceTime: 1200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '5941002539478750',
                            feesInUsd: 10.289044068047062,
                            asset: {
                                chainId: 1,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 379075,
                        },
                        serviceTime: 1260,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 1200,
                        bridgeSlippage: 0,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 1260,
                maxServiceTime: 1200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 1,
                        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                routeId: 'fac5e032-40f7-450f-ab7a-5b46455a9dd8',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '99325337',
                usedBridgeNames: ['hop'],
                minimumGasBalances: {
                    '1': '30000000000000000',
                    '137': '60000000000000000',
                },
                chainGasBalances: {
                    '1': {
                        minGasBalance: '30000000000000000',
                        hasGasBalance: false,
                    },
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 10.094676608912895,
                receivedValueInUsd: 89.2256933910871,
                inputValueInUsd: 99.914,
                outputValueInUsd: 99.32037,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 1,
                        toAmount: '99325337',
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
                        stepCount: 2,
                        routePath: '12-17',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                                chainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '100000000',
                                toAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '99678961',
                                minAmountOut: '99180566',
                                gasFees: {
                                    gasAmount: '3494937852150000',
                                    gasLimit: 223000,
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 6.05277801800302,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'hop',
                                    displayName: 'Hop',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/hop.png',
                                    securityScore: 4,
                                    robustnessScore: 4,
                                },
                                bridgeSlippage: 0.5,
                                fromChainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '99678961',
                                toChainId: 137,
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
                                minAmountOut: '98330315',
                                toAmount: '99325337',
                                protocolFees: {
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0,
                                    amount: '0',
                                },
                                gasFees: {
                                    gasAmount: '2333834866883700',
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 148914,
                                    feesInUsd: 4.041898590909874,
                                },
                                serviceTime: 1260,
                                maxServiceTime: 1200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '5828772719033700',
                            feesInUsd: 10.094676608912895,
                            asset: {
                                chainId: 1,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 371914,
                        },
                        serviceTime: 1260,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 1200,
                        bridgeSlippage: 0.5,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 1260,
                maxServiceTime: 1200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 1,
                        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                routeId: '764d9bb4-3212-4a04-bda7-c123943070f2',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '99723128',
                usedBridgeNames: ['hyphen'],
                minimumGasBalances: {
                    '1': '30000000000000000',
                    '137': '60000000000000000',
                },
                chainGasBalances: {
                    '1': {
                        minGasBalance: '30000000000000000',
                        hasGasBalance: false,
                    },
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 11.291308108821859,
                receivedValueInUsd: 88.42683189117815,
                inputValueInUsd: 99.914,
                outputValueInUsd: 99.71814,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 1,
                        toAmount: '99723128',
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
                        stepCount: 2,
                        routePath: '12-4',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                                chainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '100000000',
                                toAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '99678961',
                                minAmountOut: '99180566',
                                gasFees: {
                                    gasAmount: '3494937852150000',
                                    gasLimit: 223000,
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 6.05277801800302,
                                },
                            },
                            {
                                type: 'bridge',
                                protocol: {
                                    name: 'hyphen',
                                    displayName: 'Hyphen',
                                    icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/hyphen.png',
                                    securityScore: 1,
                                    robustnessScore: 4,
                                },
                                fromChainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '99678961',
                                toChainId: 137,
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
                                toAmount: '99723128',
                                bridgeSlippage: 0,
                                minAmountOut: '99224733',
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
                                    amount: '-44167',
                                },
                                gasFees: {
                                    gasAmount: '3024782513017050',
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 193001,
                                    feesInUsd: 5.238530090818838,
                                },
                                serviceTime: 360,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '6519720365167050',
                            feesInUsd: 11.291308108821859,
                            asset: {
                                chainId: 1,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 416001,
                        },
                        serviceTime: 360,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 360,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 1,
                        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                routeId: '78c86448-32ed-4918-95ba-16295a913fe3',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '98069927',
                usedBridgeNames: ['celer'],
                minimumGasBalances: {
                    '1': '30000000000000000',
                    '137': '60000000000000000',
                },
                chainGasBalances: {
                    '1': {
                        minGasBalance: '30000000000000000',
                        hasGasBalance: false,
                    },
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 10.543695024840355,
                receivedValueInUsd: 87.52132497515964,
                inputValueInUsd: 99.914,
                outputValueInUsd: 98.06502,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 1,
                        toAmount: '98069927',
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
                        stepCount: 2,
                        routePath: '12-16',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                                chainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '100000000',
                                toAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '99678961',
                                minAmountOut: '99180566',
                                gasFees: {
                                    gasAmount: '3494937852150000',
                                    gasLimit: 223000,
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 6.05277801800302,
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
                                fromChainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '99678961',
                                toChainId: 137,
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
                                toAmount: '98069927',
                                minAmountOut: '97081182',
                                gasFees: {
                                    gasAmount: '2593102834991850',
                                    gasLimit: 165457,
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 4.490917006837335,
                                },
                                bridgeSlippage: 0.5,
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
                                    amount: '1609020',
                                },
                                serviceTime: 300,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '6088040687141850',
                            feesInUsd: 10.543695024840355,
                            asset: {
                                chainId: 1,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 388457,
                        },
                        serviceTime: 300,
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        maxServiceTime: 7200,
                        bridgeSlippage: 0.5,
                        swapSlippage: 0.5,
                        userTxIndex: 0,
                    },
                ],
                serviceTime: 300,
                maxServiceTime: 7200,
                integratorFee: {
                    amount: '0',
                    asset: {
                        chainId: 1,
                        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                routeId: 'f9ffa9c3-7d67-4018-b475-093eb773f6d2',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '99893804',
                usedBridgeNames: ['stargate'],
                minimumGasBalances: {
                    '1': '30000000000000000',
                    '137': '60000000000000000',
                },
                chainGasBalances: {
                    '1': {
                        minGasBalance: '30000000000000000',
                        hasGasBalance: false,
                    },
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 13.64411342198407,
                receivedValueInUsd: 86.24468657801593,
                inputValueInUsd: 99.914,
                outputValueInUsd: 99.8888,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 1,
                        toAmount: '99893804',
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
                        stepCount: 1,
                        routePath: '0-8',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                                fromChainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                fromAmount: '100000000',
                                toChainId: 137,
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
                                minAmountOut: '99394334',
                                toAmount: '99893804',
                                protocolFees: {
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                        symbol: 'USDC',
                                        name: 'USDCoin',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                        chainAgnosticId: 'USDC',
                                    },
                                    feesInUsd: 0,
                                    amount: '106196',
                                },
                                gasFees: {
                                    gasAmount: '7878254962545728',
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 467562,
                                    feesInUsd: 13.64411342198407,
                                },
                                serviceTime: 3000,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '7878254962545728',
                            feesInUsd: 13.64411342198407,
                            asset: {
                                chainId: 1,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 467562,
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
                        chainId: 1,
                        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                routeId: '35226925-ef6e-4fb1-9b1b-c48513646a03',
                isOnlySwapRoute: false,
                fromAmount: '100000000',
                toAmount: '99570018',
                usedBridgeNames: ['stargate'],
                minimumGasBalances: {
                    '1': '30000000000000000',
                    '137': '60000000000000000',
                },
                chainGasBalances: {
                    '1': {
                        minGasBalance: '30000000000000000',
                        hasGasBalance: false,
                    },
                    '137': {
                        minGasBalance: '60000000000000000',
                        hasGasBalance: false,
                    },
                },
                totalUserTx: 1,
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalGasFeesInUsd: 18.128923365798755,
                receivedValueInUsd: 81.43610663420124,
                inputValueInUsd: 99.914,
                outputValueInUsd: 99.56503,
                userTxs: [
                    {
                        userTxType: 'fund-movr',
                        txType: 'eth_sendTransaction',
                        chainId: 1,
                        toAmount: '99570018',
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
                        stepCount: 2,
                        routePath: '12-8',
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        approvalData: {
                            minimumApprovalAmount: '100000000',
                            approvalTokenAddress:
                                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
                                chainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                                    symbol: 'USDC',
                                    name: 'USDCoin',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
                                    chainAgnosticId: 'USDC',
                                },
                                swapSlippage: 0.5,
                                fromAmount: '100000000',
                                toAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                toAmount: '99678961',
                                minAmountOut: '99180566',
                                gasFees: {
                                    gasAmount: '3494937852150000',
                                    gasLimit: 223000,
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    feesInUsd: 6.05277801800302,
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
                                fromChainId: 1,
                                fromAsset: {
                                    chainId: 1,
                                    address:
                                        '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                    symbol: 'USDT',
                                    name: 'Tether USD',
                                    decimals: 6,
                                    icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    logoURI:
                                        'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                    chainAgnosticId: 'USDT',
                                },
                                fromAmount: '99678961',
                                toChainId: 137,
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
                                minAmountOut: '98573772',
                                toAmount: '99570018',
                                protocolFees: {
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xdac17f958d2ee523a2206206994597c13d831ec7',
                                        symbol: 'USDT',
                                        name: 'Tether USD',
                                        decimals: 6,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
                                        chainAgnosticId: 'USDT',
                                    },
                                    feesInUsd: 0,
                                    amount: '108943',
                                },
                                gasFees: {
                                    gasAmount: '6972893662801328',
                                    asset: {
                                        chainId: 1,
                                        address:
                                            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                        symbol: 'ETH',
                                        name: 'Ethereum',
                                        decimals: 18,
                                        icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        logoURI:
                                            'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                        chainAgnosticId: null,
                                    },
                                    gasLimit: 409794,
                                    feesInUsd: 12.076145347795734,
                                },
                                serviceTime: 3000,
                                maxServiceTime: 7200,
                            },
                        ],
                        gasFees: {
                            gasAmount: '10467831514951328',
                            feesInUsd: 18.128923365798755,
                            asset: {
                                chainId: 1,
                                address:
                                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                                symbol: 'ETH',
                                name: 'Ethereum',
                                decimals: 18,
                                icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                logoURI:
                                    'https://maticnetwork.github.io/polygon-token-assets/assets/eth.svg',
                                chainAgnosticId: null,
                            },
                            gasLimit: 632794,
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
                        chainId: 1,
                        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
        fromChainId: 1,
        fromAsset: {
            chainId: 1,
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            symbol: 'USDC',
            name: 'USDCoin',
            decimals: 6,
            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
            logoURI:
                'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
            chainAgnosticId: 'USDC',
        },
        toChainId: 137,
        toAsset: {
            chainId: 137,
            address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            symbol: 'USDT',
            name: 'Tether USD',
            decimals: 6,
            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            logoURI:
                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            chainAgnosticId: 'USDT',
        },
        bridgeRouteErrors: {
            'arbitrum-bridge': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'anyswap-router-v4': {
                status: 'ASSET_NOT_SUPPORTED',
            },
            'anyswap-router-v6': {
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
