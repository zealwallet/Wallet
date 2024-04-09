export const swapQuoteEthereumUSDCUSDTNoRoutes: unknown = {
    success: true,
    result: {
        routes: [],
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
        toChainId: 1,
        toAsset: {
            chainId: 1,
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            symbol: 'USDT',
            name: 'Tether USD',
            decimals: 6,
            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            logoURI:
                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            chainAgnosticId: 'USDT',
        },
    },
}

export const swapQuotePolygonMaticUSDCNoRoutes: unknown = {
    success: true,
    result: {
        routes: [],
        fromChainId: 137,
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
        toChainId: 137,
        toAsset: {
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
}

export const swapQuoteOneInchEthereumUSDCUSDT: unknown = {
    success: true,
    result: {
        routes: [
            {
                routeId: 'cd974df5-4fcc-49bf-947b-a7dd068150c7',
                isOnlySwapRoute: true,
                fromAmount: '10000000',
                toAmount: '9959698',
                sender: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                recipient: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                totalUserTx: 1,
                totalGasFeesInUsd: 5.929755041946305,
                userTxs: [
                    {
                        userTxType: 'dex-swap',
                        txType: 'eth_sendTransaction',
                        swapSlippage: 0.38,
                        chainId: 1,
                        protocol: {
                            name: 'oneinch',
                            displayName: '1Inch',
                            icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                        },
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
                        approvalData: {
                            minimumApprovalAmount: '10000000',
                            approvalTokenAddress:
                                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                        },
                        fromAmount: '10000000',
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
                        toAmount: '9959698',
                        minAmountOut: '9921851',
                        gasFees: {
                            gasAmount: '3385606889079000',
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
                            feesInUsd: 5.929755041946305,
                        },
                        sender: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                        recipient: '0x26D0d88fFe184b1BA244D08Fb2a0c695e65c8932',
                        userTxIndex: 0,
                    },
                ],
                usedDexName: 'oneinch',
                outputValueInUsd: 9.96955,
                receivedValueInUsd: 9.96955,
                inputValueInUsd: 10,
            },
        ],
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
        toChainId: 1,
        toAsset: {
            chainId: 1,
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            symbol: 'USDT',
            name: 'Tether USD',
            decimals: 6,
            icon: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            logoURI:
                'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
            chainAgnosticId: 'USDT',
        },
    },
}

export const swapQuoteOneInchPolygonUSDCMATIC: unknown = {
    success: true,
    result: {
        routes: [
            {
                routeId: 'b9b07696-828a-47cd-9e2a-0a03fb41e604',
                isOnlySwapRoute: true,
                fromAmount: '157223311',
                toAmount: '241983863500519118749',
                sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                totalUserTx: 1,
                totalGasFeesInUsd: 0.07362301835607547,
                userTxs: [
                    {
                        userTxType: 'dex-swap',
                        txType: 'eth_sendTransaction',
                        swapSlippage: 0.5,
                        chainId: 137,
                        protocol: {
                            name: 'oneinch',
                            displayName: '1Inch',
                            icon: 'https://bridgelogos.s3.ap-south-1.amazonaws.com/1inch.png',
                        },
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
                        approvalData: {
                            minimumApprovalAmount: '157223311',
                            approvalTokenAddress:
                                '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                            allowanceTarget:
                                '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
                            owner: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        },
                        fromAmount: '157223311',
                        toAsset: {
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
                        toAmount: '241983863500519118749',
                        minAmountOut: '240773944183016523155',
                        gasFees: {
                            gasAmount: '113363849402678406',
                            gasLimit: 312762,
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
                            feesInUsd: 0.07362301835607547,
                        },
                        sender: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                        userTxIndex: 0,
                    },
                ],
                usedDexName: 'oneinch',
                outputValueInUsd: 158.154,
                receivedValueInUsd: 157.154,
                inputValueInUsd: 157.13526,
            },
        ],
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
        toChainId: 137,
        toAsset: {
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
    },
}
