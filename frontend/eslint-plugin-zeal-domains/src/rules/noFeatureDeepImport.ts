import { notReachable } from '../notReachable'

import { parseSettings } from '../types/ESLint/helpers/parseSettings'
import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'

import {
    traverseToFeature,
    traverseToInternal,
    createParser,
    traverseToName,
} from '../types/Node'

export const noFeatureDeepImport = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow direct imports of feature internals',
            category: 'Possible Errors',
        },
    },
    create(context: Context) {
        const settings = parseSettings(context)
        const parseWithPackageAlias = createParser(
            `${settings.domainsPackage.name}/`
        )

        return {
            ImportDeclaration(node: ImportNode) {
                const declaration = parseImportDeclaration(node, context)

                switch (declaration.target.type) {
                    case 'package': {
                        switch (declaration.target.package) {
                            case 'domains': {
                                const ast = parseWithPackageAlias(
                                    declaration.target.importPath
                                )

                                if (!ast) {
                                    return context.report(
                                        node,
                                        `Path [${declaration.target.importPath}] pretends to be domains, but I'm not able to understand it`
                                    )
                                }

                                const feature = traverseToFeature(ast)

                                if (!feature) {
                                    // Not a feature, we don't care
                                    return null
                                }

                                const internal = traverseToInternal(feature)

                                if (!internal) {
                                    // Import of index file which is OK
                                    return null
                                }

                                const featureNameNode = traverseToName(feature)

                                return context.report(
                                    node,
                                    `Please do not deep import feature [${featureNameNode?.text}] internals [/${internal.text}]`
                                )
                            }

                            case 'ui-kit':
                            case 'toolkit':
                            case 'other':
                                return null

                            default:
                                return notReachable(declaration.target.package)
                        }
                    }

                    case 'absolute-package':
                    case 'relative-package':
                    case 'unknown':
                        return null

                    default:
                        return notReachable(declaration.target)
                }
            },
        }
    },
}
