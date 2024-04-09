export const bridgeStatusPolygonUSDCArbitrumUSDTRefuelPendingAll: unknown = {
    success: true,
    result: {
        destinationTxStatus: 'PENDING',
        sourceTxStatus: 'COMPLETED',
        bridgeName: 'refuel-bridge',
        refuel: {
            destinationTxStatus: 'PENDING',
            sourceTxStatus: 'COMPLETED',
            bridge: 'refuel-bridge',
            status: 'PENDING',
            destinationTransactionHash: null,
        },
        isSocketTx: false,
        sourceTransactionHash:
            '0x3fedd084d201a89bd59749d1eee94350dd080c986e74762207b310b21581ade1',
        fromChainId: 137,
        toChainId: 42161,
    },
}

export const bridgeStatusPolygonUSDCArbitrumUSDTRefuelPendingRefuel: unknown = {
    success: true,
    result: {
        destinationTransactionHash:
            '0xbf7f533457ab53286481cc73bb18a89db81ff8e57c87861e519f3ef5bd944bc8',
        sourceTransactionHash:
            '0x3fedd084d201a89bd59749d1eee94350dd080c986e74762207b310b21581ade1',
        fromChainId: 137,
        toChainId: 42161,
        fromAsset: {
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
        srcTokenPrice: 0.999309,
        destTokenPrice: 0.999309,
        fromAmount: '5989388',
        toAmount: '5704457',
        sender: '0x3a23f943181408eac424116af7b7790c94cb97a5',
        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
        isSocketTx: false,
        refuel: {
            destinationTxStatus: 'PENDING',
            sourceTxStatus: 'COMPLETED',
            bridge: 'refuel-bridge',
            status: 'PENDING',
            destinationTransactionHash: null,
        },
        destinationTxStatus: 'COMPLETED',
        sourceTxStatus: 'COMPLETED',
        bridgeName: 'refuel-bridge',
    },
}

export const bridgeStatusPolygonUSDCArbitrumUSDTRefuelCompleted: unknown = {
    success: true,
    result: {
        destinationTransactionHash:
            '0xbf7f533457ab53286481cc73bb18a89db81ff8e57c87861e519f3ef5bd944bc8',
        sourceTransactionHash:
            '0x3fedd084d201a89bd59749d1eee94350dd080c986e74762207b310b21581ade1',
        fromChainId: 137,
        toChainId: 42161,
        fromAsset: {
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
        srcTokenPrice: 1,
        destTokenPrice: 1,
        fromAmount: '5989388',
        toAmount: '5704457',
        sender: '0x3a23f943181408eac424116af7b7790c94cb97a5',
        recipient: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
        isSocketTx: false,
        refuel: {
            status: 'COMPLETED',
            destinationTransactionHash:
                '0x861c46bcc75f6f4cc15d83d602aec65412dab80760ef0345b5c3b89a91a3c0b6',
            destinationTxStatus: 'COMPLETED',
            sourceTxStatus: 'COMPLETED',
            bridge: 'refuel-bridge',
        },
        destinationTxStatus: 'COMPLETED',
        sourceTxStatus: 'COMPLETED',
        bridgeName: 'refuel-bridge',
    },
}
