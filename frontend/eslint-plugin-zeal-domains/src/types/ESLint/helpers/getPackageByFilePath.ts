import * as fs from 'fs'
import * as path from 'path'
import memoize from 'lodash.memoize'

import { Package, Settings } from '../index'

type PackageLookupResult = {
    name: string
    packageRoot: string
}

const findPackage = (fileOrDirPath: string): PackageLookupResult => {
    const isDir = (() => {
        try {
            return fs.lstatSync(fileOrDirPath).isDirectory()
        } catch {
            return false
        }
    })()

    const pathToCheck = isDir ? fileOrDirPath : path.dirname(fileOrDirPath)

    try {
        const pkg = require(path.join(pathToCheck, 'package.json')) as unknown
        if (
            typeof pkg === 'object' &&
            pkg !== null &&
            'name' in pkg &&
            typeof pkg.name === 'string'
        ) {
            const result = {
                name: pkg.name,
                packageRoot: pathToCheck,
            }
            return result
        } else {
            throw new Error('No name in package, search further')
        }
    } catch {
        const newPath = path.join(pathToCheck, '..')

        if (newPath === pathToCheck) {
            throw new Error('No package found')
        } else {
            const result = findPackage(newPath)
            return result
        }
    }
}

const findPackageMemoized = memoize(findPackage)

export const getPackageByFilePath = ({
    fileOrDirPath,
    settings,
}: {
    fileOrDirPath: string
    settings: Settings
}): { package: Package; packageRoot: string; pathWithinPackage: string } => {
    const pkg = findPackageMemoized(fileOrDirPath)
    const packageRoot = pkg.packageRoot
    const pathWithinPackage = path.join(
        settings.domainsPackage.name,
        path.relative(pkg.packageRoot, fileOrDirPath)
    )

    if (pkg.name === settings.domainsPackage.name) {
        return {
            package: 'domains',
            packageRoot,
            pathWithinPackage,
        }
    } else if (pkg.name === settings.toolkitPackage.name) {
        return {
            package: 'toolkit',
            packageRoot,
            pathWithinPackage,
        }
    } else if (pkg.name === settings.uikitPackage.name) {
        return {
            package: 'ui-kit',
            packageRoot,
            pathWithinPackage,
        }
    } else {
        return {
            package: 'other',
            packageRoot,
            pathWithinPackage,
        }
    }
}
