export const safetyChecksPassed: unknown = {
    dAppInfo: {
        hostname: 'dapp.example.com',
        avatar: 'https://app.uniswap.org/images/192x192_App_Icon.png',
        title: 'Example app',
    },
    checks: [
        {
            type: 'BlacklistCheck',
            severity: 'Danger',
            state: 'Passed',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
        {
            type: 'SuspiciousCharactersCheck',
            severity: 'Danger',
            state: 'Passed',
            checkSource: {
                source: 'BlockAid',
                url: null,
            },
        },
    ],
}
