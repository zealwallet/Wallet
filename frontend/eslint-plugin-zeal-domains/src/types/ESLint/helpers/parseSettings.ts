import { Context, Settings } from '..'

const SETTINGS_KEY = 'eslint-plugin-zeal-domains'

export const parseSettings = (context: Context): Settings => {
    const settings = context.settings

    if (
        typeof settings === 'object' &&
        settings !== null &&
        SETTINGS_KEY in settings &&
        typeof settings[SETTINGS_KEY] === 'object' &&
        settings[SETTINGS_KEY] !== null &&
        // domains
        'domainsPackage' in settings[SETTINGS_KEY] &&
        settings[SETTINGS_KEY].domainsPackage !== null &&
        typeof settings[SETTINGS_KEY].domainsPackage === 'object' &&
        'name' in settings[SETTINGS_KEY].domainsPackage &&
        typeof settings[SETTINGS_KEY].domainsPackage.name === 'string' &&
        // toolkit
        'toolkitPackage' in settings[SETTINGS_KEY] &&
        settings[SETTINGS_KEY].toolkitPackage !== null &&
        typeof settings[SETTINGS_KEY].toolkitPackage === 'object' &&
        'name' in settings[SETTINGS_KEY].toolkitPackage &&
        typeof settings[SETTINGS_KEY].toolkitPackage.name === 'string' &&
        // uikit
        'uikitPackage' in settings[SETTINGS_KEY] &&
        settings[SETTINGS_KEY].uikitPackage !== null &&
        typeof settings[SETTINGS_KEY].uikitPackage === 'object' &&
        'name' in settings[SETTINGS_KEY].uikitPackage &&
        typeof settings[SETTINGS_KEY].uikitPackage.name === 'string'
    ) {
        return {
            domainsPackage: {
                name: settings[SETTINGS_KEY].domainsPackage.name,
            },
            toolkitPackage: {
                name: settings[SETTINGS_KEY].toolkitPackage.name,
            },
            uikitPackage: {
                name: settings[SETTINGS_KEY].uikitPackage.name,
            },
        }
    }

    throw new Error('Failed to parse settings')
}
