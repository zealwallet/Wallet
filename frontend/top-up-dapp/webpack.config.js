const webpack = require('webpack')
const path = require('path')
const {
    EnvironmentPlugin,
    SourceMapDevToolPlugin,
    DefinePlugin,
} = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const ZEAL_ENV = process.env.ZEAL_ENV || 'local'

console.log(`We're in ${ZEAL_ENV} mode`)

const ZEAL_APP_VERSION = require('./package.json').version

const FRONTEND_ROOT = path.resolve(__dirname, '../')

const OUTPUT_DIR = path.resolve(__dirname, `./build`)
const STATIC_DIR = path.join(FRONTEND_ROOT, 'top-up-dapp/public')
const TS_CONFIG_PATH = path.join(FRONTEND_ROOT, 'top-up-dapp/tsconfig.json')

const common = {
    entry: path.join(FRONTEND_ROOT, 'top-up-dapp/src/index.tsx'),
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new DefinePlugin({
            'process.env': {},
        }),
        new EnvironmentPlugin({
            ZEAL_ENV,
            ZEAL_APP_VERSION,
            GIT_COMMIT_HASH: require('child_process')
                .execSync('git rev-parse --short HEAD')
                .toString()
                .trim(),
        }),
        // TODO: required by react-native-reanimated
        new DefinePlugin({
            __DEV__: process.env.NODE_ENV !== 'production',
        }),
        new HtmlWebpackPlugin({
            chunks: ['main'],
            template: path.resolve(STATIC_DIR, './index.html'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: STATIC_DIR,
                    to: OUTPUT_DIR,
                    filter: (resourcePath) =>
                        !resourcePath.match('public/index.html$'),
                },
            ],
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
            src: path.join(FRONTEND_ROOT, 'top-up-dapp/src'),
            'react-native$': 'react-native-web',
        },
        fallback: {
            zlib: false,
            http: false,
            https: false,
            url: false,
            crypto: false,
            stream: require.resolve('stream-browserify'),
        },
    },
    output: {
        devtoolNamespace: 'Zeal',
        filename: '[name]-[contenthash:6].js',
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
            plugins: [new SourceMapDevToolPlugin({})],
            devServer: {
                static: {
                    directory: path.join(__dirname, 'build'),
                },
                compress: true,
                port: 3001,
                hot: true,
                client: {
                    overlay: false,
                },
            },
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
