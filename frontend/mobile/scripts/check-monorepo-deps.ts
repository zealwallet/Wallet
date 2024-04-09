import { promises as fs } from 'fs'
import path from 'path'

import { keys } from '@zeal/toolkit/Object'

const CWD = process.cwd()
const ROOT = path.resolve(CWD, '../..')

const MOBILE_PATH = path.join(ROOT, 'frontend/mobile')
const TOP_UP_DAPP_PATH = path.join(ROOT, 'frontend/top-up-dapp')
const WALLET_PATH = path.join(ROOT, 'frontend/wallet')
const DOMAINS_PATH = path.join(ROOT, 'frontend/domains')
const TOOLKIT_PATH = path.join(ROOT, 'frontend/toolkit')
const UIKIT_PATH = path.join(ROOT, 'frontend/uikit')
const PASSKEYS_PATH = path.join(ROOT, 'frontend/passkeys')

const getDeps = async (pkgPath: string): Promise<Record<string, string>> => {
    const pkg = JSON.parse(
        (await fs.readFile(path.join(pkgPath, 'package.json'))).toString()
    )

    return {
        ...pkg.dependencies,
        ...pkg.devDependencies,
    }
}

const getVersionDiff = (
    a: Record<string, string>,
    b: Record<string, string>
): [string, string, string][] | null => {
    const aSet = new Set<string>(keys(a))
    const same = keys(b).filter((key) => aSet.has(key))

    const diff = same
        .filter((key) => a[key] !== b[key])
        .map((key): [string, string, string] => [key, a[key], b[key]])

    return diff.length ? diff : null
}

const logDiff = (diff: [string, string, string][]): void => {
    const longestKey = diff.reduce(
        (acc, [key]) => (key.length > acc ? key.length : acc),
        0
    )
    const longestVersion = Math.max(
        ...diff.map(([, a, b]) => Math.max(a.length, b.length))
    )

    diff.forEach(([key, a, b]) => {
        // eslint-disable-next-line no-console
        console.log(
            key.padStart(longestKey),
            '     ',
            a.padStart(longestVersion),
            '  vs  ',
            b.padStart(longestVersion)
        )
    })
}

;(async () => {
    const [
        mobileDeps,
        walletDeps,
        domainsDeps,
        toolkitDeps,
        uikitDeps,
        topUpDappDeps,
        passkeysDeps,
    ] = await Promise.all([
        getDeps(MOBILE_PATH),
        getDeps(WALLET_PATH),
        getDeps(DOMAINS_PATH),
        getDeps(TOOLKIT_PATH),
        getDeps(UIKIT_PATH),
        getDeps(TOP_UP_DAPP_PATH),
        getDeps(PASSKEYS_PATH),
    ])

    const walletDiff = getVersionDiff(mobileDeps, walletDeps)
    const domainsDiff = getVersionDiff(mobileDeps, domainsDeps)
    const toolkitDiff = getVersionDiff(mobileDeps, toolkitDeps)
    const uikitDiff = getVersionDiff(mobileDeps, uikitDeps)
    const topUpDappDiff = getVersionDiff(mobileDeps, topUpDappDeps)
    const passkeysDiff = getVersionDiff(mobileDeps, passkeysDeps)

    if (walletDiff) {
        console.log('wallet diff:') // eslint-disable-line no-console
        logDiff(walletDiff)
    }

    if (passkeysDiff) {
        console.log('passkeys diff:') // eslint-disable-line no-console
        logDiff(passkeysDiff)
    }

    if (domainsDiff) {
        console.log('domains diff:') // eslint-disable-line no-console
        logDiff(domainsDiff)
    }

    if (toolkitDiff) {
        console.log('toolkit diff:') // eslint-disable-line no-console
        logDiff(toolkitDiff)
    }

    if (uikitDiff) {
        console.log('uikit diff:') // eslint-disable-line no-console
        logDiff(uikitDiff)
    }

    if (topUpDappDiff) {
        console.log('top-up-dapp diff:') // eslint-disable-line no-console
        logDiff(topUpDappDiff)
    }

    if (
        walletDiff ||
        domainsDiff ||
        toolkitDiff ||
        uikitDiff ||
        topUpDappDiff
    ) {
        process.exit(1)
    }
})()
