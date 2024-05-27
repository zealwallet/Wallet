/*
const fs = require("fs");

const fixture = require("/tmp/bridge.json");
const networks = new Set(["Arbitrum", "Polygon", "Ethereum"]);
const networkArr = Array.from(networks);
const symbols = new Set(["USD", "MATIC", "USDC", "USDT", "ETH"]);

const currencies = Object.keys(fixture.currencies)
  .filter(
    (id) =>
      fixture.currencies[id].symbol === "$" ||
      (symbols.has(fixture.currencies[id].symbol) &&
        networks.has(fixture.currencies[id].network))
  )
  .reduce((hash, id) => {
    hash[id] = fixture.currencies[id];
    return hash;
  }, {});

const ourCurrencies = new Set(Object.keys(currencies));

const supportedCurrencies = {};

for (let i of networkArr) {
  supportedCurrencies[i] = {};
  for (let j of networkArr) {
    supportedCurrencies[i][j] = {
      from: fixture.supportedCurrencies[i][j].from.filter((id) =>
        ourCurrencies.has(id)
      ),
      to: fixture.supportedCurrencies[i][j].to.filter((id) =>
        ourCurrencies.has(id)
      ),
      canRefuel: fixture.supportedCurrencies[i][j].canRefuel,
    };
  }
}

fs.writeFileSync(
  "/tmp/bridge_fixture.json",
  JSON.stringify({ currencies, supportedCurrencies }, null, 2)
);
*/

