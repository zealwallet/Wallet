const { withGradleProperties } = require('@expo/config-plugins')

module.exports = (config) =>
    withGradleProperties(config, (config) => {
        config.modResults.push({
            type: 'property',
            key: 'AsyncStorage_useNextStorage',
            value: 'true',
        })
        return config
    })
