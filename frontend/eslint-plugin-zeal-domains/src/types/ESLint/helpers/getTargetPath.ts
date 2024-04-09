import * as path from 'path'

import { Settings, TargetPath } from '..'

import { getPackageByFilePath } from './getPackageByFilePath'

export const getTargetPath = ({
    importPath,
    currentFilePath,
    settings,
}: {
    currentFilePath: string
    importPath: string
    settings: Settings
}): TargetPath => {
    if (path.isAbsolute(importPath)) {
        const pkg = getPackageByFilePath({
            fileOrDirPath: importPath,
            settings,
        })
        return {
            type: 'absolute-package',
            package: pkg.package,
            pathWithinPackage: pkg.pathWithinPackage,
            importPath,
            filePath: importPath,
        }
    }

    if (importPath.match(/^\./)) {
        const filePath = path.join(path.dirname(currentFilePath), importPath)
        const pkg = getPackageByFilePath({
            fileOrDirPath: filePath,
            settings,
        })

        return {
            type: 'relative-package',
            package: pkg.package,
            importPath: importPath,
            pathWithinPackage: pkg.pathWithinPackage,
        }
    }

    if (importPath.startsWith(settings.domainsPackage.name)) {
        return {
            type: 'package',
            package: 'domains',
            importPath,
        }
    }

    if (importPath.startsWith(settings.uikitPackage.name)) {
        return {
            type: 'package',
            package: 'ui-kit',
            importPath,
        }
    }

    if (importPath.startsWith(settings.toolkitPackage.name)) {
        return {
            type: 'package',
            package: 'toolkit',
            importPath,
        }
    }

    return {
        type: 'unknown',
        importPath,
    }
}
