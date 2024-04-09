import { notReachable } from '../notReachable'
import {
    Context,
    ImportNode,
    JSXOpeningElementNode,
    parseImportDeclaration,
} from '../types/ESLint'
import { getPackageByFilePath } from '../types/ESLint/helpers/getPackageByFilePath'
import { parseSettings } from '../types/ESLint/helpers/parseSettings'

export const secureUiKitFolder = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow domain imports in ui-kit folder',
            category: 'Possible Errors',
        },
    },
    create(context: Context) {
        const settings = parseSettings(context)
        return {
            JSXOpeningElement(node: JSXOpeningElementNode) {
                const currentContextPath = context.getFilename()

                const currentPkg = getPackageByFilePath({
                    fileOrDirPath: currentContextPath,
                    settings,
                })

                switch (currentPkg.package) {
                    case 'ui-kit':
                        return null
                    case 'toolkit':
                    case 'domains':
                    case 'other': {
                        const { name } = node

                        switch (name.type) {
                            case 'JSXMemberExpression':
                                return null
                            case 'JSXIdentifier':
                                // Native HTML is always starts with lowercase
                                // https://react.dev/learn/your-first-component
                                // https://legacy.reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized
                                return name.name.charAt(0) ===
                                    name.name.charAt(0).toLowerCase()
                                    ? context.report(
                                          node,
                                          'The use of native HTML elements is disallowed in JSX outside of the ui-kit.'
                                      )
                                    : null

                            default:
                                return notReachable(name)
                        }
                    }

                    default:
                        return notReachable(currentPkg.package)
                }
            },
            ImportDeclaration(node: ImportNode) {
                const declaration = parseImportDeclaration(node, context)

                switch (declaration.current.package) {
                    case 'ui-kit': {
                        switch (declaration.target.type) {
                            case 'absolute-package':
                            case 'relative-package':
                            case 'package': {
                                switch (declaration.target.package) {
                                    case 'domains':
                                        return context.report(
                                            node,
                                            `Please do not import domains in uikit [${declaration.target.importPath}]`
                                        )
                                    case 'toolkit':
                                    case 'other':
                                    case 'ui-kit':
                                        return null
                                    default:
                                        return notReachable(
                                            declaration.target.package
                                        )
                                }
                            }

                            case 'unknown':
                                return null

                            default:
                                return notReachable(declaration.target)
                        }
                    }

                    case 'toolkit':
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
