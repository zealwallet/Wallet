import { notReachable } from '../notReachable'

import { parseSettings } from '../types/ESLint/helpers/parseSettings'
import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'
import { Internal, createParser, traverseToInternal } from '../types/Node'

const ALLOWED_REG_EXP_INTERNALS = [
    /^constants$/,
    /^components\/[a-zA-Z0-9]+$/,
    /^hooks\/[a-zA-Z0-9]+$/,
    /^helpers\/[a-zA-Z0-9]+$/,
    /^api\/[a-zA-Z0-9]+$/,
    /^parsers\/[a-zA-Z0-9]+$/,
    /^api\/fixtures\/[a-zA-Z0-9]+$/,
]

const allowedListString = ALLOWED_REG_EXP_INTERNALS.map(
    (item) => `"${item}"`
).join(', ')

const getDisallowedDomainInternalsMessage = (
    disallowedInternal: Internal
): string => {
    const standardText = `Domain internal "${disallowedInternal.text}" is not allowed.
Allowed internals: ${allowedListString}`

    if (disallowedInternal.text === 'features') {
        return `${standardText}

Probably you're tring to import all features from domain, which is not allowed.
If you need to use some features import them directly one by one ('app/domains/FooDomain/features/BarFeature').`
    }

    return standardText
}

export const noRestrictedInternals = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow direct imports of domain internals',
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

                                const internal = traverseToInternal(ast)

                                if (!internal) {
                                    // No internal is OK
                                    return null
                                }

                                const matchedInternal =
                                    ALLOWED_REG_EXP_INTERNALS.find(
                                        (regexp) =>
                                            !!internal.text.match(regexp)
                                    )

                                if (matchedInternal) {
                                    // Matched internal is OK
                                    return null
                                }

                                return context.report(
                                    node,
                                    getDisallowedDomainInternalsMessage(
                                        internal
                                    )
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
