const babelJest = require('babel-jest').default

// Currently Babel is used for jest build, because jest-esbuild generates
// wrong sourcemaps and coverage looks really off from what we have now
module.exports = babelJest.createTransformer({
    presets: [
        [
            require('@babel/preset-env').default,
            { targets: { node: 'current' } },
        ],
        [
            require('@babel/preset-react').default,
            { development: true, runtime: 'automatic' },
        ],
        [require('@babel/preset-typescript').default],
    ],
    babelrc: false,
    configFile: false,
})
