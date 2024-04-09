import { notReachable } from '../notReachable'

import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'

export const secureToolKitFolder = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow wrong imports in tool-kit folder',
            category: 'Possible Errors',
        },
    },
    create(context: Context) {
        return {
            ImportDeclaration(node: ImportNode) {
                const declaration = parseImportDeclaration(node, context)

                switch (declaration.current.package) {
                    case 'toolkit': {
                        switch (declaration.target.type) {
                            case 'absolute-package':
                            case 'package':
                            case 'relative-package':
                                return context.report(
                                    node,
                                    `Please do not import [${declaration.target.package}] in toolkit [${declaration.target.importPath}]`
                                )

                            case 'unknown':
                                return null
                        }
                    }

                    case 'ui-kit':
                    case 'domains':
                    case 'other':
                        return null

                    default:
                        throw new Error('Not reachable')
                }
            },
        }
    },
}
