import { components } from '@zeal/api/portfolio'

export const permitWithLimitedSpendLimitAndShortExpiry: components['schemas']['SimulateMessageSigningResponse'] =
    {
        message: {
            type: 'PermitSignMessage',
            allowance: {
                amount: {
                    amount: {
                        amount: '25000000',
                        currencyId:
                            'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    },
                    type: 'Limited',
                    priceInDefaultCurrency: null,
                },
                unlimitedAmountValue:
                    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
                expiration: {
                    type: 'FiniteExpiration',
                    timestamp: 1697468640000,
                },
                infiniteExpirationValue:
                    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
            },
            approveTo: {
                address: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
                network: 'Ethereum',
                name: 'Uniswap V3',
                logo: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/dapp/844996ea-845d-48fb-91cd-69fa538d95dc',
                website: 'https://app.uniswap.org/#/swap',
            },
        },
        checks: [
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
            },
            {
                type: 'TokenVerificationCheck',
                severity: 'Caution',
                state: 'Passed',
                currencyId:
                    'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                checkSource: {
                    source: 'BlockAid',
                    url: null,
                },
            },
            {
                type: 'ApprovalExpirationLimitCheck',
                severity: 'Caution',
                state: 'Passed',
            },
        ],
        currencies: {
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
            'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
                type: 'CryptoCurrency',
                id: 'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                symbol: 'USDC',
                code: 'USDC',
                fraction: 6,
                rateFraction: 6,
                icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                name: 'USD Coin',
                address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                network: 'Ethereum',
            },
        },
    }

export const permit2WithUnlimitedSpendAndShortExpiry: components['schemas']['SimulateMessageSigningResponse'] =
    {
        message: {
            type: 'Permit2SignMessage',
            allowances: [
                {
                    amount: {
                        amount: {
                            amount: '1461501637330902918203684832716283019655932542975',
                            currencyId:
                                'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                        },
                        type: 'Unlimited',
                        priceInDefaultCurrency: null,
                    },
                    unlimitedAmountValue:
                        '1461501637330902918203684832716283019655932542975',
                    expiration: {
                        type: 'FiniteExpiration',
                        timestamp: 1697468640000,
                    },
                    infiniteExpirationValue: '281474976710655',
                },
            ],
            approveTo: {
                address: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
                network: 'Ethereum',
                name: 'Uniswap V3',
                logo: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/dapp/6bbfca1d-82ef-4d7d-8646-dad14d696ee4',
                website: 'https://app.uniswap.org/#/swap',
            },
        },
        checks: [
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
            },
            {
                type: 'TokenVerificationCheck',
                severity: 'Caution',
                state: 'Passed',
                currencyId:
                    'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                checkSource: {
                    source: 'BlockAid',
                    url: null,
                },
            },
            {
                type: 'ApprovalExpirationLimitCheck',
                severity: 'Caution',
                state: 'Passed',
            },
        ],
        currencies: {
            'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7': {
                type: 'CryptoCurrency',
                id: 'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                symbol: 'USDT',
                code: 'USDT',
                fraction: 6,
                rateFraction: 6,
                icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                name: 'Tether USD',
                address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                network: 'Ethereum',
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

export const permit2WithUnlimitedSpendAndLongExpiry: components['schemas']['SimulateMessageSigningResponse'] =
    {
        message: {
            type: 'Permit2SignMessage',
            allowances: [
                {
                    amount: {
                        amount: {
                            amount: '1461501637330902918203684832716283019655932542975',
                            currencyId:
                                'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                        },
                        type: 'Unlimited',
                        priceInDefaultCurrency: null,
                    },
                    unlimitedAmountValue:
                        '1461501637330902918203684832716283019655932542975',
                    expiration: {
                        type: 'FiniteExpiration',
                        timestamp: 1697727840000,
                    },
                    infiniteExpirationValue: '281474976710655',
                },
            ],
            approveTo: {
                address: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
                network: 'Ethereum',
                name: 'Uniswap V3',
                logo: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/dapp/6bbfca1d-82ef-4d7d-8646-dad14d696ee4',
                website: 'https://app.uniswap.org/#/swap',
            },
        },
        checks: [
            {
                type: 'ApprovalExpirationLimitCheck',
                severity: 'Caution',
                state: 'Failed',
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
            },
            {
                type: 'TokenVerificationCheck',
                severity: 'Caution',
                state: 'Passed',
                currencyId:
                    'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                checkSource: {
                    source: 'BlockAid',
                    url: null,
                },
            },
        ],
        currencies: {
            'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7': {
                type: 'CryptoCurrency',
                id: 'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                symbol: 'USDT',
                code: 'USDT',
                fraction: 6,
                rateFraction: 6,
                icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                name: 'Tether USD',
                address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                network: 'Ethereum',
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

export const permitWithDangerFailedSafetyCheck: components['schemas']['SimulateMessageSigningResponse'] =
    {
        message: {
            type: 'Permit2SignMessage',
            allowances: [
                {
                    amount: {
                        amount: {
                            amount: '1461501637330902918203684832716283019655932542975',
                            currencyId:
                                'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                        },
                        type: 'Unlimited',
                        priceInDefaultCurrency: null,
                    },
                    unlimitedAmountValue:
                        '1461501637330902918203684832716283019655932542975',
                    expiration: {
                        type: 'FiniteExpiration',
                        timestamp: 1697468640000,
                    },
                    infiniteExpirationValue: '281474976710655',
                },
            ],
            approveTo: {
                address: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
                network: 'Ethereum',
                name: 'Uniswap V3',
                logo: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/dapp/6bbfca1d-82ef-4d7d-8646-dad14d696ee4',
                website: 'https://app.uniswap.org/#/swap',
            },
        },
        checks: [
            {
                type: 'SmartContractBlacklistCheck',
                severity: 'Danger',
                state: 'Failed',
                checkSource: {
                    source: 'BlockAid',
                    url: null,
                },
            },
            {
                type: 'ApprovalSpenderTypeCheck',
                severity: 'Danger',
                state: 'Failed',
            },
            {
                type: 'TokenVerificationCheck',
                severity: 'Caution',
                state: 'Failed',
                currencyId:
                    'Polygon|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                checkSource: {
                    source: 'BlockAid',
                    url: null,
                },
            },
            {
                type: 'ApprovalExpirationLimitCheck',
                severity: 'Caution',
                state: 'Passed',
            },
        ],
        currencies: {
            'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7': {
                type: 'CryptoCurrency',
                id: 'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                symbol: 'USDT',
                code: 'USDT',
                fraction: 6,
                rateFraction: 6,
                icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                name: 'Tether USD',
                address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                network: 'Ethereum',
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
