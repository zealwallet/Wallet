const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const {
    EnvironmentPlugin,
    SourceMapDevToolPlugin,
    DefinePlugin,
} = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const WebpackAssetsManifestPlugin = require('webpack-assets-manifest')

const ZEAL_ENV = process.env.ZEAL_ENV || 'local'

console.log(`We're in ${ZEAL_ENV} mode`)

const FRONTEND_ROOT = path.resolve(__dirname, '../')

const OUTPUT_DIR = path.resolve(__dirname, `./${ZEAL_ENV}_build`)
const STATIC_DIR = path.join(FRONTEND_ROOT, 'wallet/public')
const TS_CONFIG_PATH = path.join(FRONTEND_ROOT, 'wallet/tsconfig.json')
const MANIFEST_PATH = path.join(FRONTEND_ROOT, 'wallet/manifest.json')

const common = {
    entry: {
        main: path.join(
            FRONTEND_ROOT,
            'wallet/src/entrypoints/wallet/index.tsx'
        ),
        background: path.join(
            FRONTEND_ROOT,
            'wallet/src/entrypoints/background/index.ts'
        ),
        content_script: path.join(
            FRONTEND_ROOT,
            'wallet/src/entrypoints/content/index.ts'
        ),
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new DefinePlugin({
            'process.env': {},
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser', // Needed for readable-stream process.nextTick
        }),
        // TODO: required by react-native-reanimated
        new DefinePlugin({
            __DEV__: process.env.NODE_ENV !== 'production',
        }),
        new EnvironmentPlugin({
            ZEAL_ENV,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: STATIC_DIR,
                    to: OUTPUT_DIR,
                    filter: (resourcePath) => {
                        const matches = [
                            'public/index.html$',
                            'public/zwidget.html$',
                        ]
                            .map((pattern) => resourcePath.match(pattern))
                            .reduce((acc, match) => acc || !!match, false)

                        return !matches
                    },
                },
            ],
        }),
        new HtmlWebpackPlugin({
            chunks: ['main'],
            template: path.resolve(STATIC_DIR, './index.html'),
        }),
        new HtmlWebpackPlugin({
            chunks: ['main'],
            template: path.resolve(STATIC_DIR, './zwidget.html'),
            filename: 'zwidget.html',
        }),
        new WebpackAssetsManifestPlugin({
            entrypoints: true,
            output: 'manifest.json',
            transform: ({ entrypoints }) => {
                const extensionManifest = JSON.parse(
                    fs.readFileSync(MANIFEST_PATH).toString()
                )

                const manifestEntrypoints = Object.keys(entrypoints).reduce(
                    (hash, entrypoint) => {
                        hash[entrypoint] = entrypoints[entrypoint].assets.js[0]
                        return hash
                    },
                    {}
                )

                // Inject real file names into extension manifest
                extensionManifest.background.service_worker =
                    manifestEntrypoints.background

                extensionManifest.content_scripts[0].js = [
                    manifestEntrypoints.content_script,
                ]

                // Inject titles into extension manifest for non prod
                if (ZEAL_ENV !== 'production') {
                    extensionManifest.name = `${extensionManifest.name} [${ZEAL_ENV}]`
                }

                return extensionManifest
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'esbuild-loader',
                options: {
                    target: 'esnext',
                    loader: 'jsx',
                },
            },
            {
                // Match js, jsx, ts & tsx files
                test: /\.tsx?$/,
                loader: 'esbuild-loader',
                options: {
                    // JavaScript version to compile to
                    target: 'esnext',
                    tsconfig: TS_CONFIG_PATH,
                    jsx: 'automatic',
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName:
                                    '[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: [
            '.web.tsx',
            '.web.ts',
            '.web.js',
            '.tsx',
            '.ts',
            '.js',
            '.scss',
        ],
        alias: {
            src: path.join(FRONTEND_ROOT, 'wallet/src'),
            'react-native$': 'react-native-web',
            '@zeal/assets': path.join(FRONTEND_ROOT, 'mobile/assets'),
            'expo-image': false,
            'expo-camera/next': false,
            'cbor-rn-prereqs': false,
            '@sumsub/react-native-mobilesdk-module': false,
            '@react-native-firebase/app': false,
            '@react-native-firebase/messaging': false,
        },
        fallback: {
            zlib: false,
            http: false,
            https: false,
            url: false,
            crypto: false,
            stream: require.resolve('stream-browserify'),
            process: require.resolve('process/browser'), // Needed for readable-stream process.nextTick
        },
    },
    output: {
        devtoolNamespace: 'Zeal',
        filename: (asset) => {
            if (ZEAL_ENV === 'local') {
                // If it's local - we don't do anything fancy
                return '[name].js'
            }

            // We inject background script from manifest (hardcoded in manifest) so we cannot have hash
            const entrypointsWithSimpleNames = ['background']

            return entrypointsWithSimpleNames.includes(asset.runtime)
                ? '[name].js'
                : `${ZEAL_ENV}-[name]-[contenthash:6].js`
        },
        path: OUTPUT_DIR,
        clean: true,
    },
    optimization: {
        minimizer: [
            '...',
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        // Lossless optimization with custom option
                        // Feel free to experiment with options for better result for you
                        plugins: [
                            ['gifsicle', { interlaced: true }],
                            ['jpegtran', { progressive: true }],
                            ['optipng', { optimizationLevel: 5 }],
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            [
                                'svgo',
                                {
                                    plugins: [
                                        {
                                            name: 'preset-default',
                                            params: {
                                                overrides: {
                                                    removeViewBox: false,
                                                    addAttributesToSVGElement: {
                                                        params: {
                                                            attributes: [
                                                                {
                                                                    xmlns: 'http://www.w3.org/2000/svg',
                                                                },
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
    },
}

let config = null

switch (ZEAL_ENV) {
    case 'local':
        config = merge(common, {
            mode: 'development',
            devtool: 'inline-source-map',
            watch: true,
            watchOptions: {
                ignored: '**/node_modules',
            },
            plugins: [new SourceMapDevToolPlugin({})],
        })
        break

    case 'production':
        config = merge(common, {
            mode: 'production',
            devtool: 'source-map',
            plugins: [
                new SourceMapDevToolPlugin({
                    filename: '[file].map',
                    module: true,
                    noSources: false,
                    columns: true,
                }),
            ],
        })
        break

    case 'development':
        config = merge(common, {
            mode: 'production',
            devtool: 'source-map',
            plugins: [
                new SourceMapDevToolPlugin({
                    filename: '[file].map',
                    module: true,
                    noSources: false,
                    columns: true,
                }),
            ],
        })
        break

    default:
        throw new Error(`Unknown ZEAL_ENV: ${ZEAL_ENV}`)
}

module.exports = config
