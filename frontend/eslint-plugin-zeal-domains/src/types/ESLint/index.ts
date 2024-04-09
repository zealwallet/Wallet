import { ImportAssertions } from 'module'
import * as path from 'path'
import * as fs from 'fs'
import { getPackageByFilePath } from './helpers/getPackageByFilePath'
import { getTargetPath } from './helpers/getTargetPath'
import { parseSettings } from './helpers/parseSettings'

export type ImportNode = { source: { value: string } }
export type JSXOpeningElementNode = {
    name:
        | { type: 'JSXMemberExpression' }
        | { type: 'JSXIdentifier'; name: string }
}

export type Context = {
    report: (
        node: ImportNode | JSXOpeningElementNode,
        message: string,
        data?: unknown,
        fix?: (fixer: any) => any
    ) => void
    getCwd: () => string
    getFilename: () => string
    settings: unknown
}

export type Settings = {
    domainsPackage: { name: string }
    toolkitPackage: { name: string }
    uikitPackage: { name: string }
}

export type Package = 'ui-kit' | 'toolkit' | 'domains' | 'other'

export type TargetPath =
    | {
          type: 'absolute-package'
          package: Package
          pathWithinPackage: string
          filePath: string
          importPath: string
      }
    | {
          type: 'package'
          package: Package
          importPath: string
      }
    | {
          type: 'relative-package'
          package: Package
          importPath: string
          pathWithinPackage: string
      }
    | {
          type: 'unknown'
          importPath: string
      }

type ImportDeclaration = {
    target: TargetPath

    current: {
        package: Package
        filePath: string
        pathWithinPackage: string
    }
}

export const parseImportDeclaration = (
    node: ImportNode,
    context: Context
): ImportDeclaration => {
    const settings = parseSettings(context)
    const currentContextPath = context.getFilename()

    const currentPkg = getPackageByFilePath({
        fileOrDirPath: currentContextPath,
        settings,
    })

    return {
        current: {
            filePath: currentContextPath,
            package: currentPkg.package,
            pathWithinPackage: currentPkg.pathWithinPackage,
        },
        target: getTargetPath({
            currentFilePath: currentContextPath,
            importPath: node.source.value,
            settings,
        }),
    }
}
