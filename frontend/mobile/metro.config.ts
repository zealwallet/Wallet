import { getSentryExpoConfig } from '@sentry/react-native/metro'
import * as path from 'path'

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getSentryExpoConfig(projectRoot)

module.exports = config

const mockedPackages = new Set<string>([
    './index.module.scss', // some unmigrated stuff with CSS

    // Ledger, there is package fro RN, so may be abstracted later
    '@ledgerhq/hw-app-eth', // web API deps
    '@ledgerhq/hw-transport-webhid', // web API deps
    '@ethereumjs/util', // can be replaced by Buffer
    '@ethereumjs/common', // hard to replace, spaghetti of classes
])

if (config.resolver) {
    config.resolver.extraNodeModules = {
        '@zeal/assets': path.resolve(workspaceRoot, 'frontend/mobile/assets'),

        src: path.resolve(projectRoot, 'src'),
        '@zeal/api': path.resolve(workspaceRoot, 'frontend/api'),
        '@zeal/domains': path.resolve(workspaceRoot, 'frontend/domains'),
        '@zeal/toolkit': path.resolve(workspaceRoot, 'frontend/toolkit'),
        '@zeal/uikit': path.resolve(workspaceRoot, 'frontend/uikit'),
        crypto: require.resolve('expo-crypto'),
        stream: require.resolve('stream-browserify'),
    }

    config.resolver.nodeModulesPaths = [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(workspaceRoot, 'node_modules'),
    ]
    config.resolver.resolveRequest = (context, moduleName, platform) => {
        if (mockedPackages.has(moduleName)) {
            return {
                type: 'sourceFile',
                filePath: path.resolve(projectRoot, './mocked-module.js'),
            }
        }
        return context.resolveRequest(context, moduleName, platform)
    }

    config.resolver.disableHierarchicalLookup = true
}

module.exports = config
