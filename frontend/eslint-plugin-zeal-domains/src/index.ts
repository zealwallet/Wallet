import { noFeatureDeepImport } from './rules/noFeatureDeepImport'
import { noInvalidImportTypes } from './rules/noInvalidImportTypes'
import { noRestrictedInternals } from './rules/noRestrictedInternals'
import { secureToolKitFolder } from './rules/secureToolKitFolder'
import { secureUiKitFolder } from './rules/secureUiKitFolder'

module.exports = {
    rules: {
        'no-feature-deep-import': noFeatureDeepImport,
        'no-invalid-import-types': noInvalidImportTypes,
        'no-restricted-internals': noRestrictedInternals,
        'secure-toolkit-folder': secureToolKitFolder,
        'secure-uikit-folder': secureUiKitFolder,
    },
}
