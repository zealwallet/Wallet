import { parseSettings } from '../types/ESLint/helpers/parseSettings'
import { notReachable } from '../notReachable'

import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'
import { createParser, traverse } from '../types/Node'

export const noInvalidImportTypes = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow wrong import types',
            category: 'Possible Errors',
        },
        fixable: 'code',
    },
    create(context: Context) {
        const settings = parseSettings(context)
        const parseWithPackageAlias = createParser(
            `${settings.domainsPackage.name}/`
        )

        return {
            ImportDeclaration(node: ImportNode) {
                const declaration = parseImportDeclaration(node, context)

                switch (declaration.current.package) {
                    case 'domains': {
                        switch (declaration.target.type) {
                            case 'absolute-package':
                                return context.report(
                                    node,
                                    `Please do not use absolute imports`
                                )

                            case 'relative-package': {
                                switch (declaration.target.package) {
                                    case 'domains': {
                                        const astCurrent =
                                            parseWithPackageAlias(
                                                declaration.current
                                                    .pathWithinPackage
                                            )
                                        const astFrom = parseWithPackageAlias(
                                            declaration.target.pathWithinPackage
                                        )

                                        if (!astCurrent || !astFrom) {
                                            // Not a valid path, but we don't care
                                            return null
                                        }

                                        const trCurrent = traverse(
                                            astCurrent,
                                            []
                                        ).join(',')
                                        const trFrom = traverse(
                                            astFrom,
                                            []
                                        ).join(',')

                                        if (trFrom === trCurrent) {
                                            // If we're in same area we're good
                                            return null
                                        }

                                        const aliasPath =
                                            declaration.target.pathWithinPackage

                                        return context.report(
                                            node,
                                            `Please import other domains or features using alias import [${aliasPath}] (you're trying to import relatively [${trFrom}] in [${trCurrent}])`,
                                            {},
                                            (fixer) =>
                                                fixer.replaceText(
                                                    node.source,
                                                    `'${aliasPath}'`
                                                )
                                        )
                                    }

                                    case 'ui-kit':
                                    case 'toolkit':
                                        return context.report(
                                            node,
                                            `Please import other packages using package imports`
                                        )

                                    case 'other':
                                        return null

                                    default:
                                        return notReachable(
                                            declaration.target.package
                                        )
                                }
                            }

                            case 'package':
                            case 'unknown':
                                return null

                            default:
                                return notReachable(declaration.target)
                        }
                    }

                    case 'ui-kit': {
                        switch (declaration.target.type) {
                            case 'absolute-package':
                                return context.report(
                                    node,
                                    `Please do not use absolute imports`
                                )

                            case 'relative-package': {
                                switch (declaration.target.package) {
                                    case 'toolkit':
                                    case 'domains':
                                        return context.report(
                                            node,
                                            `Please import other packages using package imports`
                                        )
                                    case 'other':
                                    case 'ui-kit':
                                        return null

                                    default:
                                        return notReachable(
                                            declaration.target.package
                                        )
                                }
                            }

                            case 'package':
                            case 'unknown':
                                return null

                            default:
                                return notReachable(declaration.target)
                        }
                    }

                    case 'toolkit': {
                        switch (declaration.target.type) {
                            case 'absolute-package':
                                return context.report(
                                    node,
                                    `Please do not use absolute imports`
                                )

                            case 'relative-package': {
                                switch (declaration.target.package) {
                                    case 'ui-kit':
                                    case 'domains':
                                        return context.report(
                                            node,
                                            `Please import other packages using package imports`
                                        )

                                    case 'toolkit':
                                    case 'other':
                                        return null

                                    default:
                                        return notReachable(
                                            declaration.target.package
                                        )
                                }
                            }

                            case 'package':
                            case 'unknown':
                                return null

                            default:
                                return notReachable(declaration.target)
                        }
                    }

                    case 'other':
                        return null

                    default:
                        return notReachable(declaration.current.package)
                }
            },
        }
    },
}
