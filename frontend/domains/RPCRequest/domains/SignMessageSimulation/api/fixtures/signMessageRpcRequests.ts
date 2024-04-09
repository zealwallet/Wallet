export const NFT_SIGN_RPC_REQUEST = {
    type: 'rpc_request' as const,
    request: {
        id: 12345,
        method: 'eth_signTypedData_v4',
        params: [
            '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
            '{"primaryType":"Order","domain":{"name":"Exchange","version":"2","verifyingContract":"0x12b3897a36fdb436dde2788c06eff0ffd997066e","chainId":137},"types":{"EIP712Domain":[{"type":"string","name":"name"},{"type":"string","name":"version"},{"type":"uint256","name":"chainId"},{"type":"address","name":"verifyingContract"}],"AssetType":[{"name":"assetClass","type":"bytes4"},{"name":"data","type":"bytes"}],"Asset":[{"name":"assetType","type":"AssetType"},{"name":"value","type":"uint256"}],"Order":[{"name":"maker","type":"address"},{"name":"makeAsset","type":"Asset"},{"name":"taker","type":"address"},{"name":"takeAsset","type":"Asset"},{"name":"salt","type":"uint256"},{"name":"start","type":"uint256"},{"name":"end","type":"uint256"},{"name":"dataType","type":"bytes4"},{"name":"data","type":"bytes"}]},"message":{"maker":"0x61640a8d48bca205ba91b16b0b7745e7abc61084","makeAsset":{"assetType":{"assetClass":"0x73ad2146","data":"0x000000000000000000000000fffb0e628012adfdfab3ae7720ef69a267ab445d0000000000000000000000000000000000000000000000000000000000000103"},"value":"1"},"taker":"0x0000000000000000000000000000000000000000","takeAsset":{"assetType":{"assetClass":"0x8ae85d84","data":"0x0000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f619"},"value":"1000000000000000000"},"salt":"0x2d6410e094405d62af813d0aa59ece019d08e03497bc66d3bd6d172cc353793e","start":0,"end":1671281404,"dataType":"0x23d235ef","data":"0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000f22f838aaca272afb0f268e4f4e655fac3a35ec0000000000000000000000000000000000000000000000000000000000000064"}}',
        ],
    },
}
export const PERSONAL_SIGN_RPC_REQUEST = {
    type: 'rpc_request' as const,
    request: {
        id: 123,
        method: 'personal_sign',
        params: [
            '0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765',
            '0x8C99259Bf9Cf90dC872051eB1E70Ad0E021eb7CB',
            'Example password',
        ],
    },
}
export const EC_RECOVER_RPC_REQUEST = {
    type: 'rpc_request' as const,
    request: {
        id: 2401034411,
        jsonrpc: '2.0',
        method: 'personal_ecRecover',
        params: [
            '0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765',
            '0x223b6709b298f97e195b8628a3b9fbe9b1612e58496a5df0375578c02f9db98d04c152070771b9ae5c3147abdbcbf9259da1a8611f436de3cb0869c1661e677a1c',
        ],
    },
}
export const PERMIT_RPC_REQUEST = {
    type: 'rpc_request' as const,
    request: {
        id: 3024541540,
        method: 'eth_signTypedData_v4',
        params: [
            '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
            '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Permit":[{"name":"owner","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"deadline","type":"uint256"}]},"domain":{"name":"USD Coin","version":"2","verifyingContract":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","chainId":1},"primaryType":"Permit","message":{"owner":"0x61640A8D48Bca205BA91b16B0B7745e7aBc61084","spender":"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45","value":"25000000","nonce":2,"deadline":1697468881}}',
        ],
    },
}

export const PERMIT2_UNLIMITED_SPEND_RPC_REQUEST = {
    type: 'rpc_request' as const,
    request: {
        id: 3975542902,
        method: 'eth_signTypedData_v4',
        params: [
            '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
            '{"types":{"PermitSingle":[{"name":"details","type":"PermitDetails"},{"name":"spender","type":"address"},{"name":"sigDeadline","type":"uint256"}],"PermitDetails":[{"name":"token","type":"address"},{"name":"amount","type":"uint160"},{"name":"expiration","type":"uint48"},{"name":"nonce","type":"uint48"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Permit2","chainId":"1","verifyingContract":"0x000000000022d473030f116ddee9f6b43ac78ba3"},"primaryType":"PermitSingle","message":{"details":{"token":"0xdac17f958d2ee523a2206206994597c13d831ec7","amount":"1461501637330902918203684832716283019655932542975","expiration":"1697468640","nonce":"0"},"spender":"0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b","sigDeadline":"1697468640"}}',
        ],
    },
}

export const PERMIT2_EXPIRATION_TOO_FAR_IN_THE_FUTURE_RPC_REQUEST = {
    type: 'rpc_request' as const,
    request: {
        id: 3975542903,
        method: 'eth_signTypedData_v4',
        params: [
            '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
            '{"types":{"PermitSingle":[{"name":"details","type":"PermitDetails"},{"name":"spender","type":"address"},{"name":"sigDeadline","type":"uint256"}],"PermitDetails":[{"name":"token","type":"address"},{"name":"amount","type":"uint160"},{"name":"expiration","type":"uint48"},{"name":"nonce","type":"uint48"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Permit2","chainId":"1","verifyingContract":"0x000000000022d473030f116ddee9f6b43ac78ba3"},"primaryType":"PermitSingle","message":{"details":{"token":"0xdac17f958d2ee523a2206206994597c13d831ec7","amount":"1461501637330902918203684832716283019655932542975","expiration":"1697727840","nonce":"0"},"spender":"0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b","sigDeadline":"1697727840"}}',
        ],
    },
}

export const PERMIT_WITH_MALICIOUS_SPENDER_RPC_REQUEST = {
    type: 'rpc_request' as const,
    request: {
        id: 3975542903,
        method: 'eth_signTypedData_v4',
        params: [
            '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
            '{"types":{"PermitSingle":[{"name":"details","type":"PermitDetails"},{"name":"spender","type":"address"},{"name":"sigDeadline","type":"uint256"}],"PermitDetails":[{"name":"token","type":"address"},{"name":"amount","type":"uint160"},{"name":"expiration","type":"uint48"},{"name":"nonce","type":"uint48"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Permit2","chainId":"1","verifyingContract":"0x000000000022d473030f116ddee9f6b43ac78ba3"},"primaryType":"PermitSingle","message":{"details":{"token":"0xdac17f958d2ee523a2206206994597c13d831ec7","amount":"1461501637330902918203684832716283019655932542975","expiration":"1697727840","nonce":"0"},"spender":"0x1661f1b207629e4f385da89cff535c8e5eb23ee3","sigDeadline":"1697727840"}}',
        ],
    },
}