export const currenciesMatrix: unknown = {
    currencies: {
        'Ethereum|0x0000000000000000000000000000000000000000': {
            type: 'CryptoCurrency',
            id: 'Ethereum|0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            code: 'ETH',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Ethereum|0x0000000000000000000000000000000000000000',
            name: 'ETH',
            address: '0x0000000000000000000000000000000000000000',
            network: 'Ethereum',
        },
        'Base|0x0000000000000000000000000000000000000000': {
            type: 'CryptoCurrency',
            id: 'Base|0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            code: 'ETH',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Base|0x0000000000000000000000000000000000000000',
            name: 'ETH',
            address: '0x0000000000000000000000000000000000000000',
            network: 'Base',
        },
        'Ethereum|0xdd3892eacc10c3e6a56eb29fa0cdc18c4e4bf9ae': {
            type: 'CryptoCurrency',
            id: 'Ethereum|0xdd3892eacc10c3e6a56eb29fa0cdc18c4e4bf9ae',
            symbol: '$',
            code: '$',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Ethereum|0xdd3892eacc10c3e6a56eb29fa0cdc18c4e4bf9ae',
            name: '$',
            address: '0xdd3892eacc10c3e6a56eb29fa0cdc18c4e4bf9ae',
            network: 'Ethereum',
        },
        'Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': {
            type: 'CryptoCurrency',
            id: 'Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
            symbol: 'MATIC',
            code: 'MATIC',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
            name: 'Matic Token',
            address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
            network: 'Ethereum',
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
        'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f': {
            type: 'CryptoCurrency',
            id: 'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            symbol: 'USDT',
            code: 'USDT',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            name: '(PoS) Tether USD',
            address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            network: 'Polygon',
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
        'Polygon|0x5b3dcb07244dccbd22a42080ae8b35e7a7593ed3': {
            type: 'CryptoCurrency',
            id: 'Polygon|0x5b3dcb07244dccbd22a42080ae8b35e7a7593ed3',
            symbol: '$',
            code: '$',
            fraction: 18,
            rateFraction: 18,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0x5b3dcb07244dccbd22a42080ae8b35e7a7593ed3',
            name: '$',
            address: '0x5b3dcb07244dccbd22a42080ae8b35e7a7593ed3',
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
        'Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': {
            type: 'CryptoCurrency',
            id: 'Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
            symbol: 'USDT',
            code: 'USDT',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
            name: 'Tether USD',
            address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
            network: 'Arbitrum',
        },
        'Base|0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca': {
            type: 'CryptoCurrency',
            id: 'Base|0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
            symbol: 'USDbC',
            code: 'USDbC',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://rdwdvjp8j5.execute-api.eu-west-1.amazonaws.com/wallet/image/currency/Base|0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
            name: 'USD Base Coin',
            address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
            network: 'Base',
        },
        'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': {
            type: 'CryptoCurrency',
            id: 'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            symbol: 'USDC.e',
            code: 'USDC.e',
            fraction: 6,
            rateFraction: 6,
            icon: 'https://rdwdvjp8j5.execute-api.eu-west-1.amazonaws.com/wallet/image/currency/Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            name: 'USD Coin (Arb1)',
            address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            network: 'Arbitrum',
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
    supportedCurrencies: {
        Arbitrum: {
            Arbitrum: {
                from: [
                    'Arbitrum|0x0000000000000000000000000000000000000000',
                    'Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                    'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                ],
                to: [
                    'Arbitrum|0x0000000000000000000000000000000000000000',
                    'Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                    'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                ],
                canRefuel: true,
            },
            Polygon: {
                from: [
                    'Arbitrum|0x0000000000000000000000000000000000000000',
                    'Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                    'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                ],
                to: [
                    'Polygon|0x0000000000000000000000000000000000001010',
                    'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                    'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                ],
                canRefuel: true,
            },
            Ethereum: {
                from: [
                    'Arbitrum|0x0000000000000000000000000000000000000000',
                    'Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                    'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                ],
                to: [
                    'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                    'Ethereum|0x0000000000000000000000000000000000000000',
                    'Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
                ],
                canRefuel: false,
            },
            Base: {
                from: [
                    'Arbitrum|0x0000000000000000000000000000000000000000',
                    'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                ],
                to: [
                    'Base|0x0000000000000000000000000000000000000000',
                    'Base|0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
                ],
                canRefuel: true,
            },
        },
        Polygon: {
            Arbitrum: {
                from: [
                    'Polygon|0x0000000000000000000000000000000000001010',
                    'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                    'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                ],
                to: [
                    'Arbitrum|0x0000000000000000000000000000000000000000',
                    'Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                    'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                ],
                canRefuel: true,
            },
            Polygon: {
                from: [
                    'Polygon|0x0000000000000000000000000000000000001010',
                    'Polygon|0x5b3dcb07244dccbd22a42080ae8b35e7a7593ed3',
                    'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                ],
                to: [
                    'Polygon|0x0000000000000000000000000000000000001010',
                    'Polygon|0x5b3dcb07244dccbd22a42080ae8b35e7a7593ed3',
                    'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                ],
                canRefuel: true,
            },
            Ethereum: {
                from: [
                    'Polygon|0x0000000000000000000000000000000000001010',
                    'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                    'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    'Polygon|0x5b3dcb07244dccbd22a42080ae8b35e7a7593ed3',
                ],
                to: [
                    'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                    'Ethereum|0x0000000000000000000000000000000000000000',
                    'Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
                    'Ethereum|0xdd3892eacc10c3e6a56eb29fa0cdc18c4e4bf9ae',
                ],
                canRefuel: false,
            },
        },
        Ethereum: {
            Arbitrum: {
                from: [
                    'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                    'Ethereum|0x0000000000000000000000000000000000000000',
                    'Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
                ],
                to: [
                    'Arbitrum|0x0000000000000000000000000000000000000000',
                    'Arbitrum|0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                    'Arbitrum|0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                ],
                canRefuel: true,
            },
            Polygon: {
                from: [
                    'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                    'Ethereum|0x0000000000000000000000000000000000000000',
                    'Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
                    'Ethereum|0xdd3892eacc10c3e6a56eb29fa0cdc18c4e4bf9ae',
                ],
                to: [
                    'Polygon|0x0000000000000000000000000000000000001010',
                    'Polygon|0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                    'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                    'Polygon|0x5b3dcb07244dccbd22a42080ae8b35e7a7593ed3',
                ],
                canRefuel: true,
            },
            Ethereum: {
                from: [
                    'Ethereum|0x0000000000000000000000000000000000000000',
                    'Ethereum|0xdd3892eacc10c3e6a56eb29fa0cdc18c4e4bf9ae',
                    'Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
                    'Ethereum|0x0000000000000000000000000000000000000000',
                    'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                ],
                to: [
                    'Ethereum|0x0000000000000000000000000000000000000000',
                    'Ethereum|0xdd3892eacc10c3e6a56eb29fa0cdc18c4e4bf9ae',
                    'Ethereum|0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
                    'Ethereum|0x0000000000000000000000000000000000000000',
                    'Ethereum|0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    'Ethereum|0xdac17f958d2ee523a2206206994597c13d831ec7',
                ],
                canRefuel: false,
            },
        },
    },
}
